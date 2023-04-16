<script lang="ts">
    import { bookmarks, newparent, newlayer, createtype, boardnamexport, threadidexport, returl, showhistory, usehistory, history, historylength } from "$lib/store";
    import type { postdata } from "$lib/store";
    import { goto } from "$app/navigation";
    import Speedreader from "./speedreader.svelte";
    export let archive = false;
    export let boardname = "";
    export let threadid = "";
    export let postdata: postdata = {
        postnum: 0,
        content: "",
        made: 0,
        boxes: 0,
        replies: 0,
        parent: 0,
        layer: 0
    };
    let markurl = "/"+boardname+"/"+threadid+"/"+postdata.postnum;
    if (archive){
        markurl = "/"+boardname+"/a/"+threadid+"/"+postdata.postnum;
    }
    // console.log(markurl);
    
    let main = postdata.content;
    // console.log(postdata);
    let speedread = false;
    let full = postdata.content;

    
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
    if (postdata.boxes > 1){
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
        temp = postdata.content.slice(0, 333);
        main = temp;
    }

    let expandcontent = false;
    function togglexpand(){
        expandcontent = !expandcontent;
    }


    function newreply(){
        newlayer.set(postdata.layer + 1);
        newparent.set(postdata.postnum);
        createtype.set("Newreply");
        boardnamexport.set(boardname);
        threadidexport.set(threadid);
        document.body.scrollIntoView();
    }

    function redir(){
        if (archive){
            returl.set(markurl);
        } else {
            returl.set(markurl);
        }
        // console.log($returl);
        if ($usehistory){
            if ($history.length > $historylength - 1){
                $history.splice(0, $history.length - $historylength)
                $history.push({
                    archive: archive,
                    boardname: boardname,
                    threadid: threadid,
                    postdata: postdata
                });
            } else {
                $history.push({
                    archive: archive,
                    boardname: boardname,
                    threadid: threadid,
                    postdata: postdata
                });
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
                <Speedreader content = {full}/>
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
        {#if !archive && boardname != "test"}
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
</div>