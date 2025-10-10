<script lang="ts">
	import { tabs, type boardatatype } from '$lib/index.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    let lbdata: {
        boardname: string,
        boardata: boardatatype
    }[] = $state([]);
    if(data.lbdata.length > 0){
        lbdata = data.lbdata;
    }
    tabs.location='/leaderboard';
    tabs.preview='Leaderboards';
</script>

<div class="flex flex-col items-center p-2 mb-5">
    <p class="text-2xl text-center">
        Leaderboards
    </p>
    <p class="text-xl">
        Only boards with a post number greater than 99 are shown.
    </p>
</div>
{#if lbdata.length > 0}
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr class="text-surface-950 text-lg">
                <th>Board name</th>
                <th>Established</th>
                <th>Post number</th>
            </tr>
        </thead>
        <tbody>
        {#each lbdata as item}
            <tr>
                <td><a href={'/'+item.boardname} class="btn preset-filled-primary-500">{item.boardname}</a></td>
                <td>{new Date(item.boardata.established).toLocaleString()}</td>
                <td class="text-lg"><strong>{item.boardata.replynum}</strong></td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
{/if}
