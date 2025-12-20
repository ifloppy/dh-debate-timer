<script lang="ts">
    import * as Field from "$lib/components/ui/field/index";
    import * as Tabs from "$lib/components/ui/tabs/index";
    import GeneralSettings from "./general.svelte";
    import ProcedureSettings from "./procedure.svelte";
    import defaultSettings from "$lib/assets/default.json?raw";
    import type { DebateModelNormalized } from "$lib/model/config";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    
    let rawJson = localStorage.getItem("settings");
    if (rawJson == null) {
        rawJson = defaultSettings;
        localStorage.setItem("settings", defaultSettings);
    }
    let alertVisible = $state(false);

    let json: DebateModelNormalized = $state(JSON.parse(rawJson));
    // svelte-ignore state_referenced_locally
    let procedureJson: string = $state(JSON.stringify(json.procedure));

    function resetSettings() {
        rawJson = defaultSettings;
        localStorage.setItem("settings", rawJson);
        json = JSON.parse(rawJson);
        procedureJson = JSON.stringify(json.procedure);
    }

    function saveSettings() {
        json.procedure = JSON.parse(procedureJson);
        localStorage.setItem("settings", JSON.stringify(json));
        alertVisible = true;
        setTimeout(() => {
            alertVisible = false;
        }, 3000);
    }
</script>

<div style="padding: 4%;">
    <form>
        <Field.Group>
            <Tabs.Root value="general">
                <Tabs.List>
                    <Tabs.Trigger value="general">常规设置</Tabs.Trigger>
                    <Tabs.Trigger value="procedure">流程设置</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="general">
                    <GeneralSettings bind:value={json} />
                </Tabs.Content>
                <Tabs.Content value="procedure">
                    <ProcedureSettings bind:value={procedureJson} />
                </Tabs.Content>
            </Tabs.Root>
            <Field.Separator></Field.Separator>
            <Field.Field orientation="horizontal">
                <Button onclick={saveSettings} type="submit">保存</Button>
                <Button onclick={() => goto("/")} variant="secondary"
                    >关闭</Button
                >
                <Button onclick={() => resetSettings()} variant="destructive"
                    >重置</Button
                >
            </Field.Field>
        </Field.Group>
    </form>
    {#if alertVisible}
    <div style="margin-top: 20px;">
    <Alert.Root>
        <CheckCircle2Icon />
        <Alert.Title>已保存设定</Alert.Title>
    </Alert.Root>
    </div>
    {/if}
    
</div>
