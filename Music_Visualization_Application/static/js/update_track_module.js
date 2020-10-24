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

//Updates the global_audio and its context with a buffer containing the stream URL found in the SOundCloud_track object
function loadTrack(SoundCloud_track) {
  global_audio_loader.load(SoundCloud_track.streamSource, function (buffer) {
    global_audio.setBuffer(buffer);
    global_audio.setLoop(true);
    global_audio.play();
  });
}

// Wrapper function that updates all relevant information regarding the audio, art, track title, and track artist using the SOundCloud_track object
export function updateMusicPlayer(SoundCloud_track) {
  loadTrack(SoundCloud_track);
  loadTrackArt(SoundCloud_track);
  loadTrackTitle(SoundCloud_track);
  loadTrackArtist(SoundCloud_track);
}
