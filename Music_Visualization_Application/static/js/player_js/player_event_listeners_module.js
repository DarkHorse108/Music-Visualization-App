// Import globalAudio object to bind with buttons
import { globalAudio } from "../audio_module.js";

// Import functions to change the icon associated with the middle playback control button to reflect Pause, Play, and Loading.
import {
  displayPauseButton,
  displayPlayButton,
} from "./update_buttons_module.js";

// Listen for click activity on the play button.
// If music is currently playing and the button is pressed, pause the loaded track, and change the button icon to the Play icon to indicate that the music has been stopped but can be resumed, and stop collection of frequency data for the song.
// If music is not currently playing and the button is pressed, play the loaded track, and change the button icon to the Pause icon to indicate that the music is playing now but can be paused, and resume collection of frequency data for the song.
function playButtonClick() {
  if (globalAudio.playing()) {
    globalAudio.pause();
    globalAudio.pauseFrequencyCollection();
    displayPlayButton();
  } else if (globalAudio.state() === "loaded") {
    globalAudio.play();
    globalAudio.resumeFrequencyCollection();
    displayPauseButton();
  }
}

function volumeUpButtonClick() {
  globalAudio.volume(globalAudio.volume() + 0.2);
}

function volumeDownButtonClick() {
  globalAudio.volume(globalAudio.volume() - 0.2);
}

export { playButtonClick, volumeUpButtonClick, volumeDownButtonClick };
