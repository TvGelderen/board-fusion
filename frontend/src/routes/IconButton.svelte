<script lang="ts">
    import Icon from "@iconify/svelte";

    export let icon = "";
    export let height = 32;
    export let onclick = () => {};
</script>

<Icon class="cursor-pointer" {icon} {height} {onclick} />