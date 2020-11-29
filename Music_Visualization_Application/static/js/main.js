// Import the SoundCloud client_id associated with your application
import { client_id } from "./config.js";

// Import the displayErrorMessage and clearErrorMessage functions
import {
  displayErrorMessage,
  clearErrorMessage,
} from "./player_js/error_message_module.js";

// Import the requestTrack function
import { requestTrack } from "./player_js/soundcloud_request_module.js";

// Import the function that updates what track is being played, along with the information displayed about that track
import {
  displayTimeElapsed,
  displayProgressBarElapsed,
  updateMusicPlayer,
} from "./player_js/update_track_module.js";

// Import the functions to change the icon associated with the middle playback control button to reflect Pause, Play, and Loading.
import {
  displayPauseButton,
  displayPlayButton,
  displayLoadingButton,
} from "./player_js/update_buttons_module.js";

import { World } from "./three_js/World.js";

import { animation_polyfill } from "./animation_polyfill.js";

import {
  canvasContainer,
  INPUT_FORM,
  PLAY_BUTTON,
  VOLUME_UP_BUTTON,
  VOLUME_DOWN_BUTTON,
  DEFAULT_TRACK,
  FREQUENCY_SAMPLESIZE,
} from "./constants.js";

import {
  globalAudio,
  globalAnalyser,
  globalDataArray,
  getSecondsElapsed,
  getPercentageElapsed,
} from "./audio_module.js";

import {
  playButtonClick,
  volumeUpButtonClick,
  volumeDownButtonClick,
} from "./player_js/player_event_listeners_module.js";

////////////////////////////////////////////////////////////////////////////////////////
("use strict");

// Polyfill requestAnimationFrame for smoother animation
animation_polyfill();

// A default array with 0s in all its indices that is fed into the very first render of the animation when the application is first loaded and we have no array from actual song data yet.
let cleanDataArray = [];
for (let i = 0; i < FREQUENCY_SAMPLESIZE / 2; i++) {
  cleanDataArray[i] = 0;
}

// Load a new instanced threeJS world and render it using the cleanDataArray. After the animation has loaded once, we will use actual array data containing frequency information held in globalDataArray. We do this because render current requires an array argument.
let world = new World(canvasContainer);
world.render(cleanDataArray);

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
  if (globalAudio.collectingTrackFrequencies) {
    globalAnalyser.getByteFrequencyData(globalDataArray);

    // Render a single three.js frame that is informed by data
    world.render(globalDataArray);
  }

  requestAnimationFrame(callPerFrame);
}

callPerFrame();

////////////////////////////////////////HTML Event Listeners////////////////////////////////////////

// Add an eventlistener when the form has been submitted (i.e. when the submit button is pressed).
INPUT_FORM.addEventListener("submit", function (event) {
  //Prevent refreshing of the page and then take the string value the user entered in the form and store it in the variable user_url.
  event.preventDefault();

  // Display Loading Button to show that we have begun loading the track.
  displayLoadingButton();

  let user_url = document.getElementById("user_input_url").value;

  // Reset the form and remove any text entered by the user in the form, as we have already captured it in user_url.
  INPUT_FORM.reset();

  //If there is any error message to the user currently being shown, remove it to indicate to the user that their input is being processed.
  clearErrorMessage();

  // Take the URL provided by the user, and your SoundCloud client id, and request information about the track using requestTrack() and save the returned object in var "results".
  // If the request was successful, update the front-end with the information that was returned.
  const results = requestTrack(user_url, client_id)
    .then((SoundCloud_track) => {
      // Pause collection of frequency data, stop playing audio, and load the new track
      globalAudio.pauseFrequencyCollection();
      globalAudio.stop();
      globalAudio.changeSrc(SoundCloud_track.streamSource);

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

// Add event listeners for play/pause and volume buttons
PLAY_BUTTON.addEventListener("click", playButtonClick);
VOLUME_UP_BUTTON.addEventListener("click", volumeUpButtonClick);
VOLUME_DOWN_BUTTON.addEventListener("click", volumeDownButtonClick);
