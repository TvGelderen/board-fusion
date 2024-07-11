<script lang="ts">
	import { onMount } from 'svelte';
	import { EAction, ETool, initializeBoard, updateAction, updateTool } from '$lib/board';
	import IconButton from './IconButton.svelte';

	type IconButtonType = {
		icon: string;
		active: boolean;
		onclick: () => void;
	};

	const iconButtons = $state<IconButtonType[]>([
		{
			icon: 'mdi:cursor-default-outline',
			active: false,
			onclick: () => updateAction(EAction.Drag)
		},
		{
			icon: 'mdi:pencil-outline',
			active: true,
			onclick: () => updateTool(ETool.Pencil)
		},
		{
			icon: 'mdi:crop-square',
			active: false,
			onclick: () => updateTool(ETool.Rectangle)
		},
		{
			icon: 'mdi:vector-line',
			active: false,
			onclick: () => updateTool(ETool.Line)
		}
	]);

	function handleIconClick(button: IconButtonType) {
        button.onclick();
        for (const b of iconButtons) {
            b.active = false;
        }
        button.active = true;
    }

	onMount(() => {
		initializeBoard(EAction.Draw, ETool.Pencil);
	});
</script>

<div
	class="absolute left-[50%] top-2 flex translate-x-[-50%] gap-2 rounded-md bg-white p-2 shadow-xl"
>
	{#each iconButtons as button}
		<IconButton icon={button.icon} active={button.active} onclick={() => handleIconClick(button)} />
	{/each}
</div>

<canvas class="h-full w-full bg-white"></canvas>
