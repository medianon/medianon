<script lang="ts">
    import type { PageProps } from "./$types";
    import type { threadatatype, replydatatype } from "$lib/index.svelte";
    import { layouturl, tabs } from "$lib/index.svelte";
    import Thread from "$lib/components/thread.svelte";
    import Reply from "$lib/components/reply.svelte";
    import Bookmarks from "$lib/components/bookmarks.svelte";
    let {data, params}: PageProps = $props();
    const threadata: threadatatype = data.threadata as threadatatype;
    let replies: replydatatype[] = $state([]);
    layouturl.url = "/"+params.boardname+"/a/"+params.thread;
    if(data.replies){
        replies = [...data.replies].sort((a, b) => (a.made > b.made) ? 1 : -1);
    }
    tabs.location='/'+params.boardname+'/a/'+params.thread;
    if(threadata.title.length>10){
        tabs.preview=threadata.title.slice(0, 10)+'...';
    }else{
        tabs.preview=threadata.title;
    }
    const replydiv: HTMLElement = document.getElementById("replies")!;
    if(replydiv!=null)
        replydiv.addEventListener("wheel", (event)=>{
        event.preventDefault();
        replydiv.scrollLeft += event.deltaY;
    })
</script>

<div class="flex justify-center mt-3">
    <Bookmarks boardname={params.boardname} threadid={params.thread} archive={false}></Bookmarks>
</div>
<div class="flex w-full justify-center">
    <Thread boardname={params.boardname} threadid={params.thread} threadata={threadata} archive={true} bogo={false}></Thread>
</div>
<div class="m-5"><hr class="rounded border"></div>

{#if replies.length>0}
    <div class="flex flex-col items-center">
        <p class="text-6xl">
            &#8595;
        </p>
        <p class="text-xl">Layer 1</p>
    </div>
    <div id="replies" class="flex overflow-y-scroll overflow-x-hidden flex-col max-h-[50vh] items-center px-3">
        {#each replies as reply}
            <Reply boardname={params.boardname} archive={true} threadid={params.thread} replydata={reply} bogo={false}/>
        {/each}
    </div>
{/if}