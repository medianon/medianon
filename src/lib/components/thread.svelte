<script lang="ts">
    import type { threadatatype, subscription } from "$lib/index.svelte";
    import { redirect, threadexport, subscriptions, redirauth, menu, history, images, nsfw } from "$lib/index.svelte";
    import { goto } from "$app/navigation";
    const { boardname, archive, threadid, threadata, bogo } = $props<{
        boardname: string,
        archive: boolean,
        threadid: string,
        threadata: threadatatype,
        bogo: boolean
    }>();
    let subscribed = $state(false);
    let index = subscriptions.feed.findIndex((item) => 
        item.boardname == boardname && item.threadid == threadid
    );
    if (index > -1){
        subscribed = true;
    }
    function subscribe(){
        if (!subscribed){
            subscribed = !subscribed;
            subscriptions.feed.push({
                boardname: boardname,
                threadid: threadid,
                threadata: threadata,
                archive: archive
            });
        } else {
            subscribed = !subscribed;
            let index = subscriptions.feed.findIndex((item) => 
            item.boardname == boardname && item.threadid == threadid
            );
            if (index > -1){
                subscriptions.feed.splice(index, 1);
            }
        }

    }
    let url = $state("");
    if(archive){
        url = "/"+boardname+"/a/"+threadid;
    }else{
        url = "/"+boardname+"/"+threadid
    }
    function redir(){
        redirect.url = url;
        if(bogo){
            redirauth.allow=false;
        } else {
            redirauth.allow = true;
        }
        menu.show = false;
        let add = true;
        history.posts.forEach((post)=>{
            if (
                post.type == "thread" &&
                post.boardname == boardname &&
                post.threadid == threadid
            ){
                add = false;
            }
        });
        if(add){
            history.posts.push({
                boardname: boardname,
                archive: archive,
                threadid: threadid,
                type: "thread",
                postdata: threadata as threadatatype
            });
        }
        if (history.posts.length > 10){
            history.posts.splice(0, 1);
        }
        goto('/redirect');
    }
    function opreply(){
        threadexport.threadata = threadata;
        goto('/'+boardname+'/'+threadid+'/opreply');
    }
    let showimage = $state(false);
    if(nsfw.show && (threadata.report != 4)){
        showimage = true;
    }else if(images.show && ((threadata.report == 0) || (threadata.report == 2))){
        showimage = true;
    }
    function report(){
        threadexport.threadata = threadata;
        goto('/'+boardname+'/'+threadid+'/report');
    }
</script>

<div class="flex-col border-4 border-secondary-800 rounded w-full overflow-y-scroll sm:w-[80vw] md:w-[70vw] lg:w-[60vw] min-h-fit m-5 p-3 no-scrollbar">
    {#if threadata.url != ""}
        <div class="flex flex-col p-2 w-full h-fit border">
        {#if threadata.report == 4}
        Reported
        {:else}
        {#if showimage}
        <button type="button" onclick={()=>{showimage=!showimage}}>
            <img src={threadata.url} alt="Thread" class="max-h-full max-w-full"/>
        </button>
        {/if}
            <div class="flex w-full justify-between items-center mb-1">
                <button type="button" onclick={()=>{showimage=!showimage}}>
                <div class="flex flex-col">
                        {#if (threadata.report == 1) || (threadata.report == 3)}
                        <p class="text-xl text-red-600">!</p>
                        {/if}
                        <p class="my-5">{threadata.filename}</p>
                </div>
                </button>
                <div class="flex flex-col items-center">
                    <a href={threadata.url} target="_blank">
                        <button type="button" class="btn bg-primary-700 mb-2">New Tab</button>
                    </a>
                    {#if threadata.report < 2}
                        <button type="button" class="btn bg-error-700" onclick={report}>Report</button>
                    {/if}
                </div>
            </div>
            
        {/if}
        </div>
    {/if}
    <button type="button" class="flex-col overflow-auto max-h-[30vh] w-full text-left py-3 focus:outline-none" onclick={redir}>
            <p class="text-2xl text-center">
                {threadata.title}
            </p>
            <p class="text-lg">
                {threadata.content}
            </p>
    </button>
    <div class="mx-3"><hr class="border-2 border-secondary-600 rounded"></div>
        <div class="text-lg flex w-full justify-between mt-1">
            <p>{url}</p>
            <p>
                Replies: {threadata.replies}
            </p>
        </div>
        <p>
            Posted: {new Date(threadata.made).toLocaleString()}
        </p>
        {#if archive}
            <p class="pb-2 text-error-700">
                Deleted: {new Date(threadata.archivedeltime).toLocaleString()}
            </p>
        {:else}
            <p class="pb-2 text-warning-600">
                Archived: {new Date(threadata.archivetime).toLocaleString()}
            </p>
        {/if}
        <div class="flex justify-evenly my-1">
            {#if !archive}
                <button type="button" class="btn bg-secondary-500" onclick={opreply}>Reply</button>
            {/if}
            <button type="button" onclick={subscribe}>
                {#if !menu.show}
                {#if subscribed}
                    <div class="bg-[#293947] btn">
                        Unsubscribe
                    </div>
                {:else}
                     <div class="btn preset-filled-primary-500">
                        Subscribe
                     </div>
                {/if}
                {/if}
                <div></div>
            </button>
        </div>
</div>