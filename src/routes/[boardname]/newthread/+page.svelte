<script lang="ts">
    import type { PageProps } from "./$types";
    import type { boardatatype } from "$lib/index.svelte";
    import { redirauth, redirect, tabs } from "$lib/index.svelte";
    import bcrypt from "bcryptjs";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    let { data, params }: PageProps = $props();
    let boardata: boardatatype = data.boardata as boardatatype;
    tabs.location='/'+params.boardname;
    ()=>{
        tabs.preview=boardata.title;
    }
    let threadinput = $state("");
    let threadauth = $state(false);
    let wrongpass = $state(false);
    function checkpass(){
        bcrypt.compare(threadinput, boardata.threadpass).then((res)=>{
            if(res){
                threadauth=true;
            }else{
                wrongpass=true;
            }
        })
    }
    let title = $state("");
    let content = $state("");
    let errmsg = $state("");
    let fileinp: FileList = $state() as FileList;
</script>

{#if (boardata.threadpass!="") && !threadauth}
    <div class="text-center text-lg flex-col justify-items-center p-5">
        Enter thread password:
        <input type="password" class="input w-1/2" bind:value={threadinput}/><br>
        <div class="flex w-full justify-evenly">
            <button type="button" class="btn preset-filled-success-500" onclick={checkpass}>Enter</button>
            <button type="button" class="btn preset-filled-error-500" onclick={()=>{goto('/'+params.boardname)}}>Cancel</button>
        </div> <br>
        {#if wrongpass}
            Incorrect Password <br>
        {/if}
    </div>
{:else}
    <div class="flex-col text-xl px-5 text-center">
        <p class="text-2xl p-5">
            Create a new thread in <strong>{params.boardname}</strong>:
        </p>
        <form method="POST" enctype="multipart/form-data" use:enhance={async({cancel})=>{
                if(title=="" && content==""){
                    errmsg="Title and content cannot both be empty.";
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
                            redirect.url = "/"+params.boardname;
                            redirauth.allow = true;
                            goto("/redirect");
                        }
                    }
                }}>
            Title ({title.length}/50)<br>
            <input type="text" name="title" class="input" maxlength=50 bind:value={title}><br>
            Content ({content.length}/999)<br>
            <textarea name="content" class="textarea h-48" maxlength=999 bind:value={content} placeholder="i can be resized"></textarea>
            {errmsg} <br>
            {#if boardata.threadimages}
                Image: <br>
                <div class="flex max-w-fit justify-items-center overflow-clip border">
                    <input type="file" name="fileinp" accept="image/*" bind:files={fileinp}/><br>
                </div>
                jpg/png/webp only, 6MB limit<br>
                <input type="checkbox" name="nsfw" class="checkbox border"> Mark as NSFW<br><br>
            {/if}
            <button type="submit" class="btn btn-lg preset-filled-success-500">Create</button>
        </form>
        <button type="button" class="btn btn-lg bg-error-600 my-5" onclick={()=>{goto('/'+params.boardname)}}>Cancel</button>

    </div>

{/if}