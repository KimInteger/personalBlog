const createPOST = function(req,res) {
  const path = require('node:path');

  const resMo = require('./resMo');

  const temp = require('./temp');

  const qs = require('node:querystring');

  const fs = require('node:fs');
  
  if(req.url === '/create'){
    let body = '';
    req.on('data', (chunk)=>{
      body += chunk.toString();
    });
    req.on('end',()=>{
      const parsedData = qs.parse(body);
      let convertData = temp.writeTemp(parsedData.title,parsedData.content);
      
      let nowDate = today();

      fs.writeFile(path.join(__dirname,'public','writeFile',`${nowDate}.html`),convertData,(err)=>{
        if(err){
          console.error("에러가 발생했습니다 에러 코드 : ", err);
        } else {
          resMo.updateTag(res);
        }
      });
    });
  }
};

module.exports = createPOST;
