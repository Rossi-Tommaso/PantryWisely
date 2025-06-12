<script lang="ts">
  let { notification = 0 }: { notification?: number } = $props();
</script>

<div class="relative">
    <div class="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
      <svg class="w-6 h-6 lg:w-7 lg:h-7 text-white transform transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 2 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
      </svg>
      <!-- Indicatore di notifica -->
     {#if notification > 0}
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span class="text-xs text-white font-bold">{notification}</span>
        </div>
      {/if}
    </div>
    <!-- Effetto luminoso -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
</div>