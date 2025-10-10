<script lang="ts">
    import type { PageProps } from "./$types";
    import type { threadatatype, replydatatype } from "$lib/index.svelte";
    import { redirect, threadexport, layouturl, tabs, bookmarks } from "$lib/index.svelte";
    import Thread from "$lib/components/thread.svelte";
    import Reply from "$lib/components/reply.svelte";
    import { goto } from "$app/navigation";
	import Bookmarks from "$lib/components/bookmarks.svelte";
	import { onMount } from "svelte";
    let {data, params}: PageProps = $props();
    layouturl.url = "/"+params.boardname+"/"+params.thread;
    onMount(()=>{
        if(data.redir){
            redirect.url=data.redir;
            goto('/redirect');
        }
    })
    const threadata: threadatatype = $state(data.threadata) as threadatatype;
    let replies: replydatatype[] = $state([]);
    if(data.replies){
        replies = [...data.replies].sort((a, b) => (a.made > b.made) ? 1 : -1);
    }
    tabs.location='/'+params.boardname+'/'+params.thread;
    if(threadata != undefined){
        if(threadata.title.length>10){
            tabs.preview=threadata.title.slice(0, 10)+'...';
        }else{
            tabs.preview=threadata.title;
        }
    }
    function opreply(){
        threadexport.threadata = threadata;
        goto('/'+params.boardname+'/'+params.thread+'/opreply');
    }

</script>

<div class="flex justify-evenly items-center p-5">
    <button type="button" class="btn bg-secondary-500" onclick={opreply}>
        New Reply
    </button>
    <Bookmarks boardname={params.boardname} threadid={params.thread} archive={false}></Bookmarks>
</div>
<div class="flex w-full justify-center">
    <Thread boardname={params.boardname} threadid={params.thread} threadata={threadata} archive={false} bogo={false}></Thread>
</div>
<div class="m-5"><hr class="rounded border"></div>

{#if replies.length>0}
    <div class="flex flex-col items-center">
        <p class="text-6xl">
            &#8595;
        </p>
        <p class="text-xl">Layer 1</p>
    </div>
    <div id="replies" class="flex overflow-y-scroll overflow-x-hidden flex-col max-h-[60vh] items-center px-3">
        {#each replies as reply}
            <Reply boardname={params.boardname} archive={false} threadid={params.thread} replydata={reply} bogo={false}/>
        {/each}
    </div>
    <!-- <div class="p-3 sm:px-10 pb-6"><hr class="border-2 rounded-lg"></div> -->
{/if}