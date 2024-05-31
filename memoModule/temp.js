const temp = {
  writeTemp : function(title,content){
    const create = `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
        form {
          display: inline;
        }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <h3>${content}</h3>
        <a href="../index.html">홈으로 돌아가기</a><br><br>
        <form action="/modify" method="POST">
          <button type="submit">수정</button>
        </form>
        <form action="/delete" method="POST">
          <button type="submit">삭제</button>
        </form>
      </body>
    </html>
    `
    return create;
  },
  
  mainTemp : function(content){
    const mainHtml = `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>이것은블로그입니다.</title>
      </head>
      <body>
        <div>
          <h1>패치노트</h1>
          <ul id="board">
          ${content}
          </ul>
        </div>
        <script src="./script.js"></script>
      </body>
    </html>`;
    return mainHtml;
  },

  modiTemp : `
  <!DOCTYPE html>
  <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>글 수정</title>
    </head>
    <body>
      <form action="/reWrite" method="POST">
        <label for="title">제목</label><br>
        <input type="text" id="title" name="title"><br><br>
        <label for="content">내용</label><br>
        <textarea name="content" id="content" cols="25" rows="15"></textarea><br><br>
        <button id="send" type="submit">글쓰기</button>
      </form>
    </body>
  </html>`,

  writeField : `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>글쓰기</title>
  </head>
  <body>
    <form action="/create" method="POST" id="form">
      <label for="title">제목</label><br>
      <input type="text" id="title" name="title"><br><br>
      <label for="content">내용</label><br>
      <textarea name="content" id="content" cols="25" rows="15"></textarea><br><br>
      <button id="send" type="submit">글쓰기</button>
    </form>
  </body>
  </html>
  `
}

module.exports = temp;