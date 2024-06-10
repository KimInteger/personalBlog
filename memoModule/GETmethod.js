getGETMethod = function(req,res){
  const fileUtills = require('./fileUtills');
  const fs = require('node:fs');
  const resMo = require('./resMo');

  let url = req.url;

  let filePath = fileUtills.getFilepath(url);

  let ext = fileUtills.getExtention(filePath);
  
  let contentType = fileUtills.getContentType(ext);

  if (req.url === '/') {
    resMo.updateTag(res);
  } else if (req.url === '/index.html') {
    resMo.updateTag(res);
  } else {
    fs.readFile(filePath,(err,data)=>{
      if(err){
        if (err.code === 'ENOENT') {
          resMo.notFound(res);
          return;
        } else {
          resMo.connectErr(res);
          return;
        }
      } else {
        res.writeHead(200, {"Content-Type":contentType});
        res.end(data);
      }
    });
  }
}

module.exports = getGETMethod();