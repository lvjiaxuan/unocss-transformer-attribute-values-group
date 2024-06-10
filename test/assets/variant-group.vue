<script setup lang="ts">
const a = 1
const b = 2
// eslint-disable-next-line style/space-infix-ops
const _c = [1,2,3].forEach(i => i + (a / b))
</script>

<template>
  <div class="bg-white font-light sm:[&[type=(number text)]]:(bg-gray-100 font-medium)" />
  <div class="lt-sm:[&[type=(number text)]]:(p-1 p-2)" />
  <div class="<sm:(p-1 p-2)" />
  <div class="sm:(p-1 p-2)" />
  <div class="dark:lg:(p-1 p-2)" />
  <div class="[&[type=(number text)]]:(bg-red text-green dark:(bg-cyan text-pink))" />
</template>
