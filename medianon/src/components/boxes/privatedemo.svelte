<script>
    export let video = "";
    let showvideo = false;
    let showimage = false;
    function toggleimage(){
        showimage = !showimage;
    }
    function togglevideo(){
        showvideo = !showvideo
    }
</script>

<div class="h-84 w-[25vw] rounded bg-ui2 border-2 border-field overflow-y-scroll overscroll-contain"><!--the box-->
    {#if video == "true"}
        thanks to discord for hosting this video. <br>
        it doesnt seem to work properly and idk why, youll need to use picture in picture. <br>
        just imagine it working the same way as the image.
    {:else}
        thanks to imgur for hosting these images.
    {/if}
    <!-- UPDATE BOARD DELETE ON NEW THREAD/POST -->
</div>
<div class="w-[25vw] bg-ui2 rounded border-field border-2"><!--footer-->
    <p>b/t/p</p>
    <p>Made: 1/2/3</p>
</div>

<div class="w-[25vw] inline-flex text-right rounded bg-private border-2 border-field overscroll-contain">
    {#if video == "true"}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="cursor-pointer" on:click={togglevideo}>hopefully.mp4</p>
        <a class="rounded bg-ui2 ml-3" href="https://cdn.discordapp.com/attachments/533451891389104128/1090410725010309161/c77ocq_1.mp4" target="_blank" rel="noreferrer">New Tab</a>
    {:else}
        <strong class="mx-1 text-xl text-red-300">!</strong> <!--NSFW indicator-->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="cursor-pointer" on:click={toggleimage}>coming soon.jpg</p>
        <a class="rounded bg-ui2 ml-3" href="https://i.imgur.com/a17q9UF.jpeg" target="_blank" rel="noreferrer">New Tab</a>
    {/if}
    <p class="cursor-pointer ml-auto">Report</p>
</div>
{#if video == "true"}
    {#if showvideo}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video src="https://cdn.discordapp.com/attachments/533451891389104128/1090410725010309161/c77ocq_1.mp4"></video>
    {/if}
{:else}
<div class="max-w-[25vw]">
    {#if showimage}
        <img src="https://i.imgur.com/a17q9UF.jpeg" alt="demo">
    {/if}
</div>
{/if}
