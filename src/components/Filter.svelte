<script lang="ts">
  interface Props {
    // Per il filtro priorità (lista della spesa)
    selectedImportance?: 'all' | 'low' | 'medium' | 'high';
    itemCounts?: {
      all: number;
      high: number;
      medium: number;
      low: number;
    };
    
    // Per il filtro scadenze (dispensa)
    selectedExpiry?: 'all' | 'fresh' | 'expiring' | 'expired';
    expiryCounts?: {
      all: number;
      expired: number;
      expiring: number;
      fresh: number;
    };
    
    // Determina quale filtro usare
    context: 'priority' | 'expiry';
  }

  let { 
    selectedImportance = $bindable(), 
    itemCounts,
    selectedExpiry = $bindable(),
    expiryCounts,
    context 
  }: Props = $props();

  // Configurazione per il filtro priorità (lista della spesa)
  const priorityFilterOptions = [
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

  // Configurazione per il filtro scadenze (dispensa)
  const expiryFilterOptions = [
    { 
      value: 'all', 
      label: 'Tutti', 
      icon: '📋', 
      color: 'text-gray-700',
      bgActive: 'bg-gray-100',
      borderActive: 'border-gray-300'
    },
    { 
      value: 'expired', 
      label: 'Scaduti', 
      icon: '🔴', 
      color: 'text-red-700',
      bgActive: 'bg-red-50',
      borderActive: 'border-red-300'
    },
    { 
      value: 'expiring', 
      label: 'In scadenza', 
      icon: '🟡', 
      color: 'text-amber-700',
      bgActive: 'bg-amber-50',
      borderActive: 'border-amber-300'
    },
    { 
      value: 'fresh', 
      label: 'Freschi', 
      icon: '🟢', 
      color: 'text-green-700',
      bgActive: 'bg-green-50',
      borderActive: 'border-green-300'
    }
  ];

  // Seleziona configurazione in base al contesto
  const filterOptions = context === 'expiry' ? expiryFilterOptions : priorityFilterOptions;
  const contextLabel = context === 'expiry' ? 'Stato:' : 'Priorità:';
  
  // Ottieni il valore attualmente selezionato
  const currentSelection = context === 'expiry' ? selectedExpiry : selectedImportance;
  
  // Ottieni i conteggi appropriati
  const counts = context === 'expiry' ? expiryCounts : itemCounts;

  function getItemCount(value: string): number {
    if (!counts) return 0;
    return counts[value as keyof typeof counts] || 0;
  }

  function handleSelection(value: string) {
    if (context === 'expiry') {
      selectedExpiry = value as typeof selectedExpiry;
    } else {
      selectedImportance = value as typeof selectedImportance;
    }
  }
</script>

<div class="flex items-center gap-2">
  <span class="text-sm font-medium text-gray-700 mr-2">{contextLabel}</span>
  
  <div class="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
    {#each filterOptions as option}
      <button
        onclick={() => handleSelection(option.value)}
        class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
               {currentSelection === option.value 
                 ? `${option.bgActive} ${option.borderActive} border ${option.color}` 
                 : 'text-gray-600 hover:text-gray-800 hover:bg-white'}"
      >
        <span class="text-xs">{option.icon}</span>
        <span>{option.label}</span>
        
        {#if getItemCount(option.value) > 0}
          <span class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full
                       {currentSelection === option.value
                         ? 'bg-white text-gray-700'
                         : 'bg-gray-300 text-gray-600'}">
            {getItemCount(option.value)}
          </span>
        {/if}
      </button>
    {/each}
  </div>
</div>