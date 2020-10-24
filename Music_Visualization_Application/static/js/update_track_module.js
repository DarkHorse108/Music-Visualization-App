function loadTrackArt(SoundCloud_track) {
  $("#track_img").attr("src", SoundCloud_track.artworkSource);
}

function loadTrackTitle(SoundCloud_track) {
  $("#track_title").html(SoundCloud_track.title);
}

function loadTrackArtist(SoundCloud_track) {
  $("#track_artist").html(SoundCloud_track.artist);
}

function loadTrack(SoundCloud_track) {
  global_audio_loader.load(SoundCloud_track.streamSource, function (buffer) {
    global_audio.setBuffer(buffer);
    global_audio.setLoop(true);
    global_audio.play();
  });
}

export function updateMusicPlayer(SoundCloud_track) {
  loadTrack(SoundCloud_track);
  loadTrackArt(SoundCloud_track);
  loadTrackTitle(SoundCloud_track);
  loadTrackArtist(SoundCloud_track);
}
