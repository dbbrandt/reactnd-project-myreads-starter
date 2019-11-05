import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import SearchBooks from "./SearchBooks";
import Bookcase from "./Bookcase";

class BooksApp extends Component {
  state = {
    books: [],
    searchResults: [],
    isLoading: true
  };

  componentDidMount() {
    BooksAPI.getAll()
      .then(books => this.setState({ books: books }))
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  /* Handle search and store state at the top level so user can flip back to add and see prior search results */
  handleSearch = query => {
    BooksAPI.search(query).then(books => {
      this.setState({
        searchResults: books
      });
    });
  };

  /* This function handle both existing bookcase changes and new books.
     Books changed in the search results that are already in the
     bookshelf will have changes applied.
   */
  handleShelfChange = (shelf, modifiedBook) => {
    const { books, searchResults } = this.state;

    // Find the book in the current bookshelf
    let book = books.find(b => b.id === modifiedBook.id);

    // If book found in bookshelf,  update the shelf.
    if (book) {
      book.shelf = shelf;
    // If adding a book, append to bookshelf.
    } else {
      book = modifiedBook;
      book.shelf = shelf;
      books.push(book);
    }

    BooksAPI.update(book, shelf).then(res => {
      console.log(`Update result: ${res}`);
    });

    this.setState({ books: books, searchResults: searchResults });
  };

  render() {
    const { books, searchResults, isLoading } = this.state;
    return (
      <Router>
        {isLoading ? (
          <div className="loader">{false}</div>
        ) : (
          <div className="app">
            <Route
              exact
              path="/"
              render={props => (
                <Bookcase
                  {...props}
                  books={books}
                  onChangeShelf={this.handleShelfChange}
                />
              )}
            />
            <Route
              path="/search"
              render={props => (
                <SearchBooks
                  {...props}
                  searchResults={searchResults}
                  books={books}
                  onSubmitSearch={query => this.handleSearch(query)}
                  onAddBook={this.handleShelfChange}
                />
              )}
            />
          </div>
        )}
      </Router>
    );
  }
}

export default BooksApp;
