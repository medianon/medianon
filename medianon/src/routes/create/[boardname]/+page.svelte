<script lang="ts">
    import { goto } from "$app/navigation";
    import { boardnamexport } from "$lib/store";
    import type { PageData } from './$types';
    export let data: PageData;
    if (data.tooslowlol){} else {
        redir();
    }
    function redir(){
        goto("/"+$boardnamexport, {
            invalidateAll: true
        })
    }
</script>

<div>
    too slow <br>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={redir}>{$boardnamexport}</p>
</div>