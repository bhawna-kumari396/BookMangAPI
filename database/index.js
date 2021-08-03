let books = [{
    ISBN: "12234ONE",
    Title: "Heaven Of Love",
    Authors: [1, 2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category: ["fiction", "programming", "tech"],
    publication: 1,

},
{
    ISBN: "12234TWO",
    Title: "Only You",
    Authors: [1, 2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category: ["fiction",  "tech"],
    publication: 1,
},
];


const authors = [{
    id: 1,
    name: "Bhawna",
    books: ["12234ONE"],

    
},
{
    id: 2,
    name: "Abhinav",
    books: ["12234ONE"],

},
];

const publication = [{
    id: 1,
    name: "Spectrum Of Thoughts",
    books: ["12234ONE"]
},

{
    id: 2,
    name: "Fanatixx",
    books: [""]
},

];

//Export the data to NodeJS

module.exports = { books, authors, publication };

