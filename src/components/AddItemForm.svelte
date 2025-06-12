<script lang="ts">
  interface Props {
    isModalOpen: boolean;
    onClose: () => void;
    addItem: (itemData: { 
      name: string; 
      quantity: string; 
      importance: 'low' | 'medium' | 'high'; 
      category?: string 
    }) => void;
  }

  let { isModalOpen, onClose, addItem }: Props = $props();

  let formData = $state({
    name: '',
    quantity: '',
    importance: 'medium' as 'low' | 'medium' | 'high',
    category: ''
  });

  let isSubmitting = $state(false);

  const predefinedCategories = [
    { name: 'Frutta e Verdura', icon: '🥬', color: 'bg-green-50 text-green-700' },
    { name: 'Latticini', icon: '🥛', color: 'bg-blue-50 text-blue-700' },
    { name: 'Carne e Pesce', icon: '🥩', color: 'bg-red-50 text-red-700' },
    { name: 'Panetteria', icon: '🍞', color: 'bg-amber-50 text-amber-700' },
    { name: 'Condimenti', icon: '🧂', color: 'bg-yellow-50 text-yellow-700' },
    { name: 'Bevande', icon: '🥤', color: 'bg-purple-50 text-purple-700' },
    { name: 'Surgelati', icon: '🧊', color: 'bg-cyan-50 text-cyan-700' },
    { name: 'Dolci', icon: '🍰', color: 'bg-pink-50 text-pink-700' },
    { name: 'Casa e Igiene', icon: '🧽', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'Altro', icon: '📦', color: 'bg-gray-50 text-gray-700' }
  ];

  const importanceOptions = [
    { 
      value: 'high', 
      label: 'Alta Priorità', 
      color: 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100', 
      icon: '🔴',
      description: 'Articolo essenziale'
    },
    { 
      value: 'medium', 
      label: 'Media Priorità', 
      color: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100', 
      icon: '🟡',
      description: 'Importante ma non urgente'
    },
    { 
      value: 'low', 
      label: 'Bassa Priorità', 
      color: 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100', 
      icon: '⚪',
      description: 'Se c\'è tempo'
    }
  ];

  const quickItems = [
    { name: 'Pane', importance: 'high' as const, category: 'Panetteria', icon: '🍞' },
    { name: 'Latte', importance: 'high' as const, category: 'Latticini', icon: '🥛' },
    { name: 'Uova', importance: 'medium' as const, category: 'Latticini', icon: '🥚' },
    { name: 'Pasta', importance: 'medium' as const, category: 'Altro', icon: '🍝' },
    { name: 'Mele', importance: 'medium' as const, category: 'Frutta e Verdura', icon: '🍎' },
    { name: 'Pomodori', importance: 'low' as const, category: 'Frutta e Verdura', icon: '🍅' }
  ];

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    isSubmitting = true;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      
      addItem({
        name: formData.name.trim(),
        quantity: formData.quantity.trim() || '1 pz',
        importance: formData.importance,
        category: formData.category.trim() || undefined
      });
      
      // Reset form and close modal
      resetForm();
      onClose();
      
    } finally {
      isSubmitting = false;
    }
  }

  function handleQuickAdd(item: typeof quickItems[0]) {
    addItem({
      name: item.name,
      quantity: '1pz',
      importance: item.importance,
      category: item.category
    });
    onClose();
  }

  function resetForm() {
    formData = {
      name: '',
      quantity: '',
      importance: 'medium',
      category: ''
    };
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  let nameInput: HTMLInputElement | undefined = $state();
  
  $effect(() => {
    if (isModalOpen && nameInput) {
      setTimeout(() => nameInput?.focus(), 100);
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isModalOpen}
  <!-- Modal Backdrop -->
  <div 
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={handleBackdropClick}
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white relative">
        <button 
          onclick={onClose}
          class="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold mb-1">Aggiungi Articolo</h2>
            <p class="text-blue-100">Aggiungi un nuovo elemento alla tua lista</p>
          </div>
        </div>
      </div>

      <div class="max-h-[calc(90vh-140px)] overflow-y-auto">
        <!-- Quick Add Section -->
        <div class="p-6 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span class="text-xl">⚡</span>
            Aggiungi Rapidamente
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {#each quickItems as item}
              <button
                onclick={() => handleQuickAdd(item)}
                class="group p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <div class="text-sm font-medium text-gray-900 mb-1">{item.name}</div>
                <div class="text-xs text-gray-500 capitalize">{item.importance} priorità</div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Form Section -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span class="text-xl">📝</span>
            Dettagli Personalizzati
          </h3>

          <form onsubmit={handleSubmit} class="space-y-6">
            <!-- Item Name -->
            <div class="space-y-2">
              <label for="name" class="block text-sm font-semibold text-gray-700">
                Nome Articolo *
              </label>
              <div class="relative">
                <input
                  bind:this={nameInput}
                  type="text"
                  id="name"
                  name="name"
                  bind:value={formData.name}
                  placeholder="Es. Latte intero, Parmigiano..."
                  required
                  class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Quantity -->
            <div class="space-y-2">
              <label for="quantity" class="block text-sm font-semibold text-gray-700">
                Quantità
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  bind:value={formData.quantity}
                  placeholder="Es. 2L, 500g, 1 pz"
                  class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Importance -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700">
                Priorità
              </label>
              <div class="grid gap-3">
                {#each importanceOptions as option}
                  <label class="relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm
                                {formData.importance === option.value ? option.color + ' ring-2 ring-offset-2 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}">
                    <input
                      type="radio"
                      name="importance"
                      value={option.value}
                      bind:group={formData.importance}
                      class="sr-only"
                    />
                    <div class="flex items-center gap-3 flex-1">
                      <span class="text-2xl">{option.icon}</span>
                      <div>
                        <div class="font-semibold text-sm">{option.label}</div>
                        <div class="text-xs opacity-75">{option.description}</div>
                      </div>
                    </div>
                    {#if formData.importance === option.value}
                      <div class="text-blue-600">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                    {/if}
                  </label>
                {/each}
              </div>
            </div>

            <!-- Category -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700">
                Categoria (opzionale)
              </label>
              <div class="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                <label class="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm
                            {formData.category === '' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    bind:group={formData.category}
                    class="sr-only"
                  />
                  <div class="flex items-center gap-2">
                    <span class="text-lg">❓</span>
                    <span class="text-sm font-medium">Nessuna</span>
                  </div>
                </label>
                {#each predefinedCategories as category}
                  <label class="flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm
                                {formData.category === category.name ? 'border-blue-500 ' + category.color : 'border-gray-200 hover:border-gray-300'}">
                    <input
                      type="radio"
                      name="category"
                      value={category.name}
                      bind:group={formData.category}
                      class="sr-only"
                    />
                    <div class="flex items-center gap-2">
                      <span class="text-lg">{category.icon}</span>
                      <span class="text-sm font-medium">{category.name}</span>
                    </div>
                  </label>
                {/each}
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onclick={onClose}
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={!formData.name.trim() || isSubmitting}
                class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {#if isSubmitting}
                  <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Aggiungendo...</span>
                {:else}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <span>Aggiungi alla Lista</span>
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes animate-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-in {
    animation: animate-in 0.2s ease-out;
  }
</style>