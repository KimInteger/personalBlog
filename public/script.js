const board = document.getElementById('board');

const send = document.getElementById('send');

function today(){
  let today = '';
  const date = new Date;
  const year = date.getFullYear();
  const month = `00${date.getMonth()+1}`.slice(-2);
  const day = date.getDate();
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  const sec = date.getSeconds();
  today = `${year}-${month}-${day}-${hour}-${minute}-${sec}`;
  return today;
}


// send.addEventListener('click', ()=>{
//   let nowDate = today();
//   let li = document.createElement('li');
//   li.innerHTML = `<a href="./writeFile/${nowDate}.html">${nowDate}</a>`;
//   board.appendChild(li);
// });