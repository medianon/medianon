<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
    import { goto } from '$app/navigation';
    import Thread from '$lib/components/thread.svelte';
    import Reply from '$lib/components/reply.svelte';
	import { bogo, redirect, tabs, type replydatatype, type threadatatype } from '$lib/index.svelte';
    import { images, nsfw } from '$lib/index.svelte';
    import type { PageProps } from './$types';
    let { data }: PageProps = $props();
    let restype = $state(4);
    let boardname: string|undefined = $state();
    let threadobj: {
        boardname: string,
        archive: boolean,
        threadid: string,
        threadata: threadatatype
    }|undefined = $state() as {
        boardname: string,
        archive: boolean,
        threadid: string,
        threadata: threadatatype
    }|undefined;
    let replyobj: {
        boardname: string,
        archive: boolean,
        threadid: string,
        replydata: replydatatype
    }|undefined = $state() as {
        boardname: string,
        archive: boolean,
        threadid: string,
        replydata: replydatatype
    }|undefined;
    switch (data.restype) {
        case 0:
            restype = 0;
            break;
        case 1:
            restype = 1;
            boardname = data.boardname;
            break;
        case 2:
            restype = 2;
            threadobj = data.threadobj;
            break;
        case 3:
            restype = 3;
            replyobj = data.replyobj;
            break;
        default:
            break;
    }
    tabs.location = '/bogo';
    tabs.preview = 'Bogo Search';
    function roll(){
        bogo.count += 1;
        redirect.url = '/bogo';
        goto('/redirect');
    }
</script>
<div class="p-2 justify-items-center">
    <p class="my-3">
        <span class="text-xl">Bogo Search is an optional feature that you do not have to use.</span> <br>
        <button type="button" class="btn btn-lg preset-filled-success-500 mt-5" onclick={roll}>Roll</button>
        This button will search all boards that have opted in to be searchable and fetch a random thread or reply from one of them. <br>
        Show images: <input type="checkbox" class="checkbox border" defaultChecked={images.show} onchange={()=>{images.show=!images.show}}> <br>
        Including NSFW: <input type="checkbox" class="checkbox border" defaultChecked={nsfw.show} onchange={()=>{nsfw.show=!nsfw.show}}> <br> <br>
        {#if bogo.count > 15}
        Each click generates server costs so please be nice :) <br>
        {/if}
        {#if  bogo.count > 50}
        Please <br>
        {/if}
        {#if  bogo.count > 100}
        Apply yourself <br>
        {/if}
        {#if  bogo.count > 200}
        *donation link* <br>
        {/if}
    </p>
    {#if restype == 0}
        <p class="text-xl my-3">Error: No boards to search</p>
    {:else if restype == 1}
        <p class="text-xl my-3">Error: The board <strong>{boardname}</strong> has no threads</p>
    {:else if restype == 2}
        <Thread boardname={threadobj!.boardname} threadid={threadobj!.threadid} threadata={threadobj!.threadata} archive={threadobj!.archive} bogo={true}></Thread>
    {:else if restype == 3}
        <Reply boardname={replyobj!.boardname} threadid={replyobj!.threadid} replydata={replyobj!.replydata} archive={replyobj!.archive} bogo={true}></Reply>
    {:else}
        -
    {/if}
</div>