<script lang="ts">
    import type { PageProps } from "./$types";
	import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import { boardexport, redirect, tabs } from "$lib/index.svelte";
    import bcrypt from "bcryptjs";
    let {params}: PageProps = $props();
    tabs.location='/'+params.boardname+'/settings';
    tabs.preview='Settings';
    let adminauth = $state(true);
    let adminput = $state("");
    let wrongpass = $state(false);
    let description = $state(boardexport.boardata.description);
    function checkpass(){
        bcrypt.compare(adminput, boardexport.boardata.adminpass).then((res)=>{
            if(res){
                adminauth=false;
            }else{
                wrongpass=true;
            }
        })
    }
</script>

{#if (boardexport.boardata.adminpass!="") && adminauth}
    <div class="text-center text-lg flex-col justify-items-center p-5">
        Enter admin password:
        <input type="password" class="input my-3 border" bind:value={adminput}/>
        <button type="button" class="btn preset-filled-success-500" onclick={checkpass}>Enter</button><br>
        {#if wrongpass}
            Incorrect Password
        {/if}
    </div>
{:else}

<button type="button" class="btn bg-error-700 m-3" onclick={()=>{goto('/'+params.boardname+'/settings/reports')}}>
    Reports
</button>
    <div class="text-center m-3 justify-items-center">
        <form method="post" use:enhance={async()=>{
            return async({result})=>{
                switch (result.type){
                    case "success":
                        redirect.url = '/'+params.boardname;
                        goto("/redirect");
                }
            }
        }}>
        Board title:<br>
        <input type="text" name="title" required class="input border" value={boardexport.boardata.title}> <br>
        Entry password:<br>
        <input type="password" name="entry" class="input border"><br>
        Admin password:<br>
        <strong class="text-xl text-error-500">If you leave this blank, you won't be able to access this page again.</strong> <br>
        <input type="password" name="admin" class="input border"><br>
        Bogo Search: <input type="checkbox" name="bogo" class="checkbox border" defaultChecked={boardexport.boardata.bogo}><br>
        Leaderboard: <input type="checkbox" name="leaderboard" class="checkbox border" defaultChecked={boardexport.boardata.leaderboard}><br><br>

        <strong class="text-xl">Extra settings:</strong><br><br>
        Board type:<br>
        <select name="boardtype" value={"Custom"} class="select border">
            <option>Custom</option>
            <option disabled>Audio</option>
        </select><br>
        Description: <br>
        <textarea name="description" class="textarea border" bind:value={description} maxlength="333"></textarea>
        {description.length}/333 <br><br>
        Maximum thread amount: <br>
        Default=50, Min=10, Max=100 <br>
        <input type="number" name="maxthreads" required class="input border" max=100 min=10 defaultValue={boardexport.boardata.maxthreads}><br>
        Thread password: <br>
        <input type="password" name="thread" class="input border"><br>
        Reply password: <br>
        <input type="password" name="reply" class="input border"><br>
        Maximum inactivity until board is deleted: <br>
        Enter as milliseconds <br>
        Default/Min = 30 days = 2592000000 <br>
        Max = 6 months = 31536000000 <br>
        <input type="number" name="boardeltime" required class="input border" min=2592000000 max=31536000000 defaultValue=2592000000><br>
        Time until thread is archived: <br>
        Enter as milliseconds <br>
        Default = 24 hours = 86400000 <br>
        Min = 1 hour = 3600000 <br>
        Max = 3 days = 259200000 <br>
        <input type="number" name="archivetime" required class="input border" min=3600000 max=259200000 defaultValue=86400000><br>
        Time until archived thread is deleted: <br>
        Enter as milliseconds <br>
        Default = 7 days = 604800000 <br>
        Min = 24 hours = 86400000 <br>
        Max = 15 days = 1296000000 <br>
        <input type="number" name="archivedeltime" required class="input border" min=86400000 max=1296000000 defaultValue=604800000><br>
        Thread Images: <input type="checkbox" name="threadimages" class="checkbox border" defaultChecked={boardexport.boardata.threadimages}><br><br>
        Reply Images: <input type="checkbox" name="replyimages" class="checkbox border" defaultChecked={boardexport.boardata.replyimages}><br><br>
        <button type="submit" class="btn preset-filled-success-500">Update</button><br><br>
        </form>
    </div>
{/if}