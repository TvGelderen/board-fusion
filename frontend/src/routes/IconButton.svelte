<script lang="ts">
    import Icon from "@iconify/svelte";

    export let icon = "";
    export let height = 36;
    export let active = false;
    export let onclick = () => {};
</script>

<Icon class="cursor-pointer p-[4px] rounded-md transition-colors {active ? "bg-primary/80" : "bg-white hover:bg-primary/30"}" {icon} {height} {onclick} />
