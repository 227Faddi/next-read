// Elements
const bookContainer = document.querySelector('#bookContainer');
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const cover = document.querySelector('#cover');
const link = document.querySelector('#link');
const noCoverMessage = document.querySelector('#noCoverMessage');
const spinner = document.querySelector('.spinner-border');
const addMessage = document.querySelector('#addMessage')
const errorMessage = document.querySelector('#errorMessage')
// Buttons
const nextBtn = document.querySelector('#nextBtn')
const previousBtn = document.querySelector('#previousBtn');
const addBtn = document.querySelector('#addBtn')
const getBtn = document.querySelector('#getBtn');

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

getBtn.addEventListener('click', getBook);
async function getBook(){
  try{
    showElement(addBtn)

    const userInput = document.querySelector('#userInput').value.trim().toLowerCase()
    if(!userInput){
      displayTemporaryMessage(errorMessage, 'Please enter a topic or genre.');
      return;
    }

    const url = `https://openlibrary.org/subjects/${userInput}.json`
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    if(data.works.length === 0){
      displayTemporaryMessage(errorMessage, 'No results found. Please try a different topic or genre.');
      return
    }

    const booksAvailable = data.works.length;
    let currentBook = 0;
    
    // Display Book
    function displayBook(currentBook) {
      hideElement(cover)
      showElement(bookContainer)
      showElement(spinner)
      
      const coverID = data.works[currentBook].cover_id;
      if(!coverID){
        hideElement(cover)
        hideElement(spinner)
        showElement(noCoverMessage)
      }else{
        hideElement(noCoverMessage)
        cover.src = `https://covers.openlibrary.org/b/id/${coverID}.jpg`;
      }

      const key = data.works[currentBook].key;
      link.href = `https://openlibrary.org${key}`;
      title.innerText = data.works[currentBook].title;
      author.innerText = `By ${data.works[currentBook].authors[0].name}`;

      cover.onload = function(){
        hideElement(spinner)
        showElement(cover)
        showElement(nextBtn)
        showElement(previousBtn)
      }
      cover.onerror = function () {
        hideElement(spinner)
        hideElement(cover)
        showElement(noCoverMessage)
      }
    }
    
    // NEXT/PREVIOUS BOOK AVAILABLE
    nextBtn.addEventListener('click', nextBook)
    function nextBook() {
      hideElement(noCoverMessage)
      showElement(addBtn)
      if (currentBook < booksAvailable - 1) {
        currentBook++;
        displayBook(currentBook);
      } else {
        currentBook = 0;
        displayBook(currentBook);
      }
    }

    // PREVIOUS BOOK AVAILABLE
    previousBtn.addEventListener('click', previousBook)
    function previousBook() {
      hideElement(noCoverMessage)
      showElement(addBtn)
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

addBtn.addEventListener('click', addBook)
async function addBook(){
  hideElement(addBtn)
  const title = document.querySelector('#title').innerText;
  const author = document.querySelector('#author').innerText;
  const image = document.querySelector('#cover').src;
  const link = document.querySelector('#link').href;
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
      displayTemporaryMessage(addMessage, result.message)
      addMessage.classList.remove('alert-success')
      addMessage.classList.add('alert-danger')
    } else{
      displayTemporaryMessage(addMessage, result.message)
      addMessage.classList.remove('alert-danger')
      addMessage.classList.add('alert-success')
    }
  }catch(err){
    console.log(err)
  }
}
