<script lang="ts">
	import { EAction, ETool, updateAction, updateTool } from "$lib/board";
	import IconButton from "./IconButton.svelte";

	type IconButtonType = {
		icon: string;
		onclick: () => void;
	};

    const iconDrag = 'mdi:cursor-default-outline';
    const iconPencil = 'mdi:pencil-outline';
    const iconSquare = 'mdi:crop-square';
    const iconLine = 'mdi:vector-line';

	const iconButtons: IconButtonType[] = [
		{
			icon: iconDrag,
			onclick: () => {
                updateAction(EAction.Drag);
                activeIcon = iconDrag;
            }
		},
		{
			icon: iconPencil,
			onclick: () => {
                updateTool(ETool.Pencil);
                activeIcon = iconPencil;
            }
		},
		{
			icon: iconSquare,
			onclick: () => {
                updateTool(ETool.Rectangle);
                activeIcon = iconSquare;
            }
		},
		{
			icon: iconLine,
			onclick: () => {
                updateTool(ETool.Line);
                activeIcon = iconLine;
            }
		}
	];

    let activeIcon = $state(iconPencil);
</script>

<div
	class="absolute left-[50%] top-2 flex translate-x-[-50%] gap-2 rounded-md bg-white p-2 shadow-xl"
>
	{#each iconButtons as button}
		<IconButton icon={button.icon} active={activeIcon === button.icon} onclick={button.onclick} />
	{/each}
</div>

