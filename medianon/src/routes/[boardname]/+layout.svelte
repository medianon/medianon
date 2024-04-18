<script lang="ts">
    import { returl } from '$lib/store';
    import { boardataexport, searchdata } from '$lib/store';
    import { goto } from '$app/navigation';
    import { page } from "$app/stores";
    import type { PageData } from './$types';
    import bcrypt from 'bcryptjs';
    const boardname = $page.params.boardname;
    export let data: PageData;
    if(data.nothere){
        goto("/"+boardname+"/create");
    }
    if(data.boardata){
        boardataexport.set(data.boardata);
    }
    let authed = true;

    if ($returl == "safe"){
        authed = false;
        returl.set("");
    }
    
    let inpass = "";
    let wrongpass = false;
    
    function checkpass(){
        bcrypt.compare(inpass, $boardataexport.entrypass).then((res) => {
            if (res){
                authed = false;
            }else{
                wrongpass = true;
            }
        })
    }

    function redir(){
        goto("/"+boardname, {invalidateAll: true});
    }
</script>


{#if (($boardataexport.entrypass != "") && authed)}
    <div class="m-1">
        <p>Enter password</p>
        <input type="password" bind:value={inpass}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={checkpass}>Enter</p>
        {#if wrongpass}
        <p class="text-xl">Incorrect password</p>
        {/if}
    </div>
{:else}
    <div class="m-1 text-lg">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            Board name: <strong class="cursor-pointer" on:click={redir}>{boardname}</strong> Last activity: <strong>{new Date($boardataexport.lastactive).toLocaleString()}</strong> Live thread count: <strong>{$boardataexport.threadcount} / {$boardataexport.maxthreads}</strong><br>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <strong class="text-2xl">{$boardataexport.title}</strong>
    </div>
    <div class="w-full ml-1">
        <input class="w-1/4" type="text" placeholder="Search OPs" bind:value={$searchdata}><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="" role="button" on:click={redir}>Live</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="mx-6" role="button" on:click={()=>goto("/"+boardname+"/a")}>Archive</p>
        {#if $boardataexport.ongoing}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="mr-9" role="button" on:click={()=>goto("/"+boardname+"/o")}>Ongoing</p>
        {/if}
        {#if $boardataexport.adminpass != ""}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p role="button" on:click={()=>{goto("/settings/"+boardname)}}>Settings</p><br>
        {/if}
    </div><br>
    <slot />
{/if}