<script lang="ts">
    import ShopListItem from "../../components/ShopListItem.svelte";
    import Filter from "../../components/Filter.svelte";
    import SummaryCard from "../../components/SummaryCard.svelte";
    import AddItemForm from "../../components/AddItemForm.svelte";
    import type { ShopItem } from "$lib/types.js";


    let shopItems: ShopItem[] = $state([
    {
      id: '1',
      name: 'Latte',
      quantity: '2L',
      importance: 'high',
      category: 'Latticini',
      added: new Date(),
      completed: false
    },
    {
      id: '2',
      name: 'Pane integrale',
      quantity: '1 pz',
      importance: 'medium',
      category: 'Panetteria',
      added: new Date(),
      completed: false
    },
    {
      id: '3',
      name: 'Olio extravergine',
      quantity: '1L',
      importance: 'low',
      category: 'Condimenti',
      added: new Date(),
      completed: true
    }
  ]);

  let selectedImportance = $state<'all' | 'low' | 'medium' | 'high'>('all');
  let showCompleted = $state(true);

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
</script>

<svelte:head>
  <title>Lista della Spesa - DispensApp</title>
  <meta name="description" content="Gestisci la tua lista della spesa con priorità e categorie" />
</svelte:head>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Add Item Form -->
    <div class="lg:col-span-1">
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sticky top-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Aggiungi Articolo</h3>
        <AddItemForm {addItem} />
      </div>
    </div>

    <!-- Items List -->
    <div class="lg:col-span-2 space-y-6">
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
        
        <div class="divide-y divide-gray-100">
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
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">Nessun articolo trovato</h4>
              <p class="text-gray-500">
                {selectedImportance !== 'all' 
                  ? `Non ci sono articoli con priorità ${selectedImportance}` 
                  : 'La tua lista della spesa è vuota'}
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>