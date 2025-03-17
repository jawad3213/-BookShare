import bookService from "@/services/bookService";

const state = {
  books: []
};

const mutations = {
  SET_BOOKS(state, books) {
    state.books = books;
  },
  ADD_BOOK(state, book) {
    state.books.push(book);
  }
};

const actions = {
  async fetchBooks({ commit }) {
    const books = await bookService.getBooks();
    commit("SET_BOOKS", books);
  },
  async addBook({ commit }, book) {
    const newBook = await bookService.addBook(book);
    commit("ADD_BOOK", newBook);
  }
};

const getters = {
  allBooks: (state) => state.books
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
