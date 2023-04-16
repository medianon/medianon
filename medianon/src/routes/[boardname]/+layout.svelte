<script lang="ts">
    import { returl } from '$lib/store';
    import { boardnamexport, boardataexport, searchdata, threadsort, firstsort, currentsort, nextsort } from '$lib/store';
    import type { boardata } from '$lib/store';
    import { goto } from '$app/navigation';
    import type { LayoutData } from "./$types";
    import { page } from "$app/stores";
    import bcrypt from 'bcryptjs';

    export let data: LayoutData;
    // console.log(data);
    const boardname = $page.params.boardname;
    let boardata: boardata = {
        adminpass: "",
        boardtype: "",
        entrypass: "",
        lastactive: 0,
        ongoing: false,
        title: ""
    };
    let ebcrypt = "";
    
    if(data.nothere){
        goto("/create");
    }
    
    if (data.boardata){
        boardnamexport.set(boardname)
        boardata = data.boardata;
        boardataexport.set(data.boardata)
        ebcrypt = boardata.entrypass;
    }
    if ($returl == "safe"){
        ebcrypt = "";
        returl.set("");
    }
    
    let inpass = "";
    let wrongpass = false;
    
    function checkpass(){
        bcrypt.compare(inpass, ebcrypt).then((res) => {
            if (res){
                ebcrypt = "";
            }else{
                wrongpass = true;
            }
        })
    }

    function redir(){
        goto("/"+boardname, {invalidateAll: true});
    }
    function redirsettings(){
        goto("/settings/"+boardname);
    }
</script>


{#if ebcrypt}
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
    <div class="m-1">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        Board name: <strong class="cursor-pointer" on:click={redir}>{boardname}</strong> Last activity: <strong>{new Date(boardata.lastactive).toLocaleString()}</strong><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="text-xl" on:click={redir}>
            {boardata.title} <br>
        </p>
    </div>
    <div class="w-full ml-1">
        <input class="w-1/3" type="text" bind:value={$searchdata}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="mr-3" role="button" on:click={redir}>Search</p>
        To search the archive, visit it and start typing.
        {#if boardata.adminpass != ""}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="ml-3" role="button" on:click={redirsettings}>Settings</p><br>
        {/if}
        <br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="mr-6" role="button" on:click={redir}>Live</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={()=>goto("/"+boardname+"/a")}>Archive</p>
        {#if boardata.ongoing}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p role="button" on:click={()=>goto("/"+boardname+"/o")}>Ongoing</p>
        {/if} <br> <br>
        <div class="inline-flex ml-1">
            <p class="mr-1">Sort threads by: </p>
            <select name="thread" bind:value={$threadsort}>
                <option>Bump (Default)</option>
                <option>Most recent</option>
                <option>Oldest</option>
                <option>Replies</option>
            </select>
            <p class="ml-3 mr-1">Sort first layer by: </p>
            <select name="next" bind:value={$firstsort}>
                <option>Most recent (Default)</option>
                <option>Oldest</option>
                <option>Replies</option>
            </select>
            <p class="ml-3 mr-1">Sort current layer by: </p>
            <select name="current" bind:value={$currentsort}>
                <option>Most recent (Default)</option>
                <option>Oldest</option>
                <option>Replies</option>
            </select>
            <p class="ml-3 mr-1">Sort next layer by: </p>
            <select name="next" bind:value={$nextsort}>
                <option>Most recent (Default)</option>
                <option>Oldest</option>
                <option>Replies</option>
            </select>
        </div>
    </div><br>
    <slot />
{/if}