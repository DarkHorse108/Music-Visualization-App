// Capture the form HTML element associated with the submission form for the SoundCloud URL by the user
const canvasContainer = document.getElementById("animation_div");
const INPUT_FORM = document.getElementById("user_form_element");
// Capture the button HTML element associated with the play/pause button and volume up and volume down buttons.
const PLAY_BUTTON = document.getElementById("play_pause_button");
const VOLUME_UP_BUTTON = document.getElementById("volume_up_button");
const VOLUME_DOWN_BUTTON = document.getElementById("volume_down_button");
// Initialize the default track
const DEFAULT_TRACK =
  "https://ia802807.us.archive.org/23/items/cd_mozart_wolfgang-amadeus-mozart-richard-goode/disc1/07.%20Wolfgang%20Amadeus%20Mozart%20-%20Rondo%20in%20A%20minor%2C%20K.%20511_sample.mp3";
// The quantity of fast fourier transform samples of the track's frequency to be sampled per call to the Analyzer Node.
const FREQUENCY_SAMPLESIZE = 256;

export {
  canvasContainer,
  INPUT_FORM,
  PLAY_BUTTON,
  VOLUME_UP_BUTTON,
  VOLUME_DOWN_BUTTON,
  DEFAULT_TRACK,
  FREQUENCY_SAMPLESIZE,
};
