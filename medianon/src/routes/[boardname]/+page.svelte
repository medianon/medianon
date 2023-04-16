<script lang="ts">
    import { createtype, boardnamexport, boardataexport, tabdata, searchdata, threadsort } from '$lib/store';
    import type { threadata } from '$lib/store';
    import type { boardata } from '$lib/store';
    import Threadbox from '../../components/boxes/threadbox.svelte';
    import { page } from "$app/stores";
    import type { PageData } from "./$types";
    export let data: PageData;

    const boardname = $page.params.boardname;
    let boardata: boardata;

    let threads: {
        threadid: number,
        threadata: threadata
    }[] = [];
    if(data.boardata){
        boardata = data.boardata;
        boardnamexport.set(boardname);
        boardataexport.set(boardata);
        
        // console.log(data.threadata);
        data.threads?.forEach(threadobj => {
            // console.log(threadobj);
            threads.push({
                threadid: parseInt(threadobj.threadid),
                threadata: threadobj.threadata
            })
        })
        // console.log(threads);
    }
    if ($threadsort == "Bump (Default)"){
        threads.sort((a, b) => 
        (a.threadata.bump < b.threadata.bump)? 1 : -1);
    } else if ($threadsort == "Most recent"){
        threads.sort((a, b) => 
        (a.threadata.made < b.threadata.made)? 1 : -1);
    } else if ($threadsort == "Oldest"){
        threads.sort((a, b) => 
        (a.threadata.made > b.threadata.made)? 1 : -1);
    } else if ($threadsort == "Replies"){
        threads.sort((a, b) => 
        (a.threadata.replies < b.threadata.replies)? 1 : -1);
    }
    

    function searchops(searchdata: string): {
        threadid: number,
        threadata: threadata
    }[]{
        let result: {
            threadid: number,
            threadata: threadata
        }[] = [];
        threads.forEach(thread => {
            if (thread.threadata.title.toLowerCase().includes(searchdata.toLowerCase()) || thread.threadata.content.toLowerCase().includes(searchdata.toLowerCase())){
                result.push(thread);
            }
        })
        return result;
    }
    $: searchresult = searchops($searchdata)

 
    tabdata.set({
        boardname: boardname,
        threadid: "",
        postnum: "",
        archive: false
    });

    function newthread(){
        boardnamexport.set(boardname);
        createtype.set("Newthread");
        document.body.scrollIntoView();
    }
</script>

{#if boardname != "test"}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p class="m-1" role="button" on:click={newthread}>New Thread</p>
{/if}

<div class="w-screen inline-flex justify-center mt-9">
    <!-- sorting settings etc-->
    <div class="overscroll-contain">
        {#if $searchdata != ""}
            {#each searchresult as thread}
                <div class="h-9"></div>
                <Threadbox boardname = {boardname} threadid = {thread.threadid.toString()} postdata = {thread.threadata}/>
            {/each}
        {:else}
            {#each threads as thread}
                <div class="h-9"></div>
                <Threadbox boardname = {boardname} threadid = {thread.threadid.toString()} postdata = {thread.threadata}/>
            {/each}
        {/if}
        <div class="h-[50vh]"></div>
    </div>
</div>