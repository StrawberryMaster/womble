campaignTrail_temp.election_json = [
    {
        "model": "campaign_trail.election",
        "pk": 10,
        "fields": {
            "year": 1964,
            "summary": "<div style=\"overflow:auto; height: 200px\"><p><i>“Not worth a bucket of warm piss.”</i></p><p>Neither Texas powerhouse Lyndon Johnson nor UAW leader Walter Reuther was willing to surrender their political leverage for a ceremonial post, prompting John F. Kennedy to select Washington Senator Henry “Scoop” Jackson in 1960 to lock down organized labor and defense-minded internationalists. Scoop was never meant to occupy the center of the national stage; but when bullets struck in Dallas, Jackson had to take the oath and steer a mourning nation through the Cold War.</p></div>",
            "site_description": "<p>Neither Senator Lyndon Johnson nor United Automobile Workers President Walter Reuther were willing to give up their power for the mostly ceremonial role of Vice-President, leading John Kennedy to select his ally Henry “Scoop” Jackson to double down on the support of Union workers and foreign policy minded voters. Scoop Jackson wasn't expected to do much as Vice-President, but when tragedy struck, Scoop stepped up to serve his nation and his party.</p>",
            "image_url": "https://www.historylink.org/Content/Media/Photos/Large/senator-henry-m-jackson-campaigning-in-florida-during-the-presidential-primaries-ca-march-14-1972.jpg",
            "winning_electoral_vote_number": 270,
            "advisor_url": "https://www.historylink.org/Content/Media/Photos/Large/senator-henry-m-jackson-posing-with-his-family-for-a-christmas-card-in-front-of-their-everett-house-ca-1972.jpg",
            "has_visits": 1,
            "no_electoral_majority_image": "https://www.jetsimon.com/public/static/images/2012-no-majority.jpg",
            "creator": "Halligan Elysium & catboxxd",
            "display_year": "1964Scoop"
        }
    }
];

campaignTrail_temp.temp_election_list = [
    {
        "id": 10,
        "year": 1964,
        "is_premium": 0,
        "display_year": "1964Scoop"
    }
];

RecReading = true;

campaignTrail_temp.credits = "Halligan Elysium (Writing) & catboxxd (Coding). Some image fixes were made as part of the Womble Restoration Project.";

