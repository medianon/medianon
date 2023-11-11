<script>
    import { createtype, boardnamexport } from "$lib/store";
    import Cookies from 'js-cookie';
    import { goto } from "$app/navigation";
    function close(){
        createtype.set("")
    }
    let contentinput = "";
    let titleinput = "";
    let numofboxes = 1;
    function boxes(){
        if (contentinput.length > 666){
            numofboxes = 3;
        }else if (contentinput.length > 333){
            numofboxes = 2;
        }
        else {
            numofboxes = 1;
        }
    }

    function makepost(){
        let inputdata = {
            content: contentinput,
            title: titleinput,
            boxes: numofboxes,
            made: Date.now(),
            // archive: (Date.now()+10000),
            archive: (Date.now()+86400000),
            delete: (Date.now()+604800000),
            }
        Cookies.set("temp", JSON.stringify(inputdata));//check src/hooks.server.ts to see how this is used.
        // console.log(newpost);
        goto("/"+$boardnamexport+"/create")
        close();
    }
</script>
<div on:mouseleave={close} class="w-screen h-screen m-1">
        <strong>To close this form move your mouse outside of it / ALT+TAB.</strong><br>
        Content:<br>
        <textarea type="text" class="resize" bind:value={contentinput} on:input={boxes} maxlength="999"></textarea><br>
        Characters: {contentinput.length} <br>
        Max total characters: 999 <br>
        Max characters per box: 333 <br>
        Boxes: {numofboxes}<br><br>
        Title:<br>
        <input type="text" class="w-96" bind:value={titleinput} maxlength="50"><br>
        Characters: {titleinput.length} <br>
        Max characters: 50 <br><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={makepost}>Post</p>  please remember what you typed out on the home page and what the alternatives to medianon are. <br>
        By clicking 'Post' you agree to the <a href="/legal" class="text-2xl text-black bg-white">terms and conditions</a>. See about page for more information.


</div>
