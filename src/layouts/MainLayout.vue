<template>
  <!-- 하단 네비게이션(Navbar)의 높이만큼 padding-bottom을 주어 컨텐츠가 가려지지 않게 합니다. -->
  <div class="w-full h-full pb-[60px] flex flex-col">
    <Header />
    <main class="flex-1 w-full">
      <router-view />
    </main>
    <Navbar />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Navbar from '@/components/Navbar.vue';
</script>
