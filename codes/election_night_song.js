// This will change the election night song
const originalElectionNight = electionNight;

electionNight = function (...args) {
  const electionPlaylist = new Playlist();
  const electionSong = new Song(
    "Mishima/Closing",
    "Kronos Quartet",
    "https://lh3.googleusercontent.com/hZaa-nr_sc1OyI9az-Q4l3dsn_riLbmr4kXSoGNypEv2wmOuOnEQoGDc3mmqrhuU2m1WedR52fVNcEkA=w544-h544-s-l90-rj",
    "https://file.garden/aNtAfG887DiA_7lO/2028AOC/mishimaclosing.m4a"
  );
  electionPlaylist.addSong(electionSong);
  changePlaylist(electionPlaylist);

  return originalElectionNight.apply(this, args);
};
