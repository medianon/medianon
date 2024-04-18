<script lang="ts">
    import { bookmarks, postdataexport, returl, showhistory, usehistory, history, historylength, showmedia, shownsfw, reportarchive } from "$lib/store";
    import type { postdata } from "$lib/store";
    import { goto } from "$app/navigation";
    import Speedreader from "./speedreader.svelte";
    export let archive = false;
    export let boardname = "";
    export let threadid = "";
    export let postdata: postdata;
    let markurl = "/"+boardname+"/"+threadid+"/"+postdata.postnum;
    if (archive){
        markurl = "/"+boardname+"/a/"+threadid+"/"+postdata.postnum;
    }
    // console.log(markurl);
    
    let main = postdata.content;
    // console.log(postdata);
    let speedread = false;
    
    let bookmarked = false;
    if ($bookmarks.includes(markurl)){
        bookmarked = true;
    }
    function togglemark(){
        bookmarked = !bookmarked;
        if (bookmarked){
            $bookmarks.push(markurl)
        } else {
            let index = $bookmarks.indexOf(markurl);
            $bookmarks.splice(index, 1);
        }
        // console.log($bookmarks);
    }

    let morebtn = false;
    let contentsplit: string[] = [];

    if (postdata.content.length > 333){
        morebtn = true;
        let temp = "";
        if (postdata.content.length > 666){
            temp = postdata.content.slice(333, 666);
            contentsplit.push(temp);
            temp = postdata.content.slice(666);
            contentsplit.push(temp);
        }else{
            temp = postdata.content.slice(333);
            contentsplit.push(temp);
        }
        main = postdata.content.slice(0, 333);
    }

    let expandcontent = false;
    function togglexpand(){
        expandcontent = !expandcontent;
    }

    let showimage = false;
    if($shownsfw && (postdata.reported < 5)){
        showimage = true;
    }else if($showmedia && ((postdata.reported == 1) || (postdata.reported == 3))){
        showimage = true;
    }
    function toggleimage(){
        showimage = !showimage;
    }

    function newreply(){
        postdataexport.set(postdata);
        goto(markurl+"/newreply");
    }

    function report(){
        postdataexport.set(postdata);
        if(archive){
            reportarchive.set(true);
        }else{
            reportarchive.set(false);
        }
        goto("/"+boardname+"/"+threadid+"/"+postdata.postnum.toString()+"/report");
    }

    function redir(){
        returl.set(markurl);
        // console.log($returl);
        if ($usehistory){
            $history.push({
                archive: archive,
                boardname: boardname,
                threadid: threadid,
                postdata: postdata
            });
            if ($history.length > $historylength){
                $history.splice(0, $history.length - $historylength)
            }
            showhistory.set(false);
        }
        goto("/redirect");
    }
</script>


<div class="flex flex-col">
    <div class="inline-flex w-[30vw] bg-field rounded"><!--header-->
        {#if speedread}
            <div class="w-[30vw]">
                <!-- <Speedreader /> -->
                <Speedreader content = {postdata.content}/>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <p class="cursor-pointer ml-1 my-1 px-1 rounded bg-speedread w-fit" on:click={()=>speedread = !speedread}>Close</p>
            </div>
        {:else}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="cursor-pointer ml-1 my-1 px-1 rounded bg-speedread" on:click={()=>speedread = !speedread}>Speed Read</p>
            <p class="cursor-pointer ml-1 my-1 px-1 rounded bg-listen" title="Text to speech. Coming soon.">Listen</p>
            <p class="my-1 ml-auto mr-1">{postdata.replies}</p>
        {/if}
    </div>
    <div class="inline-flex w-[30vw] bg-field rounded ">
        {#if !archive}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="cursor-pointer ml-1 my-1 px-1 rounded bg-ui2" on:click={newreply} title="You will navigate to this post after replying to it.">New reply</div>
        {/if}
        {#if bookmarked}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="ml-1 my-1 px-1 rounded bg-bookmark cursor-pointer" on:click={togglemark}>Bookmarked</div>
        {:else}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="ml-1 my-1 px-1 rounded bg-ui2 cursor-pointer text-center" on:click={togglemark}>Bookmark</div>
        {/if}
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="cursor-pointer" on:click={redir}>
        <div class="h-84 w-[30vw] rounded bg-ui2 border-2 border-field overflow-y-scroll overscroll-contain"><!--the box-->
            <p>{main}</p>
        </div>
    </div>
    <div class="w-[30vw] bg-ui2 rounded border-field border-2"><!--footer-->
        <p>{markurl}</p>
        <p>Made: {new Date(postdata.made).toLocaleString()}</p>
        {#if morebtn}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="m-1 w-12 rounded cursor-pointer bg-field text-center" on:click={togglexpand}>
            {#if expandcontent}
            Hide
            {:else}
            More
            {/if}
        </div><!--expand-->
        {/if}
    </div>
    {#if expandcontent}
        {#each contentsplit as expand}
        <div class="h-64 w-[30vw] rounded bg-ui2 border-2 border-field overflow-y-scroll overscroll-contain">
        {expand}
        </div>
        {/each}
    {/if}
    {#if ((postdata.reported) && (postdata.reported != 7))}
        <div class="w-[30vw] inline-flex text-right rounded bg-private border-2 border-field overscroll-contain">
            {#if ((postdata.reported == 2) || (postdata.reported == 4))}
                <strong class="mx-1 text-xl text-red-900" title="NSFW">!</strong>
            {/if}
            {#if (postdata.reported < 5)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="cursor-pointer overflow-clip" on:click={toggleimage}>{postdata.filename}</p>
            <a class="rounded bg-ui2 ml-3" href={postdata.url} target="_blank" rel="noreferrer">New Tab</a>
            {:else if (postdata.reported == 5)}
                Reported
            {:else}
                Deleted
            {/if}
            {#if (postdata.reported < 3)}
                <p class="cursor-pointer ml-auto border-red-900 border-2" on:click={report}>
                    Report</p>
            {/if}
        </div>
        {#if (showimage && postdata.url)}
            <div class="max-w-[25vw]">
                <img src={postdata.url} alt="">
            </div>
        {/if}
    {/if}
</div>