<script>
	import { goto } from "$app/navigation";
    import { session, tabdata, tabs, showtabs, showhistory, bogocount } from "../lib/store";
	import Tabs from "./tabs.svelte";
    import Posthistory from "./posthistory.svelte";
    let warning = false;
    let menuopen = false;

    function toggle(){
        menuopen = !menuopen;
    }
    // function close(){
    //     menuopen = false;
    // }
    
    function maketab(){
        $tabs.push($tabdata);
        // console.log($tabs);
        showtabs.set(false)
        goto("/");
    }

    function warningtoggle(){
        warning = !warning;
    }
    window.onbeforeunload = function(){
        if (warning == true){
            return('');
        }
    };

    function bogosort(){
        bogocount.set($bogocount + 1);
        goto("/bogo", {invalidateAll: true});
    }

</script>

<div class="inline-flex w-full text-right sticky top-0 bg-default">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="cursor-pointer relative top-2 left-2" on:click={toggle} >
        <div class=" h-1.6 w-12 bg-menulines"></div>
        <div class="h-2"></div>
        <div class=" h-1.6 w-12 bg-menulines"></div>
        <div class="h-2"></div>
        <div class=" h-1.6 w-12 bg-menulines"></div>
    </div>
    <div class="ml-6 w-full flex">
        <div>
            <a href="/">
                <img src="/logo_erikasbuero.png" alt="medianon logo">
            </a>
        </div>
        <div class="mt-1 ml-3">
            <a class="mr-6" role="button" href="/subscriptions">Subscriptions</a>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p role="button" on:click={()=>showtabs.set(!$showtabs)}>Tabs</p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="mr-6" role="button" on:click={maketab} title="Makes a new tab with your current location and sends you to the home page.">+</p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="mr-6" role="button" on:click={()=>showhistory.set(!$showhistory)}>Post History</p>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <p class="mr-6" role="button" on:click={bogosort}>Bogo Sort</p>
            <input type="checkbox" name="warning" on:change={warningtoggle}>
        </div>
    </div>
    <p class="mr-1">Session started: {$session}</p>
</div>

{#if menuopen}
<div class="h-9 flex justify-around sticky top-[79px] bg-default text-xl">
    <a on:click={toggle} href="/about">About</a>
    <a on:click={toggle} href="/settings">Layout</a>
    <a on:click={toggle} href="/listen">TTS Voice</a>
    <a on:click={toggle} href="/leaderboards">Leaderboards</a>
    <a on:click={toggle} target="_blank" rel="noreferrer" href="https://eyebleach.me">Eye Bleach</a>
    <a on:click={toggle} href="/legal">Legal</a>
</div>
{/if}

{#if $showtabs}
    <Tabs />
{/if}

{#if $showhistory}
    <Posthistory />
{/if}
