<script lang="ts">
	import { goto } from "$app/navigation";
    import { tabs, tabdata, showtabs, returl } from "$lib/store";
    import type { tab } from "$lib/store";
    let urlarray: Array<string> = [];
    $tabs.forEach((tab: tab) => {
        let urlstring = makestring(tab.boardname, tab.threadid, tab.postnum, tab.archive);
        urlarray.push(urlstring);
    });
    // tabs.set(urlarray);
    function makestring(b: string, t: string, p: string, a: boolean){
        let urlstring = "/";
        if (b === ""){
            return urlstring;
        }
        if (t === ""){
            urlstring += b;
            return urlstring;
        }
        urlstring += b;
        if (a){
            urlstring += "/a"
        }
        if (p === ""){
            urlstring += "/"+t;
            return urlstring;
        } else {
            urlstring += "/"+t+"/"+p;
            return urlstring;
        }
    }

    function maketab(){
        $tabs.push($tabdata);
        showtabs.set(false);
    }

    function redir(redurl: string){
        returl.set(redurl);
        goto("/redirect");
        showtabs.set(false);
    }

    function closetab(index: number){
        $tabs.splice(index, 1);
        showtabs.set(false);
    }

    function closeall(){
        $tabs.splice(0);
        showtabs.set(false);
    }
</script>

<div class="w-full inline-flex justify-around sticky top-[79px] bg-tabs">
    <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="ml-1 mt-1" role="button" on:click={maketab}
        title="Unless you are in a board, your current location is the home page.">
        New Tab
        </p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="ml-6 mt-1" role="button" on:click={closeall} title="This is irreversible.">Close all tabs</p>
        <br>
    </div>
</div>
<div class="w-full inline-flex sticky top-[146px] bg-tabs overflow-x-scroll">
    {#each urlarray as tab, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="mx-1 mb-3" role="button" on:click={()=>redir(tab)}>{tab}</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="mr-3 mb-3" role="button" on:click={()=>closetab(index)} title="Close tab">X</p>
    {/each}
</div>
