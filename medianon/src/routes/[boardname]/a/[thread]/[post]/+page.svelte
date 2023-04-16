<script lang="ts">
	import { goto } from '$app/navigation';
	import { subscriptions, tabdata, currentsort, nextsort } from '$lib/store';
	import Bookmarks from '../../../../../components/bookmarks.svelte';
	import Threadbox from '../../../../../components/boxes/threadbox.svelte';
	import Replybox from '../../../../../components/boxes/replybox.svelte';
	import type { PageData } from './$types';
    import type { threadata, postdata } from '$lib/store';
    import { page } from "$app/stores";

    const boardname = $page.params.boardname;
    const threadid = $page.params.thread;
    const postid = $page.params.post;

    export let data: PageData;
    let currentpost: postdata;
    let threadata: threadata;
    let replies: postdata[] = [];
    
    if (data.threadata){
        currentpost = data.currentpost;
        threadata = data.threadata;
        data.replies?.forEach(reply => {
            replies.push(reply);
        })

    }   
    
    let previousdata: postdata;
    
    let currentlayereplies: postdata[] = [];
    let showcurrentlayer = false;
    
    let nextlayereplies: postdata[] = [];

    replies.forEach(reply => {
        if (reply.postnum == currentpost.postnum){
            currentpost = reply;
        } else if (reply.postnum == currentpost.parent){
            previousdata = reply;
        } else if (reply.layer == currentpost.layer && reply.postnum != currentpost.postnum){
            currentlayereplies.push(reply);
        } else if (reply.layer == (currentpost.layer + 1) && reply.parent == currentpost.postnum){
            nextlayereplies.push(reply);
        }
    });

    if ($currentsort == "Most recent (Default)"){
        currentlayereplies.sort((a, b) => 
        (a.made < b.made)? 1 : -1);
    } else if ($currentsort == "Oldest"){
        currentlayereplies.sort((a, b) => 
        (a.made > b.made)? 1 : -1);
    } else if ($currentsort == "Replies"){
        currentlayereplies.sort((a, b) => 
        (a.replies < b.replies)? 1 : -1);
    }

    if ($nextsort == "Most recent (Default)"){
        nextlayereplies.sort((a, b) => 
        (a.made < b.made)? 1 : -1);
    } else if ($nextsort == "Oldest"){
        nextlayereplies.sort((a, b) => 
        (a.made > b.made)? 1 : -1);
    } else if ($nextsort == "Replies"){
        nextlayereplies.sort((a, b) => 
        (a.replies < b.replies)? 1 : -1);
    }
    
    tabdata.set({
        boardname: boardname,
        threadid: threadid,
        postnum: postid,
        archive: true
    })

    let backtrack: postdata[] = [];
    let showtrail = false;
    function togglebacktrack(){
        showtrail = !showtrail;
        if (backtrack.length > 0){}
        else {
            findtrail((currentpost.layer - 1), currentpost.parent)
        }
    }

    function findtrail(prevlayer: number, currentparent: number){
        if (prevlayer == 1){
            replies.forEach(reply => {
                if (reply.postnum == currentparent){
                    backtrack.push(reply);
                    return;
                }
            })
        } else {
            replies.forEach(reply => {
                if (reply.postnum == currentparent){
                    backtrack.push(reply);
                    findtrail((prevlayer - 1), reply.parent);
                }
            })
        }
    }

    function togglecurrentlayer(){
        showcurrentlayer = !showcurrentlayer;
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

    function redir(returl: string){
        goto(returl, {invalidateAll: true});
    };
</script>

<div class="inline-flex">
    {#if subscribed}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="ml-3 bg-subscribe" role="button" on:click={subscribe}>Subscribed</p><br>
    {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="ml-3" role="button" on:click={subscribe}>Subscribe</p><br>
    {/if}
    {#if currentpost.layer > 1}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="ml-3" role="button" on:click={togglebacktrack}>
            {#if showtrail}
                Return
            {:else}
                Backtrack
            {/if}
        </p>
    {/if}
</div>

<div class="w-screen inline-flex justify-center mt-9">
    <!-- sorting settings etc-->
    <div class="overscroll-contain">
        {#if showtrail}
            <div class="h-9"></div>
            {#each backtrack as postdata}
                <Replybox boardname = {boardname} threadid = {threadid} postdata = {postdata} archive = {true} />
                <!--NOT MY CODE. source: https://stackoverflow.com/questions/67133460/how-to-make-a-triangle-shape-with-tailwind-->
                <div class="ml-[12vw] w-16 overflow-hidden inline-block rounded">
                    <div class=" h-11 w-11 bg-arrows rotate-45 transform origin-bottom-left rounded"></div>
                </div>
                <div class="h-6"></div>
            {/each}
            <Threadbox boardname = {boardname} threadid = {threadid} postdata = {threadata}/>
        {:else}
            <div class="h-9"></div>
            {#if currentpost.layer == 1}
                <Threadbox boardname = {boardname} threadid = {threadid} postdata = {threadata} />
            {:else if currentpost.layer > 1}
                <Replybox boardname = {boardname} threadid = {threadid} archive = {true} postdata = {previousdata} />
            {/if}
        {/if}
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
        <div class="h-9"></div>
        <Replybox boardname = {boardname} threadid = {threadid} archive = {true} postdata = {currentpost} />
        <div class="h-20"></div>
        {#if currentlayereplies.length > 0}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p role="button" on:click={togglecurrentlayer}>
                {#if showcurrentlayer}
                    Hide
                {:else}
                    More
                {/if}
            </p><br>
            Click 'More' to see the other replies in layer {currentpost.layer}.
            {#if showcurrentlayer}
                {#each currentlayereplies as postdata}
                    <div class="h-9"></div>
                    <Replybox boardname = {boardname} threadid = {threadid} archive = {true} postdata = {postdata} />
                {/each}
            <div class="h-[50vh]"></div>
            {/if}
        {/if}
    </div>
    {#if nextlayereplies.length > 0}
        <!--NOT MY CODE. source: https://stackoverflow.com/questions/67133460/how-to-make-a-triangle-shape-with-tailwind-->
        <div class="w-11 mx-3 mt-44 overflow-hidden inline-block rounded">
            <div class=" h-16 rounded bg-arrows rotate-45 transform origin-top-left"></div>
        </div>
        <div class="h-screen overscroll-contain">
            {#each nextlayereplies as postdata}
                <div class="h-9"></div>
                <Replybox boardname = {boardname} threadid = {threadid} archive = {true} postdata = {postdata} />
            {/each}
            <div class="h-[50vh]"></div>
        </div>
    {/if}

</div>