<script lang="ts">
    import { subscriptions, tabdata, firstsort, boardataexport } from "$lib/store";
    import type { threadata, postdata } from "$lib/store";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
	import Bookmarks from "../../../../components/bookmarks.svelte";
	import Threadbox from "../../../../components/boxes/threadbox.svelte";
	import Replybox from "../../../../components/boxes/replybox.svelte";
    export let data: PageData;

    const boardname = $page.params.boardname;
    const threadid = $page.params.thread;
    // console.log(data.threadata);
    let threadata: threadata;
    if (data.threadata){
        threadata = data.threadata;
    }
    let replies: postdata[] = [];
    data.replies?.forEach(reply => {
        replies.push(reply)
    })
    // replies = replies.sort((a, b) => (a.made < b.made)? 1 : -1);
    if ($firstsort == "Most recent (Default)"){
        replies.sort((a, b) => 
        (a.made < b.made)? 1 : -1);
    } else if ($firstsort == "Oldest"){
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
        archive: true
    })

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
        } else {
            let index = $subscriptions.findIndex(thread => 
            thread.boardname == boardname && thread.threadid == parseInt(threadid)
            );
            if (index > -1){
                subscribed = !subscribed;
                $subscriptions.splice(index, 1);
            }
        }
    }
</script>

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
        <Bookmarks archive = {true} boardthread = {{
            boardname: boardname,
            threadid: threadid
            }}/>
    </div>
    <!--NOT MY CODE. source: https://stackoverflow.com/questions/67133460/how-to-make-a-triangle-shape-with-tailwind-->
    <div class="w-11 mx-3 mt-44 overflow-hidden inline-block rounded">
        <div class=" h-16 rounded bg-arrows rotate-45 transform origin-top-left"></div>
    </div>
    <div class="h-screen overscroll-contain">
        {#each replies as postdata}
            <div class="h-9"></div>
            <Replybox boardname = {boardname} threadid = {threadid} archive = {true} postdata = {postdata} />
        {/each}
        <div class="h-[50vh]"></div>
    </div>

</div>