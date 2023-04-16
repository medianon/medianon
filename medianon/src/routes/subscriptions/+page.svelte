<script>
    import { subscriptions, tabdata } from "$lib/store";
    tabdata.set({boardname: ""})
    import Threadbox from "../../components/boxes/threadbox.svelte";
</script>

<div class="w-full ml-1 mt-3">
    You have subscribed to {$subscriptions.length} thread{#if $subscriptions.length != 1}s{/if}. <br>
    Please note that the number of replies won't update here. Visit the thread to update it. <br><br>
    <input class="w-1/3" type="text">
    <p class="mr-3" role="button">Search</p>
</div>

<div class="mt-9 ml-[35vw] overscroll-contain">
    {#each $subscriptions as thread}
        <div class="h-9"></div>
        <Threadbox boardname = {thread.boardname} threadid = {thread.threadid} postdata = {thread.threadata}/>
    {/each}
</div>