<script lang="ts">
	import { goto } from "$app/navigation";
    import { boardataexport } from "$lib/store";
	import bcrypt from 'bcryptjs';
    import { page } from "$app/stores";
    let inpass = "";
    let adminpass = $boardataexport.adminpass;
    let wrongpass = false;

    function checkpass(){
        bcrypt.compare(inpass, adminpass).then((res) => {
            if (res){
                adminpass = "";
            }else{
                wrongpass = true;
            }
        })
    }
</script>

{#if adminpass == ""}
    <slot />
{:else if adminpass != ""}
    <p>Enter admin password</p>
    <input type="password" bind:value={inpass}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={checkpass}>Enter</p>
    {#if wrongpass}
        <p class="text-xl">Incorrect password</p>
    {/if}
    <p role="button" on:click={()=>goto("/"+$page.params.boardname)}>Return</p>
{:else}
    {()=>goto("/"+$page.params.boardname)}
{/if}