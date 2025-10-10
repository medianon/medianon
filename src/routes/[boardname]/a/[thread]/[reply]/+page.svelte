<script lang="ts">
    import type { PageProps } from "./$types";
    import type { threadatatype, replydatatype } from "$lib/index.svelte";
    import { threadexport, layouturl, tabs, bookmarks, markhist, history } from "$lib/index.svelte";
    import { goto } from "$app/navigation";
    import Thread from "$lib/components/thread.svelte";
    import Reply from "$lib/components/reply.svelte";
    import Bookmarks from "$lib/components/bookmarks.svelte";

    let {data, params}: PageProps = $props();
    let threadata: threadatatype = data.threadata as threadatatype;
    let currentreply: replydatatype = data.currentreply as replydatatype;
    let replies: replydatatype[] = data.replies as replydatatype[];
    layouturl.url = "/"+params.boardname+"/a/"+params.thread+"/"+params.reply;
    tabs.location='/'+params.boardname+'/a/'+params.thread+'/'+params.reply;
    if(currentreply.content.length>10){
        tabs.preview=currentreply.content.slice(0, 10)+'...';
    }else{
        tabs.preview=currentreply.content;
    }

    let previousreply: replydatatype = $state({}) as replydatatype;
    let currentlayer: replydatatype[] = $state([]) as replydatatype[];
    let nextlayer: replydatatype[] = $state([]) as replydatatype[];
    
    replies.forEach(reply=>{
        if(reply.replynum == currentreply.parent && currentreply.layer>1){
            previousreply = reply;
        } else if (reply.layer == currentreply.layer && reply.replynum != currentreply.replynum){
            currentlayer.push(reply);
        } else if (reply.layer == (currentreply.layer+1) && reply.parent == currentreply.replynum){
            nextlayer.push(reply);
        }
    });
    currentlayer.sort((a, b) => (a.made > b.made)? 1 : -1);
    nextlayer.sort((a, b) => (a.made > b.made)? 1 : -1);

    let showcurrentlayer = $state(false);
    function togglecurrentlayer(){
        showcurrentlayer = !showcurrentlayer;
    }

    let backtrack: replydatatype[] = $state([]) as replydatatype[];
    let showtrail = $state(false);
    function togglebacktrack(){
        showtrail = !showtrail;
        if (backtrack.length < 1){
            findtrail((currentreply.layer - 1), currentreply.parent)
        }
    }

    function findtrail(prevlayer: number, currentparent: number){
        if (prevlayer == 1){
            replies.forEach(reply => {
                if (reply.replynum == currentparent){
                    backtrack.push(reply);
                    backtrack.reverse();
                    return;
                }
            })
        } else {
            replies.forEach(reply => {
                if (reply.replynum == currentparent){
                    backtrack.push(reply);
                    findtrail((prevlayer - 1), reply.parent);
                }
            })
        }
    }
    if(markhist.add){
        let add = true;
        history.posts.forEach((post)=>{
            if (
                post.type == "reply" &&
                post.boardname == params.boardname &&
                (post.postdata as replydatatype).replynum == currentreply.replynum
            ){
                add = false;
            }
        });
        if(add){
            history.posts.push({
                boardname: params.boardname,
                archive: false,
                threadid: params.thread,
                type: "reply",
                postdata: currentreply as replydatatype
            });
        }
        if (history.posts.length > 10){
            history.posts.splice(0, 1);
        }
        markhist.add = false;
    }
</script>

<div class="flex justify-evenly items-center p-5">
    {#if currentreply.layer>1}
        <button type="button" class="btn btn-lg preset-filled-primary-500 mt-3" onclick={togglebacktrack}>
            {#if showtrail}
                Return
            {:else}
                Backtrack
            {/if}
        </button>
    {/if}
    <Bookmarks boardname={params.boardname} threadid={params.thread} archive={true}></Bookmarks>
</div>

{#if showtrail}
    <div class="flex w-full justify-center">
        <Thread boardname={params.boardname} threadid={params.thread} archive={true} threadata={threadata} bogo={false}></Thread>
    </div>
    {#each backtrack as reply}
        <div class="flex flex-col items-center">
            <p class="text-6xl text-center">
                &#8595;
            </p>
            <p class="text-xl">
                Layer {reply.layer}
            </p>
        </div>
        <div class="flex w-full justify-center">
            <Reply boardname={params.boardname} threadid={params.thread} replydata={reply} archive={true} bogo={false}></Reply>
        </div>
    {/each}
{:else}
    {#if currentreply.layer==1}
        <div class="flex w-full justify-center">
            <Thread boardname={params.boardname} threadid={params.thread} archive={true} threadata={threadata} bogo={false}></Thread>
        </div>
    {:else}
        <div class="flex w-full justify-center">
            <Reply boardname={params.boardname} threadid={params.thread} archive={true} replydata={previousreply} bogo={false}></Reply>
        </div>
    {/if}
{/if}

<div class="m-5"><hr class="rounded border"></div>

<div class="flex w-full items-center justify-center overflow-x-scroll overflow-y-hidden no-scrollbar">
    {#if showcurrentlayer}
        <div class="sm:w-[12vw] md:w-[15vw] lg:w-[21vw]"></div>
    {/if}

    <div class="flex flex-col items-center mx-3">
        <p class="text-6xl">
            &#8595;
        </p>
        {#if currentlayer.length > 0}
            <button type="button" class="btn btn-lg bg-error-950 mr-3" onclick={togglecurrentlayer}>
                {#if showcurrentlayer}
                Hide
                {:else}
                Show Layer {currentreply.layer}
                {/if}
            </button>
        {:else}
            <p class="text-xl">
                Layer {currentreply.layer}
            </p>
        {/if}
    </div>

    {#if showcurrentlayer}
        <div class="flex flex-col items-center overflow-y-scroll overflow-x-hidden max-h-[40vh] w-full mx-3">
            {#each currentlayer as reply}
                <Reply boardname={params.boardname} archive={true} threadid={params.thread} replydata={reply} bogo={false}/>
            {/each}
        </div>
    {/if}

</div>

<div class="flex w-full justify-center">
    <Reply boardname={params.boardname} threadid={params.thread} archive={true} replydata={currentreply} bogo={false}></Reply>
</div>

<div class="m-5"><hr class="rounded border"></div>

{#if nextlayer.length>0}
    <div class="flex flex-col items-center">
        <p class="text-6xl">
            &#8595;
        </p>
        <p class="text-xl">Layer {(currentreply.layer+1).toString()}</p>
    </div>
    <div class="flex overflow-y-scroll flex-col max-h-[50vh]">
        {#each nextlayer as reply}
            <div class="flex w-full justify-center">
                <Reply boardname={params.boardname} threadid={params.thread} replydata={reply} archive={true} bogo={false}></Reply>
            </div>
        {/each}
    </div>
{/if}