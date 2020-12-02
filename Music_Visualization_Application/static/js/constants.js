// Capture the form HTML element associated with the submission form for the SoundCloud URL by the user
const canvasContainer = document.getElementById("animation_div");
const INPUT_FORM = document.getElementById("user_form_element");
// Capture the button HTML element associated with the play/pause button and volume up and volume down buttons.
const PLAY_BUTTON = document.getElementById("play_pause_button");
const VOLUME_UP_BUTTON = document.getElementById("volume_up_button");
const VOLUME_DOWN_BUTTON = document.getElementById("volume_down_button");

// Initialize the default track
const DEFAULT_TRACK = "./static/mp3/cat_song.mp3";

// The quantity of fast fourier transform samples of the track's frequency to be sampled per call to the Analyzer Node.
const FREQUENCY_SAMPLESIZE = 256;

// Set the opacity fading increments
const FADE_STEPS = 0.02;

export {
  canvasContainer,
  INPUT_FORM,
  PLAY_BUTTON,
  VOLUME_UP_BUTTON,
  VOLUME_DOWN_BUTTON,
  DEFAULT_TRACK,
  FREQUENCY_SAMPLESIZE,
  FADE_STEPS,
};
