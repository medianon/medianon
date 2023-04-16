<script lang="ts">
	import '../app.postcss';
	import '../pico.css';
	import '../tailwind.css';
	import Navbar from '../components/navbar.svelte';
	import Confirmation from '../components/confirmation.svelte';
	import { status } from '$lib/store';

	let userinp = "";


	//!!!!!!!!!!!!!!!!
	let secret = "123"
	//!!!!!!!!!!!!!!!!


</script>
{#if userinp == secret}
	{#if $status==true}
		<Navbar />
		<slot />
	{:else}
		<Confirmation />
	{/if}
{:else}
	<input class="w-[33vw] mt-[33vh] ml-[33vw]" type="text" bind:value={userinp} placeholder="https://www.github.com/medianon/medianon">
{/if}