<script lang="ts">
    import { subscriptions, tabdata, searchdata } from "$lib/store";
    import type { threadata } from "$lib/store";
    import Threadbox from "../../components/boxes/threadbox.svelte";
    tabdata.set({boardname: ""});
    function searchops(searchdata: string): {
        boardname: string,
        threadid: number,
        threadata: threadata
    }[]{
        let result: {
            boardname: string,
            threadid: number,
            threadata: threadata
        }[] = [];
        $subscriptions.forEach(thread => {
            if (thread.threadata.title.toLowerCase().includes(searchdata.toLowerCase()) || thread.threadata.content.toLowerCase().includes(searchdata.toLowerCase())){
                result.push(thread);
            }
        })
        return result;
    }
    $: searchresult = searchops($searchdata);
</script>

<div class="w-full ml-1 mt-3">
    You have subscribed to {$subscriptions.length} thread{#if $subscriptions.length != 1}s{/if}. <br>
    The number of replies won't update here.<br><br>
    <input class="w-1/3" bind:value={$searchdata} type="text">
    <p class="mr-3" role="button">Search</p>
</div>

<div class="mt-9 ml-[35vw] overscroll-contain">
    {#if $searchdata == ""}
        {#each $subscriptions as thread}
            <div class="h-9"></div>
            <Threadbox boardname = {thread.boardname} threadid = {thread.threadid.toString()} postdata = {thread.threadata}/>
        {/each}
    {:else}
        {#each searchresult as thread}
            <div class="h-9"></div>
            <Threadbox boardname = {thread.boardname} threadid = {thread.threadid.toString()} postdata = {thread.threadata}/>
        {/each}
    {/if}
</div>