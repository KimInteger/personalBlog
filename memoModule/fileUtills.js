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
    let path = require('node:path');

    let ext = path.extname(filePath);
    return ext.toLowerCase();
  },

  getContentType : function(ext){
    const mimeType = {
      '.html' : 'text/html; charset=UTF-8',
      '.css' : 'text/css; charset-UTF-8',
      '.js' : 'application/javascript; charset=UTF-8',
      '.json' : 'application/json; charset=UTF-8',
      '.ico' : 'img/x-icon',
      '.png' : 'img/png'
    };

    let ct = '';
    if(mimeType.hasOwnProperty(ext)){
      ct = mimeType[ext];
    } else {
      ct = 'text/plain; charset=UTF-8';
    }
    return ct;
  } 
};

module.exports = fileUtills;