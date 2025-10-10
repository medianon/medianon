<script lang="ts">
	import { goto } from "$app/navigation";
    import type { bookmark, replydatatype } from "$lib/index.svelte";
    import { menu, redirauth, redirect, replyexport, history, bookmarks, images, nsfw } from "$lib/index.svelte";
    const {boardname, archive, threadid, replydata, bogo} = $props<{
        boardname: string,
        archive: boolean,
        threadid: string,
        replydata: replydatatype,
        bogo: boolean
    }>();
    let url = $state("");
    if(archive){
        url = "/"+boardname+"/a/"+threadid+"/"+replydata.replynum;
    }else{
        url = "/"+boardname+"/"+threadid+"/"+replydata.replynum;
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
                post.type == "reply" &&
                post.boardname == boardname &&
                (post.postdata as replydatatype).replynum == replydata.replynum
            ){
                add = false;
            }
        });
        if(add){
            history.posts.push({
                boardname: boardname,
                archive: archive,
                threadid: threadid,
                type: "reply",
                postdata: replydata as replydatatype
            });
        }
        if (history.posts.length > 10){
            history.posts.splice(0, 1);
        }
        goto('/redirect');
    }
    function newreply(){
        replyexport.replydata = replydata;
        goto('/'+boardname+'/'+threadid+'/'+replydata.replynum+'/newreply');
    }
    let preview = replydata.content;
    if(preview.length>10){
        preview=preview.slice(0, 10)+'...';
    }
    let bookmarkobj: bookmark = {
        boardname: boardname,
        archive: archive,
        threadid: threadid,
        replynum: replydata.replynum.toString(),
        preview: preview
    };
    let bookmarked = $derived.by(()=>{
        let found = false;
        bookmarks.list.forEach((item)=>{
            if(item.boardname == bookmarkobj.boardname && item.replynum == bookmarkobj.replynum && item.archive == bookmarkobj.archive){
                found = true;
                return found;
            }
        })
        return found;
    });
    function addbookmark(){
        bookmarks.list.push(bookmarkobj);
    }
    let showimage = $state(false);
    if(nsfw.show && (replydata.report != 4)){
        showimage = true;
    }else if(images.show && ((replydata.report == 0) || (replydata.report == 2))){
        showimage = true;
    }
    function report(){
        replyexport.replydata = replydata;
        goto('/'+boardname+'/'+threadid+'/'+replydata.replynum+'/report');
    }
</script>

<div class="flex-col border-4 border-primary-400 rounded w-full sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-h-fit m-5 p-3">
    {#if replydata.url != ""}
        <div class="flex flex-col p-2 w-full h-fit border">
        {#if replydata.report == 4}
        Reported
        {:else}
            <div class="flex w-full justify-between items-center mb-1">
                <div class="flex flex-col">
                    <button type="button" onclick={()=>{showimage=!showimage}}>
                        {#if (replydata.report == 1) || (replydata.report == 3)}
                        <p class="text-xl text-red-600">!</p>
                        {/if}
                        <p class="my-5">{replydata.filename}</p>
                    </button>
                </div>
                <div class="flex flex-col">
                    <a href={replydata.url} target="_blank">
                        <button type="button" class="btn bg-primary-700 mb-2">New Tab</button>
                    </a>
                    {#if replydata.report < 2}
                        <button type="button" class="btn bg-error-700" onclick={report}>Report</button>
                    {/if}
                </div>
            </div>
            {#if showimage}
                <button type="button" onclick={()=>{showimage=!showimage}}>
                    <img src={replydata.url} alt="Thread" class="max-h-full max-w-full"/>
                </button>
            {/if}
        {/if}
        </div>
    {/if}
        <button type="button" class="overflow-auto max-h-[20vh] text-left min-w-full focus:outline-none" onclick={redir}>
            <p class="text-xl p-3">
                {replydata.content}
            </p>
        </button>
    <div class="mx-3"><hr class="border-2 border-primary-600 rounded"></div>
    <div class="text-lg flex w-full justify-between mt-1">
        <p>{url}</p>
        <p>
            Replies: {replydata.replies}
        </p>
    </div>
        <p>
            Posted: {new Date(replydata.made).toLocaleString()}
        </p>
    <div class="flex justify-evenly my-1">
        {#if !archive}
            <button type="button" class="btn bg-secondary-500" onclick={newreply}>Reply</button>
        {/if}
        {#if bookmarked}
            <button type="button" class="btn bg-[#293947]">Bookmarked</button>
        {:else}
            <button type="button" class="btn preset-filled-primary-500" onclick={addbookmark}>Bookmark</button>
        {/if}
    </div>
</div>