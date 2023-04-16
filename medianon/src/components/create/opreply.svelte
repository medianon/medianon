<script>
    import { createtype, boardnamexport, threadidexport } from "$lib/store";
    import Cookies from 'js-cookie';
    import { goto } from "$app/navigation";
    function close(){
        createtype.set("")
    }
    let contentinput = "";
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
            made: Date.now(),
            boxes: numofboxes,
            }
        Cookies.set("temp", JSON.stringify(inputdata)); //check src/hooks.server.ts to see how this is used.
        // console.log(newpost);
        goto("/"+$boardnamexport+"/"+$threadidexport+"/create");
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
        Boxes: {numofboxes}<br>
        <br><br><br><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={makepost}>Post</p>  please remember what you typed out on the home page and what the alternatives to medianon are. <br>
        By clicking 'Post' you agree to the <a href="/legal" class="text-2xl text-black bg-white">terms and conditions</a>. See about page for more information.


</div>
