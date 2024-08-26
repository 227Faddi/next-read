// Elements
const bookContainer = document.querySelector('#bookContainer');
const bookTitle = document.querySelector('#bookTitle');
const bookAuthor = document.querySelector('#bookAuthor');
const bookCover = document.querySelector('#bookCover');
const noCoverMessage = document.querySelector('#noCoverMessage');
const spinner = document.querySelector('.spinner-border');
const bookDetails = document.querySelector('#bookDetails');
const nextBookBtn = document.querySelector('#nextBookBtn')
const previousBookBtn = document.querySelector('#previousBookBtn');
const hidden = document.querySelectorAll('.hidden');
const addBookBtn = document.querySelector('#addBook')
const getBookBtn = document.querySelector('#getBook');
const addMessage = document.querySelector('#addMessage')
const errorMessage = document.querySelector('#errorMessage')


// Show and Hide
function showElement(element) {
  element.classList.remove('hidden');
}
function hideElement(element) {
  element.classList.add('hidden');
}

// Temporary message for feedback
function displayTemporaryMessage(element, message, duration = 1500) {
  element.innerText = message;
  showElement(element);
  setTimeout(() => hideElement(element), duration);
}


getBookBtn.addEventListener('click', getBook);
async function getBook(){
  try{
    showElement(addBookBtn)

    const userInput = document.querySelector('#userInput').value.trim().toLowerCase()
    if(!userInput){
      displayTemporaryMessage(errorMessage, 'Please insert a topic');
      return;
    }

    const url = `https://openlibrary.org/subjects/${userInput}.json`
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    if(data.works.length === 0){
      displayTemporaryMessage(errorMessage, 'Invalid input or subject not found');
      return
    }

    const booksAvailable = data.works.length;
    let currentBook = 0;
    
    // Display Book
    function displayBook(currentBook) {
      hideElement(bookCover)
      showElement(bookContainer)
      showElement(spinner)
      
      const coverID = data.works[currentBook].cover_id;
      if(!coverID){
        hideElement(bookCover)
        hideElement(spinner)
        showElement(noCoverMessage)
      }else{
        hideElement(noCoverMessage)
        bookCover.src = `https://covers.openlibrary.org/b/id/${coverID}.jpg`;
      }
      const key = data.works[currentBook].key;
      bookDetails.href = `https://openlibrary.org${key}`;
      bookTitle.innerText = data.works[currentBook].title;
      bookAuthor.innerText = `By ${data.works[currentBook].authors[0].name}`;

      bookCover.onload = function(){
        hideElement(spinner)
        showElement(bookCover)
        showElement(nextBookBtn)
        showElement(previousBookBtn)
      }
      bookCover.onerror = function () {
        hideElement(spinner)
        hideElement(bookCover)
        showElement(noCoverMessage)
      }
    }
    
    // NEXT/PREVIOUS BOOK AVAILABLE
    nextBookBtn.addEventListener('click', nextBook)
    function nextBook() {
      showElement(addBookBtn)
      if (currentBook < booksAvailable - 1) {
        currentBook++;
        displayBook(currentBook);
      } else {
        currentBook = 0;
        displayBook(currentBook);
      }
    }

    // PREVIOUS BOOK AVAILABLE
    previousBookBtn.addEventListener('click', previousBook)
    function previousBook() {
      showElement(addBookBtn)
      if (currentBook > 0) {
        currentBook--;
        displayBook(currentBook);
      } else {
        currentBook = booksAvailable - 1
        displayBook(currentBook);
      }
    }

    displayBook(currentBook);
  }
  catch(err){
    alert(err)
  } 
}

addBookBtn.addEventListener('click', addBook)
async function addBook(){
  hideElement(addBookBtn)
  const title = document.querySelector('#bookTitle').innerText;
  const author = document.querySelector('#bookAuthor').innerText;
  const image = document.querySelector('#bookCover').src;
  const link = document.querySelector('#bookDetails').href;
  try{
    const response = await fetch('dashboard/books/add',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        'title': title,
        'author': author,
        'image': image,
        'link': link,
      })
    })
    const result = await response.json(); 
    if(!response.ok) {
      addMessage.classList.add('alert-danger')
      displayTemporaryMessage(addMessage, result.message)
    } else{
      addMessage.classList.add('alert-success')
      displayTemporaryMessage(addMessage, result.message)
    }
  }catch(err){
    console.log(err)
  }
}
