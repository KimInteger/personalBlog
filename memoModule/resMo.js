const resMo = {
  notFound : function(res){
    res.writeHead(404, {"Content-Type":"text/plain; charset=UTF-8"});
    res.end('페이지를 찾을 수 없습니다.');
  },

  connectErr : function(res){
    res.statusCode = 500;
    res.setHeader("Content-Type","text/plain; charset=UTF-8");
    res.write('서버 연결 오류');
    res.end();
  },

  updateTag : function(res){
    let fs = require('node:fs');
    let temp = require('./temp');

    liTag = '';
    folderData = [];
    fs.readdir('./public/writeFile','utf8',(err,data)=>{
      if(err){
        console.error("에러가 발생했습니다!" ,err);
      }
      folderData = data;
  
      for(let i = 0; i < folderData.length; i++){
        if(folderData[i].includes('.html')){
          folderData[i] = folderData[i].split('.html')[0];
          liTag += `<li><a href="${folderData[i]}.html">${folderData[i]}</a></li>` 
        }
      }
  
      let mainIndex = temp.mainTemp(liTag);
      res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
      res.end(mainIndex);
    });
  }
};

module.exports = resMo;