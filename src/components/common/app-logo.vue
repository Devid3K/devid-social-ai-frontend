<template>
  <div class="flex items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      class="w-8 h-8 flex-shrink-0"
      fill="none"
    >
      <defs><linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#fb7185"/></linearGradient></defs>
      <circle cx="20" cy="20" r="20" fill="url(#logo-grad)" />
      <path
        d="M12 20 Q20 10 28 20 Q20 30 12 20Z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="20" cy="20" r="4" fill="white" />
      <circle cx="20" cy="20" r="2" fill="#22d3ee" />
    </svg>
    <span class="text-lg font-bold text-white tracking-tight">
      Devid<span class="text-rose-400">AI</span>
    </span>
  </div>
</template>

<script setup lang="ts">
// App logo — no props needed
</script>
