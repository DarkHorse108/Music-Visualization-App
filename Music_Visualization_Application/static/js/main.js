// Import the requestTrack function
import { requestTrack } from "./soundcloud_request_module.js";
// Import the displayErrorMessage and clearErrorMessage functions
import {
  displayErrorMessage,
  clearErrorMessage,
} from "./error_message_module.js";
import { client_id } from "../../../config.js";

// This variable will hold the string value entered by the user in the submission form.
let user_url = null;

// We capture the form HTML element associated with the submission form for the SoundCloud URL by the user
const form_element = document.getElementById("user_form_element");

// We add an eventlistener when the form has been submitted (i.e. when the submit button is pressed). We prevent refreshing of the page
// and then take the string value the user entered in the form and store it in the variable user_url. We then clear the form of any text and print the captured value.
form_element.addEventListener("submit", function (event) {
  event.preventDefault();
  user_url = document.getElementById("user_input_url").value;

  form_element.reset();
  clearErrorMessage();

  const results = requestTrack(user_url, client_id)
    .then((promise_variable) => {
      console.log(promise_variable);
      //Update portion using promise_variable object
    })
    .catch((error_variable) => {
      displayErrorMessage();
      console.log(error_variable.message);
    });
});
