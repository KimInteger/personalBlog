const http = require('node:http');
// node:js의 모듈 http를 불러온다.

const fs = require('node:fs');
// node:js의 모듈 fileSystem을 불러온다.

const qs = require('node:querystring');

const path = require('node:path');

const today = require('./memoModule/nowDate');

const temp = require('./memoModule/temp');

// ! server연결을 원활하게 하기 위한 기명함수 제작.


function notFound(res){
  res.writeHead(404, {"Content-Type":"text/plain; charset=UTF-8"});
  res.end('페이지를 찾을 수 없습니다.');
}

function connectErr(res){
  res.statusCode = 500;
  res.setHeader("Content-Type","text/plain; charset=UTF-8");
  res.write('서버 연결 오류');
  res.end();
}

// ! contentType을 할당하기 위한 변수 mimeType을 초기화하고 할당.

const mimeType = {
  '.html' : 'text/html; charset=UTF-8',
  '.css' : 'text/css; charset-UTF-8',
  '.js' : 'application/javascript; charset=UTF-8',
  '.json' : 'application/json; charset=UTF-8',
  '.ico' : 'img/x-icon',
  '.png' : 'img/png'
};

const fileUtills = {
  getFilepath : function(url){
    let filePath = '';
    if(url === '/'){
      filePath = './public/index.html';
    } else if (url.startsWith('/img')) {
      filePath = './public/img' + url;
    } else if (url.startsWith('/2024')){
      filePath = './public/writeFile' + url;
    } else {
      filePath = './public' + url;
    }
    return decodeURI(filePath);
  },

  getExtention : function(filePath){
    let ext = path.extname(filePath);
    return ext.toLowerCase();
  },

  getContentType : function(ext){
    let ct = '';
    if(mimeType.hasOwnProperty(ext)){
      ct = mimeType[ext];
    } else {
      ct = 'text/plain; charset=UTF-8';
    }
    return ct;
  } 
};




// ! 수정을 위한 데이터를 잡기 위한 곳
let modifyUrl = ''

function updateTag(res) {
  liTag = '';
  folderData = [];
  fs.readdir(path.join(__dirname,'public','writeFile'),'utf8',(err,data)=>{
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
          connectErr(res);
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
      notFound(res);
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
            updateTag(res);
          }
        });
      });
    } else if (req.url === '/delete') {
      let needData = req.headers.referer.split('/')[3];
      fs.unlink(path.join(__dirname,'public','writeFile',`/${needData}`), (err)=>{
        if(err){
          console.error(err);
        } else {
          updateTag(res);
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
          updateTag(res);
          }
        });

      });
    } else {
      notFound(res);
    }
  } else {
    notFound(res);
  }
});

server.listen(3000, (err)=>{
  if(err){
    console.error(err);
  }
  console.log("서버가 가동중입니다.");
  console.log("http://localhost:3000");
})