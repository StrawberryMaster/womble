// ============================================
// 1968 Nixon Redux -- Pain and Suffering
// Code 1 (Final)
// ============================================

campaignTrail_temp.election_json = [
  {
    "model": "campaign_trail.election",
    "pk": 4,
    "fields": {
      "year": 1968,
      "display_year": "1968 Nixon Redux - Pain and Suffering",
      "summary": "<p>It's not just another election year—it's a moment of profound national reckoning. The conflict in Vietnam continues to cast a long shadow over American life, while domestic unrest, political violence, and deep ideological fractures have left the country searching for direction. This is not merely a contest between candidates; it's a referendum on the very direction of the nation itself.</p><p>In this complex and rapidly evolving landscape, three distinct visions compete for the support of the American people. Navigating these challenges requires more than simple policy positions—it demands a careful balancing of competing priorities, an understanding of regional dynamics, and the ability to speak to a deeply divided electorate.</p>",
      "image_url": "PASTE_ELECTION_IMAGE_URL_HERE",
      "winning_electoral_vote_number": 270,
      "advisor_url": "",
      "recommended_reading": "The Making of the President 1968 – Theodore H. White<br>Nixonland – Rick Perlstein<br>An American Melodrama – Lewis Chester, Godfrey Hodgson, Bruce Page",
      "has_visits": 1,
      "no_electoral_majority_image": "../static/images/2012-no-majority.jpg"
    }
  }
];

campaignTrail_temp.temp_election_list = [
  {
    "id": 4,
    "year": 1968,
    "is_premium": 0,
    "display_year": "1968 Nixon Redux - Pain and Suffering"
  }
];

campaignTrail_temp.credits = "Made by gardfeld";

campaignTrail_temp.global_parameter_json = [
  {
    "model": "campaign_trail.global_parameter",
    "pk": 1,
    "fields": {
      "vote_variable": 1.125,
      "max_swing": 0.12,
      "start_point": 0.94,
      "candidate_issue_weight": 10,
      "running_mate_issue_weight": 3,
      "issue_stance_1_max": -0.71,
      "issue_stance_2_max": -0.3,
      "issue_stance_3_max": -0.125,
      "issue_stance_4_max": 0.125,
      "issue_stance_5_max": 0.3,
      "issue_stance_6_max": 0.71,
      "global_variance": 0.01,
      "state_variance": 0.005,
      "question_count": 20,
      "default_map_color_hex": "#C9C9C9",
      "no_state_map_color_hex": "#999999"
    }
  }
];

