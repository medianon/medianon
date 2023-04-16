<script lang="ts">
    import { goto } from "$app/navigation";
    import { boardnamexport } from "$lib/store";
    goto("/"+$boardnamexport, {
        invalidateAll: true
        })
</script>