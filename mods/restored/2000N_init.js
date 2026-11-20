nct_stuff.dynamicOverride = true;
dynamicStyle.innerHTML = `
body {
  background-color: #e9eff7;
  background: url(https://ids.si.edu/ids/deliveryService?id=SAAM-2004.30.4_1);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
.container {
  background-color: #f7f9fc !important;
  border: 1px solid #b8c9de;
}
.game_header {
  background-color: #1b365d !important;
  border-bottom: 3px solid #b22234;
  color: #ffffff;
}
#game_window {
  background-color: #d6e6f5 !important;
  border: 2px solid #1b365d !important;
  color: #162a45;
}
.inner_window_w_desc,
.inner_window_front,
.inner_window_question {
  background-color: #f3f7fc !important;
  color: #162a45;
  border-color: #9cb4d1 !important;
}
.campaign_trail_start_emphasis {
  background-color: #b22234;
}
.footer {
  color: #1b365d;
}

.inner_window_question h3, .overlay_window h3 {
	background: #d5f3ff;
	border-color: #5e0000;
	padding: .2em .5em;
}

#campaign_sign {
  background-color: #1b365d;
  border-color: #b22234;
}

#menu_container, #overall_result_container, #overall_result {
  background-color: #f3f7fc;
  color: #162a45;
}

#menu_container h3 {
  background-color: #cdddf0;
  color: #1b365d;
}

`;

nct_stuff.themes[nct_stuff.selectedTheme].coloring_title = "#1b365d";
nct_stuff.themes[nct_stuff.selectedTheme].coloring_window = "#d6e6f5";

const gameHeaderEl = document.getElementsByClassName("game_header")[0];
if (gameHeaderEl) {
  gameHeaderEl.style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_title;
}
const gameWindowEl = $("#game_window")[0];
if (gameWindowEl) {
  gameWindowEl.style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_window;
}
const containerEl = $(".container")[0];
if (containerEl) {
  containerEl.style.backgroundColor = "#f7f9fc";
}

const headerImg = document.getElementById("header");
if (headerImg) {
  headerImg.src = "https://thecampaigntrail.net/static/images/banners/banner_alt.png";
}
document.body.background = "";

corrr = `<h2>The Campaign Trail</h2>`;

if ($("#theme_picker")[0]) $("#theme_picker")[0].style.display = "none";
if ($("#bottomBar")[0]) $("#bottomBar")[0].style.display = "none";

e = campaignTrail_temp;

var changeGameDisp = (hide) => {
  disp = "";
  if (hide) {
    disp = "none";
  }
  document.getElementsByClassName("inner_window_w_desc")[0].style.display = disp;
};

