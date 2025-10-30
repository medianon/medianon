<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from "$app/forms";
	import { goto } from '$app/navigation';
	import { tabs } from '$lib/index.svelte';
    let {params}: PageProps = $props();
    let entry = $state("");
    let admin = $state("");
    tabs.location='/'+params.boardname;
    tabs.preview='Create board'
</script>

<div class="flex w-full justify-center">
<div class="flex flex-col text-xl text-center p-5">
    <p class="text-2xl p-5">
        The board <strong>{params.boardname}</strong> does not exist. Fill in the form below to create it.
    </p>
    <form method="POST" use:enhance={async()=>{
        return async({result})=>{
            switch (result.type){
                case "success":
                    goto("/"+params.boardname, {invalidateAll: true});
                }
            }
        }}>
        Board title:<br>
        <input type="text" name="title" class="input border" maxlength=50> <br>
        Entry password:<br>(Leave blank for no entry password.)<br>
        <input type="password" name="entry" bind:value={entry} class="input border"><br>
        Admin password:<br>(Leave blank for no admin access. This can be changed later, but <br>
        <strong class="text-error-500">you cannot add an admin password after creating a board without one.</strong>)<br>
        <input type="password" name="admin" bind:value={admin} class="input border"><br>
        Leaderboard Participation: <input type="checkbox" class="checkbox border" name="leaderboard"><br>
        Bogo Search Participation: <input type="checkbox" class="checkbox border" name="bogo"><br><br>
        This is the final confirmation message. Click create and the board will be created.<br><br>
        <button type="submit" class="btn btn-lg preset-filled-success-500">Create</button>
    </form>
</div>
</div>
