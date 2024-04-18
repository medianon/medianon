<script lang="ts">
    import { tabdata } from "$lib/store";
    import { type threadata, searchdata, threadsort, boardataexport } from '$lib/store';
    import Threadbox from "../../../components/boxes/threadbox.svelte";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    export let data: PageData;

    const boardname = $page.params.boardname;
    
    let threads: {
        threadid: number,
        threadata: threadata
    }[] = [];
    if (data.archive){
        data.archive.forEach((threadobj) => {
            threads.push({
                threadid: parseInt(threadobj.threadid),
                threadata: threadobj.threadata
            })
        })
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
    // console.log(threads);
    
    function searchops(searchdata: string): {
        threadid: number,
        threadata: threadata
    }[]{
        let result: {
            threadid: number,
            threadata: threadata
        }[] = [];
        threads.forEach(thread => {
            if (thread.threadata.title.includes(searchdata.toLowerCase()) || thread.threadata.content.includes(searchdata.toLowerCase())){
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
        archive: true
    });
</script>

<!-- <div>This space is reserved for a sponsored post. See about page for more information.</div> -->
<div class="w-screen inline-flex justify-center mt-9">
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
<!-- <div>This space is reserved for a sponsored post. See about page for more information.</div> -->
