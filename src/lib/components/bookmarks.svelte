<script lang="ts">
	import { goto } from "$app/navigation";
	import { bookmarks, markhist, redirauth, redirect } from "$lib/index.svelte";
    const {boardname, threadid, archive} = $props<{
        boardname: string,
        threadid: string,
        archive: boolean
    }>();
    function redir(replynum: string){
        if(archive){
            redirect.url = '/'+boardname+'/a/'+threadid+'/'+replynum;
        }else{
            redirect.url = '/'+boardname+'/'+threadid+'/'+replynum;
        }
        markhist.add = true;
        redirauth.allow = true;
        goto('/redirect');
    }
    function removemark(index: number){
        bookmarks.list.splice(index, 1);
    }
</script>

<div class="flex-col border-2 rounded border-[#293947] bg-primary-500 p-3">
    <p class="text-xl text-surface-700">Bookmarks</p>
    <div class="flex flex-col items-center overflow-y-scroll overflow-x-hidden max-h-[10vh] min-w-fit no-scrollbar">
        {#each bookmarks.list as bookmark, index}
            {#if (bookmark.boardname == boardname) && (bookmark.threadid == threadid) && (bookmark.archive == archive)}
                <div class="flex items-center w-fit">
                    <div class="bg-[#293947] flex-col w-28 rounded-xl border mb-1 mr-1 p-1">
                        <button type="button" class="flex-col" onclick={()=>{redir(bookmark.replynum)}}>
                            <p>{bookmark.threadid}/<span class="text-xl">{bookmark.replynum}</span></p>
                            <p class="text-center">{bookmark.preview}</p>
                        </button>
                    </div>
                    <button type="button" class="btn bg-error-600 text-2xl" onclick={()=>{removemark(index)}}>X</button>
                </div>
            {/if}
        {/each}
    </div>
</div>