<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';
    import { redirauth, redirect, tabs } from '$lib/index.svelte';
	import { goto } from '$app/navigation';
    let { data, params }: PageProps = $props();
    tabs.location='/'+params.boardname+'/settings';
    tabs.preview='Settings';
    let reports = data.reports;
    let reportstring: string = $state("");
    let selectedindex: number = $state(0);
    let outcome: string = $state("None selected");
    let showimage = $state(false);
    function toggleimage(){
        showimage = !showimage;
    }
    function refresh(){
        redirect.url = '/'+params.boardname+'/settings/reports';
        redirauth.allow = true;
        goto('/redirect');
    }
</script>



{#if (selectedindex == (reports.length))}
    {#if reports.length == 0}
    No reports
    {:else}
    <button type="button" class="btn bg-secondary-500 m-3" onclick={refresh}>
        Refresh
    </button>
    {/if}
{:else}
    {#each reports as report, index}
    {#if index == selectedindex}
    <p class="m-3">{index+1}/{reports.length}</p>
    <form class="m-9" method="post" use:enhance={()=>{
        return async({result})=>{
            switch (result.type){
                case "success":
                    outcome = "None selected";
                    reportstring = "";
                    selectedindex += 1;
            }
        }
    }}>
        <div class="flex flex-col p-3 items-center justify-center border-2">
            <button type="button" class="btn bg-surface-600" onclick={toggleimage}>
                {report.filename}
            </button>
            <a href={report.url} target="_blank">
                <button type="button" class="btn bg-surface-700 my-2">
                    New Tab
                </button>
            </a>
            {#if showimage}
                <img src={report.url} alt={report.filename}>
            {/if}
            <p class="text-lg">
                Filename: {report.filename} <br>
                {#if (report.replynum == "-1")}
                    Location: <strong class="text-xl">{params.boardname + "/" + report.threadid}</strong>
                {:else}
                    Location: <strong class="text-xl">{params.boardname + "/" + report.threadid + "/" + report.replynum}</strong>
                {/if} <br>
                Reason: {report.reason}
            </p>
            <select name="outcome" class="select w-1/2" bind:value={outcome} onchange={()=>{
                reportstring = JSON.stringify(report);
                selectedindex = index;
            }}>
                <option>None selected</option>
                <option>Delete entirely</option>
                <option>Allow</option>
                <option>Allow and mark as NSFW</option>
            </select>
            <input type="hidden" name="reportstring" bind:value={reportstring}>
            {#if (outcome != "None selected")}
            <br>There is no confirmation dialog <br>
            <button type="submit" class="btn bg-error-500">
                Submit
            </button>
            {/if}
        </div>
    </form>
    {/if}
    {/each}
{/if}
