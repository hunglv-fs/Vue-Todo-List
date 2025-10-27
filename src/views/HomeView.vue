<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
    <div class="mx-auto px-4 text-center" style="max-width: 1000px;">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">
        Welcome to Vue 3 + Vite
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        A modern Vue.js application with Vue Router, Pinia, and TailwindCSS
      </p>
      
      <div class="grid md:grid-cols-3 gap-6 mt-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Vue Router</h3>
          <p class="text-gray-600">Navigate between Home, About, and Todos pages</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Pinia Store</h3>
          <p class="text-gray-600">Global state management for todo operations</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">TailwindCSS</h3>
          <p class="text-gray-600">Responsive and modern UI styling</p>
        </div>
      </div>
      
      <div class="mt-8">
        <RouterLink 
          to="/todos" 
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try the Todo App →
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
