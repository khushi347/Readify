const axios = require("axios");

const searchBooks = async (query) => {

    const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    const items = response.data.items || [];

    const books = items.slice(0, 10).map((book) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
        genre: book.volumeInfo.categories?.[0] || "Unknown"
    }));

    return books;
};

const searchBooksByGenre = async (genre) => {

    const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${genre}`
    );

    const items = response.data.items || [];

    const books = items.slice(0, 10).map((book) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
        genre: book.volumeInfo.categories?.[0] || "Unknown"
    }));

    return books;
};

module.exports = {
    searchBooks,
    searchBooksByGenre
};