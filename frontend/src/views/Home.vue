<template>
  <div class="home-container">

    <div class="banner">
      <h1>Your Best Value Proposition</h1>
      <p>Where stories come alive, Knowledge knows no bounds, Welcome to our library!</p>
      <button>Start free trial</button>
    </div>
    
    
    <div class="features">
      <div class="feature" v-for="(feature, index) in features" :key="index">
        <img :src="feature.image" alt="Feature image" class="feature-image" />
        <div class="feature-text">
          <h2>{{ feature.title }}</h2>
          <p>{{ feature.description }}</p>
          <button>Learn More</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          image: require('@/assets/feature1.jpg'),
          title: "Feature that is amazing",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
          image: require('@/assets/feature2.jpg'),
          title: "Feature that is amazing",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        },
        {
          image: require('@/assets/feature3.jpg'),
          title: "Feature that is amazing",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        }
      ]
    };
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Bannière */
.banner {
  width: 100%;
  height: 80vh;
  background: url('@/assets/banner.jpg') no-repeat center/cover;
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

.banner button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

/* Section des fonctionnalités */
.features {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 50px 10px;
}

.feature {
  display: flex;
  align-items: center;
  width: 80%;
  max-width: 1200px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-image {
  width: 50%;
  height: auto;
  border-radius: 10px;
}

.feature-text {
  flex: 1;
  padding: 20px;
}

.feature h2 {
  font-size: 1.8rem;
}

.feature p {
  font-size: 1rem;
}

.feature button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>