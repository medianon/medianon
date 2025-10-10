<script lang="ts">
    import type { LayoutProps } from './$types';
    import type {boardatatype} from '$lib/index.svelte';
    import { layouturl, redirect, boardexport, redirauth } from '$lib/index.svelte';
    import { goto } from '$app/navigation';
    import bcrypt from 'bcryptjs';
    let { children, data, params }: LayoutProps = $props();
    let boardata: boardatatype = $state({}) as boardatatype;
    if(data.nothere){
        goto('/'+params.boardname+'/create');
    }
    if(data.boardata){
        boardata = data.boardata;
    }
    layouturl.url = "/"+params.boardname;
    let info = $state(false);
    let entryauth = $state(true);
    let entryinput = $state("");
    let wrongpass = $state(false);
    function checkpass(){
        bcrypt.compare(entryinput, boardata.entrypass).then((res)=>{
            if(res){
                entryauth=false;
            }else{
                wrongpass=true;
            }
        })
    }
    function redir(url: string){
        redirect.url = url;
        redirauth.allow = true;
        goto("/redirect", {invalidateAll: true});
    }
    if(redirauth.allow){
        entryauth = false;
        redirauth.allow = false;
    }
    function settings(){
        boardexport.boardata = boardata;
        goto('/'+params.boardname+'/settings');
    }
</script>

{#if entryauth && boardata.entrypass!=""}
    <div class="flex flex-col items-center p-5">
        <p class="text-xl">
            Enter password to enter /<strong>{params.boardname}</strong>:
        </p>
        <input type="password" class="input my-3 sm:w-[80vw] md:w-[50vw] border" bind:value={entryinput}/>
        <button type="button" class="btn preset-filled-success-500" onclick={checkpass}>Enter</button><br>
        {#if wrongpass}
            Incorrect Password
        {/if}
    </div>
{:else}
    <div class="flex w-full">
    <div class="flex-col p-5">
        <p class="text-3xl pt-5">{boardata.title}</p>
        <p class="text-xl">{layouturl.url}</p>
        <div class="flex pt-2">
            <button type="button" class="btn preset-filled-primary-500 mr-5" onclick={() => info = !info}>
                {#if info}
                    Hide Info
                {:else}
                    View Info
                {/if}
            </button>
                {#if boardata.adminpass!=""}
                    <button type="button" class="btn bg-surface-700" onclick={settings}>Settings</button>
                {/if}
        </div>
        {#if info}
            <div class="text-lg">
                {#if boardata.description != ""}
                    <p class="text-xl">Description: {boardata.description}</p>
                {/if}
                <p>Established: {new Date(boardata.established).toLocaleString()}</p>
                <p>Last Active: {new Date(boardata.lastactive).toLocaleString()}</p>
                <p>Live Threads: {boardata.threadcount}/{boardata.maxthreads}</p>
                <p>Thread Images: <input class="checkbox" type="checkbox" checked={boardata.threadimages} disabled></p>
                <p>Reply Images: <input class="checkbox" type="checkbox" checked={boardata.replyimages} disabled></p>
                <p>Leaderboard: <input class="checkbox" type="checkbox" checked={boardata.leaderboard} disabled></p>
                <p>Bogo: <input class="checkbox" type="checkbox" checked={boardata.bogo} disabled></p>
            </div>
        {/if}
    </div>
    </div>
    
    <div class="flex p-5 justify-evenly">
        <button type="button" class="btn btn-lg preset-filled-secondary-500" onclick={()=>redir('/'+params.boardname)}>Live</button>
        <button type="button" class="btn btn-lg bg-warning-700" onclick={()=>redir('/'+params.boardname+'/a')}>Archive</button>
    </div>
    <div class="px-3 sm:px-10"><hr class="border-2 rounded-lg"></div>
    {@render children?.()}
{/if}
