<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import logo from '$lib/assets/logo_erikasbuero.png';
	import {session} from '$lib/index.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children } = $props();
	
	onMount(()=>{
		goto('/');
	});
	let agreed = $state({agree: false});
	function agree() {
		session.start = new Date().toLocaleString();
		agreed.agree = true;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
{#if agreed.agree}
	<Navbar />
	{@render children?.()}

{:else}
	<div class="flex w-full justify-center">
		<a href="/">
			<img src={logo} alt="Logo" class="pt-2 pl-12">
		</a>
	</div>
	<div class="flex w-full justify-center text-2xl p-5">
		Please agree to the following Terms and Conditions to proceed:
	</div><br>
	<div class="flex w-full justify-center">
		<div class="textarea text-center overflow-auto w-full h-[30vh] mx-5">
			By accessing and using this website (the “Forum”), you agree to these Terms and Conditions. This Forum is provided as a free and open-source platform that allows users to post and engage in discussions without requiring accounts, cookies, or personal data collection. Please read this document carefully before participating.<br>
			Use of the Forum<br>
You agree to use the Forum in a lawful manner and in compliance with applicable laws and regulations.<br>

You are solely responsible for the content you choose to post.<br>

The Forum administrators reserve the right to remove any content that they deem harmful, offensive, spam, or in conflict with community guidelines.<br>

Because this platform is anonymous, you should not post personal information about yourself or others.<br>

Content Responsibility<br>
The Forum does not endorse, guarantee, or verify the accuracy of any user content.<br>

All posts are the responsibility of the individual users who created them.<br>

The Forum administrators are not liable for any damages, losses, or disputes arising from user-generated content.<br>

Privacy<br>
This Forum does not collect personal data, require registration, or use cookies.<br>

Posts made on the Forum are publicly visible and may be indexed by search engines. Users should keep in mind that once submitted, posts may remain accessible to others.<br>

Because of the open, anonymous nature of the Forum, it is not possible to delete content on request once shared, though administrators may remove content at their discretion.<br>

Liability<br>
The Forum is provided “as is,” without warranties of any kind, express or implied.<br>

The administrators are not liable for any damages, direct or indirect, resulting from use of the Forum.<br>

Users assume full responsibility for their own interactions and contributions.<br>

Open Source Platform<br>
The Forum software is released under an open-source license and may be freely inspected, modified, and reused within the bounds of its applicable license.<br>

This Terms and Conditions document applies only to this instance of the Forum and does not cover third-party deployments.<br>

Changes to Terms<br>
These Terms may be updated from time to time without notice. Continued use of the Forum constitutes acceptance of any revised Terms.<br>

Governing Law<br>
These Terms are governed by and construed in accordance with the laws applicable in the jurisdiction where the Forum is administered.<br>

Any disputes shall be handled under that jurisdiction.<br>
		</div>
	</div>
	<div class="flex w-full justify-center pt-10">
		<button type="button" class="btn btn-lg preset-filled-success-500" onclick={agree}>I AGREE</button>
	</div>
	<footer class="flex w-full justify-evenly fixed bottom-0">
		<p class="text-xl">
			dont worry, we dont use cookies :)
		</p>
		<p>
			extablished: 11/03/2023
		</p>
	</footer>

{/if}
