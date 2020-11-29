// Import Howler Library for audio playback handling
import "./howler_js/howler.js";

import { displayPlayButton } from "./player_js/update_buttons_module.js";

import { DEFAULT_TRACK, FREQUENCY_SAMPLESIZE } from "./constants.js";

// Initialize new Howler.js object with its default track and behaviors
let globalAudio = new Howl({
  src: [DEFAULT_TRACK],
  volume: 0.5,
  autoplay: false,
  html5: false,
  loop: false,
});

// When audio has loaded, for safety ensure that frequency collection flag is set to false since no music is playing until the user presses play. As such we display the play button.
globalAudio.on("load", () => {
  globalAudio.pauseFrequencyCollection();
  displayPlayButton();
});

// When audio is playing, set the frequency collection flag to true and show the pause button to indicate the song can be paused.
globalAudio.on("play", () => {
  globalAudio.resumeFrequencyCollection();
  displayPauseButton();
});

// When a song finishes playing "on end", change the icon on the middle button of the music player to display a Play icon. If play is clicked after this occurs, song playback will begin again from the beginning of the track.
globalAudio.on("end", () => {
  globalAudio.pauseFrequencyCollection();
  displayPlayButton();
});

// Boolean to track whether to collect track frequencies or not
globalAudio.collectingTrackFrequencies = false;

// Add a function to globalAudio object to pause collecting of frequencies
globalAudio.pauseFrequencyCollection = () => {
  globalAudio.collectingTrackFrequencies = false;
};

// Add a function to globalAudio object to resume collecting of frequencies
globalAudio.resumeFrequencyCollection = () => {
  globalAudio.collectingTrackFrequencies = true;
};

// Modify Howler.js object's inner AudioContext to include an Analyser node which will allow us to retrieve data from the song being played.
let globalAnalyser = Howler.ctx.createAnalyser();
Howler.masterGain.connect(globalAnalyser);

// Each time globalAnalyser.getByteFrequencyData() is called and passed the array globalDataArray as an argument, the array will contain frequency data of the song at the time of the function call.
globalAnalyser.fftSize = FREQUENCY_SAMPLESIZE;
let bufferLength = globalAnalyser.frequencyBinCount;
let globalDataArray = new Uint8Array(bufferLength);

// Based on the current track's playback progress, return the number of seconds that have elapsed during the track's playback.
// This snippet was taken from the Howler.js documentation's music player example found here: https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
function getSecondsElapsed() {
  let secondsElapsed = globalAudio.seek() || 0;
  return secondsElapsed;
}

// Given the number of seconds elapsed during the track's playback, convert it to a percentage value relative to the total duration (in seconds) of the track.
// This snippet was taken from the Howler.js documentation's music player example found here: https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
function getPercentageElapsed(secondsElapsed) {
  let percentageElapsed = (secondsElapsed / globalAudio.duration()) * 100 || 0;
  return percentageElapsed;
}

export {
  globalAudio,
  globalAnalyser,
  globalDataArray,
  getSecondsElapsed,
  getPercentageElapsed,
};
