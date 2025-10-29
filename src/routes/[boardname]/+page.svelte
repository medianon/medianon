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
    let searchdata: string = $state("");
    let searchresult = $derived.by(()=>{
        let result: {
            threadid: string,
            threadata: threadatatype
        }[] = [];
        threads.forEach(thread => {
            if (thread.threadata.title.toLowerCase().includes(searchdata.toLowerCase()) || thread.threadata.content.toLowerCase().includes(searchdata.toLowerCase()) || thread.threadid.includes(searchdata)){
                result.push(thread);
            }
        })
        return result;
    })
</script>

<div class="flex flex-col items-center p-5">
    <button type="button" class="btn btn-lg preset-filled-secondary-500" onclick={() => goto('/'+params.boardname+'/newthread')}>
        New Thread
    </button>
    {#if threads.length>2}
        <br>
        <input type="text" placeholder="Search threads" class="input border w-[50vw]" bind:value={searchdata}>
    {/if}
</div>
<div class="flex flex-col w-full justify-center items-center px-3">
    {#if searchdata == ""}
        {#each threads as thread}
            <Thread boardname={params.boardname} archive={false} threadid={thread.threadid} threadata={thread.threadata} bogo={false}/>
            <div class="h-[6vh]"></div>
        {/each}
    {:else}
        {#each searchresult as thread}
            <Thread boardname={params.boardname} archive={false} threadid={thread.threadid} threadata={thread.threadata} bogo={false}/>
            <div class="h-[6vh]"></div>
        {/each}
    {/if}
</div>