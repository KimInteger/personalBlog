const http = require('node:http');
// node:js의 모듈 http를 불러온다.

const fs = require('node:fs');
// node:js의 모듈 fileSystem을 불러온다.

const qs = require('node:querystring');

const path = require('node:path');

// ! 기점을 잡기위한 날짜 new Date매서드

function today(){
  let today = '';
  const date = new Date;
  const year = date.getFullYear();
  const month = `00${date.getMonth()+1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  const sec = `00${date.getSeconds()}`.slice(-2);
  today = `${year}-${month}-${day}-${hour}-${minute}-${sec}`;
  return today;
}

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


// ! html템플릿 관련 변수

// * 생성되어 writeFile로 들어가는 html template
const template = function makeTemplate(title,content) {
const html =`
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
    <h3>${content}</h3>
    <a href="../index.html">홈으로 돌아가기</a>
    <form action="/delete" method="POST">
    <button type="button"><a href="../writeField.html" style="color:black; text-decoration:none;">수정</a></button>
      <button type="submit">삭제</button>
    </form>
  </body>
</html>
`
return html;
};

// * res.end()로 보여질 화면을 잡아온 index.html의 tempalte
const mainTemp = function makeMain(content){
  const mainHtml = `<!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이것은블로그입니다.</title>
  </head>
  <body>
    <form action="/create" method="POST" id="form">
      <label for="title">제목</label><br>
      <input type="text" id="title" name="title"><br><br>
      <label for="content">내용</label><br>
      <textarea name="content" id="content" cols="25" rows="15"></textarea><br><br>
      <button id="send" type="submit">글쓰기</button>
    </form>
    <div>
      <h2>게시판</h2>
      <ul id="board">
      ${content}
      </ul>
    </div>
    <script src="./script.js"></script>
  </body>
  </html>`;
  return mainHtml;
};

// ! 폴더를 읽어내서 변수에 할당하기.
let folderData = [];

let liTag ='';

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
});



const server = http.createServer((req,res)=>{

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
        let convertData = template(title,content);
        
        let nowDate = today();

        fs.writeFile(path.join(__dirname,'public','writeFile',`${nowDate}.html`),convertData,(err)=>{
          if(err){
            console.error("에러가 발생했습니다 에러 코드 : ", err);
          } else {
            liTag += `<li><a href="${nowDate}.html">${nowDate}</a></li>`
            let mainIndex = mainTemp(liTag);
            res.writeHead(200,{"Content-Type":"text/html; charset=UTF-8"});
            res.end(mainIndex);
          }
        });
      });
    } else if (req.url === '/delete') {
      let needData = req.headers.referer.split('/')[3];
      fs.unlink(path.join(__dirname,'public','writeFile',`/${needData}`), (err)=>{
        if(err){
          console.error(err);
        } else {
          liTag = '';
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

            let mainIndex = mainTemp(liTag);
            res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"});
            res.end(mainIndex);

          });
        }
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