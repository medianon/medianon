<script lang="ts">
    import { speed } from "$lib/store";
    export let content = "test";
    let contentarray = content.split(" ")
    let index = 0;
    let currentword = contentarray[index];

    let play = false;
    function toggleplay(){
        play = !play;
        if (play){
            updateword();
        }
    }
    function updateword(){
        if (play){
            currentword = contentarray[index];
            index++;
            if (contentarray.length > index){
                setTimeout(updateword, 60000/$speed);
            } else {
                index = 0;
                play = false;
            }
        }
    }

    // console.log(contentarray);
</script>

<div class="flex justify-center">
    <strong class="text-xl">{currentword}</strong>
</div>

<div class="flex justify-center">
    {index + " / " + contentarray.length}
</div>

<div class="flex justify-center h-[50px]">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="cursor-pointer ml-1 my-1 px-1 rounded bg-ui2" on:click={toggleplay}>
        {#if play}
        Pause
        {:else}
        Play
        {/if}
    </p>
    
    <input type="number" step=10 min=0 max={contentarray.length} class="ml-6 w-20 h-[60px]" bind:value={index}>
    Progress
    
    <input type="number" step="50" min=0 max=2000 class="ml-6 w-20" bind:value={$speed}>
    Words per minute
</div>