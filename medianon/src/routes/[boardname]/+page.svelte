<script lang="ts">
    import { boardataexport, tabdata, searchdata, threadsort } from '$lib/store';
    import type { threadata } from '$lib/store';
    import Threadbox from '../../components/boxes/threadbox.svelte';
    import { page } from "$app/stores";
    import { goto } from '$app/navigation';
    import type { PageData } from "./$types";
    export let data: PageData;
    const boardname = $page.params.boardname;
    let threads: {
        threadid: string,
        threadata: threadata
    }[] = [];
    if(data.threads){
        threads = data.threads;
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
        threadid: string,
        threadata: threadata
    }[]{
        let result: {
            threadid: string,
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
        goto(boardname+"/newthread");
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<p class="m-1" role="button" on:click={newthread}>New Thread</p>

<div class="w-screen inline-flex justify-center mt-9">
    <div class="overscroll-contain">
        {#if $searchdata != ""}
            {#each searchresult as thread}
                <div class="h-9"></div>
                <Threadbox boardname = {boardname} threadid = {thread.threadid} postdata = {thread.threadata}/>
            {/each}
        {:else}
            {#each threads as thread}
                <div class="h-9"></div>
                <Threadbox boardname = {boardname} threadid = {thread.threadid} postdata = {thread.threadata}/>
            {/each}
        {/if}
        <div class="h-[50vh]"></div>
    </div>
    {#if $boardataexport.pinned != ""}
        <div class="overscroll-contain m-9">
            <div class="h-96 w-[30vw] rounded bg-ui2 border-2 border-field overflow-y-scroll overscroll-contain"><!--the box-->
                <p class="text-xl text-center"><strong>Pinned post:</strong></p>
                <p>{$boardataexport.pinned}</p>
            </div>
        </div>
    {/if}
</div>