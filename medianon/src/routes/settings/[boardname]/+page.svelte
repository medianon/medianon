<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import bcrypt from 'bcryptjs'; 
    const boardname = $page.params.boardname
    let pinned = "";
    let epass = "";
    let apass = "";
    let tpass = "";
    let rpass = "";
    let passwords = {
        epass: "",
        apass: "",
        tpass: "",
        rpass: ""
    };
    let passwordstring = JSON.stringify(passwords);
    async function hashentry(){
        passwords.epass = await bcrypt.hash(epass, 3);
        passwordstring = JSON.stringify(passwords);
    }
    async function hashadmin(){
        passwords.apass = await bcrypt.hash(apass, 3);
        passwordstring = JSON.stringify(passwords);
    }
    async function hashthread(){
        passwords.tpass = await bcrypt.hash(tpass, 3);
        passwordstring = JSON.stringify(passwords);
    }
    async function hashreply(){
        passwords.rpass = await bcrypt.hash(rpass, 3);
        passwordstring = JSON.stringify(passwords);
    }
    let maxthreads = 100;
    function threadcheck(){
        if (maxthreads == undefined){
            maxthreads = 10;
        }
        if (maxthreads >= 100){
            maxthreads = 100;
        }
        if (maxthreads <= 10){
            setTimeout(()=>{    
                if (maxthreads <= 10){
                    maxthreads = 10;
                }
            }, 500);
        }
    }
</script>
<div>
    if youre seeing this, the board <strong>{boardname}</strong> is all yours. <br>
    there are more settings on the way. <br>
    thanks for using medianon! :)
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<p role="button" class="m-1" on:click={()=>goto("/"+boardname, {invalidateAll: true})}>Return to {boardname}</p>

<div class="text-center mt-9">
    <form method="post" use:enhance={async()=>{
        if (maxthreads <= 10){
            maxthreads = 10;
        }
        return async({result})=>{
            switch (result.type){
                case "success":
                    // returl.set("safe");
                    goto("/"+boardname, {invalidateAll: true});
            }
        }
    }}>
        Board title:<br>
        <input type="text" name="title" class="w-1/3"> <br><br>
        <!-- Board type:<br>
        <select name="boardtype" value={"Custom"}>
            <option>Custom</option>
            <option disabled>Private (coming soon)</option>
            <option disabled>Audio (coming later)</option>
        </select><br><br> -->
        Entry password:<br>
        <input type="text" bind:value={epass} on:input={hashentry} class="w-1/3"><br><br>
        Leaderboard Participation: <input type="checkbox" name="leaderboard"><br><br>
        Bogo Sort Participation: <input type="checkbox" name="bogo"><br><br>
        Admin password:<br>
        <strong class="text-2xl text-red-900">If you leave this blank, you won't be able to access this page again.</strong> <br>
        <input type="text" bind:value={apass} on:input={hashadmin} class="w-1/3"><br><br><br>
        <strong>Extra settings:</strong><br>
        Max thread amount: <br>
        Min=10, Max=100, Default=100 <br>
        <input type="number" name="maxthreads" bind:value={maxthreads} on:input={threadcheck} max=100 min=10> <br><br>
        Pinned post: <br>
        <textarea name="pinned" class="resize" bind:value={pinned} maxlength="333"></textarea><br>
        {pinned.length}/333 <br><br>
        Thread password: <br>
        <input type="text" bind:value={tpass} on:input={hashthread} class="w-1/3"><br><br>
        Reply password: <br>
        <input type="text" bind:value={rpass} on:input={hashreply} class="w-1/3"><br>
        <br><br>
        This is the final confirmation message. Click update and {boardname}'s data will be updated. <br>
        Check all details are correct. <br><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="w-min bg-red-900" role="button">Update</button><br>
        You will be redirected to <strong>/{boardname}</strong> and asked to login if you set a password.
        <input type="hidden" name="passwords" value={passwordstring}>
    </form>
</div>
<div class="h-[50vh]"></div>