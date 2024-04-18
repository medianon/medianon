<script lang="ts">
    import { returl, boardataexport, tabdata } from "$lib/store";
    import { goto } from "$app/navigation";
	import bcrypt from 'bcryptjs';
    import { enhance } from "$app/forms";
	import { page } from "$app/stores";
    let errormsg = "";
    let contentinput = "";
    let titleinput = "";
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

    tabdata.set({
        boardname: $page.params.boardname,
        threadid: "",
        postnum: "",
        archive: false
    });

    let inpass = "";
    let threadpass = $boardataexport.threadpass;
    let wrongpass = false;

    function checkpass(){
        bcrypt.compare(inpass, threadpass).then((res) => {
            if (res){
                threadpass = "";
            }else{
                wrongpass = true;
            }
        })
    }
</script>
{#if threadpass}
    <p>Enter thread password</p>
    <input type="password" bind:value={inpass}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={checkpass}>Enter</p>
    {#if wrongpass}
        <p class="text-xl">Incorrect password</p>
    {/if}
    <br>
    <p role="button" on:click={()=>goto("/"+$page.params.boardname)}>Return</p>
{:else}
    <div class="w-screen h-[200vh] m-1">
        <form method="POST" enctype="multipart/form-data" use:enhance={({cancel})=>{
            // const fileinp = formData.get("fileinp");
            // console.log(fileinp);
            
            if(titleinput.length == 0 && contentinput.length == 0){
                errormsg = "Title and content cannot both be empty";
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
                        goto("/"+$page.params.boardname, {invalidateAll: true});
                    }
                }
            }}>
            {errormsg}<br>
            Title: <br>
            <input class="w-96" type="text" name="title" maxlength=50 bind:value={titleinput}><br>
            {titleinput.length}/50 <br><br>
            Content: <br>
            <textarea class="resize w-1/2 h-4/6" name="content" bind:value={contentinput} on:input={boxes} maxlength=999></textarea><br>
            {contentinput.length}/999<br>
            Boxes: {numofboxes} <br><br>
            <!-- {#if ($boardataexport.boardtype == "Special" || $boardataexport.boardtype == "Private" || $boardataexport.boardtype == "Public")} -->
            {#if ($boardataexport.boardtype == "Special" || $boardataexport.boardtype == "Private")}
                Image: <br>
                <input type="file" name="fileinp" accept="image/*" bind:files={fileinp}/><br>
                jpg/png/webp only, 6MB limit<br>
                <input type="checkbox" name="nsfw"> Mark as NSFW<br><br>
            {/if}
            <button role="button" class="w-min bg-red-900">Post</button><br>
            please remember what you typed out on the home page and what the alternatives to medianon are. <br>
        </form>
        
    </div>

{/if}