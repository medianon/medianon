<script>
	import { goto } from "$app/navigation";
    import { status, session } from "$lib/store";
	import viewport from "$lib/useViewportAction";
    import { fade } from "svelte/transition";
    let oath = "i am now posting anonymously. i vow to use this power responsibly."
    let input = "";
    let showbtn = false;
    let benjy = true;
    let bfname = true;
    let marty = true;
    let mnname = true;
    let churchy = true;
    let wcname = true;
    function check(){
        if(input.toLowerCase() == oath){
            showbtn = true;
        }else{
            showbtn=false;
        }
    }
    function enter(){
        //!!SESSION TIMER!!
        let currenttime = new Date();
        session.set(currenttime.toLocaleString());
        status.set(true);
        goto("/");
    }
    function iykyk(){
        input = oath;
        showbtn = true;
    }
    function reset(){
        document.body.scrollIntoView();
    }
    function resetext(){
        churchy = true;
        wcname = true;
        marty = true;
        mnname = true;
        benjy = true;
        bfname = true;
    }
</script>

<p class="text-center">medianon is a free to use anonymous forum.<br>
    before entering, all i ask is you mindfully type the following message:
</p>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<article class="text-center" on:click={iykyk}>
    I am now posting anonymously. I vow to use this power responsibly.
</article>

<input class="w-full" type="text" bind:value={input} on:input={check}>
<p>(case insensetive, full stops required, one space between the two sentences)</p>
<br><br>

{#if showbtn}
<div class="text-center">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={enter}>Enter</p>
</div>
{/if}

<br><br><br>
<p>DISCLAIMER: this is an independently run website. there is little to no moderation here (see about page). take nothing here seriously.<br>
    keep any sensitive or personally identifiable information far away from here. i have tried to keep this website secure where necessary (see about page), but i guarantee nothing.<br><br>
    as thanks for reading this far, click on the message.
</p>

<div class="h-96"></div>

<p class="text-center" use:viewport on:enterViewport={resetext}><strong>medianon.org established: 11/03/2023</strong></p>

<div class="h-screen"></div>

<div class="text-center">
    <div class="sticky top-1">
        {#if churchy}
        <h1 transition:fade class="text-3xl">
            Those that fail to learn from history are doomed to repeat it.<br>
        </h1>
        {/if}
        {#if wcname}
            <h2 transition:fade class="text-2xl">-Winston Churchill.</h2>
        {/if}
    </div>
    <div class="h-screen"></div>
    <div class="sticky top-24">
        {#if marty}
        <h1 transition:fade class="text-3xl">
            First they came for the socialists, and I did not speak out<br>
            Because I was not a socialist.<br>
            Then they came for the trade unionists, and I did not speak out<br>
            Because I was not a trade unionist.<br>
            Then they came for they Jews, and I did not speak out<br>
            Because I was not a Jew.<br>
            Then they came for me<br>
            And there was no one left to speak out for me.<br>
        </h1>
        {/if}
        {#if mnname}
        <h2 transition:fade class="text-2xl">-Martin Niemoller.</h2>
        {/if}
    </div>
    <div class="h-[80vh]"></div>
    <div class="sticky top-[28rem]">
        {#if benjy}
        <h1 transition:fade class="text-3xl">
            Those who would give up essential liberty to purchase a little temporary safety,<br>
            Deserve neither liberty nor safety.<br>
        </h1>
        {/if}
        {#if bfname}
            <h2 transition:fade class="text-2xl">-Benjamin Franklin.</h2>
        {/if}
    </div>
    <div class="h-[20vh]"></div>
    <div use:viewport on:enterViewport={()=>wcname=false}></div>
    <div class="h-[30vh]"></div>
    <div use:viewport on:enterViewport={()=>mnname=false}></div>
    <div class="h-[25vh]"></div>
    <div use:viewport on:enterViewport={()=>bfname=false}></div>
    <div class="h-[40vh]"></div>
</div>
<article class="text-center text-xl sticky top-[7vh]">we only care about your message, not your identity.</article>
<div class="h-[5vh]"></div>
<div use:viewport on:enterViewport={()=>benjy = false}></div>
<div class="h-[15vh]"></div>
<div use:viewport on:enterViewport={()=>marty = false}></div>
<div class="h-[25vh]"></div>
<div use:viewport on:enterViewport={()=>churchy = false}></div>
<div class="h-[65vh]"></div>
<div use:viewport on:enterViewport={reset} on:enterViewport={resetext}>https://youtu.be/ELKbtFljucQ https://youtu.be/cS0jTbzd8Q8 https://youtu.be/hS_AXRRnIzM https://youtu.be/hCVX-RrrmDw https://youtu.be/mRDez3ucfIs https://youtu.be/JAEDQwMtf4o</div>