
e.CandidText = "Select your Presidential nominee:"
e.VpText = "Select your Vice Presidential nominee:"
campaignTrail_temp.modBoxTheme = {
     "header_color": "#703600",
     "header_text_color": "#000000",
     "description_text_color": "#ffffff",
     "description_background_color": "#8a8a8a",
     "main_color": "#5f1e02",
     "secondary_color": "#d74709",
     "ui_text_color": "#610a0a"
}
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
            "question_count": 25,
            "default_map_color_hex": "#C9C9C9",
            "no_state_map_color_hex": "#999999"
        }
    }
]
campaignTrail_temp.achievements = {
    "Mini Soda" : {
        "image" : "https://i.imgur.com/zinPuFR.png",
        "description" : "As Wilson, win Minnesota."
    },
    "Two Isolationists?" : {
        "image" : "https://i.imgur.com/Sn13gSD.png",
        "description" : "As Hughes, support neutrality."
    },
    "Democratic Equal Rights Candidate" : {
        "image" : "https://i.imgur.com/sHgOI2b.png",
        "description" : "As Wilson, desegregate jobs and support Womens Suffrage.",
        "cannotBeCheated" : false
    }
}

campaignTrail_temp.election_json = [
    {
        "model": "campaign_trail.election",
        "pk": 14,
        "fields": {
            "year": 1916,
            "summary": "<p>Woodrow Wilson was elected back in 1912 due to a split in the Republican Party. But since then, his presidency has kept him busy. From health issues to war in Europe, Wilson is going to have to prove America needs him for 4 more years. Charles Evans Hughes is the Republican Nominee and must prove to voters why he is the better alternative. </p><ul><li>Wilson is the incumbent and must reflect on his previous term and mention his legacy if he wants to win re-election.</li><li>Hughes is under a lot of pressure with the division of his party. His goals are to unite the Republican Party and of course, to defeat Woodrow Wilson.</li></ul>",
            "image_url": "https://i.imgur.com/hVhsd1W.png",
            "winning_electoral_vote_number": 266,
            "advisor_url": "https://i.imgur.com/re0pk1P.png",
            "recommended_reading": "<h4 style=\"margin-top: 0.5em;\">Books and Links</h4>A. Scott Berg - <a href=\"http://www.amazon.com/exec/obidos/ASIN/0425270068/amhius20-20\" target=\"_blank\">Wilson</a></br>Arthur Link - <a href=\"B00350CVHM\" target=\"_blank\">Woodrow Wilson and the Progressive Era, 1910-1917</a></br><a href=\"https://presidentialcampaignselectionsreference.wordpress.com/overviews/20th-century/1916-overview/\" target=\"_blank\">Presidential Campaigns and Elections - 1916</a></br><a href=\"http://millercenter.org/president/biography/wilson-campaigns-and-elections\" target=\"_blank\">Woodrow Wilson's Campaigns</a></br><a href=\"http://articles.latimes.com/2005/oct/23/opinion/oe-shaffer23\" target=\"_blank\">The Great GOP Spat -- of 1916</a></br><a href=\"http://maxkade.iupui.edu/adams/chap8.html\" target=\"_blank\">German-Americans as Voters and Office-Seekers</a></br><a href=\"http://www.jstor.org/stable/1900319?seq=1#page_scan_tab_contents\">Woodrow Wilson, Irish-Americans, and the Election of 1916</a></br><a href=\"https://feminist.org/blog/index.php/2014/07/08/july-8-1916-alice-paul-pushes-presidential-nominee-to-support-suffrage/\" target=\"_blank\">July 8, 1916: Alice Paul Pushes Presidential Nominee to Support Suffrage</a>",
            "has_visits": 1,
            "no_electoral_majority_image": "https://www.jetsimon.com/public/static/images/1896-no-majority.jpg",
            "creator": "Dan Bryan",
            "display_year": "1916 Redux"
        }
    }
]

