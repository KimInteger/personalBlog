const form = document.getElementsByTagName('form');

console.log(document.URL);

form[0].setAttribute('action',`/delete/${document.URL}`);


console.log(form[0]);