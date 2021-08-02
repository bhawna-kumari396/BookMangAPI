//Framework

const { response } = require("express");
const express = require("express");


//Database

const database = require("./database/index");

//Initailizing Express

const inkingEmotions = express();

//configurations

inkingEmotions.use(express.json());

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

inkingEmotions.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

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
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ book: getSpecificBook });

},
);

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
    const getSpecificAuthor = database.author.filter((author) =>
        author.books.includes(req.params.isbn));

    if (getSpecificAuthor.length === 0) {
        return res.json({ 
            error: `No author found for the book ${req.params.isbn}`, 
        });
    }

    return res.json({ authors: getSpecificAuthor });
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
Route         /book/add
description   add new books
Access          PUBLIC
Parameters     none
Method         POST
 */

inkingEmotions.post("/book/add", (req, res) => {

    const { newBook } = req.body;

    database.books.push(newBook);

    return res.json({ books: database.books,
         message: "Book was added!!!" });

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

    database.author.push(newAuthor);

    return res.json({ authors: database.authors,
         message: "Author was added!!!" });



});

/*
Route         /book/update/title
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
Route         /book/update/author
description   Update/add new author
Access          PUBLIC
Parameters     isbn
Method         PUT
 */

inkingEmotions.put("/book/update/author/:isbn/:authorId", (req, res) => {
    //Update the book database

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.authors.push(parseInt(req.body.newAuthor));
    }
    });


    //Update the author database

    database.authors.forEach((author) => {

        if (author.id === parseInt(req.body.newAuthor))
        return author.books.push(req.params.isbn);

    });

    return res.json({
        books: database.books, 
        authors: database.authors, 
        message: "New author was added 🚀"})
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

     return res.json({books: database.books, 
        publications: database.publications, 
        message: "Successfully updated publication",
    });

});


inkingEmotions.listen(3000, () => console.log("Server Running!!!"));
