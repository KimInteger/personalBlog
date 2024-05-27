const http = require('node:http');
// node:js의 모듈 http를 불러온다.

const fs = require('node:fs');
// node:js의 모듈 fileSystem을 불러온다.

const qs = require('node:querystring');

const path = require('node:path');

function today(){
  let today = '';
  const date = new Date;
  const year = date.getFullYear();
  const month = `00${date.getMonth()+1}`.slice(-2);
  const day = date.getDate();
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = date.getMinutes();
  const sec = date.getSeconds();
  today = `${year}-${month}-${day}-${hour}-${minute}-${sec}`;
  return today;
}

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
  </body>
</html>
`
return html;
};

const mainTemp = function makeMain(content){
  const mainHtml = `<!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이것은블로그입니다.</title>
    <link rel="icon" href="./img/icons8-bear-full-body-16.png">
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

const htmlUrl = function(url){
  let path = ''; 
  if(url.startsWith('/2024')){
    path = './public/writeFile' + url;
  } else {
    return;
  }
  return path;
}

let liTag ='';

const server = http.createServer((req,res)=>{
  // ? 어디서 문제가 생겼는지 잡아내기 위한 console.log(req.url)
  console.log(req.url);
  let makeH = htmlUrl(req.url);
  if(req.method === 'GET'){
    if(req.url === '/'){
      fs.readFile('./public/index.html', (err,data)=>{
        if(err){
          res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
          res.end("서버 연결 오류");
        }
        res.writeHead(200,{"Content-Type":"text/html; charset=UTF-8"});
        res.end(data);
      });
    } else if (req.url ==='/img/icons8-bear-full-body-16.png') {
      fs.readFile('./public/img/icons8-bear-full-body-16.png', (err,data)=>{
        if(err){
          res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
          res.end("서버 연결 오류");
        }
        res.writeHead(200,{"Content-Type":"img/png"});
        res.end(data);
      });
    } else if(req.url ==='/script.js') {
      fs.readFile('./public/script.js',(err,data)=>{
        if(err){
          res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
          res.end("서버 연결 오류");
        }
        res.writeHead(200,{"Content-Type":"application/javascript; charset=UTF-8"});
        res.end(data);
      });
    } else if (req.url.startsWith('/2024')) {
      fs.readFile(makeH, (err,data)=>{
        if(err){
          res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
          res.end("서버 연결 오류");
        }
        res.writeHead(200,{"Content-Type":"text/html; charset=UTF-8"});
        res.end(data);
      });
    } else if (req.url === '/index.html') {
      fs.readFile('./public/index.html', (err,data)=>{
        if(err){
          res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
          res.end("서버 연결 오류");
        }
        res.writeHead(200,{"Content-Type":"text/html; charset=UTF-8"});
        res.end(data);
      });
    } else if (req.url === '/favicon.ico') {
      return;
    } else {
      res.writeHead(404, {"Content-Type": "text/plain; charset=UTF-8"});
      res.end("페이지를 찾을 수 없습니다.");
    }
  } else if (req.method === 'POST'){
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
        console.log(typeof(convertData));
        
        let nowDate = today();

        fs.writeFile(path.join(__dirname,'public','writeFile',`${nowDate}.html`),convertData,(err)=>{
          if(err){
            console.error("에러가 발생했습니다 에러 코드 : ", err);
          }
        });

        liTag += `<li><a href="${nowDate}.html">${nowDate}</a></li>`

        let mainIndex = mainTemp(liTag);

        fs.writeFile(path.join(__dirname,'public','index.html'), mainIndex, (err)=>{
          if(err){
            console.error("에러가 발생했습니다. 에러 코드 : ", err);
          }
          fs.readFile('./public/index.html', (err,data)=>{
            if(err){
              res.writeHead(500,{"Content-Type":"text/plain; charset=UTF-8"});
              res.end("서버 연결 오류");
            }
            res.writeHead(200,{"Content-Type":"text/html; charset=UTF-8"});
            res.end(data);
          });
        });
      });
    }
  } else {
    res.writeHead(404, {"Content-Type": "text/plain; charset=UTF-8"});
    res.end("페이지를 찾을 수 없습니다.");
  }
});

server.listen(3000, (err)=>{
  if(err){
    console.error(err);
  }
  console.log("서버가 가동중입니다.");
  console.log("http://localhost:3000");
})