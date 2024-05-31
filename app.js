const http = require('node:http');
// node:js의 모듈 http를 불러온다.

const fs = require('node:fs');
// node:js의 모듈 fileSystem을 불러온다.

const qs = require('node:querystring');

const path = require('node:path');

const today = require('./memoModule/nowDate');

const temp = require('./memoModule/temp');

const resMo = require('./memoModule/resMo');

const fileUtills = require('./memoModule/fileUtills');

// ! 전역변수
let modifyUrl = ''
// * 수정위치를 잡을 변수 

const server = http.createServer((req,res)=>{
  console.log(req.url);

  let url = req.url;

  let filePath = fileUtills.getFilepath(url);

  let ext = fileUtills.getExtention(filePath);

  let contentType = fileUtills.getContentType(ext);
  if(req.method === 'GET'){
    if(req.url === url){
      fs.readFile(filePath, (err,data)=>{
        if(err){
          resMo.connectErr(res);
          return err;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", contentType);
        res.write(data);
        res.end();
      });
    } else if(req.url === '/favicon.ico'){
      return;
    } else {
      resMo.notFound(res);
    }
  } else if (req.method === 'POST'){
    console.log(req.url);

    if(req.url === '/create'){
      let body = '';
      req.on('data', (chunk)=>{
        body += chunk.toString();
      });
      req.on('end',()=>{
        const parsedData = qs.parse(body);
        const title = parsedData.title;
        const content = parsedData.content;
        let convertData = temp.writeTemp(title,content);
        
        let nowDate = today();

        fs.writeFile(path.join(__dirname,'public','writeFile',`${nowDate}.html`),convertData,(err)=>{
          if(err){
            console.error("에러가 발생했습니다 에러 코드 : ", err);
          } else {
            resMo.updateTag(res);
          }
        });
      });
    } else if (req.url === '/delete') {
      let needData = req.headers.referer.split('/')[3];
      fs.unlink(path.join(__dirname,'public','writeFile',`/${needData}`), (err)=>{
        if(err){
          console.error(err);
        } else {
          resMo.updateTag(res);
        }
      });

    } else if (req.url === '/modify') {
      modifyUrl = '';
      modifyUrl = req.headers.referer.split('/')[3]
      console.log(modifyUrl);
      res.writeHead(200,{"Content-Type":"text/html; charset=UTF-8"});
      res.end(temp.modiTemp);
    } else if (req.url === '/reWrite') {
      let body = '';
      req.on('data',(chunk)=>{
        body += chunk.toString();
      });
      req.on('end',()=>{
        let parsdRewrite = qs.parse(body);

        let rewriteData = temp.writeTemp(parsdRewrite.title, parsdRewrite.content);
        fs.writeFile(path.join(__dirname,'public','writeFile',`${modifyUrl}`),rewriteData,(err)=>{
          if(err){
            console.error("에러가 발생했습니다 에러 코드 : ", err);
          } else {
          resMo.updateTag(res);
          }
        });

      });
    } else {
      resMo.notFound(res);
    }
  } else {
    resMo.notFound(res);
  }
});

server.listen(3000, (err)=>{
  if(err){
    console.error(err);
  }
  console.log("서버가 가동중입니다.");
  console.log("http://localhost:3000");
})