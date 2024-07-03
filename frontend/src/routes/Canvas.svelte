<script lang="ts">
import { onMount } from 'svelte';
import { initializeBoard } from '$lib/board';
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
        <Icon icon="mdi:pencil" height="32" />
        <Icon icon="mdi:crop-square" height="32" />
        <Icon icon="mdi:format-text" height="32" />
    </div>
</div>

<div class="w-full h-full p-4">
    <canvas class="w-full h-full shadow-xl rounded-md bg-white"></canvas>
</div>