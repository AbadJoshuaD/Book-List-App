class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(book => {
      UI.createBook(book);
    });
  }
  static createBook(book) {
    const booklist = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="button-delete">X</a></td>
    `;
    booklist.appendChild(row);
  }
  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static deleteBook(target) {
    if (target.classList.contains("button-delete")) {
      target.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const titleContainer = document.querySelector(".title-container");
    titleContainer.after(div);
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static deleteBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
document.addEventListener("DOMContentLoaded", UI.displayBooks);

document.querySelector("#form-book").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("All field must be filled in", "danger");
  } else {
    const book = new Book(title, author, isbn);
    UI.createBook(book);
    Store.addBooks(book);
    UI.showAlert("Successfully Added Book", "success");
    UI.clearFields();
  }
});

document.querySelector("#book-list").addEventListener("click", bookTarget => {
  UI.deleteBook(bookTarget.target);
  Store.deleteBook(
    bookTarget.target.parentElement.previousElementSibling.textContent
  );
  UI.showAlert("Successfully Deleted Book", "success");
});
