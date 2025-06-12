<script lang="ts">
  import ShopListItem from "../../components/ShopListItem.svelte";
  import Filter from "../../components/Filter.svelte";
  import SummaryCard from "../../components/SummaryCard.svelte";
  import AddItemModal from "../../components/AddItemForm.svelte";
  import type { ShopItem } from "$lib/types.js";

  let shopItems: ShopItem[] = $state([
  {
    id: '1',
    name: 'Latte',
    quantity: '2L',
    importance: 'high',
    category: 'Latticini',
    added: new Date(),
    completed: false,
  },
  {
    id: '2',
    name: 'Pane integrale',
    quantity: '1pz',
    importance: 'medium',
    category: 'Panetteria',
    added: new Date(),
    completed: false,
  }
]);

let selectedImportance = $state<'all' | 'low' | 'medium' | 'high'>('all');
let showCompleted = $state(true);
let isModalOpen = $state(false);

const filteredItems = $derived(() => {
  return shopItems.filter(item => {
    const importanceMatch = selectedImportance === 'all' || item.importance === selectedImportance;
    const completedMatch = showCompleted || !item.completed;
    return importanceMatch && completedMatch;
  });
});

const summary = $derived(() => ({
  total: shopItems.length,
  completed: shopItems.filter(item => item.completed).length,
  pending: shopItems.filter(item => !item.completed).length,
  highPriority: shopItems.filter(item => item.importance === 'high' && !item.completed).length
}));

function addItem(itemData: { name: string; quantity: string; importance: 'low' | 'medium' | 'high'; category?: string }) {
  const newItem: ShopItem = {
    id: Date.now().toString(),
    ...itemData,
    added: new Date(),
    completed: false
  };
  shopItems = [...shopItems, newItem];
}

function toggleItem(id: string) {
  shopItems = shopItems.map(item => 
    item.id === id ? { ...item, completed: !item.completed } : item
  );
}

function deleteItem(id: string) {
  shopItems = shopItems.filter(item => item.id !== id);
}

function updateImportance(id: string, importance: 'low' | 'medium' | 'high') {
  shopItems = shopItems.map(item => 
    item.id === id ? { ...item, importance } : item
  );
}

function clearCompleted() {
  shopItems = shopItems.filter(item => !item.completed);
}

function openModal() {
  isModalOpen = true;
}

function closeModal() {
  isModalOpen = false;
}
</script>

<svelte:head>
<title>Lista della Spesa - DispensApp</title>
<meta name="description" content="Gestisci la tua lista della spesa con priorità e categorie" />
</svelte:head>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
<!-- Header Section -->
<div class="mb-8">
  <h2 class="text-3xl font-bold text-gray-900 mb-2">Lista della Spesa</h2>
  <p class="text-lg text-gray-600">Organizza i tuoi acquisti per priorità e non dimenticare nulla.</p>
</div>

<!-- Summary Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
  <SummaryCard
    title="Totale Articoli"
    value={summary().total}
    icon="package"
    color="blue"
  />
  
  <SummaryCard
    title="Da Acquistare"
    value={summary().pending}
    icon="clock"
    color="amber"
  />
  
  <SummaryCard
    title="Completati"
    value={summary().completed}
    icon="check"
    color="green"
  />

  <SummaryCard
    title="Alta Priorità"
    value={summary().highPriority}
    icon="exclamation"
    color="red"
  />
</div>

<!-- Main Content Area -->
<div class="space-y-6">
  <!-- Filters and Controls -->
  <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <Filter 
          bind:selectedImportance 
          itemCounts={{
            all: shopItems.length,
            high: shopItems.filter(item => item.importance === 'high').length,
            medium: shopItems.filter(item => item.importance === 'medium').length,
            low: shopItems.filter(item => item.importance === 'low').length
          }}
        />
      </div>
      
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input 
            type="checkbox" 
            bind:checked={showCompleted}
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Mostra completati
        </label>
        
        {#if summary().completed > 0}
          <button 
            onclick={clearCompleted}
            class="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Rimuovi completati
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
        Articoli ({filteredItems().length})
      </h3>
      
      {#if filteredItems().length > 0}
        <div class="text-sm text-gray-500">
          {selectedImportance !== 'all' ? `Filtrato per: ${selectedImportance}` : 'Tutti gli articoli'}
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Container con scroll fisso -->
  <div class="h-96 overflow-y-auto">
    <div class="divide-y divide-gray-100" role="list" aria-label="Lista della spesa">
      {#each filteredItems().sort((a, b) => {
        // Sort by completion status, then by importance, then by date
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        const importanceOrder: Record<ShopItem['importance'], number> = { high: 3, medium: 2, low: 1 };
        if (importanceOrder[a.importance] !== importanceOrder[b.importance]) {
          return importanceOrder[b.importance] - importanceOrder[a.importance];
        }
        
        return b.added.getTime() - a.added.getTime();
      }) as item (item.id)}
        <ShopListItem 
          {item}
          onToggle={() => toggleItem(item.id)}
          onDelete={() => deleteItem(item.id)}
          onUpdateImportance={(importance) => updateImportance(item.id, importance)}
        />
      {/each}
      
      {#if filteredItems().length === 0}
        <div class="p-12 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-2">Nessun articolo trovato</h4>
          <p class="text-gray-500 mb-4">
            {selectedImportance !== 'all' 
              ? `Non ci sono articoli con priorità ${selectedImportance}` 
              : 'La tua lista della spesa è vuota'}
          </p>
          <button
            onclick={openModal}
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
  class="group relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
>
  <svg class="w-8 h-8 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
  </svg>
  
  <!-- Tooltip -->
  <div class="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
    Aggiungi articolo
    <div class="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
  </div>
</button>

<!-- Pulse Animation Ring -->
<div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
</div>

<!-- Add Item Modal -->
<AddItemModal 
{isModalOpen} 
onClose={closeModal}
{addItem}
/>

<!-- Desktop Quick Add Button (hidden on mobile) -->
<div class="hidden lg:block fixed bottom-6 left-6 z-40">
<div class="flex flex-col gap-3">
  <!-- Quick Stats -->
  <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200">
    <div class="text-xs text-gray-500 mb-1">Articoli pendenti</div>
    <div class="text-2xl font-bold text-gray-900">{summary().pending}</div>
    {#if summary().highPriority > 0}
      <div class="text-xs text-red-600 font-medium mt-1">
        {summary().highPriority} ad alta priorità
      </div>
    {/if}
  </div>
  
  <!-- Secondary Actions -->
  {#if summary().completed > 0}
    <a
      onclick={clearCompleted}
      class="group w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
      title="Rimuovi completati"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    </a>
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

</style>