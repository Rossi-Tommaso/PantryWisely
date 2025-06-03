<script lang="ts">
	import '../app.css';
	import Header from '../components/Header.svelte';
	
	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<Header />
	{@render children()}
</div>