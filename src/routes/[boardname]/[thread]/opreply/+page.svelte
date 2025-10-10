<script lang="ts">
    import type { PageProps } from "./$types";
    import type { boardatatype, threadatatype } from "$lib/index.svelte";
    import { redirect, threadexport, layouturl, tabs, redirauth } from "$lib/index.svelte";
    import { goto } from "$app/navigation";
    import bcrypt from "bcryptjs";
    import { enhance } from "$app/forms";
	import Thread from "$lib/components/thread.svelte";
    let {data, params}: PageProps = $props();
    layouturl.url = "/"+params.boardname+"/"+params.thread;
    tabs.location='/'+params.boardname+'/'+params.thread;
    if(threadexport.threadata.title.length>10){
        tabs.preview=threadexport.threadata.title.slice(0, 10)+'...';
    }else{
        tabs.preview=threadexport.threadata.title;
    }
    let boardata: boardatatype = $state({}) as boardatatype;
    if(data.boardata){
        boardata = data.boardata;
    }
    // let threadata: threadatatype = $state({}) as threadatatype;
    let replyinput = $state("");
    let replyauth = $state(false);
    let wrongpass = $state(false);
    function checkpass(){
        bcrypt.compare(replyinput, boardata.replypass).then((res)=>{
            if(res){
                replyauth=true;
            }else{
                wrongpass=true;
            }
        })
    }
    let content = $state("");
    let errmsg = $state("");
    let fileinp: FileList = $state() as FileList;
</script>

{#if (boardata.replypass != "") && !replyauth}
    <div class="text-center text-lg flex-col justify-items-center p-5">
        Enter reply password:
        <input type="password" class="input border" bind:value={replyinput}/><br>
        <div class="flex w-full justify-evenly">
            <button type="button" class="btn preset-filled-success-500" onclick={checkpass}>Enter</button>
            <button type="button" class="btn preset-filled-error-500">Cancel</button>
        </div> <br>
        {#if wrongpass}
            Incorrect Password <br>
        {/if}
    </div>
{:else}

    <p class="text-2xl p-5 text-center">
        Reply to this thread:
    </p>
    <div class="flex w-full justify-center">
        <Thread boardname={params.boardname} threadid={params.thread} threadata={threadexport.threadata} archive={false} bogo={false}></Thread>
    </div>
    <div class="flex-col text-xl p-5 text-center">
        <form method="POST" enctype="multipart/form-data" use:enhance={async({cancel})=>{
                if(content==""){
                    errmsg="Type something.";
                    cancel();
                }
                if(fileinp?.length>0){
                    let filecheck = true;
                    const validtypes = ["jpg", "jpeg", "png", "webp"];
                    for(let i = 0; i < validtypes.length; i++){
                        if (fileinp[0].type.endsWith(validtypes[i])){
                            filecheck = false;
                            break;
                        }
                    }
                    if(filecheck){
                        errmsg = "Invalid File type";
                        cancel();
                    }
                    if(fileinp[0].size > 6000000){
                        errmsg = "File Size exceeds 6MB";
                        cancel();
                    }
                };
                return async({result})=>{
                    switch (result.type){
                        case "success":
                            redirect.url = "/"+params.boardname+'/'+params.thread;
                            redirauth.allow = true;
                            goto("/redirect");
                        }
                    }
                }}>
            Content ({content.length}/999)<br>
            <textarea name="content" class="textarea h-48 border" maxlength=999 bind:value={content} placeholder="i can be resized"></textarea>
            {errmsg} <br>
            {#if boardata.replyimages}
                Image: <br>
                <div class="flex max-w-fit justify-items-center overflow-clip border">
                    <input type="file" name="fileinp" accept="image/*" bind:files={fileinp}/><br>
                </div>
                jpg/png/webp only, 6MB limit<br>
                <input type="checkbox" name="nsfw" class="checkbox border"> Mark as NSFW<br><br>
            {/if}
            <button type="submit" class="btn btn-lg preset-filled-success-500">Create</button>
        </form>
        <button type="button" class="btn btn-lg bg-error-600 my-5" onclick={()=>{goto('/'+params.boardname+'/'+params.thread)}}>Cancel</button>

    </div>
{/if}