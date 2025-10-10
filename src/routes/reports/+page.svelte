<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';
    import { redirauth, redirect, tabs } from '$lib/index.svelte';
    import bcrypt from 'bcryptjs';
	import { goto } from '$app/navigation';
    let { data }: PageProps = $props();
    tabs.location='/reports';
    tabs.preview='Reports';
    let reports = data.reports;
    let password = data.password;
    let reportstring: string = $state("");
    let selectedindex: number = $state(0);
    let outcome: string = $state("None selected");
    let showimage = $state(false);
    function toggleimage(){
        showimage = !showimage;
    }
    function refresh(){
        redirect.url = '/reports';
        redirauth.allow = true;
        goto('/redirect');
    }
    let entryauth = $state(true);
    let entryinput = $state("");
    let wrongpass = $state(false);
    function checkpass(){
        bcrypt.compare(entryinput, password).then((res)=>{
            if(res){
                entryauth=false;
            }else{
                wrongpass=true;
            }
        })
    }
</script>

{#if password && entryauth}
    <div class="flex flex-col items-center p-5">
        <p class="text-xl">
            Enter password to enter /<strong>reports</strong>:
        </p>
        <input type="password" class="input my-3 sm:w-[80vw] md:w-[50vw] border" bind:value={entryinput}/>
        <button type="button" class="btn preset-filled-success-500" onclick={checkpass}>Enter</button><br>
        {#if wrongpass}
            Incorrect Password
        {/if}
    </div>
{:else}
    {#if (selectedindex == (reports.length))}
        {#if reports.length == 0}
        No reports
        {:else}
        <button type="button" class="btn bg-secondary-500" onclick={refresh}>
            Refresh
        </button>
        {/if}
    {:else}
        {#each reports as report, index}
        {#if index == selectedindex}
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
                        Location: <strong class="text-xl">{report.boardname + "/" + report.threadid}</strong>
                    {:else}
                        Location: <strong class="text-xl">{report.boardname + "/" + report.threadid + "/" + report.replynum}</strong>
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
{/if}
