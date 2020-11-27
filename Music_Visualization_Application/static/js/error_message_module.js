// This function displays the error message "Invalid SoundCloud track URL. Please try again." at the bottom of the music player.
// It does so by appending an HTML paragraph element with id "error_message" as a child of the div with id "user_error_messaging_div."
// It first checks if there is an existing error message already displayed. If there is, no action is taken. If there is not, the error message is appended.
export function displayErrorMessage() {
  if (!errorMessagePresent()) {
    $("#user_error_messaging_div").append(
      "<p id='error_message'>Invalid SoundCloud track.</br>Try a different track.</p>"
    );
  }
}

// This function removes any visible error messages from the bottom of the music player.
// It works by removing an html element with id "error_message" from the html document. If no such element exists, no action is taken.
export function clearErrorMessage() {
  if (errorMessagePresent()) {
    $("#error_message").remove();
  }
}

// This functions checks if there is an error message already displayed in the front-end/Music Player HTML.
// An error message will be a paragraph element with id "error_message"
// We attempt to obtain that paragraph element. If the paragraph element exists, then clearly an error message is already displayed, so we return true.
// If the paragraph element does not exist, then no error message is currently displayed, so we return false.
function errorMessagePresent() {
  const error_message = document.getElementById("error_message");
  if (error_message === null) {
    return false;
  } else {
    return true;
  }
}
