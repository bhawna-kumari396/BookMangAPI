require("dotenv").config();

//Framework
const express = require("express");

const mongoose = require("mongoose");

//Database

const database = require("./database/index");

//Initailizing Express

const inkingEmotions = express();

//configurations

inkingEmotions.use(express.json());

// Estb. database connection

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connection estblished!!!!");
  })
  .catch((err) => console.log("Connection Failed"));

/*
Route         /
description    To get all books
Access          PUBLIC
Parameters     NONE
Method         GET
 */

inkingEmotions.get("/", (req, res) => {
  // helloo change

  return res.json({ books: database.books });
});

/*
Route         /is
description    To get specific book based on ISBN
Access          PUBLIC
Parameters     isbn
Method         GET
 */

inkingEmotions.get("/:isbn", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,

    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route         /c
description    To get specific book based on a Category
Access          PUBLIC
Parameters     category
Method         GET
 */

inkingEmotions.get("/c/:category", (req, res) => {
  const getSpecificBooks = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );

  if (getSpecificBooks.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ books: getSpecificBooks });
});




/*
Route         /author
description    to get all authors
Access          PUBLIC
Parameters     NOPE
Method         GET
 */

inkingEmotions.get("/author", (req, res) => {
  return res.json({ authors: database.author });
});

/*
Route         /author/book
description   get a list of authors based on a book.
Access          PUBLIC
Parameters     isbn
Method         GET
 */

inkingEmotions.get("/author/book/:isbn", (req, res) => {
  const getSpecificAuthors = database.authors.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthors.length === 0) {
    return res.json({
      error: `No author found for the book ${req.params.isbn}`,
    });
  }

  return res.json({ authors: getSpecificAuthors });
});

/*
Route         /publication
description   get all publication
Access          PUBLIC
Parameters     none
Method         GET
 */

inkingEmotions.get("/publications", (req, res) => {
  return res.json({ publications: database.publication });
});

/*
Route         /book/new
description   add new books
Access          PUBLIC
Parameters     none
Method         POST
 */

inkingEmotions.post("/book/new", (req, res) => {
  const { newBook } = req.body;

  database.books.push(newBook);

  return res.json({ books: database.books, message: "Book was added!!!" });
});

/*
Route         /author/new
description   add new author
Access          PUBLIC
Parameters     none
Method         POST
 */

inkingEmotions.post("/author/new", (req, res) => {
  const { newAuthor } = req.body;

  database.authors.push(newAuthor);

  return res.json({
    authors: database.authors,
    message: "Author was added!!!",
    
  });
});

/*
Route         /publication/new
description   add new publication
Access          PUBLIC
Parameters     none
Method         POST
 */

inkingEmotions.post("/publication/new", (req, res) => {
  const { newPublication } = req.body;

  database.publications.push(newPublication);

  return res.json({
    publications: database.publications,
    message: "Publication was added!!!",
    
  });
});

/*
Route         /book/update
description   Update title of a book
Access          PUBLIC
Parameters     isbn
Method         PUT
 */

inkingEmotions.put("/book/update/:isbn", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.Title = req.body.bookTitle;
      return;
    }
  });

  return res.json({ books: database.books });
});

/*
Route         /book/author/update/:isbn
description   Update/add new author
Access          PUBLIC
Parameters     isbn
Method         PUT
 */

inkingEmotions.put("/book/author/update/:isbn", (req, res) => {
  //Update the book database

  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) 
      return book.authors.push(req.body.newAuthor);
    
  });

  //Update the author database

  database.authors.forEach((author) => {
    if (author.id === req.body.newAuthor)
      return author.books.push(req.params.isbn);
  });

  return res.json({
    books: database.books,
    authors: database.authors,
    message: "New author was added ????",
  });
});

/*
Route         /publication/update/book
description   Update/add new book to a publication
Access          PUBLIC
Parameters     isbn
Method         PUT
 */

inkingEmotions.put("/publication/update/book/:isbn", (req, res) => {
  // update the publication database

  database.publications.forEach((publication) => {
    if (publication.id === req.body.pubId) {
      return publication.books.push(req.params.isbn);
    }
  });

  //update the book database

  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publications,
    message: "Successfully updated publication",
  });
});

/*
Route         /book/delete
description   delete a book
Access          PUBLIC
Parameters     isbn
Method         DELETE
 */

inkingEmotions.delete("/book/delete/:isbn", (req, res) => {
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  );

  database.books = updatedBookDatabase;
  return res.json({ books: database.books });
});

/*
Route         /book/delete/author
description   delete a author from a book
Access          PUBLIC
Parameters     isbn, author id
Method         DELETE
 */

inkingEmotions.delete("/book/delete/Authors/:ISBN/:authorId", (req, res) => {
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(req.params.authorId)
      );

      book.authors = newAuthorList;
      return;
    }
  });

  //update the author database
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBooksList = author.books.filter(
        (book) => book.ISBN !== req.params.isbn
      );

      author.books = newBooksList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.authors,
    message: "author was deleted!!!!",
  });
});

/*
Route         /publication/delete/book
description   delete a book from publication
Access          PUBLIC
Parameters     isbn, publication id
Method         DELETE
 */

inkingEmotions.delete("/publication/delete/book/:ISBN/:pubId", (req, res) => {
  database.publications.forEach((publication) => {
    if (publication.id === parseInt(req.params.pubId)) {
      const newBooksList = publication.books.filter(
        (book) => book !== req.params.isbn
      );

      publication.books = newBooksList;
      return;
    }
  });

  //update book database

  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = 0; // no publication available
      return;
    }

    return res.json({
      books: database.books,
      publications: database.publications,
    });
  });
});

inkingEmotions.listen(3000, () => console.log("Server Running!!!"));

//Talk to mongodb in which mongodb understands => *******
//talk to us in the way we understand => JS

// mongoose

//why schema?

//mongodb is schemaless

//mongoose helps you with validation.

//mongooes model

//model -> document model of mongo DB

//scheme -> Model ->
