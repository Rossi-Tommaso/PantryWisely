<script lang="ts">
    import type { PantryItem, ExpiryStatus } from "$lib/types.js";
  
    interface Props {
      item: PantryItem;
      expiryStatus: ExpiryStatus;
      onDelete: () => void;
      onUpdateExpiration: (date: Date | null) => void;
      onToggleEssential: () => void;
    }
  
    let { item, expiryStatus, onDelete, onUpdateExpiration, onToggleEssential }: Props = $props();
  
    let showEditExpiration = $state(false);
    let editingExpiration = $state<string>('');
  
    // Format date for display
    function formatDate(date: Date | null): string {
      if (!date) return 'Nessuna scadenza';
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  
    // Get days until expiration
    function getDaysUntilExpiration(date: Date | null): number | null {
      if (!date) return null;
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  
    // Get expiry status styling
    function getExpiryStatusStyles(status: ExpiryStatus) {
      switch (status) {
        case 'expired':
          return {
            badge: 'bg-red-100 text-red-800 border-red-200',
            text: 'text-red-600',
            icon: 'text-red-500'
          };
        case 'expiring':
          return {
            badge: 'bg-amber-100 text-amber-800 border-amber-200',
            text: 'text-amber-600',
            icon: 'text-amber-500'
          };
        default:
          return {
            badge: 'bg-green-100 text-green-800 border-green-200',
            text: 'text-green-600',
            icon: 'text-green-500'
          };
      }
    }
  
    // Get expiry status label
    function getExpiryStatusLabel(status: ExpiryStatus): string {
      switch (status) {
        case 'expired': return 'Scaduto';
        case 'expiring': return 'In scadenza';
        default: return 'Fresco';
      }
    }
  
    // Start editing expiration date
    function startEditingExpiration() {
      editingExpiration = item.expirationDate 
        ? item.expirationDate.toISOString().split('T')[0] 
        : '';
      showEditExpiration = true;
    }
  
    // Save expiration date
    function saveExpiration() {
      const newDate = editingExpiration ? new Date(editingExpiration) : null;
      onUpdateExpiration(newDate);
      showEditExpiration = false;
    }
  
    // Cancel editing
    function cancelEditing() {
      showEditExpiration = false;
      editingExpiration = '';
    }
  
    const styles = $derived(getExpiryStatusStyles(expiryStatus));
    const daysUntilExpiration = $derived(getDaysUntilExpiration(item.expirationDate));
  </script>
  
  <div class="group p-6 hover:bg-gray-50 transition-colors duration-200">
    <div class="flex items-start gap-4">
      <!-- Essential Star Icon -->
      <button
        onclick={onToggleEssential}
        class={`flex-shrink-0 p-1 rounded-full transition-all duration-200 ${
          item.isEssential 
            ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
            : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'
        }`}
        title={item.isEssential ? 'Rimuovi da essenziali' : 'Marca come essenziale'}
      >
        <svg class="w-5 h-5" fill={item.isEssential ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      </button>
  
      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <!-- Item Name and Quantity -->
            <div class="flex items-center gap-2 mb-2">
              <h4 class="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </h4>
              <span class="text-sm text-gray-500 font-medium">
                {item.quantity}
              </span>
              {#if item.isEssential}
                <span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full border border-yellow-200">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                  </svg>
                  Essenziale
                </span>
              {/if}
            </div>
  
            <!-- Category -->
            {#if item.category}
              <div class="mb-3">
                <span class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  {item.category}
                </span>
              </div>
            {/if}
  
            <!-- Expiration Info -->
            <div class="flex items-center gap-3">
              <!-- Status Badge -->
              <span class={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles.badge}`}>
                <svg class={`w-3 h-3 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
                  {#if expiryStatus === 'expired'}
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  {:else if expiryStatus === 'expiring'}
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  {:else}
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  {/if}
                </svg>
                {getExpiryStatusLabel(expiryStatus)}
              </span>
  
              <!-- Expiration Date Display/Edit -->
              {#if showEditExpiration}
                <div class="flex items-center gap-2">
                  <input
                    type="date"
                    bind:value={editingExpiration}
                    class="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onclick={saveExpiration}
                    class="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                    title="Salva"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                  </button>
                  <button
                    onclick={cancelEditing}
                    class="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
                    title="Annulla"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              {:else}
                <button
                  onclick={startEditingExpiration}
                  class={`text-sm hover:underline ${styles.text}`}
                  title="Clicca per modificare la scadenza"
                >
                  {formatDate(item.expirationDate)}
                  {#if daysUntilExpiration !== null}
                    {#if daysUntilExpiration < 0}
                      (scaduto da {Math.abs(daysUntilExpiration)} giorni)
                    {:else if daysUntilExpiration === 0}
                      (scade oggi)
                    {:else if daysUntilExpiration === 1}
                      (scade domani)
                    {:else if daysUntilExpiration <= 7}
                      (scade tra {daysUntilExpiration} giorni)
                    {/if}
                  {/if}
                </button>
              {/if}
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <!-- Edit Date Button -->
            <button
              onclick={startEditingExpiration}
              class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Modifica scadenza"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </button>
  
            <!-- Delete Button -->
            <button
              onclick={onDelete}
              class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Elimina articolo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>