<script lang="ts">
	import { goto } from "$app/navigation";
    import { bookmarks, returl } from "$lib/store";
    export let boardthread = {
        boardname: "",
        threadid: ""
    }
    export let archive = false;

    let relevant: string[] = [];
    $bookmarks.forEach(bookmark => {
        if (archive){
            let split = bookmark.split("/", 4);
            if (split[1] == boardthread.boardname && split[3] == boardthread.threadid){
                relevant.push(bookmark);
            }
        } else {
            let split = bookmark.split("/", 3);    
            if (split[1] == boardthread.boardname && split[2] == boardthread.threadid){
                relevant.push(bookmark);
            }

        }
    })
    
    function redir(redurl: string){
        returl.set(redurl);
        goto("/redirect");
    }
</script>

<div class="w-80 h-64 rounded border-4 border-ui2 bg-field overflow-scroll resize">
    Bookmarks: <br>
    {#each relevant as bookmark}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="m-1" role="button" on:click={()=>redir(bookmark)}>
        {bookmark}</p>
    {/each}
</div>