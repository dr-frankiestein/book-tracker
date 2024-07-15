document.querySelector('#addBook').addEventListener('click', searchForTitle)

const tbrList = []
const readList = []

// get tbr list from local storage:
let tbrArray = localStorage.getItem('tbrList') ? JSON.parse(localStorage.getItem('tbrList')) : [];
restoreBookMethods(tbrArray)
console.log(tbrArray)


tbrArray.forEach(book => book.addBookToList('tbr'))
addEventToItems()

function addEventToItems() {
    let items = document.querySelectorAll('li')
    items.forEach(item => {
    item.addEventListener('mouseover', (e) =>{
      let currentTitle = e.target.innerText
      currentTitle = currentTitle.split(' - ')[0]
      sessionStorage.setItem("currentTitle", currentTitle)
    }) 
  })
}



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
  showCover() {
    const img = document.querySelector('#coverImg')
    img.src = this.cover
    img.style.display = 'block'
  }
  addBookToList() {
    const ul = document.getElementById('tbr')
    const link = document.createElement('a')
    link.href="./book-form.html"
    link.textContent = this.createListEntry()
    const li = document.createElement('li')
    li.appendChild(link)
    // li.textContent = this.createListEntry()
    // localStorage.getItem('tbrList') ? ul.prepend(li) : ul.append(li)
    ul.prepend(li)
  }

  addToStorage(){
    tbrArray.push(this)
    localStorage.setItem('tbrList', JSON.stringify(tbrArray))
    this.addBookToList('tbr')
    document.querySelector('input').value = ''
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
      sessionStorage.setItem("currentTitle", bk.title)
      // In a more advanced version, this would take you to another page where you could edit this info before saving
      const newBook = new Book(bk.title, bk.author_name, coverUrl, bk.first_publish_year, date, bk.cover_edition_key)
      // tbrList.push(newBook)
      // newBook.addBookToList('tbr')
      
      newBook.showCover()
      // add new book to storage & push to DOM
      newBook.addToStorage()
      addEventToItems()
      
      window.location.href = "./book-form.html"
      
    })
    // .catch(err => {
    //   console.log(`error ${err}`)
    // });
    
}

function loadBookForm() {
  window.location.href = "./book-form.html"
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
  let currentDate = new Date().toJSON().slice(0, 10);;
  return currentDate // "17-6-2022"
}

// function titleFromString(e) {
//   let currentTitle = e.target.innerText
//   currentTitle = currentTitle.split(' - ')[0]
//   sessionStorage.setItem("currentTitle", currentTitle)

// }
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
        const link = document.createElement('a')
        link.href="./book-form.html"
        link.textContent = this.createListEntry()
        const li = document.createElement('li')
        li.appendChild(link)
        // li.textContent = this.createListEntry()
        // localStorage.getItem('tbrList') ? ul.prepend(li) : ul.append(li)
        ul.prepend(li)
      },
  
      addToStorage(){
        tbrArray.push(this)
        localStorage.setItem('tbrList', JSON.stringify(tbrArray))
        this.addBookToList('tbr')
        document.querySelector('input').value = ''
      }
    }
    bookArray[i] = Object.assign(source, book)
  })
}