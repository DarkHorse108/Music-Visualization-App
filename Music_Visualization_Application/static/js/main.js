////////////////////////////////////////Import Statements////////////////////////////////////////

// Import Howler Library for audio playback handling
import "./howler_js/howler.js";

// Import the SoundCloud client_id associated with your application
import { client_id } from "./config.js";

// Import the displayErrorMessage and clearErrorMessage functions
import {
  displayErrorMessage,
  clearErrorMessage,
} from "./error_message_module.js";

// Import the requestTrack function
import { requestTrack } from "./soundcloud_request_module.js";

// Import the function that updates what track is being played, along with the information displayed about that track
import {
  displayTimeElapsed,
  displayProgressBarElapsed,
  updateMusicPlayer,
} from "./update_track_module.js";

// Import the functions to change the icon associated with the middle playback control button to reflect Pause, Play, and Loading.
import {
  displayPauseButton,
  displayPlayButton,
  displayLoadingButton,
} from "./update_buttons_module.js";

import { World } from "./three_js/World.js";

////////////////////////////////////////////////////////////////////////////////////////
("use strict");

// requestAnimationFrame polyfill by Erik Möller.
// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavic, Darius Bacon and Joan Alba Maldonado.
// Adapted from https://gist.github.com/paulirish/1579671 which derived from
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// Added high resolution timing. This window.performance.now() polyfill can be used: https://gist.github.com/jalbam/cc805ac3cfe14004ecdf323159ecf40e
// MIT license
// Gist: https://gist.github.com/jalbam/5fe05443270fa6d8136238ec72accbc0
(function () {
  var vendors = ["webkit", "moz", "ms", "o"],
    vp = null;
  for (
    var x = 0;
    x < vendors.length &&
    !window.requestAnimationFrame &&
    !window.cancelAnimationFrame;
    x++
  ) {
    vp = vendors[x];
    window.requestAnimationFrame =
      window.requestAnimationFrame || window[vp + "RequestAnimationFrame"];
    window.cancelAnimationFrame =
      window.cancelAnimationFrame ||
      window[vp + "CancelAnimationFrame"] ||
      window[vp + "CancelRequestAnimationFrame"];
  }
  if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) ||
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
  ) {
    //iOS6 is buggy.
    var lastTime = 0;
    window.requestAnimationFrame = function (callback, element) {
      var now = window.performance.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function () {
        callback((lastTime = nextTime));
      }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }
})();

////////////////////////////////////////Constants////////////////////////////////////////

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

////////////////////////////////////////Global variables/objects////////////////////////////////////////

// Initialize new Howler.js object with its default track and behaviors
let globalAudio = new Howl({
  src: [DEFAULT_TRACK],
  volume: 0.5,
  autoplay: false,
  html5: false,
  loop: false,
});

// Modify Howler.js object's inner AudioContext to include an Analyser node which will allow us to retrieve data from the song being played.
let globalAnalyser = Howler.ctx.createAnalyser();
Howler.masterGain.connect(globalAnalyser);

// Each time globalAnalyser.getByteFrequencyData() is called and passed the array globalDataArray as an argument, the array will contain frequency data of the song at the time of the function call.
globalAnalyser.fftSize = FREQUENCY_SAMPLESIZE;
let bufferLength = globalAnalyser.frequencyBinCount;
let globalDataArray = new Uint8Array(bufferLength);

// Boolean flag indicating whether or not we want to be collecting frequency data from the song.
let collectingTrackFrequencies = false;

////////////////////////////////////////Global function definitions////////////////////////////////////////

// Only display the Play button on the middle music player control button when the track has been fully loaded.

// Load a new instanced threeJS world
let world = new World(canvasContainer);

// When a track is played, the below functions will be called once per frame.
// We update the seconds elapsed of the track during playback per frame.
// We update the percentage of the total song played visually in the progress/seek bar for the track.
// We determine whether or not to collect track frequency data.
function callPerFrame() {
  let secondsElapsed = getSecondsElapsed();
  let percentageElapsed = getPercentageElapsed(secondsElapsed);
  displayTimeElapsed(secondsElapsed);
  displayProgressBarElapsed(percentageElapsed);

  // If we intend to collect frequency data during this frame, do so through our analyser node and store the resulting array of data in the globalDataArray
  if (collectingTrackFrequencies) {
    globalAnalyser.getByteFrequencyData(globalDataArray);

    // Render a single three.js frame that is informed by data
    world.render(globalDataArray);
  }

  requestAnimationFrame(callPerFrame);
}

