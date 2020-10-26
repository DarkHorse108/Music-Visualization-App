// Updates the html img element containing the track art with the img url provided in the SoundCloud_track object
function loadTrackArt(SoundCloud_track) {
  $("#track_img").attr("src", SoundCloud_track.artworkSource);
}

// Updates the html h6 element containing the track title with the song title provided in the SoundCloud_track object
function loadTrackTitle(SoundCloud_track) {
  $("#track_title").html(SoundCloud_track.title);
}

// Updates the html h6 element containing the track artist with the song artist provided in the SoundCloud_track object
function loadTrackArtist(SoundCloud_track) {
  $("#track_artist").html(SoundCloud_track.artist);
}

function loadTrackDuration(SoundCloud_track) {
  $("#track_end_time").html(SoundCloud_track.duration);
}

// Wrapper function that updates all relevant information regarding the audio, art, track title, and track artist using the SOundCloud_track object
export function updateMusicPlayer(SoundCloud_track) {
  loadTrackArt(SoundCloud_track);
  loadTrackTitle(SoundCloud_track);
  loadTrackArtist(SoundCloud_track);
  loadTrackDuration(SoundCloud_track);
}