campaignTrail_temp.candidate_json = [
  // ===== Presidential Candidates =====
  {
    "model": "campaign_trail.candidate",
    "pk": 23,
    "fields": {
      "first_name": "Richard",
      "last_name": "Nixon",
      "election": 4,
      "party": "Republican",
      "state": "California",
      "priority": 1,
      "description": "<p>It's not simply a political comeback—it's an attempt to redefine what leadership looks like in a time of uncertainty. Richard Nixon returns to the national stage after years in the political wilderness, presenting himself as a figure of experience and steadiness. This is not about relitigating past defeats; it's about offering a path forward that prioritizes order, competence, and a carefully managed resolution to the nation's most pressing challenges. His campaign emphasizes the need for a strong executive hand capable of navigating both domestic unrest and the complexities of foreign policy without succumbing to the extremes of either side.</p><p>In a year defined by division, Nixon positions himself as the candidate best equipped to restore a sense of national purpose. He argues that the country requires more than passion or continuity—it requires judgment, discipline, and a clear-eyed approach to the difficult choices ahead. Supporters see in him a seasoned operator who understands the machinery of government and the limits of idealism; critics view the same qualities as calculation. Either way, his candidacy is framed as a deliberate alternative to the turbulence of the moment.</p>",
      "color_hex": "#E81B23",
      "is_active": 1,
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Richard_Nixon_portrait.jpg",
      "electoral_victory_message": "<h3>A Defining Victory</h3><p>It's not just a win—it's a validation of a carefully constructed message of stability and leadership.</p>",
      "electoral_loss_message": "<h3>A Difficult Outcome</h3><p>It's not the result that was hoped for. Despite a disciplined effort, the electorate has chosen a different direction.</p>",
      "no_electoral_majority_message": "<h3>An Unresolved Contest</h3><p>It's not a clear mandate—it's a deadlock. The final decision now rests with the House of Representatives.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 24,
    "fields": {
      "first_name": "Hubert H.",
      "last_name": "Humphrey",
      "election": 4,
      "party": "Democratic",
      "state": "Minnesota",
      "priority": 1,
      "description": "<p>It's not merely a campaign for the presidency—it's an effort to hold together a coalition under extraordinary strain. Hubert Humphrey faces the dual challenge of representing a party deeply divided over the war while still offering a credible vision of progress and continuity.</p>",
      "color_hex": "#0000FF",
      "is_active": 1,
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Hubert_Humphrey_official_portrait_1965.png",
      "electoral_victory_message": "<h3>A Hard-Fought Success</h3><p>It's not an easy victory—it's the product of careful coalition management under difficult circumstances.</p>",
      "electoral_loss_message": "<h3>A Challenging Result</h3><p>It's not the outcome the campaign sought. The divisions within the party and the broader electorate proved too significant to overcome.</p>",
      "no_electoral_majority_message": "<h3>An Uncertain Path Forward</h3><p>It's not a decisive result—it's a deadlock that now moves the contest into the House of Representatives.</p>",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 25,
    "fields": {
      "first_name": "George",
      "last_name": "Wallace",
      "election": 4,
      "party": "American Independent",
      "state": "Alabama",
      "priority": 2,
      "description": "<p>It's not a conventional presidential campaign—it's a challenge to the existing two-party framework itself. George Wallace's candidacy is built around a message of states' rights, resistance to federal overreach, and a strong emphasis on restoring order.</p>",
      "color_hex": "#FFD700",
      "is_active": 1,
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/5/50/George_Wallace_%28D-AL%29.jpg",
      "electoral_victory_message": "<h3>An Unexpected Outcome</h3><p>It's not what most observers predicted—it's a result that upends conventional expectations.</p>",
      "electoral_loss_message": "<h3>A Strategic Impact</h3><p>It's not an outright victory, but the campaign has succeeded in denying either major-party candidate a clear Electoral College majority in many scenarios.</p>",
      "no_electoral_majority_message": "<h3>A Forced Reckoning</h3><p>It's not a conventional result—it's a deadlock that moves the contest into the House.</p>",
      "candidate_score": 0.5
    }
  },

  // ===== Running Mates =====
  {
    "model": "campaign_trail.candidate",
    "pk": 51,
    "fields": {
      "first_name": "Spiro",
      "last_name": "Agnew",
      "election": 4,
      "party": "Republican",
      "state": "Maryland",
      "priority": 1,
      "description_as_running_mate": "<p>It's not merely a conventional running-mate selection—it's a calculated effort to reinforce a broader message of order and resolve. Spiro Agnew emerges as a figure whose presence on the ticket is intended to signal firmness in the face of domestic unrest. This is not about subtle diplomatic language or carefully measured tones; it's about projecting a clear and uncompromising stance on the challenges facing American communities. His background as a state governor is framed as practical experience with the day-to-day realities of governance, rather than abstract theorizing from distant offices.</p><p>In a political environment marked by tension and uncertainty, Agnew is positioned as a counterweight to narratives of drift and indecision. It's not simply about geographic balance—it's about adding a voice that emphasizes accountability, structure, and a refusal to yield to disruption. Supporters present him as a necessary complement to the top of the ticket, someone who can speak directly to concerns about safety and stability. Critics may view the same qualities as abrasive or overly confrontational. Either way, his inclusion is designed to sharpen the campaign's overall posture rather than soften it.</p>",
      "color_hex": "#E81B23",
      "is_active": 0,
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/10/Spiro_Agnew.jpg",
      "electoral_victory_message": "",
      "electoral_loss_message": "",
      "no_electoral_majority_message": "",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 53,
    "fields": {
      "first_name": "Edmund",
      "last_name": "Muskie",
      "election": 4,
      "party": "Democratic",
      "state": "Maine",
      "priority": 1,
      "description_as_running_mate": "<p>Edmund Muskie, the Senator from Maine, has been chosen as the Democratic vice-presidential nominee. He is widely regarded as a steady and thoughtful presence who can help present a more unifying image for a party under significant internal strain.</p>",
      "color_hex": "#0000FF",
      "is_active": 0,
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Muskie.jpg",
      "electoral_victory_message": "",
      "electoral_loss_message": "",
      "no_electoral_majority_message": "",
      "candidate_score": 1.0
    }
  },
  {
    "model": "campaign_trail.candidate",
    "pk": 55,
    "fields": {
      "first_name": "Curtis",
      "last_name": "LeMay",
      "election": 4,
      "party": "American Independent",
      "state": "Ohio",
      "priority": 1,
      "description_as_running_mate": "<p>Curtis LeMay, the former Air Force general, has been selected as the American Independent Party's vice-presidential nominee. His presence is intended to strengthen the ticket's credentials on national security and military affairs.</p>",
      "color_hex": "#FFD700",
      "is_active": 0,
      "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Gen._Curtis_LeMay_Official_Portrait.jpg",
      "electoral_victory_message": "",
      "electoral_loss_message": "",
      "no_electoral_majority_message": "",
      "candidate_score": 1.0
    }
  }
];

// ===== Running mate pairings =====
campaignTrail_temp.running_mate_json = [
  {
    "model": "campaign_trail.running_mate",
    "pk": 100,
    "fields": {
      "candidate": 23,
      "running_mate": 51,
      "priority": 1
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 101,
    "fields": {
      "candidate": 24,
      "running_mate": 53,
      "priority": 1
    }
  },
  {
    "model": "campaign_trail.running_mate",
    "pk": 102,
    "fields": {
      "candidate": 25,
      "running_mate": 55,
      "priority": 1
    }
  }
];

campaignTrail_temp.opponents_default_json = [
  { "election": 4, "candidates": [23, 24, 25] }
];

campaignTrail_temp.opponents_weighted_json = [
  { "election": 4, "candidates": [23, 24, 25] }
];

campaignTrail_temp.difficulty_level_json = [
  { "model": "campaign_trail.difficulty_level", "pk": 1, "fields": { "name": "Normal", "multiplier": 1.0 } },
  { "model": "campaign_trail.difficulty_level", "pk": 2, "fields": { "name": "Hard", "multiplier": 0.85 } },
  { "model": "campaign_trail.difficulty_level", "pk": 3, "fields": { "name": "Impossible", "multiplier": 0.7 } }
];

// ===== THEME =====
campaignTrail_temp.modBoxTheme = {
  "header_color": "#004771",
  "header_text_color": "#f5f3f4",
  "header_image_url": "PASTE_BANNER_URL_HERE",
  "description_text_color": "#FFFFFF",
  "description_background_color": "#00090f",
  "main_color": "#00090f",
  "secondary_color": "#7b7b7b",
  "ui_text_color": "#FFFFFF"
};

jet_data = {
  "headerColor": "#004771",
  "windowColor": "#e2dedc",
  "containerColor": "#2d4443",
  "innerWindowColor": "#dfdfd9",
  "bannerImageUrl": "PASTE_BANNER_URL_HERE",
  "backgroundImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Richard_Nixon_portrait.jpg/1200px-Richard_Nixon_portrait.jpg",
  "gameTitle": "1968 Nixon Redux -- Pain and Suffering"
};

//#startcode
nct_stuff.themes[nct_stuff.selectedTheme].coloring_title = "#004771";
nct_stuff.themes[nct_stuff.selectedTheme].coloring_window = "#e2dedc";

document.getElementsByClassName("game_header")[0].style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_title;
$("#game_window")[0].style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_window;
$(".container")[0].style.backgroundColor = "#2d4443";

document.getElementById("header").src = "PASTE_BANNER_URL_HERE";
document.body.background = "https://upload.wikimedia.org/wikipedia/commons/3/3c/Richard_Nixon_portrait.jpg";
//#endcode
