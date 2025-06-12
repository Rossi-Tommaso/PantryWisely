<script lang="ts">
    import PantryListItem from "../../components/PantryListItem.svelte";
    import Filter from "../../components/Filter.svelte";
    import SummaryCard from "../../components/SummaryCard.svelte";
    import AddPantryItemModal from "../../components/AddPantryItemModal.svelte";
    import type { PantryItem, ExpiryStatus } from "$lib/types.js";
  
    let pantryItems: PantryItem[] = $state([
      {
        id: '1',
        name: 'Latte fresco',
        quantity: '1L',
        category: 'Latticini',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 giorni
        isEssential: true,
      },
      {
        id: '2',
        name: 'Pasta',
        quantity: '500g',
        category: 'Cereali',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 giorni
        isEssential: true,
      },
      {
        id: '3',
        name: 'Yogurt greco',
        quantity: '400g',
        category: 'Latticini',
        expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // scaduto ieri
        isEssential: false,
      },
      {
        id: '4',
        name: 'Olio extravergine',
        quantity: '500ml',
        category: 'Condimenti',
        expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 mesi
        isEssential: true,
      }
    ]);
  
    let selectedStatus = $state<'all' | 'fresh' | 'expiring' | 'expired'>('all');
    let showEssentials = $state(false);
    let isModalOpen = $state(false);
  
    function getExpiryStatus(expirationDate: Date | null): ExpiryStatus {
      if (!expirationDate) return 'fresh';
      
      const now = new Date();
      const diffTime = expirationDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'expired';
      if (diffDays <= 7) return 'expiring';
      return 'fresh';
    }
  
    const filteredItems = $derived(() => {
      return pantryItems.filter(item => {
        const statusMatch = selectedStatus === 'all' || getExpiryStatus(item.expirationDate) === selectedStatus;
        const essentialMatch = !showEssentials || item.isEssential;
        return statusMatch && essentialMatch;
      });
    });
  
    const summary = $derived(() => {
      const expiringSoon = pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'expiring').length;
      const expired = pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'expired').length;
      const essentials = pantryItems.filter(item => item.isEssential).length;
      
      return {
        totalItems: pantryItems.length,
        expiringSoon,
        expired,
        essentials
      };
    });
  
    const statusCounts = $derived(() => ({
      all: pantryItems.length,
      fresh: pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'fresh').length,
      expiring: pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'expiring').length,
      expired: pantryItems.filter(item => getExpiryStatus(item.expirationDate) === 'expired').length
    }));
  
    function addItem(itemData: { 
      name: string; 
      quantity: string; 
      category?: string; 
      expirationDate: Date | null; 
      isEssential: boolean 
    }) {
      const newItem: PantryItem = {
        id: Date.now().toString(),
        ...itemData
      };
      pantryItems = [...pantryItems, newItem];
    }
  
    function deleteItem(id: string) {
      pantryItems = pantryItems.filter(item => item.id !== id);
    }
  
    function updateExpiration(id: string, expirationDate: Date | null) {
      pantryItems = pantryItems.map(item => 
        item.id === id ? { ...item, expirationDate } : item
      );
    }
  
    function toggleEssential(id: string) {
      pantryItems = pantryItems.map(item => 
        item.id === id ? { ...item, isEssential: !item.isEssential } : item
      );
    }
  
    function clearExpired() {
      pantryItems = pantryItems.filter(item => getExpiryStatus(item.expirationDate) !== 'expired');
    }
  
    function openModal() {
      isModalOpen = true;
    }
  
    function closeModal() {
      isModalOpen = false;
    }
  </script>
  
  <svelte:head>
    <title>Dispensa - DispensApp</title>
    <meta name="description" content="Gestisci la tua dispensa con scadenze e articoli essenziali" />
  </svelte:head>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Dispensa</h2>
      <p class="text-lg text-gray-600">Tieni traccia delle scadenze e gestisci i tuoi articoli essenziali.</p>
    </div>
  
    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <SummaryCard
        title="Totale Articoli"
        value={summary().totalItems}
        icon="package"
        color="blue"
      />
      
      <SummaryCard
        title="In Scadenza"
        value={summary().expiringSoon}
        icon="clock"
        color="amber"
      />
      
      <SummaryCard
        title="Scaduti"
        value={summary().expired}
        icon="exclamation"
        color="red"
      />
  
      <SummaryCard
        title="Essenziali"
        value={summary().essentials}
        icon="star"
        color="green"
      />
    </div>
  
    <!-- Main Content Area -->
    <div class="space-y-6">
      <!-- Filters and Controls -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <Filter 
              bind:selectedExpiry={selectedStatus}
              expiryCounts={statusCounts()}
              context="expiry" 
            />
          </div>
          
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                bind:checked={showEssentials}
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Solo essenziali
            </label>
            
            {#if summary().expired > 0}
              <button 
                onclick={clearExpired}
                class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Rimuovi scaduti
              </button>
            {/if}
          </div>
        </div>
      </div>
  
      <!-- Items List -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-900">
              Articoli in Dispensa ({filteredItems().length})
            </h3>
            
            {#if filteredItems().length > 0}
              <div class="text-sm text-gray-500">
                {selectedStatus !== 'all' ? `Filtrato per: ${selectedStatus}` : 'Tutti gli articoli'}
              </div>
            {/if}
          </div>
        </div>
        
        <div class="divide-y divide-gray-100">
          {#each filteredItems().sort((a, b) => {
            // Sort by expiry status (expired first, then expiring, then fresh)
            const statusA = getExpiryStatus(a.expirationDate);
            const statusB = getExpiryStatus(b.expirationDate);
            
            if (statusA !== statusB) {
              const statusOrder = { expired: 3, expiring: 2, fresh: 1 };
              return statusOrder[statusB] - statusOrder[statusA];
            }
            
            // Then by expiration date (sooner first)
            if (a.expirationDate && b.expirationDate) {
              return a.expirationDate.getTime() - b.expirationDate.getTime();
            }
            
            // Finally by name
            return a.name.localeCompare(b.name);
          }) as item (item.id)}
            <PantryListItem 
              {item}
              expiryStatus={getExpiryStatus(item.expirationDate)}
              onDelete={() => deleteItem(item.id)}
              onUpdateExpiration={(date: Date | null) => updateExpiration(item.id, date)}
              onToggleEssential={() => toggleEssential(item.id)}
            />
          {/each}
          
          {#if filteredItems().length === 0}
            <div class="p-12 text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Nessun articolo trovato</h4>
              <p class="text-gray-500 mb-4">
                {selectedStatus !== 'all' 
                  ? `Non ci sono articoli con stato ${selectedStatus}` 
                  : 'La tua dispensa è vuota'}
              </p>
              <button
                onclick={openModal}
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Aggiungi il primo articolo
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </main>
  
  <!-- Floating Action Button -->
  <div class="fixed bottom-6 right-6 z-40">
    <button
      onclick={openModal}
      class="group relative w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
    >
      <svg class="w-8 h-8 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
      
      <!-- Tooltip -->
      <div class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Aggiungi articolo in dispensa
        <div class="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
      </div>
    </button>
  
    <!-- Pulse Animation Ring -->
    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-blue-600 animate-ping opacity-20"></div>
  </div>
  
  <!-- Add Item Modal -->
  <AddPantryItemModal 
    {isModalOpen} 
    onClose={closeModal}
    {addItem}
  />
  
  <!-- Desktop Quick Stats (hidden on mobile) -->
  <div class="hidden lg:block fixed bottom-6 left-6 z-40">
    <div class="flex flex-col gap-3">
      <!-- Quick Stats -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
        <div class="text-xs text-gray-500 mb-1">Articoli in dispensa</div>
        <div class="text-2xl font-bold text-gray-900">{summary().totalItems}</div>
        {#if summary().expiringSoon > 0}
          <div class="text-xs text-amber-600 font-medium mt-1">
            {summary().expiringSoon} in scadenza
          </div>
        {/if}
        {#if summary().expired > 0}
          <div class="text-xs text-red-600 font-medium mt-1">
            {summary().expired} scaduti
          </div>
        {/if}
      </div>
      
      <!-- Secondary Actions -->
      {#if summary().expired > 0}
        <button
          onclick={clearExpired}
          class="group w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
          title="Rimuovi scaduti"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      {/if}
    </div>
  </div>
  
  <style>
    /* Custom animations */
    @keyframes pulse-slow {
      0%, 100% {
        opacity: 0.2;
        transform: scale(1);
      }
      50% {
        opacity: 0.4;
        transform: scale(1.05);
      }
    }
  
    .animate-pulse-slow {
      animation: pulse-slow 3s ease-in-out infinite;
    }
  
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
  
    /* Custom scrollbar for webkit browsers */
    ::-webkit-scrollbar {
      width: 8px;
    }
  
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
  
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  </style>