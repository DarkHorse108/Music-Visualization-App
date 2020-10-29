// Change icon of the middle button in the music player to Pause
export function displayPauseButton() {
  $("#play_pause_icon").attr("class", "fas fa-pause");
}
// Change icon of the middle button in the music player to Play
export function displayPlayButton() {
  $("#play_pause_icon").attr("class", "fas fa-play");
}

export function displayLoadingButton() {
  $("#play_pause_icon").attr("class", "fas fa-sync fa-spin");
}
