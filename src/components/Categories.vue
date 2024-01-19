<script setup lang="ts">
import { ref, onMounted } from 'vue';

const categories = [
  {
    name: 'Frontend',
    technologies: [
      { name: 'Vue 3', link: '/documentation/vue/' },
      { name: 'Nuxt', link: '/documentation/nuxt/' },
    ],
  },
  {
    name: 'Backend',
    technologies: [
      { name: 'Express.js', link: '/documentation/express/' },
    ],
  },
  {
    name: 'CI / CD',
    technologies: [
      // Ajoutez des technologies CI / CD au besoin
    ],
  },
  {
    name: 'Outils de développement',
    technologies: [
      // Ajoutez des outils de développement au besoin
    ],
  },
  {
    name: "Systèmes d'exploitation",
    technologies: [
      // Ajoutez des systèmes d'exploitation au besoin
    ],
  },

];

const selectedCategory = ref(categories[0]);
console.log(selectedCategory);

</script>

<template>

  <div>
    <label for="category-select">Choisir une catégorie</label>
    <select v-model="selectedCategory" id="category-select">
      <option v-for="category in categories" :key="category.name" :value="category">
        {{ category.name }}
      </option>
    </select>
  </div>

  <h2>{{ selectedCategory.name }}</h2>

</template>

<style scoped>
/* Ajoutez du style au besoin */
</style>
