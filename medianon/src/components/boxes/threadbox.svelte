<script lang="ts">
    import { goto } from "$app/navigation";
    import type { threadata } from "$lib/store";
    import Speedreader from "./speedreader.svelte";
    let archive = false;
    export let boardname = "";
    export let threadid = "";
    export let postdata: threadata;
    let main = postdata.content;

    let speedread = false;
    let full = postdata.content;

    // console.log(postdata);
    if (Date.now() > postdata.archive){
        archive = true;
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
    
    function redir(){
        if (archive){
            goto("/"+boardname+"/a/"+threadid,{invalidateAll: true})
        } else {
            goto("/"+boardname+"/"+threadid,{invalidateAll: true})
        }
    }
</script>

<div class="flex flex-col">
    <div class="inline-flex w-[30vw] bg-field rounded text-right"><!--header-->
        {#if speedread}
        <div>
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
    <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="cursor-pointer" on:click={redir}>
            <div class=" h-96 w-[30vw] rounded bg-ui2 border-2 border-field overflow-y-scroll overscroll-contain"><!--the box-->
                <p class="text-xl text-center">{postdata.title}</p>
                <p>{main}</p>
            </div>
        </div>
    </div>
    <div class="w-[30vw] bg-ui2 rounded border-field border-2"><!--footer-->
        <p>{boardname}/{#if archive}a/{/if}{threadid}</p>
        <p>Made: {new Date(postdata.made).toLocaleString()}</p>
        <p>Archived: {new Date(postdata.archive).toLocaleString()}</p>
        <!-- <p>Bump: {new Date(postdata.bump).toLocaleString()}</p> -->
        {#if archive}
        <p>Deleted: {new Date(postdata.deltime).toLocaleString()}</p>
        {/if}
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
        <div class="h-96 w-[30vw] rounded bg-ui2 border-2 border-field overflow-y-scroll overscroll-contain">
            {expand}
        </div>
        {/each}
    {/if}
</div>