async function requestTrack(url, id) {
	// Check url length and if it includes a valid prefix
	if (url.length < 24 || !url.includes('https://soundcloud.com/')) {
		throw new Error('Invalid link!');
	}

	// Request JSON from SoundCloud server and await response
	const getTrackData = await fetch(
		`https://api.soundcloud.com/resolve?url=${url}&client_id=${id}`
	);

	// Parse response as JSON and store select keys into trackData object
	if (getTrackData.status === 200) {
		// Asynchronously parse json
		const data = await getTrackData.json();

		// Asynchronously request track header to acquire url of mp3
		const mp3Stream = await fetch(`${data.stream_url}?client_id=${id}`);

		return {
			streamSource: mp3Stream.url,
			artworkSource: data.artwork_url.replace('large', `t250x250`),
			artist: `${data.user['username']}`,
			title: `${data.title}`,
			duration: `${convertToMinSec(Number(data.duration))}`,
		};
	} else {
		throw new Error('Cannot acquire track info');
	}
}

// Convert from milliseconds to MM:SS format
function convertToMinSec(duration) {
	// Convert total track duration from milliseconds to minutes
	const totalMinutes = duration / 60000;

	// Calculate minutes portion of format MM:SS
	// Math.floor removes fractional minute remainder
	const minutes = Math.floor(totalMinutes);

	// Calculate seconds portion of format MM:SS and set to 2 digits
	// (totalMinutes - minutes) results in a fractional minute
	// Multiply by 60 to get secs
	const seconds = ((totalMinutes - minutes) * 60).toPrecision(2);

	return `${minutes}:${seconds}`;
}
