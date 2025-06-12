<script lang="ts">
    import { updateDb, deleteOnDb, fetchDb } from '$lib/api/firebase/firebase.utils.js';
    import type { PantryItem } from '$lib/types.js';
  
    const testPath = "pantry/";
  
    let item: PantryItem | null = null;
    let message = "";
  
    const testItem: PantryItem = {
      id: "test-item32  ",
      name: "Latte",
      quantity: "2L",
      expirationDate: new Date("2025-01-01"),
      isEssential: true
    };
  
    async function writeItem() {
      await updateDb(testPath+'/'+testItem.id, testItem);
      message = "Item salvato!";
    }
  
    async function readItem() {
      const data = await fetchDb<PantryItem>(testPath);
      item = data;
      message = "Item caricato!";
    }
  
    async function updateItem() {
      if (item) {
        item.quantity += 1;
        await updateDb(testPath+'/'+testItem.id, item);
        message = "Item aggiornato!";
      }
    }
  
    async function deleteItem() {
      await deleteOnDb(testPath+'/'+testItem.id);
      item = null;
      message = "Item eliminato!";
    }
  </script>
  
  <h1>🔥 Test Firebase</h1>
  
  <div class="buttons">
    <button on:click={writeItem}>Scrivi</button>
    <button on:click={readItem}>Leggi</button>
    <button on:click={updateItem} disabled={!item}>Aggiorna</button>
    <button on:click={deleteItem}>Elimina</button>
  </div>
  
  {#if item}
    <pre>{JSON.stringify(item, null, 2)}</pre>
  {:else}
    <p>Nessun item trovato</p>
  {/if}
  
  <p style="color: green;">{message}</p>
  
  <style>
    .buttons button {
      margin-right: 1rem;
      margin-top: 1rem;
    }
  </style>
  