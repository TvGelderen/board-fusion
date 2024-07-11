<script lang="ts">
	import { onMount } from 'svelte';
	import { EAction, ETool, initializeBoard } from '$lib/board';
	import Toolbar from './Toolbar.svelte';

	onMount(() => {
		initializeBoard(EAction.Draw, ETool.Pencil);
	});
</script>

<Toolbar />

<canvas class="h-full w-full bg-white"></canvas>
