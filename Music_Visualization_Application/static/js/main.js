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
  display_time_elapsed,
  display_progressbar_elapsed,
  updateMusicPlayer,
} from "./update_track_module.js";

// Import the functions to change the icon associated with the middle playback control button to reflect Pause, Play, and Loading.
import {
  displayPauseButton,
  displayPlayButton,
  displayLoadingButton,
} from "./update_buttons_module.js";

////////////////////////////////////////Constants////////////////////////////////////////

// Capture the form HTML element associated with the submission form for the SoundCloud URL by the user
const INPUT_FORM = document.getElementById("user_form_element");
// Capture the button HTML element associated with the play/pause button.
const PLAY_BUTTON = document.getElementById("play_pause_button");
const VOLUME_UP_BUTTON = document.getElementById("volume_up_button");
const VOLUME_DOWN_BUTTON = document.getElementById("volume_down_button");
// Initialize the default track
const DEFAULT_TRACK =
  "https://ia902809.us.archive.org/2/items/cd_debussy-piano-works/disc1/01.18.%20Claude%20Debussy%20-%20Deux%20Arabesques%20-%20II.%20Allegretto%20scherzando_sample.mp3";

////////////////////////////////////////Global variables/objects////////////////////////////////////////

// Initialize new Howler.js object with its default track and behaviors
let global_audio = new Howl({
  src: [DEFAULT_TRACK],
  autoplay: false,
  html5: false,
  loop: false,
});

// Modify Howler.js object's inner AudioContext to include an Analyser node which will allow us to retrieve data from the song being played.
// Each time global_analyser.getByteFrequencyData() is called and passed the array global_data_array as an argument, the array will contain frequency data of the song at the time of the function call.
let global_analyser = Howler.ctx.createAnalyser();
Howler.masterGain.connect(global_analyser);
global_analyser.fftSize = 512;
let bufferLength = global_analyser.frequencyBinCount;
let global_data_array = new Uint8Array(bufferLength);
// global_analyser.getByteFrequencyData(global_data_array);
// console.log(global_data_array);

////////////////////////////////////////Global function definitions////////////////////////////////////////

// When a song finishes playing "on end", change the icon on the middle button of the music player to display a Play icon. If play is clicked after this occurs, song playback will begin again from the beginning of the track.
global_audio.on("end", () => {
  displayPlayButton();
});

// When a track is playing, the below functions will be called once per frame.
global_audio.on("play", function call_per_frame() {
  let seconds_elapsed = get_seconds_elapsed();
  let percentage_elapsed = get_percentage_elapsed(seconds_elapsed);
  display_time_elapsed(seconds_elapsed);
  display_progressbar_elapsed(percentage_elapsed);

  requestAnimationFrame(call_per_frame.bind(), 1);
});

// Based on the current track's playback progress, return the number of seconds that have elapsed during the track's playback.
// This snippet was taken from the Howler.js documentation's music player example found here: https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
function get_seconds_elapsed() {
  let seconds_elapsed = global_audio.seek() || 0;
  return seconds_elapsed;
}

// Given the number of seconds elapsed during the track's playback, convert it to a percentage value relative to the total duration (in seconds) of the track.
// This snippet was taken from the Howler.js documentation's music player example found here: https://github.com/goldfire/howler.js/blob/master/examples/player/player.js
function get_percentage_elapsed(seconds_elapsed) {
  let percentage_elapsed =
    (seconds_elapsed / global_audio.duration()) * 100 || 0;
  return percentage_elapsed;
}

// Make a GET request to the Flask server, sending the track id of the requested song in the request. The Flask server will create its own get request and obtain the URL of the direct mp3 stream/file of the track itself and return it.
// Once the URL has been obtained, we change the source of the global_audio howler object to be the URL of the direct mp3 stream for the requested song. We update the middle button of the music player to display a loading icon while the
// request is being made, and to also display a play icon when the global_audio source has been updated and is ready to play.
function loadTrack(SoundCloud_track) {
  displayLoadingButton();
  const flask_get_request = new XMLHttpRequest();
  const url = "/stream/" + String(SoundCloud_track.id);
  flask_get_request.open("GET", url);
  flask_get_request.send();
  flask_get_request.onreadystatechange = (response) => {
    response = flask_get_request.responseText;
    global_audio.changeSrc(response);
    displayPlayButton();
  };
}

////////////////////////////////////////HTML Event Listeners////////////////////////////////////////

// Add an eventlistener when the form has been submitted (i.e. when the submit button is pressed).
INPUT_FORM.addEventListener("submit", function (event) {
  //Prevent refreshing of the page and then take the string value the user entered in the form and store it in the variable user_url.
  displayLoadingButton();
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

      global_audio.stop();

      loadTrack(SoundCloud_track);

      // Load the new track using the values returned from requestTrack
      updateMusicPlayer(SoundCloud_track);

      // // Indicate to the user that track loading has completed and is now playing.
      // displayPlayButton();
    })
    // If the request was not successful, print to the console the error message indicating why.
    .catch((error_variable) => {
      if (global_audio.playing()) {
        displayPauseButton();
      } else {
        displayPlayButton();
      }
      console.log(error_variable.message);
      displayErrorMessage();
    });
});

// Listen for click activity on the play button.
// If music is currently playing and the button is pressed, pause the loaded track, and change the button icon to the Play icon to indicate that the music has been stopped but can be resumed.
// If music is not currently playing and the button is pressed, play the loaded track, and change the button icon to the Pause icon to indicate that the music is playing now but can be paused.
PLAY_BUTTON.addEventListener("click", function (event) {
  if (global_audio.playing()) {
    global_audio.pause();
    displayPlayButton();
  } else if (global_audio.state() === "loaded") {
    global_audio.play();
    displayPauseButton();
  }
});

// Event listener to increase volume on click of the volume up button
VOLUME_UP_BUTTON.addEventListener("click", function (event) {
  global_audio.volume(global_audio.volume() + 0.2);
});

// Event listener to decrease volume on click of the volume down button
VOLUME_DOWN_BUTTON.addEventListener("click", function (event) {
  global_audio.volume(global_audio.volume() - 0.2);
});
