<script lang="ts">
    import bcrypt from "bcryptjs";
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
    export let data: PageData;
    let inpass: string = "";
    let reportpass = data.passtring;
    let wrongpass = false;

    function checkpass(){
        bcrypt.compare(inpass, reportpass).then((res) => {
            if (res){
                reportpass = "";
            }else{
                wrongpass = true;
            }
    })
}
</script>

{#if reportpass == ""}
    <slot />
{:else if reportpass != ""}
    <p>Enter password</p>
    <input type="password" bind:value={inpass}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={checkpass}>Enter</p>
    {#if wrongpass}
        <p class="text-xl">Incorrect password</p>
    {/if}
{:else}
    {()=>goto("/", {invalidateAll: true})};
{/if}