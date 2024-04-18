<script lang="ts">
	import '../app.postcss';
	import '../pico.css';
	import '../tailwind.css';
	import Navbar from '../components/navbar.svelte';
	import Confirmation from '../components/confirmation.svelte';
	import { status } from '$lib/store';

</script>

{#if $status==true}
	<Navbar />
	<slot />
{:else}
	<Confirmation />
{/if}