<script context="module">
    export function apply(coloursobj){
        document.documentElement.style.setProperty("--background-color", coloursobj.background);
        document.documentElement.style.setProperty("--default", coloursobj.navbackground);
        document.documentElement.style.setProperty("--menulines", coloursobj.menulines);
        document.documentElement.style.setProperty("--color", coloursobj.text);
        document.documentElement.style.setProperty("--primary", coloursobj.buttons);
        document.documentElement.style.setProperty("--primary-inverse", coloursobj.btntxt);
        document.documentElement.style.setProperty("--primary-hover", coloursobj.btnhvr);
        document.documentElement.style.setProperty("--form-element-background-color", coloursobj.inpbackground);
        document.documentElement.style.setProperty("--ui2", coloursobj.ui2);
        document.documentElement.style.setProperty("--tabs", coloursobj.tabs);
        document.documentElement.style.setProperty("--history", coloursobj.history);
        document.documentElement.style.setProperty("--arrows", coloursobj.arrows);
        document.documentElement.style.setProperty("--bookmark", coloursobj.bookmark);
        document.documentElement.style.setProperty("--subscribe", coloursobj.subscribe);
        // document.documentElement.style.setProperty("--???", coloursobj.links);
    }
</script>
<script>
    import { defaultcolours, tabdata, threadsort, firstsort, currentsort, nextsort } from "$lib/store";
    tabdata.set({boardname: ""})
    let coloursobj = {
        userinp: true,
        background: "",
        navbackground: "",
        menulines: "",
        text: "",
        buttons: "",
        btntxt: "",
        btnhvr: "",
        inpbackground: "",
        ui2: "",
        arrows: "",
        subscribe: "",
        bookmark: "",
        tabs: "",
        history: ""
        // links: "",

    };
    function resetcolours(){
        apply($defaultcolours)
    }
</script>

<div class="text-center mt-6">
    Layout settings: <br><br>
    <div class="inline-flex ml-9">
        <p class="mr-1">Sort threads by: </p>
        <select name="thread" bind:value={$threadsort}>
            <option>Bump (Default)</option>
            <option>Most recent</option>
            <option>Oldest</option>
            <option>Replies</option>
        </select>
        <p class="ml-3 mr-1">Sort first layer by: </p>
        <select name="next" bind:value={$firstsort}>
            <option>Most recent (Default)</option>
            <option>Oldest</option>
            <option>Replies</option>
        </select>
        <p class="ml-9 mr-1">Sort current layer by: </p>
        <select name="current" bind:value={$currentsort}>
            <option>Most recent (Default)</option>
            <option>Oldest</option>
            <option>Replies</option>
        </select>
        <p class="ml-9 mr-1">Sort next layer by: </p>
        <select name="next" bind:value={$nextsort}>
            <option>Most recent (Default)</option>
            <option>Oldest</option>
            <option>Replies</option>
        </select>
    </div><br><br>
    Show all media by default: <input type="checkbox"><br>
    Including NSFW: <input type="checkbox">
    <br><br><br>
    Colour settings: <br><br>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={resetcolours}>Reset</p><br><br>
    <div class="text-center">
        Background: <input type="color" bind:value={coloursobj.background}><br>
        Navigation background: <input type="color" bind:value={coloursobj.navbackground}><br>
        Menu lines: <input type="color" bind:value={coloursobj.menulines}><br>
        Text: <input type="color" bind:value={coloursobj.text}><br>
        Buttons: <input type="color" bind:value={coloursobj.buttons}><br>
        Button text: <input type="color" bind:value={coloursobj.btntxt}><br>
        Button hover: <input type="color" bind:value={coloursobj.btnhvr}><br>
        Subscribed: <input type="color" bind:value={coloursobj.subscribe}><br>
        Bookmarked: <input type="color" bind:value={coloursobj.bookmark}><br>
        Tabs: <input type="color" bind:value={coloursobj.tabs}><br>
        Post History: <input type="color" bind:value={coloursobj.history}><br>
        Input background: <input type="color" bind:value={coloursobj.inpbackground}><br>
        Arrows: <input type="color" bind:value={coloursobj.arrows}><br>
        ui2 (content box background and various other things): <br><input type="color" bind:value={coloursobj.ui2}><br>
        <!-- Links: <input type="color" bind:value={coloursobj.links}><br> -->
        Links: idk, later <br><br>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p role="button" on:click={apply(coloursobj)}>Apply </p><br>
    </div>
</div>
<div class="h-[30vh]"></div>