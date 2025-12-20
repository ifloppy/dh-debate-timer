<script lang="ts">
    import * as Field from "$lib/components/ui/field";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";

    let { value = $bindable<string>() } = $props();
</script>

<Field.Set>
    <Field.Legend>流程设置</Field.Legend>
    <Field.Description>更改赛制设置</Field.Description>
    <Field.Field>
        <Field.Label>比赛流程JSON数据</Field.Label>
        <Textarea bind:value={value} required />
    </Field.Field>
</Field.Set>
