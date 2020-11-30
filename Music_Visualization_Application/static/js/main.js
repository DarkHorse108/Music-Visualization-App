/******************************************************************************
 **
 **  Imports
 **
 *******************************************************************************/

// Import the SoundCloud client_id associated with your application
import { client_id } from "./config.js";

// Import functions to displayErrorMessage and clearErrorMessage
import {
  displayErrorMessage,
  clearErrorMessage,
} from "./player_js/error_message_module.js";

// Import functions to process SoundCloud track requests
import { requestTrack } from "./player_js/soundcloud_request_module.js";

// Import functions that updates what track is being played, along with the information displayed about that track
import {
  displayTimeElapsed,
  displayProgressBarElapsed,
  updateMusicPlayer,
} from "./player_js/update_track_module.js";

// Import functions to change the icon associated with the middle playback control button to reflect Pause, Play, and Loading.
import {
  displayPauseButton,
  displayPlayButton,
  displayLoadingButton,
} from "./player_js/update_buttons_module.js";

// Import interface for three.js world
import { World } from "./three_js/World.js";

import { animation_polyfill } from "./animation_polyfill.js";

// Import DOM elements
import {
  canvasContainer,
  INPUT_FORM,
  PLAY_BUTTON,
  VOLUME_UP_BUTTON,
  VOLUME_DOWN_BUTTON,
  FREQUENCY_SAMPLESIZE,
} from "./constants.js";

// Import global audio objects and functions for handling the track
import {
  globalAudio,
  globalAnalyser,
  globalDataArray,
  getSecondsElapsed,
  getPercentageElapsed,
} from "./audio_module.js";

// Import functions for player event listeners
import {
  playButtonClick,
  volumeUpButtonClick,
  volumeDownButtonClick,
} from "./player_js/player_event_listeners_module.js";

/******************************************************************************
 **
 **  main()
 **
 *******************************************************************************/

("use strict");

(function main() {
  const fadeSteps = 0.02; // Set the opacity fading increments
  let opacity; // Set starting opacity (0.0 = transparent, 1.0 = opaque)
  let world; // References three.js world object

  clearErrorMessage();

  // Polyfill requestAnimationFrame for smoother animation
  animation_polyfill();

  // Add event listeners for form submission, play/pause button, and volume buttons
  INPUT_FORM.addEventListener("submit", inputFormSubmit);
  PLAY_BUTTON.addEventListener("click", playButtonClick);
  VOLUME_UP_BUTTON.addEventListener("click", volumeUpButtonClick);
  VOLUME_DOWN_BUTTON.addEventListener("click", volumeDownButtonClick);

  // Attempt to instantiate world, fade it in, and start animation
  try {
    world = new World(canvasContainer);
    opacity = 0.0;
    fadeInWorld();
    callPerFrame();
  } catch (err) {
    console.log(err.message);
    alert(`Error encountered: ${err.message}`);
  }

  /******************************************************************************
   **
   **  Helper Functions
   **
   *******************************************************************************/

  // fadeInWorld() fades the three.js world into view
  function fadeInWorld() {
    opacity += fadeSteps;
    if (opacity < 1.0) {
      world.renderOpacity(opacity);
      requestAnimationFrame(fadeInWorld);
    } else {
      // Render world completely opaque
      world.renderOpacity(1.0);
    }
  }

  // fadeOutWorld() fades the three.js world out of view
  function fadeOutWorld() {
    opacity -= fadeSteps;
    if (opacity >= 0.0) {
      world.renderOpacity(opacity);
      requestAnimationFrame(fadeInWorld);
    } else {
      world.renderStatic();
    }
  }

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
      world.renderUpdateables(globalDataArray);
    }

    // Recursively call callPerFrame() to render animation
    requestAnimationFrame(callPerFrame);
  }

  // inputFormSubmit() handles the reloading of the track and world after a successful user submission
  function inputFormSubmit(event) {
    //Prevent refreshing of the page
    event.preventDefault();

    // Display Loading Button to show that we have begun loading the track.
    displayLoadingButton();

    // Take the string value the user entered in the form and store it in the variable user_url.
    let user_url = document.getElementById("user_input_url").value;

    // Reset the form and remove any text entered by the user in the form, as we have already captured it in user_url.
    INPUT_FORM.reset();

    //If there is any error message to the user currently being shown, remove it to indicate to the user that their input is being processed.
    clearErrorMessage();

    // Take the URL provided by the user, and your SoundCloud client id, and request information about the track using requestTrack() and save the returned object in "results".
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
  }
})(); // Immediately invoke main.js
