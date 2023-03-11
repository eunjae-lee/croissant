<script lang="ts">
	const LINKS = [
		'https://giphy.com/gifs/agt-nbc-americas-got-talent-ruFFE06RFWOF66nk9V',
		'https://giphy.com/gifs/snl-thumbs-up-awesome-d2Z9QYzA2aidiWn6',
		'https://giphy.com/gifs/paramountplus-season1-s1e2-queenoftheuniverse-6JQ0wWi15NUG10ApMc',
		'https://giphy.com/gifs/loop-blue-celebration-l2Sqir5ZxfoS27EvS',
		'https://giphy.com/gifs/well-done-ZKW68Qo3vvxss',
		'https://giphy.com/gifs/awesome-yes-old-school-Z6f7vzq3iP6Mw',
		'https://giphy.com/gifs/redbull-3o6gaYpCy25SPkchSE',
		'https://giphy.com/gifs/samsungaustria-awesome-foldyourself-galaxy-z-serie-PaSnUZW1EeypulsOwd',
		'https://giphy.com/gifs/regalmovies-regal-loveregal-captainmarvel-l2RsBhyCSu5Y5XU3Zf',
		'https://giphy.com/gifs/bear-high-five-claw-26ufhqlbeuJsUbvDG',
		'https://giphy.com/gifs/excited-applause-jon-stewart-14sy6VGAd4BdKM',
		'https://giphy.com/gifs/Vida-Starz-excited-yes-4VUl7rVWLAYt90fLcH'
	];

	$: gifId = LINKS[Math.floor(Math.random() * LINKS.length)].split('-').at(-1);
</script>

<div class="flex justify-center">
	<iframe
		src={`https://giphy.com/embed/${gifId}`}
		frameBorder="0"
		class="giphy-embed w-full max-w-[32rem] aspect-square"
		allowFullScreen
	/>
</div>
