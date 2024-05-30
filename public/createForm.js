const root = document.getElementById('root');

const modify = document.getElementById('modify');

function changePage(){
  let form = document.createElement('form');
  form.id = 'aForm';
  form.setAttribute('action','/modify');
  form.setAttribute('method','POST');

  let labelTitle = document.createElement('label');
  labelTitle.setAttribute('for','title');
  labelTitle.textContent = '제목'
  labelTitle.style.display = 'block'

  let labelContent = document.createElement('label');
  labelContent.setAttribute('for','content');
  labelContent.textContent = '내용'
  labelContent.style.display = 'block'

  let inputTitle = document.createElement('input');
  inputTitle.id = 'title';
  inputTitle.name = 'title';
  inputTitle.type = 'text';
  inputTitle.style.display = 'block'

  let contentArea = document.createElement('textarea');
  contentArea.id = 'content';
  contentArea.name = 'content';
  contentArea.setAttribute('rows',15);
  contentArea.setAttribute('cols',25);
  contentArea.style.display = 'block'

  let inputSubmit = document.createElement('input');
  inputSubmit.setAttribute('type','submit');
  inputSubmit.setAttribute('value','글쓰기');
  inputSubmit.style.display = 'block'
  inputSubmit.style.marginTop = '10px'

  form.appendChild(labelTitle)
  form.appendChild(inputTitle)
  form.appendChild(labelContent)
  form.appendChild(contentArea)
  form.appendChild(inputSubmit)



  root.textContent = '';
  root.appendChild(form);
};


modify.addEventListener('click',changePage);