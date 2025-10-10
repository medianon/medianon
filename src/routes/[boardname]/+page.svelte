<script lang="ts">
    import type { PageProps } from './$types';
    import { redirect, tabs, type threadatatype } from '$lib/index.svelte';
    import { goto } from '$app/navigation';
    import Thread from '$lib/components/thread.svelte';
    let { data, params }: PageProps = $props();
    let threads: {threadid: string, threadata: threadatatype}[] = $state([]);
    if(data.threads){
        threads = [...data.threads].sort((a, b) => (a.threadata.bump < b.threadata.bump) ? 1 : -1);
    };
    if(data.redir){
        redirect.url='/'+params.boardname;
        goto('/redirect');
    }
    tabs.location='/'+params.boardname;
    if(data.boardata!.title.length>10){
        tabs.preview=data.boardata!.title.slice(0, 10)+'...';
    }else{
        tabs.preview=data.boardata!.title;
    }
</script>

<div class="flex justify-center p-5">
    <button type="button" class="btn btn-lg preset-filled-secondary-500" onclick={() => goto('/'+params.boardname+'/newthread')}>
        New Thread
    </button>
</div>
<div class="flex flex-col w-full justify-center items-center px-3">
    {#each threads as thread}
        <Thread boardname={params.boardname} archive={false} threadid={thread.threadid} threadata={thread.threadata} bogo={false}/>
        <div class="h-[6vh]"></div>
    {/each}
</div>