document.querySelector('#submit').addEventListener('click', saveBook)
populateForm()
document.querySelector('#remove').addEventListener('click', deleteBook)


function loadBookInfo() {
  let title = sessionStorage.getItem("currentTitle");
  // console.log(title)
  let bookList = JSON.parse(localStorage.getItem('tbrList'))
  let obj = bookList.filter(o => o.title.includes(title))
  return obj[0]
}


function populateForm() {
  const currentBook = loadBookInfo()
  console.log(currentBook)
  document.getElementById('title').value = currentBook.title
  document.getElementById('author').value = currentBook.author
  document.getElementById('year').value = currentBook.year
  document.getElementById('date').value = currentBook.dateAdded
  // document.getElementById('olid').value = currentBook.bookId
  document.getElementById('importance').value = currentBook.importance
  const imgLink = currentBook.cover
  showCover(imgLink)
  document.getElementById('tags').value = currentBook.tags[0] ? currentBook.tags : ''
};
function showCover(coverLink) {
  const coverSection = document.querySelector('#bookCover')
  const img = document.createElement('img')
  console.log(coverLink)
  img.src= coverLink
  img.alt= "Book Cover"
  // img.width="500"
  coverSection.append(img)
}
function getCurrentIndex() {
  let bookList = JSON.parse(localStorage.getItem('tbrList'))
  let title = sessionStorage.getItem("currentTitle");
  return bookList.findIndex((x) => x.title === title)
}
class Book {
  constructor(title, author, coverUrl, yearPublished, dateAdded, bookOlid,tags,importance) {
    this.title = title;
    this.author = author;
    this.cover = coverUrl;
    this.year = yearPublished; 
    this.dateAdded = dateAdded; 
    this.bookId = bookOlid; 
    this.tags = tags;
    this.importance = importance;
  }
}
function updateBookObject() {
  const currentBook = loadBookInfo()
  let title = document.getElementById('title').value 
  let author = document.getElementById('author').value
  let year = document.getElementById('year').value 
  let date = document.getElementById('date').value 
  let id= document.getElementById('olid').value 
  let importance = document.getElementById('importance').value 
  let tags = document.getElementById('tags').value 
  let cover = currentBook.cover

  const newBook = new Book(title, author, cover, year, date, id, tags, importance)
  return newBook
}

function saveBook() {
  let i = getCurrentIndex()
  let bookList = JSON.parse(localStorage.getItem('tbrList'))
  bookList[i] = updateBookObject()
  localStorage.setItem('tbrList', JSON.stringify(bookList))
   window.location.href = "./index.html"

}

function deleteBook() {
  let i = getCurrentIndex()
  let bookList = JSON.parse(localStorage.getItem('tbrList'))
  bookList.splice(i,1)
  localStorage.setItem('tbrList', JSON.stringify(bookList))
  window.location.href = "./index.html"
}