<script lang="ts">
    import { goto } from "$app/navigation";
    import { tabdata } from "$lib/store";
    tabdata.set({boardname: ""});
    import type { PageData } from './$types';
    export let data: PageData;
    data.leaderboardata.sort((a, b) => 
        (a.postnum < b.postnum)? 1 : -1);
</script>
<div class="text-center mt-6">
    only boards with a post number > 99 are shown. <br>
    Leaderboards: <br><br><br>
    {#each data.leaderboardata as info}
        <p class="inline-flex">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            Boardname: <span class="cursor-pointer" on:click={()=>goto("/"+info.boardname, {invalidateAll: true})}>{info.boardname}</span>, Post number: {info.postnum}, Board type: {info.boardtype}, Established: {new Date(info.established).toLocaleString()}
        </p><br><br>
    {/each}

</div>