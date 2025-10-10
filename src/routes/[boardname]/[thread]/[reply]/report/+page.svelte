<script lang="ts">
	import { enhance } from '$app/forms';
    import type { PageProps } from './$types';
    import { redirect, tabs, replyexport } from "$lib/index.svelte";
    import { goto } from '$app/navigation';
    let { data, params }: PageProps = $props();
    let imgjson = {
        filename: replyexport.replydata.filename,
        url: replyexport.replydata.url
    }
    let imgstr = JSON.stringify(imgjson);
    let showimage = $state(false);
    function toggleimage(){
        showimage = !showimage;
    }

    tabs.location = '/'+params.boardname+'/'+params.thread+'/'+params.reply;
    if(replyexport.replydata.content.length>10){
        tabs.preview=replyexport.replydata.content.slice(0, 10)+'...';
    }else{
        tabs.preview=replyexport.replydata.content;
    }
</script>

<div class="p-3 text-xl">
    You are about to report the image attached to the post <strong>{params.boardname}/{params.thread}/{params.reply}</strong><br>
    <button type="button" class="btn bg-surface-300" onclick={toggleimage}>
        {replyexport.replydata.filename}
    </button> <br>
    {#if showimage}
    <img src={replyexport.replydata.url} alt={replyexport.replydata.filename}>
    {/if}
    Valid reasons to report: <br>
    Illegal content (child abuse, classified information, etc.) <br>
    Personally identifiable information <br>
    Not marked as NSFW but it should be
    <br>
    <form method="POST" use:enhance={()=>{
        return async({result})=>{
            switch (result.type){
                case "success":
                    redirect.url = ("/"+params.boardname+"/"+params.thread+"/"+params.reply);
                    goto("/redirect");
            }
        }
    }}>
    Why are you reporting this image? <br>
    <button type="submit" class="btn bg-red-900">Self explanatory</button><br><br>
    <input type="text" name="reason" class="input border" maxlength=333><br>
    <button type="submit" class="btn bg-red-900">Submit</button>
    <input type="hidden" name="imgstr" value={imgstr}>
    </form>
</div>