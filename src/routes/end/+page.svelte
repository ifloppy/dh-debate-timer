<script lang="ts">
    import { goto } from "$app/navigation";
    import Background from "$lib/components/competition/background.svelte";
    import Toolbar from "$lib/components/competition/toolbar.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { DebateModelNormalized } from "$lib/model/config";
    import House from "@lucide/svelte/icons/house";

    let config: DebateModelNormalized;
    {
        let rawJson = localStorage.getItem("settings");
        if (rawJson != null) {
            config = JSON.parse(rawJson);
        }
    }
</script>

<Background>
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
        <Button onclick={() => goto("/")}><House></House></Button>
    </Toolbar>
</Background>

<style>
    .center {
        flex: 1; /* 占满剩余空间，把 bottom 挤到最底 */
        display: flex;
        flex-direction: column;
        align-items: center; /* 水平居中 */
        justify-content: center; /* 垂直居中（仅对这组内容） */
    }
</style>
