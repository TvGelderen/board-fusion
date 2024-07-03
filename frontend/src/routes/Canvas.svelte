<script lang="ts">
    import { onMount } from 'svelte';
    import { EBoardAction, initializeBoard, updateAction } from '$lib/board';
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
        <IconButton icon="mdi:pencil" onclick={() => updateAction(EBoardAction.Pencil)} />
        <IconButton icon="mdi:crop-square" onclick={() => updateAction(EBoardAction.Rectangle)} />
        <IconButton icon="mdi:vector-line" onclick={() => updateAction(EBoardAction.Line)} />
        <IconButton icon="mdi:format-text" onclick={() => updateAction(EBoardAction.Text)} />
    </div>
</div>

<div class="w-full h-full p-4">
    <canvas class="w-full h-full shadow-xl rounded-md bg-white"></canvas>
</div>