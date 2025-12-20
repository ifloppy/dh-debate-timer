<script lang="ts">
    import { goto } from "$app/navigation";
    import defaultSettings from "$lib/assets/default.json?raw";
    import Background from "$lib/components/competition/background.svelte";
    import Toolbar from "$lib/components/competition/toolbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import type { DebateModelNormalized } from "$lib/model/config";
    import { onDestroy } from "svelte";

    // Ringtones
    let ringtone0s: HTMLAudioElement;
    let ringtone30s: HTMLAudioElement;

    // svelte-ignore non_reactive_update
    let config: DebateModelNormalized;
    {
        let rawJson = localStorage.getItem("settings");
        if (rawJson == null) {
            rawJson = defaultSettings;
            localStorage.setItem("settings", defaultSettings);
        }
        config = JSON.parse(rawJson);
    }

    function formatSeconds(seconds: number): string {
        const total = Math.max(0, Math.floor(seconds)); // 负数按0处理
        const minutes = Math.floor(total / 60);
        const secs = total % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    }

    let counting = $state(false);
    let speakingSide = $state(0); // 0: none, 1: affirmative, 2: negative
    let mode = $state(0); // 0: not started, 1: normal debate, 2: free debate
    let timer1 = $state(0);
    let timer2 = $state(0);
    let currentProcedureId = $state(0);
    let processIdMax = config.procedure.length;
    let timerIntervalId = 0;

    function startCounting() {
        timerIntervalId = setInterval(() => {
            if (mode == 1) {
                // Normal debate
                if (timer1 > 0) {
                    timer1--;
                    if (timer1 == 30) {
                        ringtone30s.play();
                    } else if (timer1 == 0) {
                        ringtone0s.play();
                    }
                }
            } else if (mode == 2) {
                // Free debate
                if (speakingSide == 1) {
                    // Affirmative speaking
                    if (timer1 > 0) {
                        timer1--;
                        if (timer1 == 30) {
                            ringtone30s.play();
                        } else if (timer1 == 0) {
                            ringtone0s.play();
                        }
                    }
                } else if (speakingSide == 2) {
                    // Negative speaking
                    if (timer2 > 0) {
                        timer2--;
                        if (timer2 == 30) {
                            ringtone30s.play();
                        } else if (timer2 == 0) {
                            ringtone0s.play();
                        }
                    }
                }
            }
        }, 1000);
        counting = true;
    }

    function stopCounting() {
        clearInterval(timerIntervalId);
        timerIntervalId = 0;
        counting = false;
    }

    function toggleCounting() {
        if (counting) {
            stopCounting();
        } else {
            startCounting();
        }
    }

    function firstProcedure() {
        timer1 = config.procedure[currentProcedureId].duration;
        if (config.procedure[currentProcedureId].type == 0) {
            // If normal debate
            mode = 1;
            speakingSide = 0;
        } else if (config.procedure[currentProcedureId].type == 1) {
            // If free debate
            timer2 = config.procedure[currentProcedureId].duration;
            mode = 2;
            speakingSide = 1; // Affirmative starts speaking
        }
    }
    function nextProcedure() {
        stopCounting();
        currentProcedureId++;
        if (currentProcedureId >= processIdMax) {
            mode = 3;
            goto("/end");
            return;
        }
        firstProcedure();
    }
    onDestroy(() => {
        clearInterval(timerIntervalId);
    });
</script>

<Background>
    {#if mode == 0}
        <div class="center">
            <h1 style="font-size: 54px;">{config.name}</h1>
            <h2 style="font-size: 48px">
                {config.affirmative} VS {config.negative}
            </h2>
            <p style="font-size: 28px">
                {config.affirmativeName} VS {config.negativeName}
            </p>
        </div>

        <Toolbar>
            <Button variant="secondary" onclick={() => goto("/")}>返回</Button>
            <Button onclick={firstProcedure}>开始</Button>
        </Toolbar>
    {:else if mode == 1}
        <div class="center">
            <h1 style="font-size: 54px;">{formatSeconds(timer1)}</h1>
            <h2 style="font-size: 48px;">
                {config.procedure[currentProcedureId].name}
            </h2>
            <h3 style="font-size: 36px">
                {config.affirmative} VS {config.negative}
            </h3>
        </div>
        <Toolbar>
            <Button variant="secondary" onclick={toggleCounting}
                >{counting ? "暂停" : "开始"}</Button
            >
            <Button onclick={nextProcedure}>结束</Button>
        </Toolbar>
    {:else if mode == 2}
        <div class="center">
            <h2 style="font-size: 48px;">
                {config.procedure[currentProcedureId].name}
            </h2>
            <div class="line">
                <span
                    style="justify-self: start; text-align: left; font-size: 54px;"
                    >{formatSeconds(timer1)}</span
                >
                <span
                    style="justify-self: end; text-align: right; font-size: 54px;"
                    >{formatSeconds(timer2)}</span
                >
            </div>
            <div class="line">
                {#if speakingSide == 1}
                    <span
                        style="justify-self: start; text-align: left; font-size: 36px;"
                        >正在发言</span
                    >
                {:else if speakingSide == 2}
                    <span
                        style="justify-self: end; text-align: right; font-size: 36px;"
                        >正在发言</span
                    >
                {/if}
            </div>
            <h3 style="font-size: 36px">
                {config.affirmative} VS {config.negative}
            </h3>
        </div>
        <Toolbar>
            <Button variant="secondary" onclick={toggleCounting}
                >{counting ? "暂停" : "开始"}</Button
            >
            <Button onclick={() => (speakingSide = speakingSide == 1 ? 2 : 1)}
                >换边</Button
            >
            <Button variant="secondary" onclick={nextProcedure}>结束</Button>
        </Toolbar>
    {:else if mode == 3}
        <div class="space-y-2">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
        </div>
    {:else}
        <h1>发生异常，请刷新页面</h1>
    {/if}
</Background>
<audio src="/ringtones/30s.mp3" bind:this={ringtone30s} preload="auto"></audio>
<audio src="/ringtones/0s.mp3" bind:this={ringtone0s} preload="auto"></audio>

<style>

    .line {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        width: 100vh;
    }
</style>
