<script lang="ts">
    import { goto } from '$app/navigation';
    import { tabs } from '$lib/index.svelte';
    tabs.location="/";
    tabs.preview="Home"
    let disabled = true;
    let input = "";
function checkinp(){ 
    if(input == ""){
        disabled = true;
    }else if(input.includes("/") || input.includes("%") || input.includes("\\") || input.includes("?") || input.includes("#") || input.includes(" ")){
        disabled = true;
    }else if(input.length == 1 && !isNaN(+input)){
        disabled = false;
    }else if(input.length > 3 && isNaN(+input)){
        disabled = false;
    }else{
        disabled = true;
    }
}
</script>

<div class="flex flex-col w-full items-center mt-3 p-2 text-lg">
    <p>
        Please enter the board <strong> name </strong> you want to visit:
    </p>
    <input type="text" class="input my-3 sm:w-[80vw] md:w-[50vw] lg:w-[30vw] border" placeholder="Board name" bind:value={input} oninput={checkinp} maxlength=16/>
    <div class="text-left">
        <p>Minimum length: 4 with at least 1 non-number</p>
        <p>Maximum length: 16</p>
        <p>Banned characters: /, \, %, ?, #, space</p>
    </div>
    <button type="button" class="btn btn-lg preset-filled-secondary-500 my-3 z-10" disabled={disabled} onclick={()=>goto('/'+input)}>Enter</button>
    <p>
        <strong class="text-xl">Public Boards</strong>
    </p>
    <p>0-9</p>
    <button type="button" class="btn preset-filled-primary-600-400" onclick={()=>{goto('/memes')}}>memes</button>
</div>