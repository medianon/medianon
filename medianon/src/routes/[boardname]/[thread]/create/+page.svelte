<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    goto("/"+$page.params.boardname+"/"+$page.params.thread, {invalidateAll: true})
</script>