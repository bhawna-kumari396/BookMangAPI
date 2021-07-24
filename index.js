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
description    to get all books
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
description    to get specific book based on ISBN
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
Route         /category/
description    to get specific book based on a Category
Access          PUBLIC
Parameters     category
Method         GET
 */

inkingEmotions.get("/c/:category" , (req, res) => {
    const getSpecificBooks = database.books.filter((book) => book.category.includes(req.params.category));

    if (getSpecificBooks.length === 0) {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }

    return res.json({ book: getSpecificBooks });

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
    return res.json({ authors: database.authors });
});

/*
Route         /author
description   get a list of authors based on a book.
Access          PUBLIC
Parameters     isbn
Method         GET
 */

inkingEmotions.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter((author) => 
    author.books.includes(req.params.isbn));

    if(getSpecificAuthors.length === 0 ){
        return res.json({ error: `No author found for the book ${req.params.isbn}`,});
    }

    return res.json({ authors: getSpecificAuthors });
});


inkingEmotions.listen(3000, () => console.log("Server Running!!!"));