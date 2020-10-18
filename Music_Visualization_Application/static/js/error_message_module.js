// This function displays the error message "Invalid SoundCloud track URL. Please try again." at the bottom of the music player.
// It does so by appending an HTML paragraph element with id "error_message" as a child of the div with id "user_error_messaging_div."
// It first checks if there is an existing error message already displayed. If there is, no action is taken. If there is not, the error message is appended.
function DisplayErrorMessage(){
	const error_message = document.getElementById("error_message");
	if (error_message === null){
		$("#user_error_messaging_div").append("<p id='error_message'>Invalid SoundCloud track URL. Please try again.</p>");
	}
	
}

// This function removes any visible error messages from the bottom of the music player.
// It works by removing an html element with id "error_message" from the html document. If no such element exists, no action is taken. 
function ClearErrorMessage(){
	const error_message = document.getElementById("error_message");
	if (error_message !== null){
		$("#error_message").remove();
	}
}