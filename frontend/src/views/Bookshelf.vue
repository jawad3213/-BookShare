<template>
  <div class="library-container">
    <!-- Bannière -->
    <div class="banner">
      <h1>Borrow your book right now!</h1>
      <p>Explore a vast collection of books and find your next read.</p>
      <div class="search-bar">
        <input type="text" placeholder="Search for your book..." />
        <button>Search</button>
      </div>
    </div>

    <div class="most-borrowed">
      <h2 class="most-borrowed-title">Most Borrowed Books</h2>
      <div class="books-grid">
        <div class="book" v-for="(book, index) in borrowedBooks" :key="index">
          <img :src="book.image" alt="Book cover" class="book-image" />
          <div class="book-buttons">
            <button class="save-button">Save</button>
            <button class="borrow-button">Borrow Now</button>
          </div>
        </div>
      </div>
    </div>

    <div class="recently-used">
      <h2 class="most-recently-used">Recently Used</h2>
      <div class="recent-books-grid">
        <div class="book" v-for="(book, index) in recentBooks" :key="index">
          <img :src="book.image" alt="Book cover" class="book-image" />
          <div class="book-buttons">
            <button class="save-button">Save</button>
            <button class="borrow-button">Borrow Now</button>
          </div>
        </div>
      </div>
    </div>

    <div class="Browse">
  <h2 class="browse-genres">Browse Genres</h2>
  <div class="browse-genres-grid">
    <div class="book-ligne" v-for="(book, index) in browsegenres" :key="index">
      <img :src="book.image" alt="Book cover" class="book-image"  style="width:400px;"/>
    </div>
  </div>
</div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      borrowedBooks: [
        { image: require('@/assets/book1.jpg') },
        { image: require('@/assets/book2.jpg') },
        { image: require('@/assets/book3.jpg') },
        { image: require('@/assets/book4.jpg') },
        { image: require('@/assets/book5.jpg') },
        { image: require('@/assets/book6.jpg') }
        ],
      recentBooks: [
        { image: require('@/assets/book7.jpg') },
        { image: require('@/assets/book8.jpg') },
        { image: require('@/assets/book9.jpg') },
        { image: require('@/assets/book10.jpg') }
      ],
      browsegenres: [
  { image: require('@/assets/book11.jpg') },
  { image: require('@/assets/book12.jpg') },
  { image: require('@/assets/book13.jpg') },
  { image: require('@/assets/book14.jpg') },
  { image: require('@/assets/book15.jpg') },
  { image: require('@/assets/book16.jpg') },
  { image: require('@/assets/book17.jpg') },
  { image: require('@/assets/book18.jpg') },
  { image: require('@/assets/book19.jpg') }
]

    };
  }
};
</script>

<style scoped>
.library-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Bannière */
.banner {
  width: 100%;
  height: 80vh;
  background: url('@/assets/feature4.jpg') no-repeat center/cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}

.banner h1 {
  font-size: 3rem;
}

.banner p {
  font-size: 1.2rem;
  max-width: 600px;
}

/* Barre de recherche */
.search-bar {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 10px;
  font-size: 1rem;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-bar button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

/* Section Most Borrowed Books */
.most-borrowed-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 40px;
}

.most-recently-used{
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 40px;
}

.browse-genres{
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 40px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.book {
  text-align: center;

}

/* Taille uniforme des images de livres */
.book-image {
  width: 200px;  /* Largeur augmentée */
  height: 300px; /* Hauteur augmentée */
  object-fit: contain; /* Garder l'image entière */
  border-radius: 10px;
}


.book-buttons {
  margin-top: 10px;
}

.save-button, .borrow-button {
  padding: 5px 10px;
  margin: 5px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.save-button {
  background-color: #f0d881;
  color: black;
}

.borrow-button {
  background-color: #007bff;
  color: white;
}

.recent-books-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 colonnes pour afficher les livres côte à côte */
  gap: 20px;
  padding: 20px;
}

.browse-genres-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 images par ligne */
  gap: 10px; /* Réduit l'espace entre les images */
  column-gap: 5;
  row-gap: 4px;
  justify-content: center;
  
}
.book-ligne{
  padding-bottom: 0px;
  margin-bottom: 0px;
  padding-top: 0px;
}

</style>
