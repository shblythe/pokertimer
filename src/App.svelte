<script>
    import { onMount } from 'svelte';
    import {
        small_blind, big_blind, clock_running, poker_clock,
        countdown, flash, paused
    } from './stores.js';

    import Chip from './Chip.svelte';

    const reset_game = () => {
        if (confirm("Really start a new game?"))
            poker_clock.stop();
    }

    const start_timer = () => {
        poker_clock.start();
    }

    onMount(() => {
        const interval = setInterval(() => {
            poker_clock.tick();
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    $: background_colour = $flash ? "bg-yellow-200":"bg-green-950";
    $: text_colour = $flash ? "text-green-950":"text-yellow-200";

</script>

<main class={"h-full m-0 "+background_colour}>
    <div class="flex flex-col space-y-8">
        <div class="flex flex-row space-x-8 justify-center m-8">
            <button disabled={$clock_running} on:click={start_timer} class="btn text-2xl">Start Timer</button>
            <button disabled={!$clock_running} on:click={reset_game} class="btn text-2xl">New Game</button>
        </div>
        <div class="flex flex-row text-yellow-200 space-x-8 md:space-x-16 justify-center">
            <div class="flex flex-col">
                <Chip colour="white"/>
                <div class={"text-center font-bold text-4xl "+text_colour}>200</div>
            </div>
            <div class="flex flex-col">
                <Chip colour="blue"/>
                <div class={"text-center font-bold text-4xl "+text_colour}>100</div>
            </div>
            <div class="flex flex-col">
                <Chip colour="green"/>
                <div class={"text-center font-bold text-4xl "+text_colour}>50</div>
            </div>
            <div class="flex flex-col">
                <Chip colour="red"/>
                <div class={"text-center font-bold text-4xl "+text_colour}>25</div>
            </div>
        </div>
        {#if $clock_running}
            <div class={"flex flex-row text-3xl md:text-5xl basis-1/5 font-bold justify-center "+text_colour}>
                Blinds: {$small_blind} / {$big_blind}
            </div>
            <div class={"flex flex-row text-6xl basis-1/5 font-bold justify-center "+text_colour}>
                {$countdown}
            </div>
            <div class="flex flex-row space-x-8 justify-center m-8">
                <button disabled={$paused} on:click={ () => {poker_clock.pause();} } class="btn text-2xl">Pause</button>
                <button disabled={!$paused} on:click={ () => {poker_clock.resume();} } class="btn text-2xl">Resume</button>
            </div>
        {/if}
    </div>
</main>

<style>
</style>
