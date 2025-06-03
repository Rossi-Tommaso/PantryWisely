<script lang="ts">
    interface Props {
      selectedImportance: 'all' | 'low' | 'medium' | 'high';
      itemCounts: {
        all: number;
        high: number;
        medium: number;
        low: number;
      };
    }
  
    let { selectedImportance = $bindable(), itemCounts }: Props = $props();
  
    const filterOptions = [
      { 
        value: 'all', 
        label: 'Tutti', 
        icon: '📋', 
        color: 'text-gray-700',
        bgActive: 'bg-gray-100',
        borderActive: 'border-gray-300'
      },
      { 
        value: 'high', 
        label: 'Alta', 
        icon: '🔴', 
        color: 'text-red-700',
        bgActive: 'bg-red-50',
        borderActive: 'border-red-300'
      },
      { 
        value: 'medium', 
        label: 'Media', 
        icon: '🟡', 
        color: 'text-amber-700',
        bgActive: 'bg-amber-50',
        borderActive: 'border-amber-300'
      },
      { 
        value: 'low', 
        label: 'Bassa', 
        icon: '⚪', 
        color: 'text-gray-700',
        bgActive: 'bg-gray-50',
        borderActive: 'border-gray-300'
      }
    ];
  
    function getItemCount(value: string): number {
      return itemCounts[value as keyof typeof itemCounts] || 0;
    }
  </script>
  
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium text-gray-700 mr-2">Priorità:</span>
    
    <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
      {#each filterOptions as option}
        <button
          onclick={() => selectedImportance = option.value as typeof selectedImportance}
          class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                 {selectedImportance === option.value 
                   ? `${option.bgActive} ${option.borderActive} border ${option.color}` 
                   : 'text-gray-600 hover:text-gray-800 hover:bg-white'}"
        >
          <span class="text-xs">{option.icon}</span>
          <span>{option.label}</span>
          
          {#if getItemCount(option.value) > 0}
            <span class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                         {selectedImportance === option.value
                           ? 'bg-white text-gray-700'
                           : 'bg-gray-300 text-gray-600'}">
              {getItemCount(option.value)}
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>