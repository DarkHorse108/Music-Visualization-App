// Creates a foreground focused modal popup window containing user instruction for operating the application
// Modal popup format derived from: https://www.w3schools.com/howto/howto_css_modals.asp

// Get the div containing all elements, information, regarding user isntructions
let popup = document.getElementById("user_instructions_container");

// Represents the link/anchor element on the music player that when clicked, opens the user instruction popup
let link = document.getElementById("user_instructions_link");

// Represents the exit/X button so that the user can close the instructional popup
let exit_icon = document.getElementById("exit");

// Have the user instructional div become visible by removing its "none" display property and instead making it block level, the css styling puts it int he foreground
link.onclick = () => {
  popup.style.display = "block";
};

// If the user clicks the exit/X button, the user instruction div's display setting becomes "none" and disappears from the view
exit.onclick = () => {
  popup.style.display = "none";
};

// If the user clicks anywhere outside of the popup div while it is up, the div's display setting becomes "none" and disappears from the view
window.onclick = (event) => {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};
