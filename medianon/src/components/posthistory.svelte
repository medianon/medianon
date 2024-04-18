<script lang="ts">
    import { showhistory, usehistory, historylength, history } from "$lib/store";
    import Replybox from "./boxes/replybox.svelte";

    function togglehistory(){
        usehistory.set(!$usehistory);
        if (!$usehistory){
            historylength.set(0);
            $history.splice(0);
            showhistory.set(false);
        }
    }

    function clearhistory(){
        $history.splice(0);
        showhistory.set(false);
    }
</script>

<div class="w-full inline-flex justify-around sticky top-[79px] bg-history">
    <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={togglehistory}>
            {#if $usehistory}
                Turn off History
            {:else}
                Use History
            {/if}
        </p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="mx-3" role="button" on:click={clearhistory}>Clear History</p>
        <input type="number" bind:value={$historylength} min=0>
        History length
    </div>
    <div class="h-3"></div>
</div>
{#if $usehistory}
    <div class="w-full inline-flex sticky top-[140px] bg-history overflow-scroll resize">
        {#each $history as post}
            <div class="mx-6">
                <Replybox archive = {post.archive} boardname = {post.boardname} threadid = {post.threadid} postdata = {post.postdata} />
            </div>
        {/each}
    </div>
{/if}