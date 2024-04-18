<script lang="ts">
    import { returl, postdataexport, boardataexport, tabdata } from "$lib/store";
    import { goto } from "$app/navigation";
	import bcrypt from 'bcryptjs';
    import { enhance } from "$app/forms";
	import { page } from "$app/stores";
    import Replybox from "../../../../../components/boxes/replybox.svelte";
    let errormsg = "";
    let contentinput = "";
    let numofboxes = 1;
    function boxes(){
        if (contentinput.length > 666){
            numofboxes = 3;
        }else if (contentinput.length > 333){
            numofboxes = 2;
        }
        else {
            numofboxes = 1;
        }
    }
    let fileinp: FileList;
    let layer: number = ($postdataexport.layer) + 1;

    tabdata.set({
        boardname: $page.params.boardname,
        threadid: $page.params.thread,
        postnum: $page.params.post,
        archive: false
    });
    let inpass = "";
    let replypass = $boardataexport.replypass;
    let wrongpass = false;

    function checkpass(){
        bcrypt.compare(inpass, replypass).then((res) => {
            if (res){
                replypass = "";
            }else{
                wrongpass = true;
            }
        })
    }
</script>
{#if replypass}
    <p>Enter reply password</p>
    <input type="password" bind:value={inpass}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={checkpass}>Enter</p>
    {#if wrongpass}
        <p class="text-xl">Incorrect password</p>
    {/if}
    <br>
    <p role="button" on:click={()=>goto("/"+$page.params.boardname+"/"+$page.params.thread+"/"+$page.params.post)}>Return</p>
{:else}
    <div class="w-screen h-[200vh] m-1">
        <form method="POST" enctype="multipart/form-data" use:enhance={({cancel})=>{
            
            if(contentinput.length == 0){
                errormsg = "Please type something";
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
                    errormsg = "Invalid File type";
                    cancel();
                }
                if(fileinp[0].size > 6000000){
                    errormsg = "fileinp[0].size > 6000000";
                    cancel();
                }
            };
            
            return async({result})=>{
                switch (result.type){
                    case "success":
                        returl.set("safe")
                        // console.log(result.data?.data);
                        
                        goto("/"+$page.params.boardname+"/"+$page.params.thread+"/"+result.data?.data, {invalidateAll: true});
                }
            }
        }}>
            <p class="text-xl">You are replying to</p>
            <div class="w-min">
                <Replybox boardname = {$page.params.boardname} threadid = {$page.params.thread} postdata = {$postdataexport} />
            </div>
            {errormsg}<br>
            Content: <br>
            <textarea class="resize w-1/2 h-4/6" name="content" bind:value={contentinput} on:input={boxes} maxlength=999></textarea><br>
            {contentinput.length}/999<br>
            Boxes: {numofboxes} <br><br>
            {#if ($boardataexport.boardtype == "Special" || $boardataexport.boardtype == "Private" )}
                Image: <br>
                <input type="file" name="fileinp" accept="image/*" bind:files={fileinp}/><br>
                jpg/png/webp only, 6MB limit<br>
                <input type="checkbox" name="nsfw"> Mark as NSFW<br><br>
            {/if}
            <button role="button" class="w-min bg-red-900">Post</button><br>
            please remember what you typed out on the home page and what the alternatives to medianon are. <br>
            <input type="hidden" name="layer" value={layer}>
        </form>

    </div>
{/if}
