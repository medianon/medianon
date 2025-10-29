<script lang="ts">
    import type { PageProps } from './$types';
    import type { threadatatype } from '$lib/index.svelte';
    import { layouturl, tabs } from '$lib/index.svelte';
    import Thread from "$lib/components/thread.svelte";
    let { data, params }: PageProps = $props();
    let archive: {threadid: string, threadata: threadatatype}[] = $state([]);
    if(data.archive){
        archive = data.archive;
    }
    layouturl.url = "/"+params.boardname+"/a"
    tabs.location='/'+params.boardname+'/a';
    tabs.preview=data.boardata!.title;
    let searchdata: string = $state("");
    let searchresult = $derived.by(()=>{
        let result: {
            threadid: string,
            threadata: threadatatype
        }[] = [];
        archive.forEach(thread => {
            if (thread.threadata.title.toLowerCase().includes(searchdata.toLowerCase()) || thread.threadata.content.toLowerCase().includes(searchdata.toLowerCase()) || thread.threadid.includes(searchdata)){
                result.push(thread);
            }
        })
        return result;
    })
</script>
<div class="p-5 justify-items-center">
    {#if archive.length>2}
        <br>
        <input type="text" placeholder="Search threads" class="input border w-[50vw]" bind:value={searchdata}>
    {/if}
</div>
<div class="flex flex-col w-full justify-center items-center px-3">
    {#if searchdata == ""}
        {#each archive as thread}
            <Thread boardname={params.boardname} archive={true} threadid={thread.threadid} threadata={thread.threadata} bogo={false}/>
            <div class="h-[6vh]"></div>
        {/each}
    {:else}
        {#each searchresult as thread}
            <Thread boardname={params.boardname} archive={true} threadid={thread.threadid} threadata={thread.threadata} bogo={false}/>
            <div class="h-[6vh]"></div>
        {/each}
    {/if}
</div>