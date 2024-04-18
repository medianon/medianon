<script lang="ts">
    import { subscriptions, firstsort, tabdata, returl, threadataexport } from "$lib/store";
    import type { threadata, postdata } from '$lib/store';
    import type { PageData } from "./$types";
	import Bookmarks from "../../../components/bookmarks.svelte";
	import Threadbox from '../../../components/boxes/threadbox.svelte';
	import Replybox from "../../../components/boxes/replybox.svelte";
	import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    export let data: PageData;
    const boardname = $page.params.boardname;
    const threadid = $page.params.thread;

    if (data.redurl){
        returl.set(data.redurl);
        goto("/redirect");
    }

    let threadata: threadata = data.threadata!;
    let replies: postdata[] = data.replies!;

    // console.log(data.threadata);
    if ($firstsort == "Most recent"){
        replies.sort((a, b) => 
        (a.made < b.made)? 1 : -1);
    } else if ($firstsort == "Oldest (Default)"){
        replies.sort((a, b) => 
        (a.made > b.made)? 1 : -1);
    } else if ($firstsort == "Replies"){
        replies.sort((a, b) => 
        (a.replies < b.replies)? 1 : -1);
    }
    
    tabdata.set({
        boardname: boardname,
        threadid: threadid,
        postnum: "",
        archive: false
    })

    function opreply(){
        threadataexport.set(threadata);
        goto("/"+boardname+"/"+threadid+"/opreply");
    }
    
    let subscribed = false;
    let index = $subscriptions.findIndex(thread => 
        thread.boardname == boardname && thread.threadid == parseInt(threadid)
    );
    if (index > -1){
        subscribed = true;
    }
    function subscribe(){
        if (!subscribed){
            subscribed = !subscribed;
            $subscriptions.push({
                boardname: boardname,
                threadid: parseInt(threadid),
                threadata: threadata
            });
            // console.log($subscriptions);
        } else {
            let index = $subscriptions.findIndex(thread => 
            thread.boardname == boardname && thread.threadid == parseInt(threadid)
            );
            if (index > -1){
                subscribed = !subscribed;
                $subscriptions.splice(index, 1);
            }
            // console.log($subscriptions);
        }
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<p class="ml-1 mt-3" role="button" on:click={opreply} title="This will make a reply to the original post.">
New Reply</p>
{#if subscribed}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="ml-3 bg-subscribe" role="button" on:click={subscribe}>Subscribed</p><br>
{:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="ml-3" role="button" on:click={subscribe}>Subscribe</p><br>
{/if}

<div class="w-screen inline-flex justify-center mt-9">
    <div class="overscroll-contain">
        <div class="h-9"></div>
        <Threadbox boardname = {boardname} threadid = {threadid} postdata = {threadata}/>
        <div class="h-9"></div>
        <Bookmarks boardthread = {{
            boardname: boardname,
            threadid: threadid
            }}/>
    </div>
    {#if replies.length > 0}
        <!--NOT MY CODE. source: https://stackoverflow.com/questions/67133460/how-to-make-a-triangle-shape-with-tailwind-->
        <div class="w-11 mx-3 mt-32 overflow-hidden inline-block rounded">
            <div class=" h-16 rounded bg-arrows rotate-45 transform origin-top-left"></div>
        </div>
        <!-- <div class="w-6"></div> -->
        <div class="h-screen overscroll-contain">
            {#each replies as postdata}
            <div class="h-9"></div>
            <Replybox boardname = {boardname} threadid = {threadid} postdata = {postdata} />
            {/each}
            <div class="h-[50vh]"></div>
        </div>
    {/if}

</div>