<script lang="ts">
  import SummaryCard from '../components/SummaryCard.svelte';
  import NavButton from '../components/NavButton.svelte';
  import { pantrySummary } from '../lib/data/mock.js';
</script>

<svelte:head>
  <title>Dashboard - DispensApp</title>
  <meta name="description" content="Gestisci la tua dispensa e lista della spesa con DispensApp" />
</svelte:head>


  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Benvenuto nella tua dispensa</h2>
      <p class="text-lg text-gray-600">Gestisci i tuoi alimenti e mantieni sempre rifornita la tua casa.</p>
    </div>

    <!-- Summary Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        title="Totale Alimenti"
        value={pantrySummary.totalItems}
        icon="package"
        color="blue"
      />
      
      <SummaryCard
        title="In Scadenza"
        value={pantrySummary.expiringSoon}
        icon="clock"
        color="amber"
      />
      
      <SummaryCard
        title="Indispensabili Mancanti"
        value={pantrySummary.missingEssentials}
        icon="exclamation"
        color="red"
      />
    </div>

    <!-- Quick Actions Section -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-900 mb-6">Azioni Rapide</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NavButton
          title="Gestione Dispensa"
          description="Visualizza e gestisci tutti i tuoi alimenti"
          icon="pantry"
          href="/dispensa"
          variant="primary"
        />
        
        <NavButton
          title="Lista della Spesa"
          description="Controlla cosa devi acquistare"
          icon="shopping"
          href="/lista-spesa"
          variant="secondary"
        />
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Attività Recente</h3>
        <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Vedi tutto
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
          <div class="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Aggiunto Latte (1L)</p>
            <p class="text-xs text-gray-500">2 ore fa</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
          <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Spuntato Pane dalla lista spesa</p>
            <p class="text-xs text-gray-500">5 ore fa</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
          <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">Yogurt in scadenza domani</p>
            <p class="text-xs text-gray-500">1 giorno fa</p>
          </div>
        </div>
      </div>
    </div>
  </main>