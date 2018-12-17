document.addEventListener("DOMContentLoaded", function() {});

const listPanel = document.getElementById('list-panel')
const showPanel = document.getElementById('show-panel')
const booksList = document.getElementById('list')
const booksURL = 'http://127.0.0.1:3000/books'

function fetchBooks() {
  fetch(`${booksURL}`
  ).then(response => response.json())
  .then(books => renderBooks(books))
}

function renderBooks(books) {
  books.forEach((book) => {
    let bookTitle = document.createElement('li')
    bookTitle.id = book.id
    bookTitle.innerText = book.title
    booksList.appendChild(bookTitle)
    bookTitle.addEventListener('click', () => fetchBookDetails(book.id))
  })
}

function fetchBookDetails(id) {
  console.log(`${booksURL}/${id}`);
  fetch(`${booksURL}/${id}`
  ).then(response => response.json())
  .then(book => renderBookDetails(book))
}

function renderBookDetails(book){
  showPanel.innerHTML =`
    <h2>${book.title}</h2>
    <img src="${book.img_url}" alt="Image for Book">
    <p>${book.description}</p>
    <button type="button" name="button">${book.users.length} likes</button>
  `
  showPanel.querySelector("button").addEventListener('click', () => likeBook(book.users, book.id))
}

function likeBook(bookLikers, id) {
  let addOwnLike = {"id":1, "username":"pouros"}
  let isAlreadyLiked = bookLikers.filter((user) =>  user.id === addOwnLike.id)
  isAlreadyLiked.length > 0 ? isAlreadyLiked = true : isAlreadyLiked = false
  if (isAlreadyLiked) {
    showPanel.querySelector("button").disabled = true
  } else {
    bookLikers.push(addOwnLike)

    fetch(`${booksURL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        users: bookLikers
      })
    })
    .then(response => response.json())
    .then((response) => {
      showPanel.querySelector("button").innerText = `${response.users.length} likes`
  })

  }
}
fetchBooks()
