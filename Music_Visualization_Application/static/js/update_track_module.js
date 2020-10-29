// Updates the html img element containing the track art with the img url provided in the SoundCloud_track object
function loadTrackArt(SoundCloud_track) {
  $("#track_img").attr("src", SoundCloud_track.artworkSource);
}

// Updates the html h6 element containing the track title with the song title provided in the SoundCloud_track object. If the track title is longer than 45 characters, it will have a marquee effect by adding the marquee class to it.
function loadTrackTitle(SoundCloud_track) {
  if (SoundCloud_track.title.length > 45) {
    $("#track_title_outer").addClass("marquee");
  } else {
    $("#track_title_outer").removeClass("marquee");
  }
  $("#track_title_text").html(SoundCloud_track.title);
}

// Updates the html h6 element containing the track artist with the song artist provided in the SoundCloud_track object. If the track artist is longer than 45 characters, it will have a marquee effect by adding the marquee class to it.
function loadTrackArtist(SoundCloud_track) {
  if (SoundCloud_track.artist.length > 45) {
    $("#track_artist_outer").addClass("marquee");
  } else {
    $("#track_artist_outer").removeClass("marquee");
  }
  $("#track_artist_text").html(SoundCloud_track.artist);
}

// Loads the total duration of the song, in minutes:seconds format i.e. (1:15)
function loadTrackDuration(SoundCloud_track) {
  $("#track_end_time").html(SoundCloud_track.duration);
}

// Converts an argument representing units of time in seconds, into a format reflecting minutes:seconds as a string and returns it.
// This snippet was taken from the Howler.js documentation's music player example found here: https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
function formatTime(total_seconds_elapsed) {
  var formatted_minutes = Math.floor(total_seconds_elapsed / 60) || 0;
  var formatted_seconds = total_seconds_elapsed - formatted_minutes * 60 || 0;

  return (
    formatted_minutes +
    ":" +
    (formatted_seconds < 10 ? "0" : "") +
    formatted_seconds
  );
}

// Takes an argument representing units of time in seconds, converts it into minutes:seconds format and places that value as the value of the paragraph element with id "track_current_time".
export function displayTimeElapsed(seconds_elapsed) {
  let formatted_time = formatTime(Math.round(seconds_elapsed));
  $("#track_current_time").html(formatted_time);
}

// Takes a numerical (integer or float) value as an argument, representing a percentage. This value is placed as the value of the range input element with id "track_seeker" which shows the
// progress of the played track as a progress/seeker bar.
export function displayProgressBarElapsed(percentage_elapsed) {
  $("#track_seeker").val(percentage_elapsed);
}

// Wrapper function that updates all relevant information regarding the audio, art, track title, and track artist using the SOundCloud_track object
export function updateMusicPlayer(SoundCloud_track) {
  loadTrackArt(SoundCloud_track);
  loadTrackTitle(SoundCloud_track);
  loadTrackArtist(SoundCloud_track);
  loadTrackDuration(SoundCloud_track);
}
