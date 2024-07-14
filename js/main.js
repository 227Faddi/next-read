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

document.querySelector('#getBook').addEventListener('click', getBook);

async function getBook(){
  try{
    const userInput = document.querySelector('#userInput').value.trim().toLowerCase()
    if(!userInput){
      alert('Please enter a topic or genre')
      return;
    }
    const url = `https://openlibrary.org/subjects/${userInput}.json`
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();

    const booksAvailable = data.works.length;
    let currentBook = 0;
    
    function displayBook(currentBook) {
      bookCover.classList.add('hidden');
      bookContainer.classList.remove('hidden');
      spinner.classList.remove('hidden');
      
      const coverID = data.works[currentBook].cover_id;

      if(!coverID){
        noCoverMessage.classList.remove('hidden');
        bookCover.classList.add('hidden');
        spinner.classList.add('hidden');
      }else{
        noCoverMessage.classList.add('hidden');
        bookCover.src = `https://covers.openlibrary.org/b/id/${coverID}.jpg`;
      }
      
      const key = data.works[currentBook].key;
      bookDetails.href = `https://openlibrary.org${key}`;
      bookTitle.innerText = data.works[currentBook].title;
      bookAuthor.innerText = `By ${data.works[currentBook].authors[0].name}`;

      bookCover.onload = function(){
        bookCover.classList.remove('hidden');
        spinner.classList.add('hidden')
        nextBookBtn.classList.remove('hidden')
        previousBookBtn.classList.remove('hidden')
      }
      bookCover.onerror = function () {
        noCoverMessage.classList.remove('hidden');
        spinner.classList.add('hidden');
        bookCover.classList.add('hidden');
      }
    }

    displayBook(currentBook);
    
    // SCROLL THROUGH THE BOOKS AVAILABLE
    nextBookBtn.addEventListener('click', nextBook)
    previousBookBtn.addEventListener('click', previousBook)
  
    function nextBook() {
      if (currentBook < booksAvailable - 1) {
        currentBook++;
        displayBook(currentBook);
      } else {
        currentBook = 0;
        displayBook(currentBook);
      }
    }
    function previousBook() {
      if (currentBook > 0) {
        currentBook--;
        displayBook(currentBook);
      } else {
        currentBook = booksAvailable - 1
        displayBook(currentBook);
      }
    }
  }
  catch(err){
    alert(err)
  }
}

