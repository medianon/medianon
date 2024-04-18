<script lang="ts">
    import { goto } from '$app/navigation';
	import { tabdata } from '$lib/store';
    let input = "";
    let enterbtn = false;

    tabdata.set({boardname: ""});

    function checkinp(){ 
        if(input == ""){
            enterbtn = false;
        }else if(input.includes("/") || input.includes("%") || input.includes("\\") || input.includes("?") || input.includes("#") || input.includes(" ")){
            enterbtn = false;
        }else if(input.length == 1 && !isNaN(+input)){
            enterbtn = true;
        }else if(input.length > 3 && isNaN(+input)){
            enterbtn = true;
        }else{
            enterbtn = false;
        }
        // console.log(input + " & " + enterbtn.toString());
    }

    function redir(){
        goto("/"+input);
    }
    function specialredir(inp: string){
        goto("/"+inp);
    }
</script>


<div class="m-1 mt-20 text-center">
    Enter board <strong>name</strong> you want to access:<br>
    <input class="w-72" type="text" maxlength=16 bind:value={input} on:input={checkinp}>
    {#if enterbtn}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={redir}>Enter</p>
    {/if}
    <br>
    Public Boards:<br> 
    0-9<br><br>
    Special Boards:<br>
    <p role="button" on:click={()=>specialredir("memes")}>memes</p>
    <br><br>
    Every other board:<br>
    Minimum characters: 4, at least 1 non-number<br>
    Maximum characters: 16<br>
    List of banned characters:<br>
    /, \, %, ?, #, space <br>
    these are banned because they break the website. if you find another one, please let me know
    <br><br><br>

    <!-- <a href="/view">coming soon</a><br> -->
</div>