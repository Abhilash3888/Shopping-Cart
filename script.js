const itemsList = document.querySelector('#item-list');
const items = document.querySelectorAll('li');
const filterInput = document.querySelector('.filter');
const clearBtn = document.querySelector('.btn-clear');
const submitBtn = document.querySelector('.btn');
const formInput = document.querySelector('.form-input');
const form = document.querySelector('#item-form');
let storage = [];
let isEditMode = false;
let oldText = '';
formInput.value = '';

function createListItem(value) {

  const listItem = document.createElement('li');
  const textContent = document.createTextNode(value);
  listItem.appendChild(textContent);

  const clear = document.createElement('button');
  clear.classList.add('remove-item', 'btn-link', 'text-red');

  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-xmark');

  clear.appendChild(icon);
  listItem.appendChild(clear);
  itemsList.appendChild(listItem);
}


function getStorageData() {
  const storedData = localStorage.getItem('items');
  storage = JSON.parse(storedData);
}

function updateListItem(pos, content) {
  Array.from(itemsList.children).forEach((item, index) => {
    if (index === pos) {
      item.textContent = '';
      item.classList.remove('edit-mode');
      const textContent = document.createTextNode(content);
      item.appendChild(textContent);

      const clear = document.createElement('button');
      clear.classList.add('remove-item', 'btn-link', 'text-red');

      const icon = document.createElement('i');
      icon.classList.add('fa-solid', 'fa-xmark');

      clear.appendChild(icon);
      item.appendChild(clear);
    }
  })
}

function removeDisplay() {
  filterInput.style.display = 'none';
  clearBtn.style.display = 'none';
}

function createButton() {
  submitBtn.textContent = ''
  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-plus');
  submitBtn.style.backgroundColor = '#000'
  submitBtn.appendChild(icon);
  const textContent = document.createTextNode(' Add Item');
  submitBtn.appendChild(textContent);
}

function updateButton() {
  submitBtn.textContent = ''
  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-pen');
  submitBtn.style.backgroundColor = '#228B22';
  submitBtn.appendChild(icon);
  const textContent = document.createTextNode(' Update Item');
  submitBtn.appendChild(textContent);
}

if (localStorage.getItem('items') && JSON.parse(localStorage.getItem('items')).length !== 0) {
  getStorageData();
  storage.forEach(data => createListItem(data));
} else {
  removeDisplay();
}

submitBtn.addEventListener('click', () => {
  createButton();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (!isEditMode) {
    createListItem(formInput.value);
    storage.push(formInput.value);
    localStorage.setItem('items', JSON.stringify(storage));
  }
  else {
    isEditMode = false;
    getStorageData();
    const index = storage.indexOf(oldText);
    storage[index] = formInput.value;
    localStorage.setItem('items', JSON.stringify(storage));
    updateListItem(index, formInput.value);
  }
  formInput.value = '';
  filterInput.style.display = 'inline';
  clearBtn.style.display = 'inline';
});

itemsList.addEventListener('click', e => {

  if (e.target.tagName === 'I') {
    const parent = e.target.parentElement.parentElement;
    parent.remove();
    if (itemsList.children.length === 0) {
      removeDisplay();
    }
    getStorageData();
    const index = storage.indexOf(e.target.parentElement.parentElement.textContent);
    storage.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(storage));
  }

  if (e.target.tagName === 'LI') {
    isEditMode = true;
    oldText = e.target.textContent;
    formInput.value = e.target.textContent;
    e.target.classList.add('edit-mode');
    updateButton();
  }
});

clearBtn.addEventListener('click', () => {
  Array.from(itemsList.children).forEach(item => itemsList.removeChild(item));
  removeDisplay();
  localStorage.clear();
  storage = [];
});

filterInput.addEventListener('input', e => {

  Array.from(itemsList.children).forEach(item => {
    item.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ? item.style.display = 'flex' : item.style.display = 'none';
  });
});
