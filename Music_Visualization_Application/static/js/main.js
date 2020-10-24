// Load the default track first into global_audio
import { loadDefaultTrack } from "./default_track_module.js";

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
import { updateMusicPlayer } from "./update_track_module.js";

// Import the functions to change the icon associated with the middle playback control button to reflect Pause, Play, and Loading.
import {
  displayPauseButton,
  displayPlayButton,
} from "./update_buttons_module.js";

// Load the default track to be played upon initial opening of the application.
loadDefaultTrack();

// Capture the form HTML element associated with the submission form for the SoundCloud URL by the user
const INPUT_FORM = document.getElementById("user_form_element");
// Capture the button HTML element associated with the play/pause button.
const PLAY_BUTTON = document.getElementById("play_pause_button");
const VOLUME_UP_BUTTON = document.getElementById("volume_up_button");
const VOLUME_DOWN_BUTTON = document.getElementById("volume_down_button");

// Add an eventlistener when the form has been submitted (i.e. when the submit button is pressed).
INPUT_FORM.addEventListener("submit", function (event) {
  //Prevent refreshing of the page and then take the string value the user entered in the form and store it in the variable user_url.
  event.preventDefault();
  let user_url = document.getElementById("user_input_url").value;

  // Reset the form and remove any text entered by the user in the form, as we have already captured it in user_url. If there is any error message to the user currently being shown, remove it to indicate to the user that their input is being processed.
  INPUT_FORM.reset();
  clearErrorMessage();

  // Take the URL provided by the user, and your SoundCloud client id, and request information about the track using requestTrack() and save the returned object in var "results".
  // If the request was successful, update the front-end with the information that was returned.
  const results = requestTrack(user_url, client_id)
    .then((SoundCloud_track) => {
      console.log(SoundCloud_track);

      // If the loaded track is currently playing, stop it, before loading the new track
      global_audio.stop();

      // Load the new track using the values returned from requestTrack
      updateMusicPlayer(SoundCloud_track);

      // Indicate to the user that track loading has completed and is now playing.
      displayPauseButton();
    })
    // If the request was not successful, print to the console the error message indicating why.
    .catch((error_variable) => {
      console.log(error_variable.message);
      displayErrorMessage();
    });
});

// Listen for click activity on the play button.
// If music is currently playing and the button is pressed, pause the loaded track, and change the button icon to the Play icon to indicate that the music has been stopped but can be resumed.
// If music is not currently playing and the button is pressed, play the loaded track, and change the button icon to the Pause icon to indicate that the music is playing now but can be paused.
PLAY_BUTTON.addEventListener("click", function (event) {
  if (global_audio.isPlaying) {
    global_audio.pause();
    displayPlayButton();
  } else {
    global_audio.play();
    displayPauseButton();
  }
});

// Event listener to increase volume on click of the volume up button
VOLUME_UP_BUTTON.addEventListener("click", function (event) {
  global_audio.setVolume(global_audio.getVolume() + 0.2);
});

// Event listener to decrease volume on click of the volume down button
VOLUME_DOWN_BUTTON.addEventListener("click", function (event) {
  global_audio.setVolume(global_audio.getVolume() - 0.2);
});
