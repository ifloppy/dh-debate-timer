<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import Play from "@lucide/svelte/icons/play";
    import Settings from "@lucide/svelte/icons/settings";

    import defaultSettings from "$lib/assets/default.json?raw";
    import { toggleMode } from "mode-watcher";
    import SunIcon from "@lucide/svelte/icons/sun";
    import MoonIcon from "@lucide/svelte/icons/moon";
    import FullScreen from "@lucide/svelte/icons/fullscreen";

    let rawJson = localStorage.getItem("settings");
    if (rawJson == null) {
        rawJson = defaultSettings;
        localStorage.setItem("settings", defaultSettings);
    }

    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Toolbar from "$lib/components/competition/toolbar.svelte";

    const isFullscreen = writable(false);

    function syncFullscreenState() {
        isFullscreen.set(!!document.fullscreenElement);
    }

    async function toggleFullscreen() {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await document.documentElement.requestFullscreen({
                    navigationUI: "hide" as any,
                });
            }
        } catch (err) {
            console.error("切换全屏失败：", err);
        } finally {
            syncFullscreenState();
        }
    }

    onMount(() => {
        syncFullscreenState();
        const onChange = () => syncFullscreenState();
        document.addEventListener("fullscreenchange", onChange);
        document.addEventListener("fullscreenerror", onChange);
        return () => {
            document.removeEventListener("fullscreenchange", onChange);
            document.removeEventListener("fullscreenerror", onChange);
        };
    });
</script>

<div class="page-container">
    <div class="center" style="gap: 16px">
        <h1 style="font-size: 54px;">东海辩论计时器</h1>

        <Button href="/competition"><Play />开始比赛</Button>
        <Button variant="secondary" href="/settings"
            ><Settings />设置赛制</Button
        >
        <div style="flex-direction: row;">
            <Button onclick={toggleMode} variant="outline" size="icon">
                <SunIcon
                    class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
                />
                <MoonIcon
                    class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
            <Button onclick={toggleFullscreen}>
                <FullScreen></FullScreen>
            </Button>
        </div>
    </div>

    <Toolbar>
        <p style="opacity: 0.4;">由 iruanp.com 制作，使用svelte.js开发</p>
    </Toolbar>
</div>

<style>
    .page-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        gap: 16px;
    }
</style>