callPerFrame();

globalAudio.on("load", () => {
  pauseFrequencyCollection();
  displayPlayButton();
});

globalAudio.on("play", () => {
  resumeFrequencyCollection();
  displayPauseButton();
});

// When a song finishes playing "on end", change the icon on the middle button of the music player to display a Play icon. If play is clicked after this occurs, song playback will begin again from the beginning of the track.
globalAudio.on("end", () => {
  pauseFrequencyCollection();
  displayPlayButton();
});

// This function sets the flag for whether or not we want to collect frequency data for what track is currently playing to FALSE.
function pauseFrequencyCollection() {
  collectingTrackFrequencies = false;
}

// This function sets the flag for whether or not we want to collect frequency data for what track is currently playing to TRUE.
function resumeFrequencyCollection() {
  collectingTrackFrequencies = true;
}

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

// Make a GET request to the Flask server, sending the track id of the requested song in the request. The Flask server will create its own get request and obtain the URL of the direct mp3 stream/file of the track itself and return it.
// Once the URL has been obtained, we change the source of the globalAudio howler object to be the URL of the direct mp3 stream for the requested song. We update the middle button of the music player to display a loading icon while the
// request is being made, and to also display a play icon when the globalAudio source has been updated and is ready to play.
function loadTrack(SoundCloud_track) {
  globalAudio.changeSrc(SoundCloud_track.streamSource);
}

////////////////////////////////////////HTML Event Listeners////////////////////////////////////////

// Add an eventlistener when the form has been submitted (i.e. when the submit button is pressed).
INPUT_FORM.addEventListener("submit", function (event) {
  //Prevent refreshing of the page and then take the string value the user entered in the form and store it in the variable user_url.
  event.preventDefault();

  // Display Loading Button to show that we have begun loading the track.
  displayLoadingButton();

  let user_url = document.getElementById("user_input_url").value;

  // Reset the form and remove any text entered by the user in the form, as we have already captured it in user_url. If there is any error message to the user currently being shown, remove it to indicate to the user that their input is being processed.
  INPUT_FORM.reset();
  clearErrorMessage();

  // Take the URL provided by the user, and your SoundCloud client id, and request information about the track using requestTrack() and save the returned object in var "results".
  // If the request was successful, update the front-end with the information that was returned.
  const results = requestTrack(user_url, client_id)
    .then((SoundCloud_track) => {
      // Pause collection of frequency data
      pauseFrequencyCollection();

      // Stop playing audio
      globalAudio.stop();

      // Load the new track
      loadTrack(SoundCloud_track);

      // Update the Music Player with the new track's information, such as artist, title, total duration.
      updateMusicPlayer(SoundCloud_track);
    })
    // If the request was not successful, print to the console the error message indicating why.
    .catch((errorVariable) => {
      if (globalAudio.playing()) {
        displayPauseButton();
      } else {
        displayPlayButton();
      }
      console.log(errorVariable.message);
      displayErrorMessage();
    });
});

// Listen for click activity on the play button.
// If music is currently playing and the button is pressed, pause the loaded track, and change the button icon to the Play icon to indicate that the music has been stopped but can be resumed, and stop collection of frequency data for the song.
// If music is not currently playing and the button is pressed, play the loaded track, and change the button icon to the Pause icon to indicate that the music is playing now but can be paused, and resume collection of frequency data for the song.
PLAY_BUTTON.addEventListener("click", function (event) {
  if (globalAudio.playing()) {
    globalAudio.pause();
    pauseFrequencyCollection();
    displayPlayButton();
  } else if (globalAudio.state() === "loaded") {
    globalAudio.play();
    resumeFrequencyCollection();
    displayPauseButton();
  }
});

// Event listener to increase volume on click of the volume up button
VOLUME_UP_BUTTON.addEventListener("click", function (event) {
  globalAudio.volume(globalAudio.volume() + 0.2);
});

// Event listener to decrease volume on click of the volume down button
VOLUME_DOWN_BUTTON.addEventListener("click", function (event) {
  globalAudio.volume(globalAudio.volume() - 0.2);
});
