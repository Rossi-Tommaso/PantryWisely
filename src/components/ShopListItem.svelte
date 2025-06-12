<script lang="ts">
  import type { ShopItem } from "$lib/types.js";

  interface Props {
    item: ShopItem;
    onToggle: () => void;
    onDelete: () => void;
    onUpdateImportance: (importance: 'low' | 'medium' | 'high') => void;
  }

  let { item, onToggle, onDelete, onUpdateImportance }: Props = $props();

  let showActions = $state(false);

  const importanceConfig = {
    high: { label: 'Alta', color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
    medium: { label: 'Media', color: 'amber', bg: 'bg-amber-100', text: 'text-amber-800' },
    low: { label: 'Bassa', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800' }
  };

  const currentImportance = $derived(importanceConfig[item.importance]);

  function formatDate(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Ora';
    if (diffInHours < 24) return `${diffInHours}h fa`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ieri';
    if (diffInDays < 7) return `${diffInDays} giorni fa`;
    
    return date.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'short' 
    });
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showActions = !showActions;
    }
  }
</script>

<div 
  class="p-4 hover:bg-gray-50 transition-colors {item.completed ? 'opacity-60' : ''}"
  role="listitem"
  tabindex="0"
  onmouseenter={() => showActions = true}
  onmouseleave={() => showActions = false}
  onkeydown={handleKeyDown}
>
  <div class="flex items-center gap-4">
    <!-- Checkbox -->
    <button 
      onclick={onToggle}
      aria-label={item.completed ? `Segna "${item.name}" come non completato` : `Segna "${item.name}" come completato`}
      class="flex-shrink-0 w-5 h-5 rounded border-2 border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center
             {item.completed ? 'bg-green-500 border-green-500' : 'hover:bg-blue-50'}"
    >
      {#if item.completed}
        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      {/if}
    </button>

    <!-- Item Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-3 mb-1">
        <h4 class="font-medium text-gray-900 {item.completed ? 'line-through' : ''}">
          {item.name}
        </h4>
        
        <span class="text-sm text-gray-500">
          {item.quantity}
        </span>

        <!-- Importance Badge -->
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {currentImportance.bg} {currentImportance.text}">
          {currentImportance.label}
        </span>
      </div>
      
      <div class="flex items-center gap-3 text-xs text-gray-500">
        {#if item.category}
          <span class="inline-flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            {item.category}
          </span>
        {/if}
        
        <span class="inline-flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {formatDate(item.added)}
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 {showActions ? 'opacity-100' : 'opacity-0'} transition-opacity">
      <!-- Importance Selector -->
      <div class="relative">
        <label class="sr-only" for="importance-{item.id}">Livello di importanza per {item.name}</label>
        <select 
          id="importance-{item.id}"
          value={item.importance}
          onchange={(e) => onUpdateImportance(e.currentTarget.value as 'low' | 'medium' | 'high')}
          class="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Bassa</option>
        </select>
      </div>

      <!-- Delete Button -->
      <button 
        onclick={onDelete}
        aria-label={`Elimina "${item.name}" dalla lista`}
        class="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
        </svg>
      </button>
    </div>
  </div>
</div>