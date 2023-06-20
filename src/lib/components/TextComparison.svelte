<script lang="ts">
	import diff from 'simple-text-diff';

	export let correctAnswer: string;
	export let yourAnswer: string;

	let result = diff.diffPatch(correctAnswer, yourAnswer);
</script>

correct
<div class="correct-answer">{@html result.before}</div>

your answer
<div class="your-answer">{@html result.after}</div>

<style>
	.correct-answer :global(del) {
		@apply no-underline bg-green-300;
	}

	.your-answer :global(ins) {
		@apply line-through bg-red-300;
	}
</style>
