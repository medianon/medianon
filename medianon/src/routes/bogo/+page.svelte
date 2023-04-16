<script lang="ts">
    import Threadbox from "../../components/boxes/threadbox.svelte";
    import Replybox from "../../components/boxes/replybox.svelte";
    import { tabdata, usebogo, bogocount } from "$lib/store";
    tabdata.set({
        boardname: "bogo"
    })
    import type { PageData } from './$types';
    export let data: PageData;

    function togglebogo(){
        usebogo.set(!$usebogo)
    }
</script>

<div class="text-center mt-6">
    Bogo sort takes all boards that have opted in to be searched by it and picks one at random. <br>
    If there are no threads in the selected board, it fails and you have to try again. Otherwise it takes the threads in that board and picks one at random. <br>
    A digital coin is flipped. If its heads, the thread is returned. <br>
    If its tails, it takes all the replies to that thread and picks one at random. <br>
    If there are no replies, it fails and you have to try again. Otherwise, the reply is returned. <br><br>
    There is absolutely no way to predict what you will see. You may come across something NSFW/very unpleasant. <br>
    By pressing 'I agree', you agree that you are using this optional feature at your own risk and you understand what these risks are. <br>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <p role="button" on:click={togglebogo}>I agree</p><br>

</div>
<div class="mt-6 items-center">
    {#if $usebogo}
        {#if data.failure}
                {data.failure}
        {:else if data.threadata}
        <div class="w-full text-center">
            <Threadbox boardname = {data.boardname} threadid = {data.threadid} postdata = {data.threadata}/>
        </div>
        {:else if data.postnum}
        <div class="w-full text-center">
            <Replybox boardname = {data.boardname} threadid = {data.threadid} postdata = {data.postdata} />
        </div>
        {/if}
    {/if}
</div>
<p>You have clicked 'Bogo Sort' {$bogocount} times.</p><br>
{#if $bogocount > 10}
    <p>as you may have noticed, it doesnt work perfectly. but each click still generates server costs so please be nice :) </p>
{/if}