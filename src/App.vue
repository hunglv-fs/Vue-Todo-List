<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b">
      <div class="mx-auto px-4 sm:px-6 lg:px-8" style="max-width: 1000px;">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img alt="Vue logo" src="@/assets/logo.svg" class="h-8 w-8 mr-3" />
            <span class="text-xl font-semibold text-gray-900">Vue 3 App</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="flex items-center space-x-8">
            <RouterLink 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Home
            </RouterLink>
            <RouterLink 
              to="/about" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              About
            </RouterLink>
            <RouterLink 
              to="/todos" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              Todos
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

