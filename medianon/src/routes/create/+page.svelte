<script lang="ts">
    import { boardnamexport, tabdata } from "$lib/store";
    import { goto } from "$app/navigation";
    import bcrypt from 'bcryptjs'; 
    import Cookies from 'js-cookie';
    let inputdata = {
        title: "",
        entrypass: "",
        adminpass: "",
        leaderboard: false,
        bogo: false
        // lastactive: 0,
    };

    tabdata.set({boardname: ""})

    function togglebogo(){
        inputdata.bogo = !inputdata.bogo;
    }

    function toggleaderboard(){
        inputdata.leaderboard = !inputdata.leaderboard;
    }

    async function makeboard(){
        let sendata = {
            title: inputdata.title,
            boardtype: "Custom",
            entrypass: "",
            adminpass: "",
            lastactive: Date.now(),
            leaderboard: inputdata.leaderboard,
            bogo: inputdata.bogo
        }
        if(inputdata.entrypass){
            sendata.entrypass = await bcrypt.hash(inputdata.entrypass, 10);
        }
        if(inputdata.adminpass){
            sendata.adminpass = await bcrypt.hash(inputdata.adminpass, 10);
        }
        let datastring = JSON.stringify(sendata);
        // console.log(datastring);
        Cookies.set("temp", datastring);//check src/hooks.server.ts to see how this is used.
        goto("/create/" + $boardnamexport);
    }
    // let bogo = false;
</script>

<div>The board named <strong> {$boardnamexport}</strong> doesn't currently exist. <br>
    Please note that board name and board title aren't the same thing. <br><br><br>
    If you would like to make a board with the name <strong>{$boardnamexport}</strong>, fill out the form below.<br>
    the whole database may get rekt when i migrate to another one so dont get too attached to/worried about 'your' board name.
</div>
<br><br><br>
<div class="text-center">
    Board name:<br>
    <input disabled={true} type="text" placeholder={$boardnamexport}><br><br><br>
    Everything else can be changed later using the admin password. <br><br><br>
    Board title:<br>
    <input type="text" class="w-1/3" bind:value={inputdata.title}> <br>

    Board type:<br>
    <select name="boardtype" value={"Custom"}>
        <option>Custom</option>
        <option disabled>Private (coming soon)</option>
        <option disabled>Audio (coming later)</option>
    </select><br><br>
    Entry password:<br>(Leave blank for no entry password.)<br>
    <input type="text" class="w-1/3" bind:value={inputdata.entrypass}><br><br>
    Leaderboard Participation: <input type="checkbox" on:change={toggleaderboard}><br>
    If you set an entry password, the user will still need to know the password if they decide to visit your board. <br><br>
    Bogo Sort Participation: <input type="checkbox" on:change={togglebogo}><br>
    If you set an entry password, the user will still need to know the password if they decide to visit your board. <br>
    off by default, please only tick this if youre a human and going to be nice <br>
    and side note please pay your share if you tick this as it will by default generate more server costs. thank you.
    <br><br>
    Admin password:<br>(Leave blank for no admin access. This can be changed later, but <br>
    <strong>you cannot add an admin password after making a board without one.</strong>)<br>
    <input type="text" class="w-1/3" bind:value={inputdata.adminpass}><br><br>

    This is the final confirmation message. Click create and the board will be created.<br>
    Check all details are correct before clicking create. <br>
    By clicking 'Create' you agree to the <a href="/legal" target="_blank" class="text-2xl text-black bg-white">terms and conditions</a>. See about page for more information.
    <br><br>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={makeboard}>Create</p><br><br>
</div><br><br><br>