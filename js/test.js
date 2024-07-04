document.querySelector('button').addEventListener('click', searchForTitle)

const tbrList = []
const readList = []

// get tbr list from local storage:
let tbrArray = localStorage.getItem('tbrList') ? JSON.parse(localStorage.getItem('tbrList')) : [];
restoreBookMethods(tbrArray)
console.log(tbrArray)

tbrArray.forEach(book => book.addBookToList('tbr'))
// function addBook(book) {
//   const li = document.createElement('li')
//   li.textContent = book
//   ul.appendChild(li)
// }
// add to local storage
// function addToStorage(newBook){
//   tbrArray.push(newBook)
//   localStorage.setItem('tbrList', JSON.stringify(tbrArray))
//   newBook.addBookToList('tbr')
//   document.querySelector('input').value('')
// }

class Book {
  constructor(title, author, coverUrl, yearPublished, dateAdded, bookOlid) {
    this.title = title;
    this.author = author;
    this.cover = coverUrl;
    this.year = yearPublished; 
    this.dateAdded = dateAdded; 
    this.bookId = bookOlid; 
    this.tags = [];
    this.importance = 'normal';
  }
  // book list format
  createListEntry() {
    return `${this.title} - ${this.author} (${this.year})`;
  }
  showCover(imgNode) {
    imgNode.src = this.cover
  }
  addBookToList() {
    const ul = document.getElementById('tbr')
    const li = document.createElement('li')
    li.textContent = this.createListEntry()
    // localStorage.getItem('tbrList') ? ul.prepend(li) : ul.append(li)
    ul.prepend(li)
  }

  addToStorage(){
    tbrArray.push(this)
    localStorage.setItem('tbrList', JSON.stringify(tbrArray))
    this.addBookToList('tbr')
    document.querySelector('input').value('')
  }
}

function searchForTitle() {
  
  let titleSearch = document.querySelector('input').value
  titleSearch = titleSearch.split(' ').join('+')

  let url = `https://openlibrary.org/search.json?title=${titleSearch}&language=eng`
  // const img = document.querySelector('img')

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      const bk = data.docs[0]
      console.log(bk)
      const coverUrl = getCoverUrl(bk.cover_i)
      const date = dateToday()

      // In a more advanced version, this would take you to another page where you could edit this info before saving
      const newBook = new Book(bk.title, bk.author_name, coverUrl, bk.first_publish_year, date, bk.cover_edition_key)
      // tbrList.push(newBook)
      // newBook.addBookToList('tbr')

      // add new book to storage & push to DOM
      newBook.addToStorage()
      
    })
    .catch(err => {
      console.log(`error ${err}`)
    });

}


function getCoverUrl(coverId) {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`

}

function dateToday() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${year}-${month}-${day}`;
  return currentDate // "17-6-2022"
}

// to get covers: https://covers.openlibrary.org/b/id/13913814-M.jpg
// docs[i].cover_i

// re-add all the functions (JSON doesn't store methods)
// this is an insanely clunky solution this this problem but IDK how else to fix atm
function restoreBookMethods(bookArray) {
  bookArray.forEach((book,i) => {
    const source = {
      // book list format
      createListEntry() {
        return `${this.title} - ${this.author} (${this.year})`;
      },
      showCover(imgNode) {
        imgNode.src = this.cover
      },
      addBookToList() {
        const ul = document.getElementById('tbr')
        const li = document.createElement('li')
        li.textContent = this.createListEntry()
        // localStorage.getItem('tbrList') ? ul.prepend(li) : ul.append(li)
        ul.prepend(li)
      },
  
      addToStorage(){
        tbrArray.push(this)
        localStorage.setItem('tbrList', JSON.stringify(tbrArray))
        this.addBookToList('tbr')
        document.querySelector('input').value('')
      }
    }
    bookArray[i] = Object.assign(source, book)
  })
}