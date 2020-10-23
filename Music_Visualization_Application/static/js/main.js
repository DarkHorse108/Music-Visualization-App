// Import the requestTrack function
import { requestTrack } from "./soundcloud_request_module.js";
// Import the displayErrorMessage and clearErrorMessage functions
import {
  displayErrorMessage,
  clearErrorMessage,
} from "./error_message_module.js";
// Import the SoundCloud client_id associated with your application
import { client_id } from "./config.js";

// Capture the form HTML element associated with the submission form for the SoundCloud URL by the user
const form_element = document.getElementById("user_form_element");

// Add an eventlistener when the form has been submitted (i.e. when the submit button is pressed).
form_element.addEventListener("submit", function (event) {
  //Prevent refreshing of the page and then take the string value the user entered in the form and store it in the variable user_url.
  event.preventDefault();
  let user_url = document.getElementById("user_input_url").value;

  // Reset the form and remove any text entered by the user in the form, as we have already captured it in user_url. If there is any error message to the user currently being shown, remove it to indicate to the user that their input is being processed.
  form_element.reset();
  clearErrorMessage();

  // Take the URL provided by the user, and your SoundCloud client id, and request information about the track using requestTrack() and save the returned object in var "results".
  // If the request was successful, update the front-end with the information that was returned.
  const results = requestTrack(user_url, client_id)
    .then((promise_variable) => {
      console.log(promise_variable);
      //Update portion using promise_variable object
    })
    // If the request was not successful, print to the console the error message indicating why.
    .catch((error_variable) => {
      displayErrorMessage();
      console.log(error_variable.message);
    });
});
