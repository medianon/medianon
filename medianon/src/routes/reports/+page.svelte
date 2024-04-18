<script lang="ts">
    import type { PageData } from './$types';
    import type { report } from '$lib/store';
	import { returl } from '$lib/store';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    export let data: PageData;
    let reportarray: report[] = data.reports;
    // console.log(reportarray);
    let reportstring: string;
    let selectedindex = 0;
    let selected: string;
    function refresh(){
        returl.set("/reports");
        goto("/redirect");
    }
</script>

<form class="m-9" method="post" use:enhance={()=>{
        return async({result})=>{
            switch (result.type){
                case "success":
                    if(selectedindex < reportarray.length){
                        selectedindex += 1;
                        selected = "None selected";
                    }
            }
        }
}}>

{#if (selectedindex == (reportarray.length))}
    <p role="button" on:click={refresh}>Refresh</p>
{:else}
    {#each reportarray as report, index}
        {#if index == selectedindex}
            <div class="border-field border-4 flex-col">
                <img src={report.url} alt={report.filename}>
                <p>
                    Filename: {report.filename} <br>
                    {#if (report.postnum != undefined)}
                    Location: {report.boardname + "/" + report.threadid + "/" + report.postnum}
                    {:else}
                    Location: {report.boardname + "/" + report.threadid}
                    {/if} <br>
                    Reason: {report.reason}
                </p>
                <select name="outcome" bind:value={selected} on:change={()=>{
                    reportstring = JSON.stringify(report);
                }}>
                    <option>None selected</option>
                    <option>Delete entirely</option>
                    <option>Keep</option>
                    <option>Keep NSFW</option>
                </select>
                <input type="hidden" name="reportstring" bind:value={reportstring}>
                {#if (selected != "None selected")}
                <br><br>
                <button role="button" class=" w-min">
                    Submit
                </button>
                {/if}
            </div>
        {/if}
    {/each}
{/if}

</form>
