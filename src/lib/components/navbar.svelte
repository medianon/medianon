<script lang="ts">
	import { enhance } from '$app/forms';
	import Thread from '$lib/components/thread.svelte';
    import logo from '$lib/assets/logo_erikasbuero.png';
    import type { replydatatype, threadatatype } from '$lib/index.svelte';
	import { menu, redirauth, redirect, subscriptions, tabs, history, session, images, nsfw } from '$lib/index.svelte';
	import { goto } from '$app/navigation';
	import Reply from './reply.svelte';
    function unsubscribe(){
        subscriptions.feed.splice(0);
    }
    function newtab(){
        tabs.list.push({url: tabs.location, preview: tabs.preview});
    }
    function cleartabs(){
        tabs.list.splice(0);
    }
    function clearhistory(){
        history.posts.splice(0);
    }
    let showsubs = $state(false);
    let showhistory = $state(false);
    function home(){
        goto('/');
        menu.show=false;
    }
    function saferedir(url: string){
        redirect.url = url;
        redirauth.allow = true;
        menu.show=!menu.show;
        goto('/redirect');
    }    
    function redir(url: string){
        redirect.url = url;
        menu.show=!menu.show;
        goto('/redirect');
    }
    function closetab(index: number){
        tabs.list.splice(index, 1);
    }
</script>

<div class="flex w-full justify-between relative">
    <a href="/">
        <img src={logo} alt="Logo" class="pt-1 pl-2">
    </a>
    {#if menu.show}
        <button aria-label="Menu" type="button" class="fixed right-3 top-6 z-50" onclick={()=>{menu.show=!menu.show}}>
            <div class="w-full flex">
                <div class="h-2 w-12 bg-error-950 border border-surface-800 rotate-45 absolute">
                </div>
                <div class="h-2 w-12 bg-error-950 border border-surface-800 -rotate-45">
                </div>
            </div>
        
        </button>
    {:else}
        <button aria-label="Menu" type="button" class="fixed right-3 top-2 z-50" onclick={()=>{menu.show=!menu.show}}>
        
        <div class="h-2 w-11 bg-error-950 border border-surface-800"></div>
        <div class="h-[10px]"></div>
        <div class="h-2 w-11 bg-error-950 border border-surface-800"></div>
        <div class="h-[10px]"></div>
        <div class="h-2 w-11 bg-error-950 border border-surface-800"></div>
    </button>
    {/if}


</div>

{#if menu.show}
    <div class="w-full h-screen flex-col overflow-y-scroll fixed top-0 bg-surface-500 z-40">
        <div class="flex">
            <button onclick={home}>
                <img src={logo} alt="Logo" class="pt-1 pl-2">
            </button>
        </div>
<!-- tabs -->
        <div class="flex max-w-full items-center justify-evenly m-3 p-2 overflow-x-scroll overflow-y-hidden no-scrollbar">
            <div class="flex flex-col items-center mr-5">
                <div class="flex-col rounded-xl border-2 bg-primary-900 mx-3">
                    <p class="text-xl text-center m-2"><strong>{tabs.location}</strong></p>
                    <p class="m-2">{tabs.preview}</p>
                </div>
                <button type="button" class="btn bg-[#293947] text-lg my-1" onclick={newtab}>New Tab</button>
                {#if tabs.list.length>1}
                    <button type="button" class="btn bg-error-600" onclick={cleartabs}>Clear</button>
                {/if}
            </div>
            <div class="flex flex-col overflow-y-scroll max-h-[15vh] min-w-fit no-scrollbar">
                {#each tabs.list as tab, index}
                <div class="flex items-center">
                    <div class="flex-col rounded-xl border-2 bg-primary-900 mb-1 mr-1">
                        <button type="button" class="flex-col" onclick={()=>saferedir(tab.url)}>
                            <p class="text-xl text-center m-2"><strong>{tab.url}</strong></p>
                            <p class="m-2 truncate">{tab.preview}</p>
                        </button>
                    </div>
                    <button type="button" class="btn bg-error-600 text-2xl" onclick={()=>closetab(index)}>X</button>
                </div>
                {/each}
            </div>
        </div>
<!-- subscriptions -->
        <div class="flex flex-col justify-center m-5 py-2 items-center border-2 rounded border-[#293947]">
            <p class="text-xl">Subscriptions</p>
            {#if showsubs}
                <div class="flex flex-col items-center overflow-y-scroll overflow-x-hidden max-h-[50vh] px-3">
                    {#each subscriptions.feed as item}
                    <Thread boardname={item.boardname} threadid={item.threadid} threadata={item.threadata} archive={item.archive} bogo={false}></Thread>
                    {/each}
                </div>
            {/if}
            {#if subscriptions.feed.length>0}
            <div class="flex w-full justify-evenly my-3">
                <button type="button" class="btn preset-filled-primary-300-700" onclick={()=>{showsubs=!showsubs}}>
                    {#if showsubs}
                        Hide
                    {:else}
                        Show
                    {/if}
                </button>
                <button type="button" class="btn bg-error-600" onclick={unsubscribe}>Clear</button>
            </div>
            {/if}
        </div>
<!-- post history -->
        <div class="flex flex-col justify-center m-5 py-2 items-center border-2 rounded border-[#293947]">
            <p class="text-xl">Post History</p>
            {#if showhistory}
                <div class="flex flex-col items-center overflow-y-scroll overflow-x-hidden max-h-[50vh] px-3">
                    {#each history.posts as item}
                        {#if item.type == "thread"}
                            <Thread boardname={item.boardname} threadid={item.threadid} threadata={item.postdata as threadatatype} archive={item.archive} bogo={false}></Thread>
                        {:else if item.type == "reply"}
                            <Reply boardname={item.boardname} threadid={item.threadid} replydata={item.postdata as replydatatype} archive={item.archive} bogo={false}></Reply>
                        {/if}
                    {/each}
                </div>
            {/if}
            {#if history.posts.length>0}
            <div class="flex w-full justify-evenly my-3">
                <button type="button" class="btn preset-filled-primary-300-700" onclick={()=>{showhistory=!showhistory}}>
                    {#if showhistory}
                        Hide
                    {:else}
                        Show
                    {/if}
                </button>
                <button type="button" class="btn bg-error-600" onclick={clearhistory}>Clear</button>
            </div>
            {/if}
        </div>
<!-- misc -->
        <div class="flex w-full justify-evenly my-5">
            <button type="button" class="btn preset-filled-secondary-500" onclick={()=>{redir('/about')}}>About</button>
            <button type="button" class="btn preset-filled-primary-500" onclick={()=>{redir('/leaderboard')}}>Leaderboards</button>
            <button type="button" class="btn bg-green-900" onclick={()=>{redir('/bogo')}}>Bogo Search</button>
        </div>

        <p class="m-3">
            Session started on: <br>
            {session.start}
        </p>
        <div class="p-2">
            Show images: <input type="checkbox" class="checkbox border" defaultChecked={images.show} onchange={()=>{images.show=!images.show}}> <br>
            Including NSFW: <input type="checkbox" class="checkbox border" defaultChecked={nsfw.show} onchange={()=>{nsfw.show=!nsfw.show}}>
        </div>
    </div>
{/if}
