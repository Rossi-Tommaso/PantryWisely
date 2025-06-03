<script lang="ts">
    interface Props {
      addItem: (itemData: { 
        name: string; 
        quantity: string; 
        importance: 'low' | 'medium' | 'high'; 
        category?: string 
      }) => void;
    }
  
    let { addItem }: Props = $props();
  
    let formData = $state({
      name: '',
      quantity: '',
      importance: 'medium' as 'low' | 'medium' | 'high',
      category: ''
    });
  
    let isSubmitting = $state(false);
  
    const predefinedCategories = [
      'Frutta e Verdura',
      'Latticini',
      'Carne e Pesce',
      'Panetteria',
      'Condimenti',
      'Bevande',
      'Surgelati',
      'Dolci',
      'Casa e Igiene',
      'Altro'
    ];
  
    const importanceOptions = [
      { value: 'high', label: 'Alta Priorità', color: 'text-red-600', icon: '🔴' },
      { value: 'medium', label: 'Media Priorità', color: 'text-amber-600', icon: '🟡' },
      { value: 'low', label: 'Bassa Priorità', color: 'text-gray-600', icon: '⚪' }
    ];
  
    async function handleSubmit(e: Event) {
      e.preventDefault();
      
      if (!formData.name.trim()) return;
      
      isSubmitting = true;
      
      try {
        addItem({
          name: formData.name.trim(),
          quantity: formData.quantity.trim() || '1 pz',
          importance: formData.importance,
          category: formData.category.trim() || undefined
        });
        
        // Reset form
        formData = {
          name: '',
          quantity: '',
          importance: 'medium',
          category: ''
        };
        
        // Focus back to name input
        setTimeout(() => {
          const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
          nameInput?.focus();
        }, 100);
        
      } finally {
        isSubmitting = false;
      }
    }
  
    function handleQuickAdd(itemName: string, importance: 'low' | 'medium' | 'high' = 'medium') {
      addItem({
        name: itemName,
        quantity: '1 pz',
        importance,
        category: undefined
      });
    }
  
    const quickItems = [
      { name: 'Pane', importance: 'high' as const },
      { name: 'Latte', importance: 'high' as const },
      { name: 'Uova', importance: 'medium' as const },
      { name: 'Pasta', importance: 'medium' as const }
    ];
  </script>
  
  <form onsubmit={handleSubmit} class="space-y-4">
    <!-- Item Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Nome Articolo *
      </label>
      <input
        type="text"
        id="name"
        name="name"
        bind:value={formData.name}
        placeholder="Es. Latte intero"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  
    <!-- Quantity -->
    <div>
      <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
        Quantità
      </label>
      <input
        type="text"
        id="quantity"
        name="quantity"
        bind:value={formData.quantity}
        placeholder="Es. 2L, 500g, 1 pz"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  
    <!-- Importance -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Priorità
      </label>
      <div class="grid grid-cols-1 gap-2">
        {#each importanceOptions as option}
          <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors
                        {formData.importance === option.value ? 'border-blue-500 bg-blue-50' : ''}">
            <input
              type="radio"
              name="importance"
              value={option.value}
              bind:group={formData.importance}
              class="sr-only"
            />
            <span class="text-lg mr-2">{option.icon}</span>
            <span class="text-sm font-medium {option.color}">
              {option.label}
            </span>
          </label>
        {/each}
      </div>
    </div>
  
    <!-- Category -->
    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
        Categoria (opzionale)
      </label>
      <select
        id="category"
        name="category"
        bind:value={formData.category}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Seleziona categoria</option>
        {#each predefinedCategories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </div>
  
    <!-- Submit Button -->
    <button
      type="submit"
      disabled={!formData.name.trim() || isSubmitting}
      class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {#if isSubmitting}
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      {:else}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      {/if}
      {isSubmitting ? 'Aggiungendo...' : 'Aggiungi alla Lista'}
    </button>
  </form>
  
  <!-- Quick Add Section -->
  <div class="mt-6 pt-6 border-t border-gray-200">
    <h4 class="text-sm font-medium text-gray-700 mb-3">Aggiungi Rapidamente</h4>
    <div class="grid grid-cols-2 gap-2">
      {#each quickItems as item}
        <button
          onclick={() => handleQuickAdd(item.name, item.importance)}
          class="p-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {item.name}
        </button>
      {/each}
    </div>
  </div>