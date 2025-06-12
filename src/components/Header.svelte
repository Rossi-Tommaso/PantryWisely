<script lang="ts">
  import { onMount } from 'svelte';
  import Logo from './Logo.svelte';
  import type { Info } from '$lib/types.js';
  
  let currentDate = '';
  let isMenuOpen = false;
  let isScrolled = false;
  let info: Info[] = [
    {
      type: 'message',
      title: 'Test',
      message: 'test'
    },
    {
      type: 'message',
      title: 'Test',
      message: 'test'
    },
    {
      type: 'message',
      title: 'Test',
      message: 'test'
    },
  ]
  
  // Aggiorna la data in tempo reale
  onMount(() => {
    const updateDate = () => {
      currentDate = new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    updateDate();
    const interval = setInterval(updateDate, 60000); // Aggiorna ogni minuto
    
    // Gestisce l'effetto scroll
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
  
  const menuItems = [
    { name: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { name: 'Inventario', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10' },
    { name: 'Ricette', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Liste Spesa', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];
</script>

<!-- Header principale con effetto glassmorphism -->
<header 
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out"
  class:bg-white-80={isScrolled}
  class:backdrop-blur-xl={isScrolled}
  class:shadow-lg={isScrolled}
  class:bg-gradient-to-r={!isScrolled}
  class:from-white={!isScrolled}
  class:to-gray-90={!isScrolled}
  class:border-gray-200={isScrolled}
  class:border-b={isScrolled}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4 lg:py-6">
      
      <!-- Logo e informazioni -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-3 group">
          <!-- Logo con animazione -->
          <Logo 
            notification={info.length}
          />
          
          <!-- Testo del brand -->
          <div class="hidden sm:block">
            <h1 class="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
              PantryWisely
            </h1>
            <p class="text-sm lg:text-base text-gray-600 capitalize font-medium tracking-wide mt-0.5">
              {currentDate}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Desktop -->
      <nav class="hidden lg:flex items-center space-x-1">
        {#each menuItems as item}
          <button class="group relative px-4 py-2.5 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-xl hover:bg-gray-100/70 flex items-center space-x-2">
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/>
            </svg>
            <span class="font-medium text-sm">{item.name}</span>
            <!-- Indicatore hover -->
            <div class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></div>
          </button>
        {/each}
      </nav>

      <!-- Azioni rapide e menu mobile -->
      <div class="flex items-center space-x-2">
        
        <!-- Pulsanti azione rapida (desktop) -->
        <div class="hidden md:flex items-center space-x-2">
          <!-- Notifiche -->
          <button class="relative p-2.5 text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100/70 group">
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a3 3 0 00-6 0v5z"/>
            </svg>
            <div class="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </button>
          
          <!-- Impostazioni -->
          <button class="p-2.5 text-gray-500 hover:text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100/70 group">
            <svg class="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
          
          <!-- Profilo utente -->
          <button class="p-1 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span class="text-white font-bold text-sm">M</span>
            </div>
          </button>
        </div>

        <!-- Menu hamburger (mobile) -->
        <button 
          on:click={toggleMenu}
          class="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-xl hover:bg-gray-100/70"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6 transition-transform duration-300" class:rotate-90={isMenuOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if isMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>

<!-- Menu mobile -->
{#if isMenuOpen}
  <div class="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" on:click={toggleMenu}>
    <div 
      class="absolute top-20 right-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
      on:click|stopPropagation
    >
      <div class="p-6 space-y-4">
        <!-- Informazioni utente mobile -->
        <div class="flex items-center space-x-3 pb-4 border-b border-gray-100">
          <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <span class="text-white font-bold">M</span>
          </div>
          <div>
            <p class="font-semibold text-gray-900">Mario Rossi</p>
            <p class="text-sm text-gray-500">mario@example.com</p>
          </div>
        </div>
        
        <!-- Menu items -->
        {#each menuItems as item}
          <button class="w-full flex items-center space-x-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
            <svg class="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}/>
            </svg>
            <span class="font-medium">{item.name}</span>
          </button>
        {/each}
        
        <!-- Azioni rapide mobile -->
        <div class="pt-4 border-t border-gray-100 space-y-2">
          <button class="w-full flex items-center space-x-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a3 3 0 00-6 0v5z"/>
            </svg>
            <span class="font-medium">Notifiche</span>
            <div class="ml-auto w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
          </button>
          
          <button class="w-full flex items-center space-x-3 p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="font-medium">Impostazioni</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Spacer per compensare l'header fisso -->
<div class="h-20 lg:h-24"></div>

<style>
  /* Animazioni personalizzate */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>