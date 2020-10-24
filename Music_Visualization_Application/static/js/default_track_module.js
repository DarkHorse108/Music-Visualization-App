// Loads the global audio loader with a royalty free song to be used as the opening track when the music visualization application is first exectued.

export function loadDefaultTrack() {
  // Source audio for initially loaded track, royalty free from the U.S. Media Archive. Deux Arabesques II. ALlegretto scherzando by Claude Debussy.
  const DEFAULT_TRACK =
    "https://ia902809.us.archive.org/2/items/cd_debussy-piano-works/disc1/01.18.%20Claude%20Debussy%20-%20Deux%20Arabesques%20-%20II.%20Allegretto%20scherzando_sample.mp3";

  // Load the default track with the global audio loader so it can be played.
  global_audio_loader.load(DEFAULT_TRACK, function (buffer) {
    global_audio.setBuffer(buffer);
    global_audio.setLoop(true);
  });
}
