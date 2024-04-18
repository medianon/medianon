<script lang="ts">
	import { enhance } from '$app/forms';
    import { postdataexport, reportarchive, returl, tabdata } from "$lib/store";
    import { goto } from '$app/navigation';
    import { page } from "$app/stores";
    let imgjson = {
        filename: $postdataexport.filename,
        url: $postdataexport.url
    }
    let imgstr = JSON.stringify(imgjson);
    let showimage = false;
    function toggleimage(){
        showimage = !showimage;
    }
    
    tabdata.set({
        boardname: $page.params.boardname,
        threadid: $page.params.thread,
        postnum: $page.params.post,
        archive: false
    });
</script>

<div>
    You are about to report the image attached to the post <strong>{$page.params.boardname}{#if $reportarchive}/a{/if}/{$page.params.thread}/{$postdataexport.postnum}</strong><br>
    <p role="button" on:click={toggleimage}>
        {#if showimage}
            Hide
        {:else}
            View image
        {/if}
    </p>
    {#if showimage}
    <img class="m-9 w-1/2" src={$postdataexport.url} alt={$postdataexport.filename}>
    {/if}
    <h1 class="text-xl">
        Valid reasons to report: <br>
        Illegal content (child abuse, classified information, etc.) <br>
        Personally identifiable information <br>
        Not marked as NSFW but it should be
    </h1><br><br>
    <form method="POST" use:enhance={()=>{
        return async({result})=>{
            switch (result.type){
                case "success":
                    if($reportarchive){
                        returl.set("/"+$page.params.boardname+"/a/"+$page.params.thread+"/"+$page.params.post);
                        reportarchive.set(false);
                    }else{
                        returl.set("/"+$page.params.boardname+"/"+$page.params.thread+"/"+$page.params.post);
                    }
                    goto("/redirect");
            }
        }
    }}>
    Why are you reporting this image? <br>
    <button role="button" class="w-min bg-red-900">Self explanatory</button><br><br>
    <input type="text" name="reason" class="w-full" maxlength=333><br>
    <button role="button" class="w-min bg-red-900">Submit</button>
    <input type="hidden" name="imgstr" value={imgstr}>
    </form>
</div>