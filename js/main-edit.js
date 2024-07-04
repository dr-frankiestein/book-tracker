
document.querySelector('button').addEventListener('click', getFetch)

// to save list in local storage
const ul = document.querySelector('ul');
let booksArray = localStorage.getItem('bookList') ? JSON.parse(localStorage.getItem('bookList')) : [];

booksArray.forEach(addBook)
function addBook(book) {
  const li = document.createElement('li')
  li.textContent = book
  ul.appendChild(li)
}
function getFetch(){
  const choice = document.querySelector('input').value
  console.log(choice)
  localStorage.setItem('lastISBN', choice)
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${choice}&jscmd=data&format=json`
  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        const book = data[`ISBN:${choice}`]
        // adding to DOM
        document.querySelector('img').src = book.cover.medium
        document.querySelector('h3').innerText = book.title
        console.log(book)
        // adding to local storage
        addToStorage(book.title)
        
      

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
 
}

function addToStorage(newBook){
  booksArray.push(newBook)
  localStorage.setItem('bookList', JSON.stringify(booksArray))
  addBook(newBook)
  document.querySelector('input').value('')
}