campaignTrail_temp.candidate_json = [
    {
        "model": "campaign_trail.candidate",
        "pk": 142,
        "fields": {
            "first_name": "Thomas Woodrow",
            "last_name": "Wilson",
            "election": 14,
            "party": "Democratic",
            "state": "New Jersey",
            "priority": 1,
            "description": "<p><strong> \"He kept us out of war!\" </strong></p><p>After being elected in 1912, Woodrow Wilson went right to work. He has passed numerous laws that made Democrats and Progressives supportive of his administration. Despite this, he has been having health issues and lost his first wife, Ellen, in 1914. After his wife's death, he married his second wife, Edith, in 1915.</p> <p>However, while all this has been happening, there has been a major war that started in Europe, so the question stands. Do we break isolationism and provide aid, or do we not break precedent? Wilon so far has chosen for the U.S. to remain an isolationist country.</p> <p><strong>  But will he change his mind? </strong></p>",
            "color_hex": "#000085",
            "secondary_color_hex": "#90C0FF",
            "is_active": 1,
            "image_url": "https://i.imgur.com/TSLQNGc.png",
            "electoral_victory_message": "<h3> WOODROW WILSON SECURES RE-ELECTION!!!</h3> <p> Congratulations, Mr. President! You have exceeded 266 Electoral Votes, which means you are the first Democratic President since Andrew Jackson to win two consecutive terms! And you are the third-ever Democratic President to win re-election in general! California and New Hampshire have barely gone in your favor, causing you to win! Now, you are faced with a serious task. The War in Europe is continuing, and you need to keep your promise to stay out of the war. But issues like Women's Suffrage and Child Labor are becoming serious topics. Furthermore, you have been having some health scares, so you will need to keep it easy, if you can. Good Luck, President Wilson, you will need it.</p> ",
            "electoral_loss_message": "<h3> PRESIDENT WOODROW WILSON FUMBLES THE PRESIDENCY!!!</h3> <p> I am sorry, Mr. President, but you have lost to Hughes. Under Hughes' presidency, America will more than certainly get involved in the war and will be known as \"The Great War\". You plan on resigning in a few months so Hughes can get settled in. Whatever happens with you is your business. Good Luck, Mr. Wilson!</p>\n",
            "no_electoral_majority_message": "<h3>No candidate has captured an Electoral College majority.</h3><p>Elections for Congress have also resulted in an even split among members, and it is extremely unclear who might ultimately win this election. Best of luck in what is sure to be a contentious process.</p>",
            "description_as_running_mate": "'",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 143,
        "fields": {
            "first_name": "Charles Evans",
            "last_name": "Hughes",
            "election": 14,
            "party": "Republican",
            "state": "New York",
            "priority": 2,
            "description": "<p><strong> \"America First, America Efficient\"</strong></p> <p>Charles Evans Hughes resigned from the Supreme Court back in June so he could run for President. He won the Republican Nomination, defeating names like John W. Weeks and Elihu Root. However, what helped Hughes the most was Former President Theodore Roosevelt's endorsement. This helped unite the party, though some progressives remain unconvinced of Hughes.</p> <p> Now Hughes is given the task to defeat Woodrow Wilson and bring the Republicans back to the Executive Branch. Hughes supports the U.S. involvement in the war in Europe and is planning on criticizing Wilson for not adequately preparing the nation for war.</p>\n<p><strong>But is his stance on the war popular with voters?",
            "color_hex": "#850000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 1,
            "image_url": "https://i.imgur.com/zXqjqz0.png",
            "electoral_victory_message": "<h3>Congratulations! You have won the 1916 election.</h3><p>After the tumultuous 1912, the natural supremacy of the Republican Party has reasserted itself. The next steps are up to you -- perhaps you can lead the repeal of the Adamson Act, or replace it with something more measured and comprehensive. In regards to Europe, best of luck in whatever may occur over the next four years. Finally, Wilson plans to resign before your March 4th inauguration, so that you might assume the office now.</p>",
            "electoral_loss_message": "<h3>Sorry, you have lost the 1916 election.</h3><p>Ultimately, the popularity of Woodrow Wilson was just a little much to overcome.</p><p>It appears that Wilson's agenda will remain in effect domestically. In world affairs, it remains to be seen how the situation in Europe will finally resolve itself. As to your own prospects, it is unclear what your next steps will be. The Supreme Court seat you once enjoyed has now been lost for the foreseeable future.</p>",
            "no_electoral_majority_message": "<h3>No candidate has captured an Electoral College majority.</h3><p>Elections for Congress have also resulted in an even split among members, and it is extremely unclear who might ultimately win this election. Best of luck in what is sure to be a contentious process.</p>",
            "description_as_running_mate": "'",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 144,
        "fields": {
            "first_name": "Allan",
            "last_name": "Benson/Other",
            "election": 14,
            "party": "Socialist",
            "state": "Michigan",
            "priority": 3,
            "description": "'",
            "color_hex": "#00C100",
            "secondary_color_hex": "#A1FFA1",
            "is_active": 0,
            "image_url": "'",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "'",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 145,
        "fields": {
            "first_name": "James",
            "last_name": "Hanly",
            "election": 14,
            "party": "Prohibition",
            "state": "Indiana",
            "priority": 4,
            "description": "'",
            "color_hex": "#FFFF00",
            "secondary_color_hex": "#FFFFC0",
            "is_active": 0,
            "image_url": "'",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "'",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 342,
        "fields": {
            "first_name": "Thomas R.",
            "last_name": "Marshall",
            "election": 14,
            "party": "Democratic",
            "state": "Indiana",
            "priority": 5,
            "description": "'",
            "color_hex": "#000085",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://i.imgur.com/KTGkRSR.png",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "<p><strong>\"The Incumbent\"</strong></p><p>Thomas Riley Marshall has been the incumbent Vice President since 1913. Despite the beef between the two of you, he is the popular choice for running mate as he ran with you in 1912. Renominating him will make him the first Democratic Vice President to be renominated since John C. Calhoun in 1828. He will also help you in Indiana, which has been predicted to go to the Republicans since Hughes's Running Mate, Charles Fairbanks, is also a native of Indiana.</p>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 345,
        "fields": {
            "first_name": "Newton",
            "last_name": "Baker",
            "election": 14,
            "party": "Democratic",
            "state": "Ohio",
            "priority": 6,
            "description": "'",
            "color_hex": "#000085",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://i.imgur.com/0ozwC5N.png",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "<p><strong>\"The Secretary of War\" </strong></p> <p> Newton Baker is the current Secretary of War, having served since March. Before that, he was the Mayor of Cincinnati for 4 years. Baker's nomination will help you in Ohio and secure their 24 Electoral Votes. However, selecting him would hurt you significantly in Indiana, as Marshall would be replaced as Running Mate. Also, his young age of 44 could be alarming to some voters.   ",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 343,
        "fields": {
            "first_name": "Charles W.",
            "last_name": "Fairbanks",
            "election": 14,
            "party": "Republican",
            "state": "Indiana",
            "priority": 7,
            "description": "'",
            "color_hex": "#850000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://i.imgur.com/tqtS2Mf.png",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "<p><strong>\"The Former Vice President\"</strong></p> <p>Charles W. Fairbanks was the former Vice President to Theodore Roosevelt from 1905-1909. Fairbanks is a conservative, so it would balance the ticket since you lean more progressive. Fairbanks can also help you in Indiana, which is a crucial swing state. If you win, Fairbanks will be the third Vice President to serve under two different presidents.</p>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 346,
        "fields": {
            "first_name": "Elmer",
            "last_name": "Burkett",
            "election": 14,
            "party": "Republican",
            "state": "Nebraska",
            "priority": 8,
            "description": "'",
            "color_hex": "#850000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://i.imgur.com/vF86WCT.png",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "<p><strong>\"The Senator\"</strong></p><p>Elmer Burkett is a former Senator from Nebraska. He is not as politically known like Fairbanks, but could help you in the plains and mountain states. However, his home state of Nebraska is not predicted to go Republican this year, so selecting him would only barely narrow the margin in Nebraska. </p>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 150,
        "fields": {
            "first_name": "George",
            "last_name": "Kirkpatrick",
            "election": 14,
            "party": "Socialist",
            "state": "Ohio",
            "priority": 9,
            "description": "'",
            "color_hex": "#00C100",
            "secondary_color_hex": "#A1FFA1",
            "is_active": 0,
            "image_url": "'",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "'",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 151,
        "fields": {
            "first_name": "Ira",
            "last_name": "Lendrith",
            "election": 14,
            "party": "Prohibition",
            "state": "Indiana",
            "priority": 10,
            "description": "'",
            "color_hex": "#FFFF00",
            "secondary_color_hex": "#FFFFC0",
            "is_active": 0,
            "image_url": "'",
            "electoral_victory_message": "'",
            "electoral_loss_message": "'",
            "no_electoral_majority_message": "'",
            "description_as_running_mate": "'",
            "candidate_score": 0,
            "running_mate": true
        }
    }
]

campaignTrail_temp.running_mate_json = [
    {
        "model": "campaign_trail.running_mate",
        "pk": 96,
        "fields": {
            "candidate": 144,
            "running_mate": 150
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 97,
        "fields": {
            "candidate": 145,
            "running_mate": 151
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 144961,
        "fields": {
            "candidate": 142,
            "running_mate": 342
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 82576,
        "fields": {
            "candidate": 142,
            "running_mate": 345
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 142128,
        "fields": {
            "candidate": 143,
            "running_mate": 343
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 84106,
        "fields": {
            "candidate": 143,
            "running_mate": 346
        }
    }
]

campaignTrail_temp.credits = "General_Rise8708, Code 1 Template and Original Mod by Dan Bryan, and banner made by E!"

campaignTrail_temp.opponents_default_json = [
    {
        "election": 14,
        "candidates": [
            142,
            143,
            144,
            145
        ]
    }
]

campaignTrail_temp.opponents_weighted_json = [
    {
        "election": 14,
        "candidates": [
            142,
            143,
            144,
            145
        ]
    }
]

campaignTrail_temp.temp_election_list = [
    {
        "id": 14,
        "year": 1916,
        "is_premium": 0,
        "display_year": "1916 Redux"
    }
]

jet_data = {
    "headerColor": "#01216a",
    "windowColor": "#492c03",
    "containerColor": "#5f2a07",
    "innerWindowColor": "#8f002b",
    "bannerImageUrl": "https://i.imgur.com/zTQTXXJ.png",
    "backgroundImageUrl": "https://i.imgur.com/Ki2DQf7.png",
    "endingTextColor": "#000000",
    "customQuote": "\"I would rather lose in a cause that will some day win, than win in a cause that will some day lose\" - Woodrow Wilson",
    "gameTitle": "THE WAR TRAIL"
}

//#startcode


corrr = '\n              <h2>THE WAR TRAIL</h2><font id="wittyquote" size="4" color="white"><em>"I would rather lose in a cause that will some day win, than win in a cause that will some day lose" - Woodrow Wilson</em></font>\n            ';


nct_stuff.themes[nct_stuff.selectedTheme].coloring_title = "#01216a";

nct_stuff.themes[nct_stuff.selectedTheme].coloring_window = "#492c03";

document.getElementsByClassName("game_header")[0].style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_title;

$("#game_window")[0].style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_window;

$(".container")[0].style.backgroundColor = "#5f2a07";

document.getElementById("header").src = "https://i.imgur.com/zTQTXXJ.png";

document.body.background = "https://i.imgur.com/Ki2DQf7.png";

document.head.innerHTML += "<style>#results_container {color:#000000;} .inner_window_w_desc {background-color:#8f002b!important;}</style>";
e.difficulty_level_json = [{"model":"campaign_trail.difficulty_level","pk":1,"fields":{"name":"Noob","multiplier":1.5}},{"model":"campaign_trail.difficulty_level","pk":2,"fields":{"name":"Babymode","multiplier":1.4}},{"model":"campaign_trail.difficulty_level","pk":3,"fields":{"name":"Cakewalk","multiplier":1.3}},{"model":"campaign_trail.difficulty_level","pk":4,"fields":{"name":"Very Easy","multiplier":1.2}},{"model":"campaign_trail.difficulty_level","pk":5,"fields":{"name":"Easy","multiplier":1.1}},{"model":"campaign_trail.difficulty_level","pk":6,"fields":{"name":"Quite Easy","multiplier":1.05}},{"model":"campaign_trail.difficulty_level","pk":7,"fields":{"name":"Normal","multiplier":1.00}},{"model":"campaign_trail.difficulty_level","pk":8,"fields":{"name":"Challenging","multiplier":0.95}},{"model":"campaign_trail.difficulty_level","pk":9,"fields":{"name":"Hard","multiplier":0.9}},{"model":"campaign_trail.difficulty_level","pk":10,"fields":{"name":"Very Hard","multiplier":0.85}},{"model":"campaign_trail.difficulty_level","pk":11,"fields":{"name":"Impossible","multiplier":0.8}},{"model":"campaign_trail.difficulty_level","pk":12,"fields":{"name":"Unthinkable","multiplier":0.7}},{"model":"campaign_trail.difficulty_level","pk":13,"fields":{"name":"Blowout","multiplier":0.6}},{"model":"campaign_trail.difficulty_level","pk":14,"fields":{"name":"Disaster","multiplier":0.5}},{"model":"campaign_trail.difficulty_level","pk":15,"fields":{"name":"Sabatoge","multiplier":0.001}}]
e=campaignTrail_temp

var changeGameDisp = (hide) => {
  disp = "";
  if (hide) {
    disp = "none";
  }
  document.getElementsByClassName("inner_window_w_desc")[0].style.display = disp
};

e.creditsPage = () => {
  credits_html = `
    <h3>Coding</h3>
    <p><font color='#65bc6d'>General_Rise8708</font></p>
    <h3>Coding Helper(Some codes from 1816 A War No More)</h3>
    <p><font color='#65bc6d'>TheMcCain</font></p>
    <h3>Writing</h3>
    <p><font color='#b665bc'>General_Rise8708</font></p>
    <h3>Playtesting</h3>
    <p><em><b><font color='red'>MeerkatHistorian1924</font></b></em></p>
    <h3>Original Mod</h3>
    <p>Dan Bryan</p><br>
    <h3>Banner</h3>
    <p>littleamericanman_85501</p><br>
    <h3>Credits Code</h3>
    <p>DecstarG</p><br>
   `
  changeGameDisp(true);
  var spacer = document.createElement("amongusspacerthisisntarealelement");
  spacer.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  document
    .getElementsByClassName("inner_window_w_desc")[0]
    .children[1].appendChild(spacer);
    changeGameDisp(true);
    var menuHeader = document.createElement("div");
    menuHeader.classList.add("inner_window_front");
    menuHeader.innerHTML = `<h1 style='font-family: "Times New Roman";'><font color='#0496f7'>Credits</font></h1>`;
    menuHeader.id = "SOTUheader";
    menuHeader.style = "height: 50px;background-color:#2d2d2d";
    var newMenu = document.createElement("div");
    newMenu.classList.add("inner_window_front");
    newMenu.id = "SOTUmenu";
    newMenu.style = `height:260px;background-color:#2d2d2d;color:white;overflow-y: scroll;`;

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

}

e.credits = "<button onclick='e.creditsPage()'>Credits</button>"
quotes = ["'When we lose the right to be different, we lose the privilege to be free.' - Charles Evans Hughes", "'No nation is fit to sit in judgment upon any other nation.' - Woodrow Wilson", "'It is hard to fail, but it is worse never to have tried to succeed.' - Theodore Roosevelt", "'My name must not be considered for Vice President and if it is presented, I wish it withdrawn. Please withdraw it.' - Charles W. Fairbanks", "'What this country needs is a good five-cent cigar.' - Thomas R. Marshall"]
customquote = quotes[Math.floor((Math.random() * quotes.length))]

const specialQuote = "'A conservative is a man who just sits and thinks, mostly sits' - Woodrow Wilson";
				
// 1% chance for funny quote
if (Math.random() < 0.01) {
  customquote = specialQuote; // specialQuote should be defined somewhere
} else {
  customquote = quotes[Math.floor(Math.random() * quotes.length)];
}

// Now safe to build HTML
corrr = `
<div style="background:linear-gradient(to bottom,#5b462c,#a68a64); color:white;">
  <h2>THE WAR TRAIL</h2>
  <font id="wittyquote" size="3" color="white"><em>${customquote}</em></font>
</div>
`;

//#endcode
