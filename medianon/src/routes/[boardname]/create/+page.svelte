<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    goto("/"+$page.params.boardname, {
        invalidateAll: true
        })
</script>