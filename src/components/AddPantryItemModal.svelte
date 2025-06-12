<script lang="ts">
    interface Props {
      isModalOpen: boolean;
      onClose: () => void;
      addItem: (itemData: {
        name: string;
        quantity: string;
        category?: string;
        expirationDate: Date | null;
        isEssential: boolean;
      }) => void;
    }
  
    let { isModalOpen, onClose, addItem }: Props = $props();
  
    let formData = $state({
      name: '',
      quantity: '',
      category: '',
      expirationDate: '',
      isEssential: false
    });
  
    let errors = $state({
      name: '',
      quantity: ''
    });
  
    const categories = [
      'Latticini',
      'Cereali',
      'Condimenti',
      'Conserve',
      'Surgelati',
      'Frutta e Verdura',
      'Carne e Pesce',
      'Bevande',
      'Dolci',
      'Altro'
    ];
  
    function resetForm() {
      formData = {
        name: '',
        quantity: '',
        category: '',
        expirationDate: '',
        isEssential: false
      };
      errors = {
        name: '',
        quantity: ''
      };
    }
  
    function validateForm(): boolean {
      let isValid = true;
      
      // Reset errors
      errors = { name: '', quantity: '' };
  
      // Validate name
      if (!formData.name.trim()) {
        errors.name = 'Il nome è obbligatorio';
        isValid = false;
      }
  
      // Validate quantity
      if (!formData.quantity.trim()) {
        errors.quantity = 'La quantità è obbligatoria';
        isValid = false;
      }
  
      return isValid;
    }
  
    function handleSubmit(event: Event) {
      event.preventDefault();
      
      if (!validateForm()) {
        return;
      }
  
      // Parse expiration date
      const expirationDate = formData.expirationDate 
        ? new Date(formData.expirationDate) 
        : null;
  
      // Call the addItem function
      addItem({
        name: formData.name.trim(),
        quantity: formData.quantity.trim(),
        category: formData.category || undefined,
        expirationDate,
        isEssential: formData.isEssential
      });
  
      // Reset form and close modal
      resetForm();
      onClose();
    }
  
    function handleClose() {
      resetForm();
      onClose();
    }
  
    function handleBackdropClick(event: MouseEvent) {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    }
  
    // Close modal on escape key
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    }
  </script>
  
  <svelte:window on:keydown={handleKeydown} />
  
  {#if isModalOpen}
    <!-- Modal Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onclick={handleBackdropClick}
    >
      <!-- Modal Content -->
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Aggiungi Articolo in Dispensa</h3>
            <p class="text-sm text-gray-600 mt-1">Inserisci i dettagli dell'articolo</p>
          </div>
          <button
            onclick={handleClose}
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Chiudi"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
  
        <!-- Modal Body -->
        <form onsubmit={handleSubmit} class="p-6 space-y-6">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nome Articolo *
            </label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              placeholder="es. Latte fresco"
              class={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              maxlength="100"
            />
            {#if errors.name}
              <p class="mt-1 text-sm text-red-600">{errors.name}</p>
            {/if}
          </div>
  
          <!-- Quantity Field -->
          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">
              Quantità *
            </label>
            <input
              id="quantity"
              type="text"
              bind:value={formData.quantity}
              placeholder="es. 1L, 500g, 2pz"
              class={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.quantity ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              maxlength="20"
            />
            {#if errors.quantity}
              <p class="mt-1 text-sm text-red-600">{errors.quantity}</p>
            {/if}
          </div>
  
          <!-- Category Field -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="category"
              bind:value={formData.category}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Seleziona categoria</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
  
          <!-- Expiration Date Field -->
          <div>
            <label for="expirationDate" class="block text-sm font-medium text-gray-700 mb-2">
              Data di Scadenza
            </label>
            <input
              id="expirationDate"
              type="date"
              bind:value={formData.expirationDate}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <p class="mt-1 text-sm text-gray-500">Lascia vuoto se non ha scadenza</p>
          </div>
  
          <!-- Essential Checkbox -->
          <div>
            <label class="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                bind:checked={formData.isEssential}
                class="w-4 h-4 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
              />
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
                <span class="text-sm font-medium text-gray-700">Articolo essenziale</span>
              </div>
            </label>
            <p class="mt-1 text-sm text-gray-500">Gli articoli essenziali sono sempre visibili e prioritari</p>
          </div>
  
          <!-- Form Actions -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onclick={handleClose}
              class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
            >
              Annulla
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Aggiungi
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
  
  <style>
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  
    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out;
    }
  
    .animate-slideUp {
      animation: slideUp 0.3s ease-out;
    }
  </style>