e.creditsPage = () => {
  credits_html = `
    <h3>Coding</h3>
    <p><font color='#1f6f43'>DecstarG#4326</font></p>
    <h3>Writing</h3>
    <p><font color='#7b2cbf'>Mocha#0096</font></p>
    <p><font color='#9a6700'>DecstarG#4326</font></p>
    <p><font color='#0e7490'>NeoK#7895</font></p>
    <p><font color='#3b426b'>Rubix#4197</font></p>
    <h3>Playtesting/Misc. Help</h3>
    <p><em><b><font color='#b22234'>Board667#8785</font></b></em></p>
    <p>AngryGandhi#3704</p>
    <p>Chapu#1656</p>
    <p>pedrocheems#6531</p>
    <p>Diamondy30901#0308</p>
    <p>TomBoxXD#1642</p>
    <h3>Music Credit</h3>
    <p>Main ST: The Caretaker - Everywhere at the End of Time</p><br>
    <p>We'll Meet Again - Vera Lynn (edit by SirMcSir)</p>
    <p>My Time - Bo En (piano cover by Lattice)</p>
    <p>Oceania's Anthem - Dominic Muldowney (cover by Noah & Clyde Music)</p>
    <p>King Nothing - Metallica (guitar cover Julien Menard)</p>
    <p>Your Reality - Dan Salvato (piano cover by Lattice)</p>
    <p>An Ending - Toby Fox</p>
    <p>Made In Heaven - Queen (piano cover by Fabrizio Spaggiari)</p>
    <p>Requiem - Mozart</p>
    <p>Hotel California - Eagles (music box cover by Beeano)</p>
    <p>It's Just a Burning Memory - The Caretaker</p>
    <p>Space Oddity - David Bowie (cover by Mike Masse and Jeff Hall)</p>
    <p>Heartaches - Al Bowlly</p>
    <p>Goodbye, My Beautiful - Russ Morgan</p><br><br>
    <h1><font color='#b22234'>Final Note</font></h1>
    <div style='width: 70%;text-overflow: ellipsis;text-align:center;display: block;margin-left: auto;margin-right: auto;'>
    <p>Hi, this is Decstar. I just wanted to thank you for playing this mod.</p>
    <p>This particular style of mod isn't necessarily the "norm" for TCT, but when I was developing the concept, I thought it would play well in the medium.</p>
    <p>I hope you enjoy/did enjoy the mod.</p>
    <p>To my fellow developers (who haven't seen this yet): thank you so much for your help with this, I think each of you have done a fantastic job. Thank you for putting up with my 4am schizo ideas for new endings.</p>
    <p>And as always, remember that it's raining somewhere else.</p>
    </div>
  `;
  changeGameDisp(true);
  var spacer = document.createElement("amongusspacerthisisntarealelement");
  spacer.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  document
    .getElementsByClassName("inner_window_w_desc")[0]
    .children[1].appendChild(spacer);
  changeGameDisp(true);
  var menuHeader = document.createElement("div");
  menuHeader.classList.add("inner_window_front");
  menuHeader.innerHTML = `<h1 style='margin: 10px 0;'><font color='#ffffff'>Credits</font></h1>`;
  menuHeader.id = "SOTUheader";
  menuHeader.style = "height: 50px; background-color: #1b365d !important; border-bottom: 3px solid #b22234;";
  var newMenu = document.createElement("div");
  newMenu.classList.add("inner_window_front");
  newMenu.id = "SOTUmenu";
  newMenu.style = `height:260px;background-color:#f3f7fc !important;color:#162a45;overflow-y: scroll;`;

  newMenu.innerHTML = credits_html;
  let z = document.getElementById("game_window");
  var backButton = document.createElement("button");
  backButton.style =
    "position: relative; bottom: -13px; left: -380px; width: 150px; height: 80px;font-size:40px;padding-top:5px;padding-left:8px";
  backButton.id = "backSOTUBtn";
  backButton.innerHTML = `<b>BACK</b>`;
  backButton.onclick = function () {
    document.getElementById("SOTUheader").remove();
    document.getElementById("SOTUmenu").remove();
    document.getElementById("backSOTUBtn").remove();
    changeGameDisp(false);
  };
  z.appendChild(menuHeader);
  z.appendChild(newMenu);
  z.appendChild(backButton);
};

e.credits = "<button onclick='e.creditsPage()'>Credits</button>";

e.election_json = [
  {
    "model": "campaign_trail.election",
    "pk": 20,
    "fields": {
      "year": 2000,
      "summary": "<p><b style='color: #b22234'>CONTENT WARNING: This mod explores themes of suicide, depression, and existentialism.</b></p><p>The Clinton presidency has been a middling success. Faced with respectable economic performance, and the collapse of the Soviet Union, the United States is poised as the sole superpower on the world stage. On the Democratic side, Sam Nunn is prepared to continue Clinton’s pragmatic policies in the United States. Arlen Specter, coming from the newly reascended liberal Republican faction, must make a case that the Republican party too can handle the country competently.</p><p>Regardless of who wins this election, it is likely that little will fundamentally change for the United States, with some declaring that the “End of History” is impending.</p>",
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/election_pic.png",
      "winning_electoral_vote_number": 270,
      "advisor_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/election_advisors.png",
      "recommended_reading": "Placeholder",
      "has_visits": 1,
      "no_electoral_majority_image": "https://upload.wikimedia.org/wikipedia/en/5/5b/The_Caretaker_-_Everywhere_at_the_End_of_Time_-_Stage_1_cover.jpg"
    }
  }
];

