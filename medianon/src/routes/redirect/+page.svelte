<script lang="ts">
    import { goto } from "$app/navigation";
    import { returl } from "$lib/store";
    
    goto($returl, {
        invalidateAll: true
        })
    returl.set("safe");
</script>