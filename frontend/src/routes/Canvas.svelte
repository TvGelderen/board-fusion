<script lang="ts">
    import { onMount } from 'svelte';
    import { EAction, ETool, initializeBoard, updateAction, updateTool } from '$lib/board';
	import IconButton from './IconButton.svelte';

    onMount(() => {
        initializeBoard();
    });
</script>

<div class="absolute flex gap-2 bg-white rounded-md shadow-xl p-2 top-2 left-[50%] translate-x-[-50%]">
    <IconButton icon="mdi:cursor-default-outline" onclick={() => updateAction(EAction.Drag)} />
    <IconButton icon="mdi:pencil-outline" onclick={() => updateTool(ETool.Pencil)} />
    <IconButton icon="mdi:crop-square" onclick={() => updateTool(ETool.Rectangle)} />
    <IconButton icon="mdi:vector-line" onclick={() => updateTool(ETool.Line)} />
</div>

<canvas class="w-full h-full bg-white"></canvas>
