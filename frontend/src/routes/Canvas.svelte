<script lang="ts">
    import { onMount } from 'svelte';
    import { EAction, ETool, initializeBoard, updateAction, updateTool } from '$lib/board';
	import IconButton from './IconButton.svelte';
    import Icon from '@iconify/svelte';

    onMount(() => {
        initializeBoard();
    });
</script>

<div class="flex justify-between items-center p-2 shadow-md bg-white">
    <div class="flex">
        <Icon icon="material-symbols:brush-outline" height="36" />
        <h2 class="text-3xl ml-2">Board Fusion</h2>
    </div>
    <div class="flex gap-2">
        <IconButton icon="mdi:cursor-default-outline" onclick={() => updateAction(EAction.Drag)} />
        <IconButton icon="mdi:pencil-outline" onclick={() => updateTool(ETool.Pencil)} />
        <IconButton icon="mdi:crop-square" onclick={() => updateTool(ETool.Rectangle)} />
        <IconButton icon="mdi:vector-line" onclick={() => updateTool(ETool.Line)} />
    </div>
</div>

<div class="w-full h-full p-4">
    <canvas class="w-full h-full shadow-xl rounded-md bg-white"></canvas>
</div>
