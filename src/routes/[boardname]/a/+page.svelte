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
</script>
<div class="pt-10"></div>
<div class="flex flex-col w-full justify-center items-center px-3">
    {#each archive as thread}
        <Thread boardname={params.boardname} archive={true} threadid={thread.threadid} threadata={thread.threadata} bogo={false}/>
        <div class="h-[6vh]"></div>
    {/each}
</div>