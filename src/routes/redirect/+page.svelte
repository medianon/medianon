<script lang="ts">
    import { redirect } from "$lib/index.svelte";
    import { goto } from "$app/navigation";
    let url = redirect.url;
    redirect.url = "";
    goto(url, {invalidateAll: true});
</script>