campaignTrail_temp.global_parameter_json = [
    {
        "model": "campaign_trail.global_parameter",
        "pk": 1,
        "fields": {
            "vote_variable": 1.125,
            "max_swing": 0.12,
            "start_point": 0.94,
            "candidate_issue_weight": 10.0,
            "running_mate_issue_weight": 3.0,
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

campaignTrail_temp.candidate_json = [
    {
        "model": "campaign_trail.candidate",
        "pk": 91,
        "fields": {
            "first_name": "Henry “Scoop”",
            "last_name": "Jackson",
            "election": 10,
            "party": "Democratic",
            "state": "Washington",
            "priority": 1,
            "description": "<p>For the ambitious son of Norwegian immigrants, the Monkey's Paw has curled its fingers and granted his greatest wish in the worst possible way. Henry “Scoop” Jackson was the only candidate Kennedy wanted who was willing to take the job, and his working-class background, support for organized labor, and vocal disagreements with Eisenhower's foreign policy helped Kennedy secure the victory even after the South turned against him.</p><p>But being a useful running mate doesn't necessarily make him a strong head of the ticket. Scoop is uncharismatic, has conservative sympathies, and has a habit of tutting whenever his coalition's allies take to the streets to demand their rights. If Jackson is going to keep Camelot safe from Goldwater, he'll have to find a way to keep this already-tenuous coalition on his side.</p>",
            "color_hex": "#0043b0",
            "secondary_color_hex": "#85b3ff",
            "is_active": 1,
            "image_url": "https://media.gettyimages.com/id/515041076/pt/foto/senator-henry-scoop-jackson.jpg?s=612x612&w=0&k=20&c=pzunKHj5KT91KoBKNZfvO0Ib0ESQGPuQFbUTm1CXe-M=",
            "electoral_victory_message": "<h3>Congratulations! You have won the 1964 Presidential Election.</h3><p>You have secured a full four-year mandate in your own right, validating your stewardship after the tragedy of Dallas. With Goldwater soundly defeated, you can push forward with your robust national defense program, expand federal support for labor and education, and safeguard Kennedy's legislative legacy. Keep a watchful eye on Southeast Asia and domestic racial tensions — they will define the trials of your upcoming term.</p>",
            "electoral_loss_message": "<h3>Sorry, you have lost the 1964 Presidential Election.</h3><p>Barry Goldwater has pulled off an unprecedented upset, capturing the White House and breaking the New Deal coalition. Pundits will place the blame squarely on your inability to inspire the party faithful and the catastrophic fracture between Northern liberals and Southern traditionalists. You will likely return to Capitol Hill to resume your seat in the Senate, leading a demoralized opposition against the conservative revolution.</p>",
            "no_electoral_majority_message": "<h3>An Electoral College Deadlock!</h3><p>Neither candidate has secured an outright majority of electors, throwing the contest directly into the House of Representatives. While the Democratic majority should theoretically elect you, Southern segregationists hold the balance of power and will demand drastic concessions on civil rights before casting their ballots.</p>",
            "description_as_running_mate": "''",
            "candidate_score": 1.0,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 92,
        "fields": {
            "first_name": "Barry",
            "last_name": "Goldwater",
            "election": 10,
            "party": "Republican",
            "state": "Arizona",
            "priority": 2,
            "description": "<p><b>Non-playable, context only</b><p>Barry Goldwater, once dismissed as a radical with little hope of ever winning nationally, now stands a real chance of reaching the White House. After a bruising primary that he mostly managed to keep his head above, the Republican Party has, however reluctantly, fallen in behind him in the hope of unseating the mediocre incumbent.</p><p>A charismatic firebrand, Goldwater presents himself as the man who can rein in reckless Democratic programs while defending the fundamental rights of businesses and the states. For a party that spent years treating him as a fringe figure, getting this far is quite the achievement. Now he just has to win the thing.</p>",
            "color_hex": "#960000",
            "secondary_color_hex": "#ff9191",
            "is_active": 1,
            "image_url": "https://media.gettyimages.com/id/50398880/pt/foto/barry-m-goldwater.jpg?s=612x612&w=0&k=20&c=ihibS6i21Nv0BIRlB1pXINtcO7NemydD8_PmdEKWVYY=",
            "electoral_victory_message": "<h3>Barry Goldwater has won the Presidency.</h3><p>The conservative revolution has triumphed, sweeping aside thirty years of New Deal orthodoxy.</p>",
            "electoral_loss_message": "<h3>Barry Goldwater has been defeated.</h3><p>Jackson and the Democratic establishment have turned back the conservative challenge.</p>",
            "no_electoral_majority_message": "<h3>The Election heads to the House of Representatives.</h3><p>With no majority in the Electoral College, the election will be determined in Congress.</p>",
            "description_as_running_mate": "''",
            "candidate_score": 1.0,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 93,
        "fields": {
            "first_name": "Eric",
            "last_name": "Hass/Others",
            "election": 10,
            "party": "Socialist Labor",
            "state": "New York",
            "priority": 3,
            "description": "''",
            "color_hex": "#4a0000",
            "secondary_color_hex": "#994e4e",
            "is_active": 0,
            "image_url": "https://i.imgur.com/fRBY9uu.jpg",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "''",
            "candidate_score": 1.0,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 95,
        "fields": {
            "first_name": "John",
            "last_name": "Connally",
            "election": 10,
            "party": "Democratic",
            "state": "Texas",
            "priority": 5,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://preview.redd.it/kinda-sad-to-see-mods-like-carterverse-not-have-most-of-v0-bn7ffy64dpoh1.png?width=291&format=png&auto=webp&s=a2ef30b3b4bfff61b04ea9b022d44fcd2e5d5401",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<p>The governor of Texas, John Connally gained national recognition when he and his wife narrowly survived the Kennedy assassination.</p> <p>In theory, that connection could help keep the Democratic ticket closely tied to Kennedy, but Connally is an arch-conservative even by Southern standards. Bringing him onto the ticket would represent a significant shift to the right, potentially peeling some votes away from Goldwater while risking the enthusiasm of liberal voters. Still, he's a loyal party man — or at least loyal to the promotion —, and he won't storm out of the room if you support Civil Rights, which is about as much as you can ask for.</p>",
            "candidate_score": 0.0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 96,
        "fields": {
            "first_name": "Ralph",
            "last_name": "Yarborough",
            "election": 10,
            "party": "Democratic",
            "state": "Texas",
            "priority": 6,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRClKYlKnvGi1viwohaoRRGKHNHmELKmJsg1TLWzD4Cl-DYeVH6tvFYo1Wa&s=10",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<p>A Texas Senator and, perhaps, one of the few genuinely liberal politicians the state has produced, he is best known for expanding educational opportunities for veterans and securing federal funding for universities. His Southern roots never stopped him from taking unpopular positions at home: he refused to sign the Southern Manifesto following Brown v. Board of Education, and before coming to the Senate, his support for civil rights cost him several gubernatorial primary bids.</p><p>A Northerner-Southerner ticket may be the best chance of clawing back some of the South, but his record on civil rights makes that considerably harder. Still, if you're determined to double down on liberalism, the choice is fairly narrow: he and Bobby are the only men the DNC will accept.</p>",
            "candidate_score": 0.0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 97,
        "fields": {
            "first_name": "Arleigh",
            "last_name": "Burke",
            "election": 10,
            "party": "Independent",
            "state": "Colorado",
            "priority": 7,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiuLvsZRRHRr8frXNCBon8PYlsuFB8K5YDnOzS3D_seqY3g90YPYmonEQ&s=10",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<p>Burke is a veteran of both the Second World War and the Korean War, and a former Chief of Naval Operations. He would be an unusual choice for several reasons: his career reached its peak under President Eisenhower, and he is neither a Kennedy nor a son of Dixie. Choosing him would instead amount to a commitment to an apolitical campaign centered on foreign policy.</p><p>With the election already tangled up in some of the most divisive issues of the day, doubling down on foreign policy while steering clear of the social questions could offer a way to keep the campaign on friendlier ground. Burke's military record and experience would also give the ticket some authority on the international stage.</p>",
            "candidate_score": 0.0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 98,
        "fields": {
            "first_name": "Robert F.",
            "last_name": "Kennedy",
            "election": 10,
            "party": "Democratic",
            "state": "Massachusetts",
            "priority": 8,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://media.gettyimages.com/id/97351400/pt/foto/united-states-robert-f-kennedy-in-the-daily-news-studio.jpg?s=612x612&w=0&k=20&c=l6uo_FTLmsc5EKblLL5_jlA1fC8qs6jYV4EWziV2Sbc=",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<p>Robert F. Kennedy is the late John Kennedy's brother and closest political ally, as well as the DNC's preferred running mate. To be frank, he'd probably be their first choice for the ticket, but the party is wary of the stigma that could come with replacing an incumbent.</p><p>Handsome, charismatic, and ambitious, Bobby would almost certainly send much of the South fleeing to Goldwater. In the party's worst-case projections, that could leave you facing a 365–121 Electoral College landslide. He would also expect some concessions before joining the ticket, particularly a major role in both the campaign and the administration from the outset. Still, given his reputation as a gifted campaigner and capable statesman, that's arguably less a concession than another gift the Kennedys bring to the table.</p>",
            "candidate_score": 0.0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 99,
        "fields": {
            "first_name": "William E.",
            "last_name": "Miller",
            "election": 10,
            "party": "Republican",
            "state": "New York",
            "priority": 9,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://media.gettyimages.com/id/50398196/pt/foto/vice-president-candidate-william-e-miller-attending-former-president-herbert-c-hoovers-funeral.jpg?s=612x612&w=0&k=20&c=N9qkJBBu7Hiq_yy7hZqF7iRrzWUEpkOhL-iSRWTAWjU=",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<p>A Catholic from New York, William Miller might look to those unfamiliar with his politics like an attempt to capitalize on the tragedy of President Kennedy's death. To anyone who knows him, though, his selection is a rather shocking one. Miller is an arch-conservative, practically on Goldwater's level, making the ticket a direct rebuke to the Rockefeller Republicans and to President Jackson. Doubling down this hard on his own beliefs flies in the face of the usual logic behind balancing a ticket.</p><p>If President Jackson weren't Goldwater's opponent, it's hard to imagine him running such a one-sided ticket. Then again, with Jackson in the White House, perhaps Goldwater has decided there's little reason to pretend otherwise.</p>",
            "candidate_score": 0.0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 103,
        "fields": {
            "first_name": "Henning A.",
            "last_name": "Blomen",
            "election": 10,
            "party": "Socialist Labor",
            "state": "Massachusetts",
            "priority": 13,
            "description": "''",
            "color_hex": "#00C100",
            "secondary_color_hex": "#A1FFA1",
            "is_active": 0,
            "image_url": "''",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "''",
            "candidate_score": 0.0,
            "running_mate": true
        }
    }
];

campaignTrail_temp.running_mate_json = [
    {
        "model": "campaign_trail.running_mate",
        "pk": 58,
        "fields": {
            "candidate": 91,
            "running_mate": 95
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 59,
        "fields": {
            "candidate": 91,
            "running_mate": 96
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 60,
        "fields": {
            "candidate": 91,
            "running_mate": 97
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 61,
        "fields": {
            "candidate": 91,
            "running_mate": 98
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 62,
        "fields": {
            "candidate": 92,
            "running_mate": 99
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 66,
        "fields": {
            "candidate": 93,
            "running_mate": 103
        }
    }
];

campaignTrail_temp.opponents_default_json = [
    {
        "election": 10,
        "candidates": [91, 92, 93]
    }
];

campaignTrail_temp.opponents_weighted_json = [
    {
        "election": 10,
        "candidates": [91, 92, 93]
    }
];

campaignTrail_temp.difficulty_level_json = [
    {
        "model": "campaign_trail.difficulty_level",
        "pk": 1,
        "fields": {
            "name": "Easy",
            "multiplier": 1.1
        }
    },
    {
        "model": "campaign_trail.difficulty_level",
        "pk": 3,
        "fields": {
            "name": "Normal",
            "multiplier": 0.97
        }
    },
    {
        "model": "campaign_trail.difficulty_level",
        "pk": 4,
        "fields": {
            "name": "Hard",
            "multiplier": 0.95
        }
    },
    {
        "model": "campaign_trail.difficulty_level",
        "pk": 5,
        "fields": {
            "name": "Impossible",
            "multiplier": 0.9
        }
    }
];

campaignTrail_temp.candidate_dropout_json = [
    {
        "model": "campaign_trail.candidate_dropout",
        "pk": 1,
        "fields": {
            "candidate": 36,
            "affected_candidate": 18,
            "probability": 1.0
        }
    }
];

campaignTrail_temp.modBoxTheme = {
    "header_color": "#121212",
    "header_text_color": "#b8b8b8",
    "description_background_color": "#181422",
    "description_text_color": "#ffffff",
    "main_color": "#3f2d62",
    "secondary_color": "#5c418f",
    "ui_text_color": "#ffffff"
};

jet_data = {
    "headerColor": "#121212",
    "headerTextColor": "#b8b8b8",
    "windowColor": "#3f2d62",
    "containerColor": "#291e40",
    "innerWindowColor": "#f5f0fa",
    "innerWindowTextColor": "#121212",
    "descriptionWindowColor": "#181422",
    "descriptionWindowTextColor": "#ffffff",
    "startButtonColor": "#5c418f",
    "bannerImageUrl": "https://i.imgur.com/EZx7Mhn.png",
    "backgroundImageUrl": "https://i.imgur.com/pwSIaO5.png",
    "gameTitle": "The Campaign Trail",
    "customQuote": "\"Speak softly and carry a Scoop.\"",
    "quoteTextColor": "#d9c4ff",
    "endingTextColor": "#000000",
    "modBoxTheme": campaignTrail_temp.modBoxTheme
};

HistHexcolour = ["#0043B0", "#960000", "#4A0000"];
HistName = ["Henry “Scoop” Jackson", "Barry Goldwater", "Eric Hass / Others"];
HistEV = [385, 153, 0];
HistPV = ["38,421,908", "31,847,150", "430,280"];
HistPVP = ["54.3%", "45.0%", "0.7%"];

//#startcode
function applyTheme(theme) {
    const gameHeader = document.querySelector(".game_header");
    if (gameHeader && theme.coloring_title) {
        gameHeader.style.backgroundColor = theme.coloring_title;
    }

    const gameWindow = document.getElementById("game_window");
    if (gameWindow && theme.coloring_window) {
        gameWindow.style.backgroundColor = theme.coloring_window;
    }

    const container = document.querySelector(".container");
    if (container && theme.coloring_container) {
        container.style.backgroundColor = theme.coloring_container;
    }

    const headerImg = document.getElementById("header");
    if (headerImg && theme.header_image) {
        headerImg.src = theme.header_image;
    }

    if (theme.body_background) {
        document.body.style.backgroundImage = `url("${theme.body_background}")`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";
    }

    const style = document.createElement("style");
    style.textContent = `
      #results_container { color: #000000; }
      #wittyquote { color: #d9c4ff; }
      .game_header h2 { color: #ffffff; }
      .inner_window_w_desc { background-color: #f5f0fa !important; color: #121212; }
      .inner_window_front, .person_description_window, .election_description_window, .description_window_small { background-color: #ede5f7 !important; color: #121212; }
      .campaign_trail_start_emphasis { background-color: #5c418f !important; color: #ffffff !important; }

      .overlay_window img { object-fit: cover; object-position: top; }

      .inner_window_question h3, .overlay_window h3 {
          background: #291e40;
          color: #ffffff;
          border-color: #5c418f;
          padding: .3em .6em;
      }

      #campaign_sign {
          background-color: #291e40;
          border: 2px solid #5c418f;
      }
      #campaign_sign p {
          color: #f5f0fa;
      }

      #map_container {
          background-color: #f5f0fa;
      }

      #menu_container, #overall_result_container, #overall_result {
          background-color: #f5f0fa;
          color: #121212;
      }

      #menu_container h3 {
          background-color: #3f2d62;
          color: #ffffff;
      }

      #results_container .person_image {
          width: 230px;
          object-fit: cover;
      }

      .overlay_window {
          height: auto;
      }

	  .person_image img, #election_image img {
		  object-fit: cover;
		  object-position: center;
		}

		#election_image img {
		  object-position: top;
		}

      #candidate_pic, #running_mate_pic {
          object-fit: cover;
          object-position: top;
          width: 155px;
      }

      button {
          background-color: #5c418f;
          color: #ffffff;
          border: 1px solid #1a1226;
          border-radius: 3px;
          padding: 5px 12px;
          transition: background-color 0.15s ease, transform 0.05s ease;
      }
      button:hover {
          background-color: #6e4fa8;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          cursor: pointer;
      }
      button:active {
          background-color: #452d70;
          transform: translateY(1px);
      }

      select {
          background-color: #291e40;
          color: #ffffff;
          border: 1px solid #5c418f;
          padding: 4px;
      }

      div[style*="overflow:auto"]::-webkit-scrollbar {
          width: 6px;
      }
      div[style*="overflow:auto"]::-webkit-scrollbar-thumb {
          background: #5c418f;
          border-radius: 3px;
      }
      div[style*="overflow:auto"]::-webkit-scrollbar-track {
          background: #ede5f7;
      }
    `;
    document.head.appendChild(style);
}

corrr = '\n              <h2>The Campaign Trail</h2>\n            ';

const theme = nct_stuff.themes[nct_stuff.selectedTheme];

theme.coloring_title = "#121212";
theme.coloring_window = "#3f2d62";
theme.coloring_container = "#291e40";
theme.header_image = "https://preview.redd.it/kinda-sad-to-see-mods-like-carterverse-not-have-most-of-v0-u88660zzcpoh1.png?width=1165&format=png&auto=webp&s=4e01db88e5720dc87b261d7af501bed2c52c8bcb";
theme.body_background = "https://live.staticflickr.com/5445/8756073814_787d5fb635_b.jpg";

applyTheme(theme);
//#endcode

// This is a modified version of the music player
// used in the mod All The Way.
class Song {
  constructor(title, artist, coverLink, audioLink) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;
    this.audioLink = audioLink;
  }
  getTitle() { return this.title; }
  getArtist() { return this.artist; }
  getCoverLink() { return this.coverLink; }
  getAudioLink() { return this.audioLink; }
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
let currentVolume = 3;
let getAudioAmplitude = (time) => 0;

// assets
const ASSETS = {
  bg: "https://i.imgur.com/57IeWZc.png",
  infoBg: "https://i.imgur.com/BSXotSO.png",
  needle: "https://i.imgur.com/ohd0XR3.png",
  btnPrev: "https://i.imgur.com/Zkk16Uy.png",
  btnPlay: "https://i.imgur.com/Kb4y3wX.png",
  btnPause: "https://i.imgur.com/LxQnVBj.png",
  btnNext: "https://i.imgur.com/P39RRW4.png",
  volIcon: "https://i.imgur.com/jjUzV10.png"
};

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  activePlaylist.currentSongIndex = 0;
  updateUI(activePlaylist);

  // ensure audio exists before trying to access it
  const audio = getAudioElement();
  const song = activePlaylist.getCurrentSong();

  if (song) {
    audio.src = song.audioLink;
    decodeAudio(audio.src);
    audio.play().catch(e => console.log("Autoplay blocked or waiting for interaction", e));
    updatePlayPauseIcon(true);
  }
}
window.changePlaylist = changePlaylist;

function updateUI(playlist) {
  const currentSong = playlist.getCurrentSong();
  const player = document.getElementById("player");

  if (!player || !currentSong) return;

  const cover = player.querySelector("#cover");
  const title = player.querySelector("#title");
  const artist = player.querySelector("#artist");

  if (cover) cover.src = currentSong.getCoverLink();
  if (title) title.textContent = currentSong.getTitle();
  if (artist) artist.textContent = currentSong.getArtist();
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
  const btn = document.getElementById("playPauseButton");
  if (btn) btn.src = isPlaying ? ASSETS.btnPause : ASSETS.btnPlay;
}

// audio decoding for needle animation
async function isBraveBrowser() {
  return (window.navigator.brave && await window.navigator.brave.isBrave());
}

async function decodeAudio(audioSrc) {
  try {
    if (await isBraveBrowser()) return null;

    const audioContext = new AudioContext();
    const response = await fetch(audioSrc);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await audioContext.decodeAudioData(arrayBuffer);

    const sampleRate = buffer.sampleRate;
    const totalSamples = buffer.length;
    const numChannels = buffer.numberOfChannels;

    const downsampleFactor = 32;
    const reducedSize = Math.floor(totalSamples / downsampleFactor);

    let amplitudes = new Float32Array(reducedSize);
    let meanAmplitude = 0;

    for (let i = 0; i < reducedSize; i++) {
      let sum = 0;
      for (let channel = 0; channel < numChannels; channel++) {
        sum += buffer.getChannelData(channel)[i * downsampleFactor] ** 2;
      }
      amplitudes[i] = sum / numChannels;
      meanAmplitude += amplitudes[i];
    }

    meanAmplitude /= reducedSize;

    getAudioAmplitude = function (time) {
      const delay = 0.17;
      let index = Math.floor((time + delay) * sampleRate / downsampleFactor);
      index = Math.min(index, reducedSize - 1);
      let amplitudeNorm = amplitudes[index] / (2 * meanAmplitude);
      return Math.min(amplitudeNorm, 1);
    };

    console.log("Audio decoded successfully!");
  } catch (error) {
    console.error("Error decoding audio:", error);
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
    // Side A
    ["Music For Night People", "The Larry Page Orchestra", "https://i.discogs.com/gmNkkD9sfNw9loep4x7Vvhku9na1ttRt3FvIzF8RrRI/rs:fit/g:sm/q:90/h:600/w:594/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTcxMjQ3/MzItMTQ5NzQ0NTk1/NS0zODg3LmpwZWc.jpeg", "https://audio.jukehost.co.uk/CZGLN0owECLaH2RrCLkilZjMTG70sh80"],
    ["Abraham, Martin & John", "Marvin Gaye", "https://upload.wikimedia.org/wikipedia/en/c/cd/Marvin-way-love-is.jpg", "https://audio.jukehost.co.uk/Mztey0lInnTecjOildeNBVjc4VKlxYkP"],
    ["In The Summer Of His Years", "Connie Francis", "https://upload.wikimedia.org/wikipedia/en/7/79/In_the_Summer_of_His_Years_%28album%29.jpg", "https://audio.jukehost.co.uk/TxpMOkHP25QHdfPMbu5XQ2QgL5Wh9ZV3"],
    ["Green Beret", "Tommy Scott's Pipes & Banjo Band", "https://cdn-images.dzcdn.net/images/cover/ff3689d092b7d71404481319afd32f9d/1900x1900-000000-80-0-0.jpg", "https://audio.jukehost.co.uk/85s68GIOegXpY4JmNAeNHKQ5sBova9dr"],

    // Side B
    ["Paint It, Black", "The Rolling Stones", "https://upload.wikimedia.org/wikipedia/en/5/58/Paint_It_Black_UK_sleeve.jpg", "https://audio.jukehost.co.uk/X3XVjTL1e5o3Kn0MXHfBggliygjHmpAK"],
    ["The Wanderer", "Dion", "https://upload.wikimedia.org/wikipedia/en/a/a9/The_Wanderer.png", "https://audio.jukehost.co.uk/EDRgryIgbx3vZQg9t2Fc1ZJ7EffI6Oj8"],
    ["Runaway", "Del Shannon", "https://upload.wikimedia.org/wikipedia/en/e/e7/Runaway_%28Del_Shannon_song%29.jpg", "https://audio.jukehost.co.uk/dC2TcEkNDO8prcdxSot00lG2FXEpaLgw"],
    ["Sugar, Sugar", "The Archies", "https://i.discogs.com/TMw-tg06fJ4vNVpRVggMpv5_Iw8FgJADnWs8SGjjLuM/rs:fit/g:sm/q:90/h:600/w:595/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTYwNzY0/NjAtMTQ4NTY5MDk4/OC0zNzY1LmpwZWc.jpeg", "https://audio.jukehost.co.uk/rhv9at6IS1oNzl3AFqXEMmcha7pX9XXu"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  window.sideA = new Playlist();
  window.sideB = new Playlist();
  defaultSongs.slice(0, 4).forEach(data => window.sideA.addSong(new Song(...data)));
  defaultSongs.slice(4).forEach(data => window.sideB.addSong(new Song(...data)));

  // inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #player {
      border: 3px solid #C9C9C9;
      display: flex;
      flex-direction: row;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      user-select: none;
      box-sizing: border-box;
      margin: 10px auto;
      max-width: 100%;
    }
    #display-box {
      display: flex;
      align-items: center;
      width: 50%;
    }
    #cover {
      width: 176px;
      height: 176px;
      object-fit: cover;
    }
    #info-container {
      display: flex;
      flex-direction: row;
      height: 178px;
      width: 127px;
      margin-top: 3px;
      background-image: url('${ASSETS.infoBg}');
      background-size: cover;
      color: #cfcfcf;
      position: relative;
    }
    #song-info {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
      overflow: hidden;
    }
    #title {
      font-weight: normal;
      font-size: 1.025em;
      line-height: 17px;
      margin: 4px 0;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }
    #artist {
      font-size: 0.85em;
      color: #b0b0b0;
      margin: 0;
    }
    #controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px;
      width: 100%;
      padding-top: 15px;
    }
    #controls {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 80%;
      gap: 12px;
    }
    #controls img {
      cursor: pointer;
      transition: filter 0.1s ease;
    }
    #controls img:active {
      filter: brightness(0.4);
    }
    #needle {
      position: absolute;
      top: 0;
      left: 0;
      width: 127px;
      height: 352px;
      transform-origin: 50% 50%;
      transform: rotate(-45deg);
      transition: transform 0.3s ease;
      pointer-events: none;
      user-select: none;
      z-index: 9999;
      outline: none;
      border: none;
    }

    input[type=range] {
      appearance: none;
      background: #e0e0e0;
      border-radius: 2px;
      outline: none;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.6);
    }

    #progress-bar-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    #progress-bar {
      width: 80%;
      height: 4px;
      margin-top: 20px;
      cursor: pointer;
    }
    #progress-bar::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: #333;
      border: 2px solid #f1f1f1;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.7);
    }
    #progress-bar::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #333;
      border: 2px solid #f1f1f1;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0,0,0,0.7);
    }

    /* Vertical Volume Slider */
    .is-vertical {
      margin-left: -16%;
      height: 126px;
      display: flex;
      justify-content: center;
    }
    #volumeSlider {
      width: 4px;
      height: 100%;
      writing-mode: vertical-rl;
      direction: rtl;
      cursor: pointer;
    }
    #volumeSlider::-webkit-slider-thumb {
      appearance: none;
      width: 22px;
      height: 12px;
      background: #a86b32;
      border: 1px solid #4a2a10;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.6);
    }
    #volumeSlider::-moz-range-thumb {
      width: 22px;
      height: 10px;
      background: #a86b32;
      border: 1px solid #4a2a10;
      border-radius: 2px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.6);
    }

    #volume-display {
      font-weight: bold;
      display: none;
    }
    `;
  document.head.appendChild(style);

  // create HTML
  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="display-box">
      <img id="cover" src="">
      <div id="info-container">
        <img id="needle" src="${ASSETS.needle}">
        <div id="song-info">
          <h3 id="title"></h3>
          <p id="artist"></p>
        </div>
      </div>
    </div>
    <div id="controls-container">
      <div id="controls">
        <img id="prevButton" src="${ASSETS.btnPrev}" alt="Previous">
        <img id="playPauseButton" src="${ASSETS.btnPause}" alt="Play/Pause">
        <img id="nextButton" src="${ASSETS.btnNext}" alt="Next">
      </div>
      <div id="progress-bar-container">
        <input type="range" id="progress-bar" value="0" max="100" step="0.1">
      </div>
    </div>
    <div id="volume-container">
      <img src="${ASSETS.volIcon}" alt="Volume">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}">
      </div>
      <span id="volume-display">${currentVolume}</span>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  // set up audio & logic
  const audio = getAudioElement();
  const startSong = activePlaylist.getCurrentSong();
  if (startSong) {
    audio.src = startSong.audioLink;
    decodeAudio(audio.src);
  }
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBar = document.getElementById("progress-bar");
  const volumeSlider = document.getElementById("volumeSlider");
  const volDisplay = document.getElementById("volume-display");
  const needle = document.getElementById("needle");

  // play/pause
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      updatePlayPauseIcon(true);
    } else {
      audio.pause();
      needle.style.transform = "rotate(-45deg)";
      updatePlayPauseIcon(false);
    }
  });

  // next/prev
  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    audio.src = activePlaylist.getCurrentSong().audioLink;
    decodeAudio(audio.src);
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(() => updatePlayPauseIcon(false));
  };

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  // progress bar & needle update
  audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration)) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }

    // needle dynamic rotation based on amplitude
    const MIN_DEG = -45, MAX_DEG = 45;
    let amplitude = audio.paused ? 0 : getAudioAmplitude(audio.currentTime);
    let degrees = MIN_DEG + amplitude * (MAX_DEG - MIN_DEG);
    needle.style.transform = `rotate(${degrees}deg)`;
  });

  audio.addEventListener("ended", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  // volume
  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    volDisplay.textContent = currentVolume;
    audio.volume = currentVolume / 9;
  });

  // initial play
  updateUI(activePlaylist);
  audio.play()
    .then(() => updatePlayPauseIcon(true))
    .catch(() => updatePlayPauseIcon(false));
}

setupMusicPlayer();