e.temp_election_list = [
  {
    "id": 20,
    "year": 2000,
    "is_premium": 0,
    "display_year": "2000N"
  }
];

e.opponents_default_json = [
  {
    "election": 20,
    "candidates": [
      200,
      201,
      202
    ]
  }
];

e.opponents_weighted_json = [
  {
    "election": 20,
    "candidates": [
      200,
      201,
      202
    ]
  }
];

e.candidate_json = [
  {
    "model": "campaign_trail.candidate",
    "pk": 200,
    "fields": {
      "first_name": "Arlen",
      "last_name": "Specter",
      "election": 20,
      "party": "Republican",
      "state": "Pennsylvania",
      "priority": 1,
      "description": `<p>Senator Arlen Specter is an interesting case. While he has been in the Senate for almost 20 years, he has only begun to skyrocket to national prominence in recent years. Invigorated by the moderate Republican gains in the North during the 1994 midterms Specter faced. Despite some speculating on his candidacy in 1996, the general consensus was that he would wait until 2000 to run, given the general popularity of Bill Clinton.</p><p>After winning the primary essentially unopposed, Specter is coming into the general election with the challenge of convincing voters that he can maintain and secure the relatively peaceful world environment of the Clinton years, while simultaneously providing a convincing case for his moderate brand of Republican politics.</p>`,
      "color_hex": "#FF0000",
      "secondary_color_hex": "#FF0000",
      "is_active": 1,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_specter.png",
      "electoral_victory_message": "<h3>the ending codes broke</h3><p>sorry uwu</p>",
      "electoral_loss_message": "<h3>the ending codes broke</h3><p>sorry uwu</p>",
      "no_electoral_majority_message": "<h3>the ending codes broke</h3><p>sorry uwu</p>",
      "description_as_running_mate": null,
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 201,
    "fields": {
      "first_name": "Sam",
      "last_name": "Nunn",
      "election": 20,
      "party": "Democratic",
      "state": "Georgia",
      "priority": 1,
      "description": "<p>Senator Sam Nunn is a change of pace for the Democratic party. Only a few years back he would have been on the more conservative wing of the party, but now he finds himself at a new centre from President Clinton’s southward shift.</p><p>Much like his opponent, Nunn didn’t face much opposition from within his own party’s nomination, with early endorsements from both Gore and Clinton giving him a landslide edge over his main opponent, Senator John Kerry. Nunn’s nomination will solidify the ‘New Southern Strategy’ as some smug Republican insiders have dubbed it.</p><p>He must prove to the public that this moderation from the Democratic party is the right move, and convince the national audience that he is the natural successor to the peace of the past decade.</p>",
      "color_hex": "#0000FF",
      "secondary_color_hex": "#0000FF",
      "is_active": 1,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_nunn.png",
      "electoral_victory_message": "<h3>the ending codes broke</h3><p>sorry uwu</p>",
      "electoral_loss_message": "<h3>the ending codes broke</h3><p>sorry uwu</p>",
      "no_electoral_majority_message": "<h3>the ending codes broke</h3><p>sorry uwu</p>",
      "description_as_running_mate": null,
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 202,
    "fields": {
      "first_name": "Ralph",
      "last_name": "Nader/Other",
      "election": 20,
      "party": "Other",
      "state": "Nevada",
      "priority": 1,
      "description": "<p>will never be playable</p>",
      "color_hex": "#00C100",
      "secondary_color_hex": "#00C100",
      "is_active": 0,
      "image_url": "https://static.wikia.nocookie.net/platinumgames/images/4/46/Boris.png/revision/latest/scale-to-width-down/250?cb=20140506032514",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": null,
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 204,
    "fields": {
      "first_name": "Bill",
      "last_name": "Weld",
      "election": 20,
      "party": "Republican",
      "state": "Massachusetts",
      "priority": 1,
      "description": null,
      "color_hex": "#e7ed74",
      "secondary_color_hex": "#e7ed74",
      "is_active": 0,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_weld.png",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": "<p>Bill Weld is a figure from Massachusetts who is willing to be on your ticket. He is the governor, having been in office since the early 90s. He was an early backer of your campaign, having been more aligned with the party's moderate faction. Many of your advisors call him pretty boring, but they also said he should 100% be your running mate. So what can you really do?</p><p>Much like you, he checks all the boxes of the post-Clinton Republicans. He’s northern, centrist, and very, very normal.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 205,
    "fields": {
      "first_name": "John",
      "last_name": "Kasich",
      "election": 20,
      "party": "Republican",
      "state": "Ohio",
      "priority": 1,
      "description": null,
      "color_hex": "#e7ed74",
      "secondary_color_hex": "#e7ed74",
      "is_active": 0,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_kasich.png",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": "<p>John Kasich is a figure from Ohio who is willing to be on your ticket. He is one of their representatives, having been in office since the early 80s. He was an early backer of your campaign, having been more aligned with the party's moderate faction. Many of your advisors call him pretty boring, but they also said he should 100% be your running mate. So what can you really do?</p><p>Much like you, he checks all the boxes of the post-Clinton Republicans. He’s boring, centrist, and very, very normal.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 206,
    "fields": {
      "first_name": "Jim",
      "last_name": "Jeffords",
      "election": 20,
      "party": "Republican",
      "state": "Vermont",
      "priority": 1,
      "description": null,
      "color_hex": "#e7ed74",
      "secondary_color_hex": "#e7ed74",
      "is_active": 0,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_jeffries.png",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": "<p>Jim Jeffords is a figure from Vermont who is willing to be on your ticket. He is the junior senator, having been in office since the late 80s. He was an early backer of your campaign, having been more aligned with the party's moderate faction. Many of your advisors call him pretty boring, but they also said he should 100% be your running mate. So what can you really do?</p><p>Much like you, he checks all the boxes of the post-Clinton Republicans. He’s northern, centrist, and very, very normal.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 207,
    "fields": {
      "first_name": "John",
      "last_name": "Breaux",
      "election": 20,
      "party": "Democratic",
      "state": "Louisiana",
      "priority": 1,
      "description": null,
      "color_hex": "#e7ed74",
      "secondary_color_hex": "#e7ed74",
      "is_active": 0,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_breux.png",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": "<p>John Breaux is a figure from Louisiana who is willing to be on your ticket. He is the senior senator, having been in office since the late 80s. He was an early backer of Clinton’s political realignment, and also endorsed you very early in the primary. He has been a centrist for most of his career. Many of your advisors call him pretty boring, but they also said that he should 100% be your running mate. So what can you really do?</p><p>Much like you, he checks all the boxes of the post-Clinton Democrats. He’s southern, centrist, and very, very normal.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 208,
    "fields": {
      "first_name": "Joe",
      "last_name": "Lieberman",
      "election": 20,
      "party": "Democratic",
      "state": "Connecticut",
      "priority": 1,
      "description": null,
      "color_hex": "#e7ed74",
      "secondary_color_hex": "#e7ed74",
      "is_active": 0,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_lieberman.png",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": "<p>Joe Lieberman is a figure from Connecticut who is willing to be on your ticket. Having been in office since the late 80s, he was an early backer of Clinton’s political realignment, and also endorsed you very early in the primary, despite rumours of a potential Lieberman 2000 campaign. He has been a centrist for most of his career. Many of your advisors call him pretty boring, but they also said that he should 100% be your running mate. So what can you really do?</p><p>Much like you, he checks all the boxes of the post-Clinton Democrats. He’s boring, centrist, and very, very normal.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 209,
    "fields": {
      "first_name": "Evan",
      "last_name": "Bayh",
      "election": 20,
      "party": "Democratic",
      "state": "Indiana",
      "priority": 1,
      "description": null,
      "color_hex": "#e7ed74",
      "secondary_color_hex": "#e7ed74",
      "is_active": 0,
      "image_url": "https://file.garden/Z8RkRO3deXuAgbIz/2000N/candidate_bayh.png",
      "electoral_victory_message": null,
      "electoral_loss_message": null,
      "no_electoral_majority_message": null,
      "description_as_running_mate": "<p>Evan Bayh is a figure from Indiana who is willing to be on your ticket. He is the junior senator, having been in office since the early 90s. He was an early backer of Clinton’s political realignment, and also endorsed you very early in the primary, despite rumors of a potential Lieberman 2000 campaign. He has been a centrist for most of his career. Many of your advisors call him pretty boring, but they also said that he should 100% be your running mate. So what can you really do?</p><p>Much like you, he checks all the boxes of the post-Clinton Democrats. He’s boring, centrist, and very, very normal.</p>",
      "candidate_score": 1.0
    }
  }
];

e.running_mate_json = [
  {
    "model": "campaign_trail.running_mate",
    "pk": 100,
    "fields": {
      "candidate": 200,
      "running_mate": 204
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 101,
    "fields": {
      "candidate": 200,
      "running_mate": 205
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 102,
    "fields": {
      "candidate": 200,
      "running_mate": 206
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 103,
    "fields": {
      "candidate": 201,
      "running_mate": 207
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 104,
    "fields": {
      "candidate": 201,
      "running_mate": 208
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 105,
    "fields": {
      "candidate": 201,
      "running_mate": 209
    }
  }
];

e.global_parameter_json = [
  {
    "model": "campaign_trail.global_parameter",
    "pk": 1,
    "fields": {
      "vote_variable": 1.125,
      "max_swing": 0.12,
      "start_point": 0.94,
      "candidate_issue_weight": 10,
      "running_mate_issue_weight": 0,
      "issue_stance_1_max": -0.71,
      "issue_stance_2_max": -0.3,
      "issue_stance_3_max": -0.125,
      "issue_stance_4_max": 0.125,
      "issue_stance_5_max": 0.3,
      "issue_stance_6_max": 0.71,
      "global_variance": 0.01,
      "state_variance": 0.005,
      "question_count": 25,
      "default_map_color_hex": "#C9C9C9",
      "no_state_map_color_hex": "#999999"
    }
  }
];

e.difficulty_level_json = [
  {
    "model": "campaign_trail.difficulty_level",
    "pk": 4,
    "fields": {
      "name": "Normal",
      "multiplier": 0.97
    }
  }
];

// disable cheats (yes, I know)
const cheatMenu = document.querySelector(".cheat_menu");
if (cheatMenu) cheatMenu.classList.toggle("cheat_menu");

disableCheats = () => {
  const cheatModeEl = $("#cheatmode")[0];
  if (cheatModeEl) {
    Array.from(cheatModeEl.children).forEach((f) => f.remove());
  }
};

disableCheats();

// Music player
// This is a modified version of the music player
// used in the mockup Perpetual American Terror.
class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    // detect and parse YouTube IDs, otherwise treat as a standard audio link
    this.youtubeId = extractYouTubeId(audioOrYouTube);
    this.audioLink = this.youtubeId ? null : (audioOrYouTube || null);
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
  getYouTubeId() { return this.youtubeId; }
}

class Playlist {
  constructor() {
    this.songs = [];
    this.currentSongIndex = 0;
  }
  addSong(song) { this.songs.push(song); }
  getCurrentSong() { return this.songs[this.currentSongIndex]; }

  playNext() {
    if (this.songs.length === 0) return;
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
  }

  playPrevious() {
    if (this.songs.length === 0) return;
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
  }
}

window.Playlist = Playlist;
window.Song = Song;

let activePlaylist = new Playlist();
let audioInstance = null;
let currentVolume = 1;

// YouTube URL support
let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytConstructing = false;
let ytProgressTimer = null;
let backendVolume = 1;

const ytHooks = {
  onEnded: null,
  onProgress: null
};

const ytCallbacks = [];

function flushYTCallbacks() {
  if (!ytPlayer || typeof ytPlayer.loadVideoById !== "function") return;
  while (ytCallbacks.length) {
    const cb = ytCallbacks.shift();
    try {
      cb?.();
    } catch (e) {
      console.log("YouTube player callback failed.", e);
    }
  }
}

function extractYouTubeId(url) {
  if (typeof url !== "string") return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

(function injectYouTubeAPI() {
  if (document.getElementById("yt-iframe-api")) return;
  const tag = document.createElement("script");
  tag.id = "yt-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
})();

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
};

function applyVolumeToYT() {
  if (!ytPlayer || typeof ytPlayer.setVolume !== "function") return;
  try {
    ytPlayer.setVolume(Math.round(backendVolume * 100));
    if (backendVolume === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  } catch (e) {}
}

function ensureYTPlayer(onReady) {
  if (onReady) ytCallbacks.push(onReady);
  if (ytPlayer && ytPlayerReady && typeof ytPlayer.loadVideoById === "function") {
    flushYTCallbacks();
    return;
  }
  if (ytConstructing) return;

  const createPlayer = () => {
    let holder = document.getElementById("ytplayer");
    if (!holder) {
      const el = document.createElement("div");
      el.id = "ytplayer";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.position = "absolute";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
      return el;
    }

    ytConstructing = true;
    try {
      ytPlayer = new YT.Player("ytplayer", {
        height: "0",
        width: "0",
        videoId: "",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            ytConstructing = false;
            ytPlayer = event.target;
            ytPlayerReady = true;
            applyVolumeToYT();
            flushYTCallbacks();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              ytHooks.onEnded?.();
            }
            if (e.data === YT.PlayerState.PLAYING) {
              applyVolumeToYT();
            }
          }
        }
      });
    } catch (e) {
      ytConstructing = false;
      console.log("Could not create the YouTube player.", e);
      return;
    }

  };

  if (ytApiReady && window.YT && window.YT.Player) {
    createPlayer();
  } else {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  }
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump() {
  stopYTProgressPump();
  ytProgressTimer = setInterval(() => {
    ytHooks.onProgress?.(backendGetCurrentTime(), backendGetDuration());
  }, 250);
}

function backendSetSrcAndLoad(song, audio) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    stopYTProgressPump();
    ensureYTPlayer(() => {
      ytPlayer.loadVideoById(song.getYouTubeId());
      applyVolumeToYT();
    });
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) {
      try { ytPlayer.stopVideo(); } catch (e) {}
    }
    audio.src = song.getAudioLink() || "";
    audio.load();
  }
}

function ytCurrentSong() { return activePlaylist.getCurrentSong(); }
function ytAudioElement() { return getAudioElement(); }

function backendPlay(audio) {
  const song = ytCurrentSong();
  if (!song) return Promise.resolve();

  if (isYouTubeSong(song)) {
    return new Promise((resolve) => {
      ensureYTPlayer(() => {
        ytPlayer.playVideo();
        resolve();
      });
    });
  }

  return audio.play().catch(e => {
    console.log("Playback deferred for user interaction.", e);
  });
}

function backendPause(audio) {
  const song = ytCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
  }
}

function backendSetVolume(audio, volume) {
  backendVolume = volume;
  audio.volume = volume;
  if (isYouTubeSong(ytCurrentSong())) applyVolumeToYT();
}

function backendGetCurrentTime() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getCurrentTime?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) return ytPlayer.getDuration?.() || 0;
  const audio = ytAudioElement();
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = ytCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else {
    const audio = ytAudioElement();
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = seconds;
  }
}

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    backendSetSrcAndLoad(song, audio);
    startYTProgressPump();
    backendPlay(audio)
      .then(() => updatePlayPauseIcon(true))
      .catch(e => console.log("Autoplay blocked or waiting for interaction", e));
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;
  const root = player.shadowRoot || player;

  const cover = root.querySelector("#cover");
  const title = root.querySelector("#title");
  const artist = root.querySelector("#artist");

  if (cover) cover.src = currentSong.getCoverLink ? currentSong.getCoverLink() : currentSong.coverLink;
  if (title) title.textContent = currentSong.getTitle ? currentSong.getTitle() : currentSong.title;
  if (artist) artist.textContent = currentSong.getArtist ? currentSong.getArtist() : currentSong.artist;
}
window.updateUI = updateUI;

// helpers
function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.createElement("audio");
    audioInstance.id = "audio";
    document.body.appendChild(audioInstance);
  }
  return audioInstance;
}

function updatePlayPauseIcon(isPlaying) {
  const player = document.getElementById("player");
  if (!player) return;
  const root = player.shadowRoot || player;
  const btn = root.querySelector("#playPauseButton");
  if (btn) {
    btn.innerHTML = isPlaying
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M8 5v14l11-7z"/></svg>`;
  }
}

// setup
function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  // prevent duplicate players
  if (document.getElementById("player")) return;

  const defaultSongs = [
    ["Echo's Answer", "Broadcast", "https://images.genius.com/c719e3ca7a6dd3b8e19c58b19358b5d2.999x999x1.png", "https://www.youtube.com/watch?v=nuz9AcacCLM"],
    ["Sometime Later", "Alpha", "https://images.genius.com/1aa9a88769d50cbd6c942339b5ccf013.600x534x1.jpg", "https://www.youtube.com/watch?v=_vwzGTkhgwo"],
    ["Purple", "Crustation, Bronagh Slevin", "https://i.ytimg.com/vi/h8bibJ8v9aI/hqdefault.jpg", "https://www.youtube.com/watch?v=D2FB08OHaeo"],
    ["Low Place Like Home", "Sneaker Pimps", "https://i.discogs.com/O64D1mCzyh3pXYE4q6dCgZJsuT34zrc0sPaFGD2krfY/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTMxNjY5/OTk0LTE3MjU2NDgw/MDgtODQ5MS5qcGVn.jpeg", "https://www.youtube.com/watch?v=7aH7ILzS6G0"],
    ["Eden", "Hooverphonic", "https://images.genius.com/31c49d1c863f0e51dc1447f2749f3417.600x600x1.jpg", "https://www.youtube.com/watch?v=Lw59wrZI_ic"],
    ["Western Eyes", "Portishead", "https://i.scdn.co/image/ab67616d0000b273d48721bfc334d8a5d1faeffb", "https://www.youtube.com/watch?v=tz-QNii79lI"],
    ["Midnight In A Perfect World", "DJ Shadow", "https://i.scdn.co/image/ab67616d0000b273f53c8bc4fcc1a22b0dcd3042", "https://www.youtube.com/watch?v=IHvRY1SC9qw"],
    ["Everything You Do Is A Balloon", "Boards of Canada", "https://yt3.googleusercontent.com/xw4jWwbUjoz5Mi6dGfm06InUf8ALB_JIEqzdM3KgI7JZASQieigfY9ibD1qjGB8sqb5SKByKUVDWf7c=w544-h544-l90-rj", "https://www.youtube.com/watch?v=5_KKJmEY2PU"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 20px;
      padding: 18px 25px;
      min-height: 250px;
      margin: 20px auto;
      width: 780px;
      background: linear-gradient(180deg, #f7faff 0%, #e1ebf7 55%, #cdddf0 100%);
      border: 2px solid #1b365d;
      border-radius: 2px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(27, 54, 93, 0.22);
      color: #162a45;
      box-sizing: border-box;
    }

    #cover {
      width: 210px;
      height: 210px;
      object-fit: cover;
      border: 2px solid #8aa4c4;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(27, 54, 93, 0.25);
      flex-shrink: 0;
    }

    #rightPanel {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
      gap: 15px;
    }

    #info-container {
      background: linear-gradient(180deg, #ffffff 0%, #edf4fc 100%);
      border: 1px solid #9bb2cf;
      border-radius: 4px;
      padding: 12px 16px;
      box-shadow: inset 1px 1px 3px rgba(27, 54, 93, 0.12);
      color: #162a45;
    }

    #title-row {
      display: flex;
      align-items: center;
    }

    #song-info #title {
      font-size: clamp(12px, 16px, 18px);
      font-weight: bold;
      margin: 0;
      color: #1b365d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #song-info #artist {
      font-size: 1.0em;
      margin: 4px 0 0 0;
      color: #485e7a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    #progress-bar-container {
      width: 100%;
      height: 10px;
      background: #dce6f2;
      border: 1px solid #9bb2cf;
      border-radius: 3px;
      cursor: pointer;
      margin-top: 12px;
      position: relative;
      overflow: hidden;
      user-select: none;
    }

    #progress {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #1b365d 0%, #2563eb 65%, #b22234 100%);
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    #controls-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    #controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #controls button {
      background: linear-gradient(180deg, #ffffff 0%, #e8eff8 60%, #d4e1f2 100%);
      border: 1px solid #8aa4c4;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(27, 54, 93, 0.18);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 32px;
      transition: background 0.1s;
    }

    #controls button:hover {
      background: linear-gradient(180deg, #ffffff 0%, #f0f5fc 100%);
      border-color: #1b365d;
    }

    #controls button:active {
      background: linear-gradient(180deg, #cbd9eb 0%, #e1ebf7 100%);
      box-shadow: inset 1px 1px 3px rgba(27, 54, 93, 0.25);
    }

    #volume-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #volumeSlider {
      -webkit-appearance: none;
      width: 110px;
      height: 8px;
      background: linear-gradient(to right, #1b365d 0%, #2563eb 22.2%, #cbd7e6 22.2%, #cbd7e6 100%);
      border: 1px solid #8aa4c4;
      border-radius: 3px;
      outline: none;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #d4e1f2 100%);
      border: 1px solid #1b365d;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(27, 54, 93, 0.35);
    }

    #volumeSlider::-webkit-slider-thumb:active {
      background: #b22234;
    }
  `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <img id="cover" src="" alt="Album Cover">
    <div id="rightPanel">
      <div id="info-container">
        <div id="song-info">
          <div id="title-row">
            <h3 id="title"></h3>
          </div>
          <p id="artist"></p>
        </div>
        <div id="progress-bar-container">
          <div id="progress"></div>
        </div>
      </div>
      <div id="controls-container">
        <div id="controls">
          <button id="prevButton" title="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6zM11 12l8.5 6V6z"/></svg>
          </button>
          <button id="playPauseButton" title="Play/Pause">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button id="nextButton" title="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
        <div id="volume-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#aaa"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          <input type="range" id="volumeSlider" min="0" max="9" step="1" value="2">
        </div>
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) backendSetSrcAndLoad(startSong, audio);
  startYTProgressPump();
  backendSetVolume(audio, currentVolume / 9);

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress");
  const volumeSlider = document.getElementById("volumeSlider");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (isYouTubeSong(activePlaylist.getCurrentSong())) {
      const isPlaying = window.YT?.PlayerState
        ? ytPlayer?.getPlayerState?.() === YT.PlayerState.PLAYING
        : false;
      if (isPlaying) {
        backendPause(audio);
        updatePlayPauseIcon(false);
      } else {
        startYTProgressPump();
        backendPlay(audio);
        updatePlayPauseIcon(true);
      }
      return;
    }

    if (audio.paused) {
      backendPlay(audio);
      updatePlayPauseIcon(true);
    } else {
      backendPause(audio);
      updatePlayPauseIcon(false);
    }
  });

  const playActiveTrack = () => {
    updateUI(activePlaylist);
    const song = activePlaylist.getCurrentSong();
    if (song) {
      backendSetSrcAndLoad(song, audio);
      startYTProgressPump();
      backendPlay(audio);
      updatePlayPauseIcon(true);
    }
  };

  // next/prev
  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playActiveTrack();
  });

  // progress bar
  const paintProgress = () => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration) && duration > 0) {
      const progress = (backendGetCurrentTime() / duration) * 100;
      if (progressBar) progressBar.style.width = progress + "%";
    }
  };

  audio.addEventListener("timeupdate", paintProgress);

  ytHooks.onEnded = () => {
    activePlaylist.playNext();
    playActiveTrack();
  };

  ytHooks.onProgress = () => {
    paintProgress();
  };

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playActiveTrack();
  });

  progressBarContainer.addEventListener("click", (e) => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration) && duration > 0) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      backendSeekTo((clickX / width) * duration);
    }
  });

  // volume
  const updateVolumeFill = (val) => {
	const pct = (val / 9) * 100;
	volumeSlider.style.background = `linear-gradient(to right, #0052d4 0%, #4364f7 ${pct}%, #111 ${pct}%, #111 100%)`;
  };

  updateVolumeFill(volumeSlider.value);

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    backendSetVolume(audio, currentVolume / 9);
	updateVolumeFill(currentVolume);
  });

  // initial play
  updateUI(activePlaylist);
  backendPlay(audio)
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}
setupMusicPlayer();
