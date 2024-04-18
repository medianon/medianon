<script lang="ts">
	import { enhance } from '$app/forms';
    import { tabdata, returl } from "$lib/store";
    import { goto } from "$app/navigation";
    import bcrypt from 'bcryptjs'; 
	import { page } from '$app/stores';
    tabdata.set({boardname: ""})
    const boardname = $page.params.boardname;
    let epass = "";
    let apass = "";
    let passwords = {
        epass: "",
        apass: ""
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
    // bcrypt.hash("", 10);

</script>

<div>The board named <strong> {boardname}</strong> doesn't currently exist. <br>
    Please note that board name and board title aren't the same thing. <br><br>
    If you would like to make a board with the name <strong>{boardname}</strong>, fill out the form below.<br>
    All boards will be deleted after 30 days of inactivity.
</div>
<br><br><br>
<div class="text-center">
    <form method="post" use:enhance={async()=>{
        return async({result})=>{
            switch (result.type){
                case "success":
                    returl.set("safe");
                    goto("/"+boardname, {invalidateAll: true});
            }
        }
    }}>
        Board name:<br>
        <input readonly name="boardname" value={boardname} type="text"><br><br><br>
        Everything else can be changed later using the admin password. <br><br><br>
        Board title:<br>
        <input type="text" name="title" class="w-1/3"> <br>
        Entry password:<br>(Leave blank for no entry password.)<br>
        <input type="text" bind:value={epass} on:input={hashentry} class="w-1/3"><br><br>
        Leaderboard Participation: <input type="checkbox" name="leaderboard"><br>
        If you set an entry password, the user will still need to know the password if they decide to visit your board. <br><br>
        Bogo Sort Participation: <input type="checkbox" name="bogo"><br>
        If you set an entry password, the user will still need to know the password if they decide to visit your board. <br>
        off by default, only tick this if youre a human<br>
        <br><br>
        Admin password:<br>(Leave blank for no admin access. This can be changed later, but <br>
        <strong class="text-xl text-red-900">you cannot add an admin password after making a board without one.</strong>)<br>
        <input type="text" bind:value={apass} on:input={hashadmin} class="w-1/3"><br><br>
        
        This is the final confirmation message. Click create and the board will be created.<br>
        By clicking 'Create' you agree to the <a href="/legal" class="text-2xl text-black bg-white">terms and conditions</a>. See about page for more information.
        <br><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="bg-red-900 w-min" role="button">Create</button><br><br>
        <input type="hidden" name="passwords" value={passwordstring}>
    </form>
    </div><br><br><br>
