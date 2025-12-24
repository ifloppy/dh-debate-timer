<div class="toolbar">
	<slot />
</div>

<style>
	.toolbar {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		gap: 2rem;
		padding-left: 2rem;
		padding-right: 2rem;
	}
</style>
