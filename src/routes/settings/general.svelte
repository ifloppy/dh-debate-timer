<script lang="ts">
    import * as Field from "$lib/components/ui/field";
    import { Input } from "$lib/components/ui/input";
    import type { DebateModelNormalized } from "$lib/model/config";

    let { value = $bindable<DebateModelNormalized>() } = $props();
</script>

<Field.Set>
    <Field.Legend>常规设置</Field.Legend>
    <Field.Description>赛前进行的常规设置</Field.Description>
    <Field.Field>
        <Field.Label>赛事名称</Field.Label>
        <Input bind:value={value.name} required />
    </Field.Field>
    <Field.Field>
        <Field.Label>主办方</Field.Label>
        <Input bind:value={value.organizer} required />
    </Field.Field>
    <Field.Field>
        <Field.Label>正方立场</Field.Label>
        <Input bind:value={value.affirmative} required />
    </Field.Field>
    <Field.Field>
        <Field.Label>反方立场</Field.Label>
        <Input bind:value={value.negative} required />
    </Field.Field>
    <Field.Field>
        <Field.Label>正方队名</Field.Label>
        <Input bind:value={value.affirmativeName} required />
    </Field.Field>
    <Field.Field>
        <Field.Label>反方队名</Field.Label>
        <Input bind:value={value.negativeName} required />
    </Field.Field>
</Field.Set>
