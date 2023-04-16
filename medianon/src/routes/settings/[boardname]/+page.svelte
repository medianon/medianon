<script lang="ts">
    import { boardnamexport } from "$lib/store";
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

    async function updateboard(){
        let sendata = {
            title: inputdata.title,
            entrypass: "",
            adminpass: "",
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
        goto("/settings/" + $boardnamexport + "/update");
    }

    function togglebogo(){
        inputdata.bogo = !inputdata.bogo;
    }

    function toggleaderboard(){
        inputdata.leaderboard = !inputdata.leaderboard;
    }
</script>
<div>
    if youre seeing this, the board <strong>{$boardnamexport}</strong> is all yours. <br>
    ive not added in all of the settings yet, but in the future, with this password, you will have full control of this board. <br>
    thanks for using medianon! :)
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<p role="button" class="m-1" on:click={()=>goto("/"+$boardnamexport, {invalidateAll: true})}>Return to {$boardnamexport}</p>

<div class="text-center mt-9">
    Board title:<br>
    <input type="text" class="w-1/3" bind:value={inputdata.title}> <br><br>
    Board type:<br>
    <select name="boardtype" value={"Custom"}>
        <option>Custom</option>
        <option disabled>Private (coming soon)</option>
        <option disabled>Audio (coming later)</option>
    </select><br><br>
    Entry password:<br>
    <input type="text" class="w-1/3" bind:value={inputdata.entrypass}><br><br>
    Leaderboard Participation: <input type="checkbox" on:change={toggleaderboard}><br><br>
    Bogo Sort Participation: <input type="checkbox" on:change={togglebogo}><br><br>
    Admin password:<br>
    <strong>If you leave this blank, you won't be able to access this page again.</strong> <br>
    <input type="text" class="w-1/3" bind:value={inputdata.adminpass}><br><br><br><br>
    This is the final confirmation message. Click update and {$boardnamexport}'s data will be updated. <br>
    Check all details are correct before clicking update. <br><br>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={updateboard}>Update</p><br>
    You will be redirected to /{$boardnamexport} after clicking update.
</div>
<div class="h-[50vh]"></div>