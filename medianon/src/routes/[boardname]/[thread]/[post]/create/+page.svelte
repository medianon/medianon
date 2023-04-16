<script lang="ts">
    import { goto } from "$app/navigation";
    import { newparent } from '$lib/store';
    import { page } from "$app/stores";

    goto("/"+$page.params.boardname+"/"+$page.params.thread+"/"+$newparent, {invalidateAll: true})
</script>