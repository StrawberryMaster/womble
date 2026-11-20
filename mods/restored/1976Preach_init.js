campaignTrail_temp.election_json = [
    {
        "model": "campaign_trail.election",
        "pk": 10,
        "fields": {
            "year": 1976,
            "summary": "<div style=\"overflow:auto; height: 200px\"><p>Having endured eight years of President Nixon, America is ready for a change. That is the hope of Senator Frank Church of Idaho, a staunch progressive leader who narrowly snatched the Democratic Nomination from underneath Jerry Brown.</p><p>Vice President Spiro Agnew hopes to continue the legacy of a moderate administration, burdened by claims of tax fraud and kickbacks during his tenure as Governor of Maryland. His boss has not been without scandal either; Agnew must deflect charges of corruption and wire-tapping surrounding Nixon’s inner circle. With the Vietnam War over, the candidates will spar over amnesty, the ERA, the federal bailout of New York City, school busing, and the future of Détente.</p></div>",
			"site_description": "<p>Having endured eight years of President Nixon, America is ready for a change. That is the hope of Senator Frank Church of Idaho, a staunch progressive leader who narrowly snatched the Democratic Nomination from underneath Jerry Brown.</p><p>Vice President Spiro Agnew hopes to continue the legacy of a moderate administration, burdened by claims of tax fraud and kickbacks during his tenure as Governor of Maryland. His boss has not been without scandal either; Agnew must deflect charges of corruption and wire-tapping surrounding Nixon’s inner circle. With the Vietnam War over, the candidates will spar over amnesty, the ERA, the federal bailout of New York City, school busing, and the future of Détente.</p>",
            "image_url": "https://i.imgur.com/Y4xk8E6.png",
            "winning_electoral_vote_number": 270,
            "advisor_url": "https://bunny-wp-pullzone-cjamrcljf0.b-cdn.net/wp-content/uploads/2021/02/jody-powell-hamilton-jordan_001-1383x1080@2x.jpg",
            "recommended_reading": "<h4 style='margin-top: 0.5em;'>Preach - A New Campaign Trail Mod</h4><a href='https://www.britannica.com/biography/Frank-Church' target='_blank'>Frank Church</a><br><h4>Lore</h4><p>Throughout 1968, Richard Nixon was paranoid that his running mate Spiro Agnew's tax fraud would become a major issue for the campaign. He used his influence to dissuade Maryland lobbyists from talking; the press thus never caught wind of his conduct and he never resigned. In 1974, H.R. Haldeman took full responsibility for the White House's involvement in the wiretapping of the Watergate hotel. He was convicted by a grand jury and testified under oath that he acted alone. The infamous Nixon tapes avoided subpoena, allowing him to dodge impeachment and resignation.<br><br><img src='https://cdn.britannica.com/21/181121-004-32ED6E25/Frank-Church-Pres-Jimmy-Carter-White-House-1977.jpg?s=1500x700&q=85' width='120px'></img><br><br>Church performed well in the 1976 primaries as a result of his aggressive opposition to Haldeman's conduct and his claim that Nixon was involved. He then secured help from progressive allies, Arizona Representative Mo Udall and Georgia Governor Jimmy Carter, to clinch the nomination.</p><h4 style='margin-top: 0.5em;'>Credits: Joeyo 19: Creator, playtester, writer, coder</h4>",
            "has_visits": 1,
            "no_electoral_majority_image": "https://www.jetsimon.com/public/static/images/2012-no-majority.jpg",
            "recommended_reading_enabled": true,
            "creator": "Dan Bryan",
            "display_year": "1976"
        }
    }
];

campaignTrail_temp.temp_election_list = [
    {
        "id": 10,
        "year": 1976,
        "is_premium": 0,
        "display_year": "1976"
    }
];

RecReading = true;

campaignTrail_temp.credits = "Joeyo 19. Some writing fixed/enhanced as part of the Womble Restoration Project.";

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
];

campaignTrail_temp.candidate_json = [
    {
        "model": "campaign_trail.candidate",
        "pk": 91,
        "fields": {
            "first_name": "Frank",
            "last_name": "Church",
            "election": 10,
            "party": "Democratic",
            "state": "Idaho",
            "priority": 1,
            "description": "<div style=\"overflow:auto; height: 200px\">“<i>Shut. It. Down.</i>”\n\n<p>Obviously, you don't want to say this out loud; but it isn't enough to win this election. America is 200 years old and it IS time for a change. But reform is not enough. Change is not enough. Nothing, you know better than most, is ever enough. It's time for America to transform its deepest desire into an election, a mandate—better yet: a referendum. Frank Church can, must, and will lead America into its third century.</p>\n\n<p>Nixon is a crook. He loves to deny it, but you know the truth. You know he's guilty of mass slaughter, fraud, and god knows what else. He avoided impeachment and resignation thanks to his buddies. It's time for the people to serve as judge, jury, and executioner. And it's not just him: Haldeman, Mitchell, Dean, Felt, and Holmes. Agnew is your opponent, but he is not your enemy; you know you'll win, what really matters is achieving absolute victory. Sweeping the House and Senate is the only path forward to tear down the intelligence bureaus, fight the military-industrial complex, and most importantly: Shut. It. Down. Wake up, Frank, it's time to go to war.</p></div>",
            "color_hex": "#6b6bff",
            "secondary_color_hex": "#90C0FF",
            "is_active": 1,
            "image_url": "https://i.imgur.com/1AtA7lP.png",
            "electoral_victory_message": "<h3>Congratulations! You have won the 1976 Presidential Election.</h3><p>Hopefully you can make good on your promises to clean up Washington and change the political and moral culture of the country. If you are successful, there is no reason you cannot run for reelection in 1980. Just be wary of any economic problems, or of some foreign policy crisis that could dent your popularity.</p>",
            "electoral_loss_message": "<h3>Sorry, you have lost the 1976 Presidential Election.</h3><p>As an outsider candidate, this was really your moment to make an impact on American politics and to win a national election. The beltway gossip already has it that Ted Kennedy is the frontrunner for the 1980 nomination. Perhaps you can run again for Governor of Georgia, or make an impact in some other way.</p>",
            "no_electoral_majority_message": "<h3>Wow! You have won in a squeaker.</h3><p>While the Electoral College ended in a tie, the Democrats have a huge advantage in the House of Representatives and are sure to elect you in that manner. Hopefully the closeness of this election doesn't undermine your promises to clean up Washington and unite the people of this country.</p>",
            "description_as_running_mate": "''",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 92,
        "fields": {
            "first_name": "Spiro",
            "last_name": "Agnew",
            "election": 10,
            "party": "Republican",
            "state": "Maryland",
            "priority": 2,
            "description": "<div style=\"overflow:auto; height: 200px\"><p>Spiro Agnew enters 1976 carrying the full banner of the Nixon administration. Having avoided the Maryland kickback scandal that might have ended his career, Agnew has retained his position as the champion of the Silent Majority and the administration's chief polemicist.</p>\n\n<p>Yet the terrain is treacherous. Nixon's narrow escape from impeachment has left the public disillusioned with executive overreach, and inflation continues to eat away at family budgets. Agnew commands the prestige of the Vice Presidency and can campaign on détente, but he faces a brutal battle to keep the Reagan wing united while fending off Frank Church's anti-corruption crusade.</p></div>",
            "color_hex": "#ff5c5c",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://www.jetsimon.com/public/static/images/gerald-ford-1976.jpg",
            "electoral_victory_message": "<h3>Congratulations! You have won the 1976 Presidential Election.</h3><p>Hopefully you can continue to help the United States recover from the Watergate Scandal, the recent recession, and the debacle of Vietnam. In either case, this will be your final term as President. Speculation is sure to be intense on who will replace you. Will it be Ronald Reagan? Ted Kennedy? Or someone else entirely?</p>",
            "electoral_loss_message": "<h3>Sorry, you have lost the 1976 Presidential Election.</h3><p>Hopefully your opponent can make good on his promises to clean up Washington and change the political and moral culture of the country. Perhaps you can still play a role in 1980, or seek your old Congressional leadership positions. In any case, you can still take solace in the fact that you did the right thing by pardoning Nixon and moving the country beyond the Watergate episode.</p>",
            "no_electoral_majority_message": "<h3>Sorry, you have lost the 1976 Presidential Election.</h3><p>While the Electoral College ended in a tie, the Democrats have a huge advantage in the House of Representatives and are sure to elect your opponent in that manner. Perhaps you can still play a role in 1980, or seek your old Congressional leadership positions. In any case, you can still take solace in the fact that you did the right thing by pardoning Nixon and moving the country beyond the Watergate episode.</p>",
            "description_as_running_mate": "''",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 93,
        "fields": {
            "first_name": "Eugene",
            "last_name": "McCarthy",
            "election": 10,
            "party": "Independent",
            "state": "Minnesota",
            "priority": 3,
            "description": "''",
            "color_hex": "#00C100",
            "secondary_color_hex": "#A1FFA1",
            "is_active": 0,
            "image_url": "''",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "''",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 94,
        "fields": {
            "first_name": "Other",
            "last_name": "Candidates",
            "election": 10,
            "party": "Independent",
            "state": "Alaska",
            "priority": 4,
            "description": "''",
            "color_hex": "#FFFF00",
            "secondary_color_hex": "#FFFFC0",
            "is_active": 0,
            "image_url": "''",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "''",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 95,
        "fields": {
            "first_name": "Jimmy",
            "last_name": "Carter",
            "election": 10,
            "party": "Democratic",
            "state": "Georgia",
            "priority": 5,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://i.imgur.com/tRjp4ki.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\"><p>Jimmy Carter served as Governor of Georgia for four years. He is a pragmatic but progressive thinker who can get things done as President of the Senate.</p>\n\n<p>After sweeping the South in the primary, he dropped out and endorsed you; you partially owe your nomination to him, and repaying it won't hurt. He served as a Georgia State Senator for four years, providing him strong legislative experience, and possesses incredible well-rounded background as both a nuclear engineer and a peanut farmer. He'll deliver a tremendous boost across the South. Beyond that, his clean moral reputation and wholesome Southern style will balance your fiery Western populism perfectly.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 96,
        "fields": {
            "first_name": "Mo",
            "last_name": "Udall",
            "election": 10,
            "party": "Democratic",
            "state": "Arizona",
            "priority": 6,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://i.imgur.com/1BtEec5.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\"><p>Mo Udall is currently serving as a US Representative from Arizona and is a primary reason you won the nomination.</p>\n\n<p>Without his decision to bow out of the primaries early and throw his delegates behind you, Frank Church wouldn't be standing on this stage today. He is deeply aligned with progressive labor unions and environmental reformers. Choosing him will solidify the liberal wing of the party and make you highly competitive in Arizona and the interior West, though it may require extra effort to shore up the South.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 98,
        "fields": {
            "first_name": "Henry M.",
            "last_name": "Jackson",
            "election": 10,
            "party": "Democrat",
            "state": "Washington",
            "priority": 8,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://i.imgur.com/Lm9oqU6.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\">“<i>For fools rush in where angels fear to tread.</i>”\n\n<p>This choice would be unorthodox to say the least.</p>\n\n<p>Henry \"Scoop\" Jackson has served as a Senator from Washington for over a decade and a half. A fierce hawk and seasoned New Deal liberal on economic policy, Jackson was your bitter primary rival. He is an experienced legislative technician, but he will not be easy to tame. If you want his weight on the ticket, you will have to make serious concessions toward the center and navigate delicate negotiations with Carter and Udall.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
	{
        "model": "campaign_trail.candidate",
        "pk": 97,
        "fields": {
            "first_name": "John",
            "last_name": "Glenn",
            "election": 10,
            "party": "Democrat",
            "state": "Ohio",
            "priority": 7,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://i.imgur.com/DRe5Eqn.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\">“<i>Godspeed, John Glenn.</i>”\n\n<p>A national hero and the first American to orbit the Earth, John Glenn brings your ticket unmatched patriotic credibility. As a decorated Marine and popular freshman Senator from Ohio, he can blunt attacks on your foreign-policy record while strengthening your position in the industrial Midwest.</p>\n\n<p>Glenn is still inexperienced in Washington, however, and his convention speech showed that he is hardly a natural campaigner. Choosing him also means leaving Mo Udall and Jimmy Carter disappointed.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 99,
        "fields": {
            "first_name": "Bob",
            "last_name": "Dole",
            "election": 10,
            "party": "Republican",
            "state": "Kansas",
            "priority": 9,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://www.jetsimon.com/public/static/images/bob-dole-1976.jpg",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\"><p>Bob Dole is a well-respected, conservative Senator from Kansas. He could help unite the party after a divisive primary fight—Ronald Reagan has signaled approval for Dole. He is popular across the agricultural states and will consolidate the Plains and Midwest, though his aggressive rhetoric can occasionally backfire.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 100,
        "fields": {
            "first_name": "Howard",
            "last_name": "Baker",
            "election": 10,
            "party": "Republican",
            "state": "Tennessee",
            "priority": 10,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://www.jetsimon.com/public/static/images/howard-baker-1976.jpg",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\"><p>Howard Baker is a Senator from Tennessee who has served since 1967. Having gained nationwide fame during the Senate Watergate Committee, he brings moderate bipartisan appeal and can contest the Upper South against Carter's reach.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 101,
        "fields": {
            "first_name": "John",
            "last_name": "Anderson",
            "election": 10,
            "party": "Republican",
            "state": "Illinois",
            "priority": 11,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://www.jetsimon.com/public/static/images/john-anderson-1976.jpg",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\"><p>John Anderson is a veteran Congressman from Illinois who combines fiscal conservatism with moderate social instincts. His presence on the ticket appeals strongly to suburban moderates and helps secure Illinois, though conservative hardliners will view him with suspicion.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 102,
        "fields": {
            "first_name": "John",
            "last_name": "Connally",
            "election": 10,
            "party": "Republican",
            "state": "Texas",
            "priority": 12,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://www.jetsimon.com/public/static/images/john-connally-1968.jpg",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style=\"overflow:auto; height: 200px\"><p>John Connally, the charismatic former Governor of Texas and Treasury Secretary, crossed over to the Republican Party in 1973. His Texas roots make him a formidable force in the Sunbelt, and his hawkish stature reassures conservatives.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 103,
        "fields": {
            "first_name": "...",
            "last_name": "Other",
            "election": 10,
            "party": "Independent",
            "state": "Alaska",
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
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 104,
        "fields": {
            "first_name": "...",
            "last_name": "Other",
            "election": 10,
            "party": "Independent",
            "state": "Alaska",
            "priority": 14,
            "description": "''",
            "color_hex": "#FFFF00",
            "secondary_color_hex": "#FFFFC0",
            "is_active": 0,
            "image_url": "''",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "''",
            "candidate_score": 0,
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
        "pk": 63,
        "fields": {
            "candidate": 92,
            "running_mate": 100
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 64,
        "fields": {
            "candidate": 92,
            "running_mate": 101
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 65,
        "fields": {
            "candidate": 92,
            "running_mate": 102
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 66,
        "fields": {
            "candidate": 93,
            "running_mate": 103
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 67,
        "fields": {
            "candidate": 94,
            "running_mate": 104
        }
    }
];

campaignTrail_temp.opponents_default_json = [
    {
        "election": 10,
        "candidates": [
            91,
            92,
            93,
            94
        ]
    }
];

campaignTrail_temp.opponents_weighted_json = [
    {
        "election": 10,
        "candidates": [
            91,
            92,
            93,
            94
        ]
    }
];

campaignTrail_temp.modBoxTheme = {
    "header_color": "#1d4734",
    "header_text_color": "#ffffff",
    "description_background_color": "#ebfff5",
    "description_text_color": "#000000",
    "main_color": "#7389b5",
    "secondary_color": "#30a176",
    "ui_text_color": "#ffffff"
};

jet_data = {
    "headerColor": "#30a176",
    "headerTextColor": "#ffffff",
    "windowColor": "#7389b5",
    "containerColor": "#8593ff",
    "innerWindowColor": "#ebfff5",
    "innerWindowTextColor": "#000000",
    "descriptionWindowColor": "#ebfff5",
    "descriptionWindowTextColor": "#000000",
    "startButtonColor": "#30a176",
    "bannerImageUrl": "https://i.imgur.com/fDGgCmM.png",
    "backgroundImageUrl": "https://i.imgur.com/j7dipiO.png",
    "gameTitle": "The Campaign Trail",
    "customQuote": "\"Time to go to Church.\"",
    "quoteTextColor": "#c9ffeb",
    "endingTextColor": "#000000",
    "modBoxTheme": {
        "header_color": "#1d4734",
        "header_text_color": "#ffffff",
        "description_background_color": "#ebfff5",
        "description_text_color": "#000000",
        "main_color": "#7389b5",
        "secondary_color": "#30a176",
        "ui_text_color": "#ffffff"
    }
};

HistHexcolour = ["#6B6BFF", "#FF5C5C", "#FFFF00", "#00C100"];
HistName = ["Frank Church", "Spiro Agnew", "Other Candidates", "Eugene McCarthy"];
HistEV = [363, 175, 0, 0];
HistPV = ["41,760,141", "37,351,693", "1,037,262", "908,380"];
HistPVP = ["51.5%", "46.1%", "1.3%", "1.1%"];

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
      #wittyquote { color: #c9ffeb; }
      .game_header h2 { color: #ffffff; }
      .inner_window_w_desc { background-color: #ebfff5 !important; color: #000000; }
      .inner_window_front, .person_description_window, .election_description_window, .description_window_small { background-color: #ebf3ff !important; color: #000000; }
      .campaign_trail_start_emphasis { background-color: #8593ff !important; }

	  .overlay_window img { object-fit: cover; object-position: top; }

      .inner_window_question h3, .overlay_window h3 {
          background: #ebfff5;
          border-color: #30a176;
          padding: .2em .5em;
      }

      #campaign_sign {
          background-color: #30a176;
          border-color: #5cd6a8;
      }
      #campaign_sign p {
          color: #ebfff5;
      }

      #map_container {
          background-color: #ebfff5;
      }

      #menu_container, #overall_result_container, #overall_result {
          background-color: #ebfff5;
      }

      #menu_container h3 {
          background-color: #7389b5;
          color: #ffffff;
      }

      #results_container .person_image {
          width: 230px;
          object-fit: cover;
      }

      .overlay_window {
          height: auto;
      }

      .person_image img {
          object-fit: cover;
      }

      #candidate_pic, #running_mate_pic {
          object-fit: cover;
          object-position: top;
          width: 155px;
      }

      button {
          background-color: #30a176;
          color: #ffffff;
          border: 1px solid #000000;
      }
	  button:hover {
		background-color: #30a176;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		cursor: pointer;
	  }

      button:active {
		background-color: #26825f;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
		transform: translateY(1px);
	  }

      select {
          background-color: #30a176;
          color: #ffffff;
      }

      div[style*="overflow:auto"]::-webkit-scrollbar {
          width: 6px;
      }
      div[style*="overflow:auto"]::-webkit-scrollbar-thumb {
          background: #7389b5;
          border-radius: 3px;
      }
      div[style*="overflow:auto"]::-webkit-scrollbar-track {
          background: #ebfff5;
      }
    `;
    document.head.appendChild(style);
}

corrr = '\n              <h2>The Campaign Trail</h2><font id="wittyquote" size="4" color="#c9ffeb"><em>"Time to go to Church."</em></font>\n            ';

const theme = nct_stuff.themes[nct_stuff.selectedTheme];

theme.coloring_title = "#30a176";
theme.coloring_window = "#7389b5";
theme.coloring_container = "#8593ff";
theme.header_image = "https://i.imgur.com/fDGgCmM.png";
theme.body_background = "https://i.imgur.com/j7dipiO.png";

applyTheme(theme);
//#endcode

class Song {
  constructor(title, artist, coverLink, audioOrYouTube) {
    this.title = title;
    this.artist = artist;
    this.coverLink = coverLink;

    const ytMatch = audioOrYouTube?.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
    );

    if (ytMatch) {
      this.youtubeId = ytMatch[1];
      this.audioLink = null;
    } else {
      this.youtubeId = null;
      this.audioLink = audioOrYouTube || null;
    }
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
window.playlist = activePlaylist;
let audioInstance = null;
let currentVolume = 5;

let ytApiReady = false;
let ytPlayer = null;
let ytPlayerReady = false;
let ytProgressTimer = null;
let ytAutoAdvancing = false;

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

const ASSETS = {
  bg: "https://file.garden/aNtAfG887DiA_7lO/others/fitn.png",
  volThumb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAVCAYAAACzK0UYAAACSklEQVR4nLWVQU/jMBCFvxk7aUi5bQUVEoILqOLGhX/B397eEXvgSBFIjZbtHlpwkzjeQ2UrsLCsUHnSKIntzJt547Hl/Pw8lGWJc46DgwPG4zFnZ2ecnJywu7tL27asVisGgwFlWVIUBdPplMvLS1SVrusIITCbzbi6uuLm5obZbEZVVdR1zfPzM/bi4oL9/X2qquL09JTDw0Mmkwl7e3ssl0vu7+95enoihICqMhwOqesa7z3GGIqiwFrLeDymLEsmkwnz+RyA4XDI7e0tFqDrOuLTe58shACAqmKMAcA5B4AxBmst3nsARISmaWjbFlVFRMiyjKIo0OhcRIgQkRffcaw/JyIpiDzPU6bRuq5LwetrZ9tEUqJPEge3DQX+kmbrJF9NAKDGmBdF7aNf3E8TqKLW2uT8K2qiqmhd16lrtw0RwXuPhhC+LJMQwoYkNk1sos84ei84VSXLsk1NPlocM1XVTWSqhBBSV7/3X5z7cAtHXWMgkUBE0hkVCd/Df/VJPBxjNjHCfznuB2k/XAX069Y0DYPB4AVJ/5R+C4mkX5P+e5TDOUfrW3Z2Co6Pj/n58xcqQrGzucy892/uUhHBvtb3tTm3ZrH4zWq1RBUCHoLh4WEOBEajbxRFQdu2ScZo0a+tqgrnHKvVKt1oAHd3dzw+PnJ9/YP5fE7T1EBHFzyC4H1AjSII0+l3RqMReZ7TdR3OuXSLLhYL5OjoKMTdk2UZWZZhjEmL1+t1yjIfZIhA2zbUdYMxBhWTZFE15Hme+sNaS13X/AFKG2atU2M+TwAAAABJRU5ErkJggg=="
};

function getAudioElement() {
  if (!audioInstance) {
    audioInstance = document.createElement("audio");
    audioInstance.id = "audio";
    document.body.appendChild(audioInstance);
  }
  return audioInstance;
}

function updatePlayPauseIcon(isPlaying) {
  const startStopBtn = document.getElementById("playPauseButton");
  if (startStopBtn) {
    if (isPlaying) startStopBtn.classList.add("active");
    else startStopBtn.classList.remove("active");
  }
}

function isYouTubeSong(song) {
  return !!song?.getYouTubeId?.();
}

function stopYTProgressPump() {
  if (ytProgressTimer) {
    clearInterval(ytProgressTimer);
    ytProgressTimer = null;
  }
}

function startYTProgressPump() {
  stopYTProgressPump();
  const progressBar = document.getElementById("progress");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration-display");

  ytProgressTimer = setInterval(() => {
    const duration = backendGetDuration();
    const current = backendGetCurrentTime();
    const progress = duration > 0 ? (current / duration) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(current);
    if (durationDisplay) durationDisplay.textContent = formatTime(duration);
  }, 250);
}

function syncYTVolumeFromSlider() {
  if (!ytPlayer) return;
  const volumePercent = Math.round((currentVolume / 9) * 100);
  ytPlayer.setVolume(volumePercent);
  if (currentVolume === 0) ytPlayer.mute();
  else ytPlayer.unMute();
}

function ensureYTPlayer(onReady) {
  const createPlayer = () => {
    if (ytPlayer) {
      onReady?.();
      return;
    }

    const holder = document.getElementById("ytplayer") || (() => {
      const el = document.createElement("div");
      el.id = "ytplayer";
      el.style.width = "0px";
      el.style.height = "0px";
      el.style.position = "absolute";
      el.style.overflow = "hidden";
      el.style.pointerEvents = "none";
      document.body.appendChild(el);
      return el;
    })();

    ytPlayer = new YT.Player(holder, {
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
        onReady: () => {
          ytPlayerReady = true;
          syncYTVolumeFromSlider();
          onReady?.();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            updatePlayPauseIcon(true);
            if (ytAutoAdvancing) {
              syncYTVolumeFromSlider();
              ytAutoAdvancing = false;
            }
          } else if (e.data === YT.PlayerState.PAUSED) {
            updatePlayPauseIcon(false);
          } else if (e.data === YT.PlayerState.ENDED) {
            ytAutoAdvancing = true;
            window._onSongEnded?.();
          }
        }
      }
    });
  };

  if (!ytApiReady || !window.YT || !window.YT.Player) {
    const timer = setInterval(() => {
      if (ytApiReady && window.YT && window.YT.Player) {
        clearInterval(timer);
        createPlayer();
      }
    }, 50);
  } else {
    createPlayer();
  }
}

function backendSetSrcAndLoad(song, audio) {
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      const id = song.getYouTubeId();
      if (ytAutoAdvancing) {
        try { ytPlayer.mute(); } catch (e) {}
        ytPlayer?.loadVideoById?.(id);
      } else {
        ytPlayer?.loadVideoById?.(id);
        syncYTVolumeFromSlider();
      }
      startYTProgressPump();
    });

    audio.pause();
    audio.src = "";
    audio.load();
  } else {
    stopYTProgressPump();
    if (ytPlayer) ytPlayer.stopVideo?.();
    audio.src = song.getAudioLink() || "";
    audio.volume = currentVolume / 9;
    audio.load();
  }
}

function backendPlay(audio) {
  const song = activePlaylist.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ensureYTPlayer(() => {
      ytPlayer?.playVideo?.();
    });
  } else {
    audio.play()
      .then(() => updatePlayPauseIcon(true))
      .catch(e => console.log("Playback deferred for user interaction.", e));
  }
}

function backendPause(audio) {
  const song = activePlaylist.getCurrentSong();
  if (!song) return;

  if (isYouTubeSong(song)) {
    ytPlayer?.pauseVideo?.();
  } else {
    audio.pause();
    updatePlayPauseIcon(false);
  }
}

function backendSetVolume(audio, volumeFraction) {
  audio.volume = volumeFraction;
  if (ytPlayer) {
    ytPlayer.setVolume(Math.round(volumeFraction * 100));
    if (volumeFraction === 0) ytPlayer.mute();
    else ytPlayer.unMute();
  }
}

function backendGetCurrentTime() {
  const song = activePlaylist.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getCurrentTime?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.currentTime || 0 : 0;
}

function backendGetDuration() {
  const song = activePlaylist.getCurrentSong();
  if (isYouTubeSong(song) && ytPlayer) {
    return ytPlayer.getDuration?.() || 0;
  }
  const audio = document.getElementById("audio");
  return audio ? audio.duration || 0 : 0;
}

function backendSeekTo(seconds) {
  const song = activePlaylist.getCurrentSong();
  const audio = document.getElementById("audio");
  if (isYouTubeSong(song) && ytPlayer) {
    ytPlayer.seekTo(seconds, true);
  } else if (audio && audio.duration > 0) {
    audio.currentTime = seconds;
  }
}

function changePlaylist(newPlaylist) {
  activePlaylist = newPlaylist;
  window.playlist = newPlaylist;
  activePlaylist.currentSongIndex = 0;

  updateUI(activePlaylist);

  const audio = getAudioElement();
  backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio);
  backendPlay(audio);
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

function formatTime(secs) {
  if (isNaN(secs)) return "0:00";
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setupMusicPlayer() {
  const gameWindow = document.getElementById("game_window");
  if (!gameWindow) {
    console.warn("game_window element not found. Player will not be attached.");
    return;
  }

  if (document.getElementById("player")) return;

  const defaultSongs = [
    ["Any Major Dude Will Tell You", "Steely Dan", "https://yt3.googleusercontent.com/GQe32v3_JfuISMNqST3XRP_Im-SfGIblddV5SfKNVReKM0G93pM3ifwWnin_Uyibt7xVPa4Ju_2DVXeH5A=w544-h544-s-l90-rj", "https://music.youtube.com/watch?v=HBzzdlpISFg"],
    ["The Way We Were", "Barbra Streisand", "https://yt3.googleusercontent.com/2e3aXwlb4KsGdXp9S0z_Ln9qdpjWxA79b97xLN9fA0FpU5nLhsa7I6eBP3keGD8tweeTQLwrzSg7hUs=w544-h544-l90-rj", "https://music.youtube.com/watch?v=hkBziLvefsw"],
    ["Sea Song", "Robert Wyatt", "https://yt3.googleusercontent.com/4RHpNY15CfhMEKmqtr-9K_vO3LuhqFLlSRvYBUhmR103XwrceoRs2e7533SgUB904FNsD1Mgp0Ckqdbk=w544-h544-l90-rj", "https://music.youtube.com/watch?v=agCX2RQWN44"],
    ["Some Misunderstanding", "Gene Clark", "https://yt3.googleusercontent.com/eX_oebwbGZZP4XLGYzFUv7xoJWeS57cTpsdfyk1EG9FMmQ2-mIM6QwZQH15HPU0AdnX0wXkflbE4PWSw=w544-h544-l90-rj", "https://music.youtube.com/watch?v=W1oGyxLtqok"],
    ["Spanish Moon", "Little Feat", "https://yt3.googleusercontent.com/bvatblDU8S5QQPolKKa7mn0sR-Mt3x0nUWFzNH_h5_hqrs5-6VcVFwy-FASLWm7T9M5Nwvyd5GKWjKh8=w544-h544-l90-rj", "https://music.youtube.com/watch?v=cS2UqIB5Apo"],
    ["Station to Station", "David Bowie", "https://yt3.googleusercontent.com/Qlj3ljBKPC6HceLxgqXYVIXv03UyT3DA-rmvXjzsdCsKCTlaH-W3cBV-t9PrMMaosC3uHGjUN8DMUTDz=w544-h544-l90-rj", "https://music.youtube.com/watch?v=ZpIhsGg2SJ0"]
  ];

  if (activePlaylist.songs.length === 0) {
    defaultSongs.forEach(data => activePlaylist.addSong(new Song(...data)));
  }

  const style = document.createElement("style");
  style.textContent = `
    #player {
      position: relative;
      border: 3px solid #222;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 975px;
      height: 191px;
      background-image: url("${ASSETS.bg}");
      background-size: cover;
      font-family: Arial, "Helvetica Neue", sans-serif;
      box-sizing: border-box;
      margin: 10px auto;
      overflow: hidden;
      user-select: none;
    }

    #cover-wrapper {
      position: absolute;
      left: 10px;
      top: 2px;
      width: 180px;
      height: 180px;
      z-index: 2;
    }

    #cover {
      width: 180px;
      height: 180px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 2px 0 8px rgba(0,0,0,0.6);
      object-fit: cover;
    }

    #start-stop-container {
      position: absolute;
      left: 282px;
      top: 25px;
      z-index: 5;
    }

    #playPauseButton {
      width: 110px;
      height: 55px;
      background: linear-gradient(180deg, #ffffff 0%, #f2f2f2 60%, #d8d8d8 100%);
      border: 3px solid #222222;
      outline: 2px solid #505050;
      border-radius: 2px;
      color: #111111;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: inset 0 1px 0 #ffffff, 0 2px 4px rgba(0,0,0,0.5);
      letter-spacing: 0.5px;
      transition: all 0.08s ease;
    }

    #playPauseButton:hover {
      background: linear-gradient(180deg, #ffffff 0%, #ffffff 60%, #e0e0e0 100%);
    }

    #playPauseButton:active, #playPauseButton.active {
      background: linear-gradient(180deg, #d0d0d0 0%, #c0c0c0 100%);
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
      transform: translateY(1px);
    }

    #transport-buttons {
      position: absolute;
      left: 285px;
      top: 136px;
      display: flex;
      gap: 10px;
      z-index: 5;
    }

    .technics-btn {
      background: linear-gradient(180deg, #f0f0f0 0%, #d0d0d0 50%, #999999 100%);
      border: 1px solid #444;
      outline: 1px solid #505050;
      border-radius: 3px;
      color: #111;
      font-size: 11px;
      font-weight: bold;
      padding: 6px 14px;
      cursor: pointer;
      box-shadow: inset 0 1px 0 #fff, 0 2px 4px rgba(0,0,0,0.4);
      transition: all 0.1s;
      letter-spacing: 0.5px;
    }

    .technics-btn:hover {
      background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 50%, #aaaaaa 100%);
    }

    .technics-btn:active {
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.6);
      transform: translateY(1px);
    }

    #center-column {
      position: absolute;
      left: 425px;
      top: 20px;
      width: 440px;
      display: flex;
      flex-direction: column;
      z-index: 10;
    }

    #song-info {
      color: #ffffff;
      margin-bottom: 12px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    }

    #title {
      font-size: 18px;
      font-weight: bold;
      color: #f0f0f0;
      letter-spacing: 0.5px;
    }

    #artist {
      font-size: 14px;
      color: #ccc;
      margin-top: 4px;
    }

    #progress-bar-container {
      position: relative;
      width: 100%;
      height: 16px;
      background: #181818;
      border: 1px solid #555;
      border-radius: 2px;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.8);
      cursor: pointer;
      margin-top: 8px;
      overflow: hidden;
      z-index: 10;
    }

    #progress {
      height: 100%;
      width: 0%;
      background: linear-gradient(180deg, #ffffff 0%, #cccccc 50%, #999999 100%);
      box-shadow: 0 0 6px rgba(255,255,255,0.6);
    }

    #time-display {
      display: flex;
      justify-content: space-between;
      color: #bbb;
      font-size: 12px;
      font-family: monospace;
      margin-top: 6px;
    }

    #volume-container {
      position: absolute;
      right: 42px;
      top: 10px;
      width: 30px;
      height: 170px;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #volumeSlider {
      writing-mode: vertical-lr;
      direction: rtl;
      width: 25px;
      height: 165px;
      background: transparent;
      cursor: pointer;
      margin: 0;
      padding: 0;
    }

    #volumeSlider:focus { outline: none; }

    #volumeSlider::-webkit-slider-runnable-track {
      width: 3px;
      height: 100%;
      background: transparent;
    }

    #volumeSlider::-moz-range-track {
      width: 3px;
      height: 100%;
      background: transparent;
    }

    #volumeSlider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 25px;
      height: 21px;
      background-image: url("${ASSETS.volThumb}");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
      cursor: pointer;
    }

    #volumeSlider::-moz-range-thumb {
      width: 25px;
      height: 21px;
      background-image: url("${ASSETS.volThumb}");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border: none;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const playerContainer = document.createElement("div");
  playerContainer.id = "player";
  playerContainer.innerHTML = `
    <div id="cover-wrapper">
      <img id="cover" alt="Album cover">
    </div>

    <div id="start-stop-container">
      <div id="playPauseButton" title="Start / Stop">start • stop</div>
    </div>

    <div id="transport-buttons">
      <button id="prevButton" class="technics-btn">◄ previous</button>
      <button id="nextButton" class="technics-btn">next ►</button>
    </div>

    <div id="center-column">
      <div id="song-info">
        <div id="title"></div>
        <div id="artist"></div>
      </div>

      <div id="progress-bar-container">
        <div id="progress"></div>
      </div>

      <div id="time-display">
        <span id="current-time">0:00</span>
        <span id="duration-display">0:00</span>
      </div>
    </div>

    <div id="volume-container">
      <div class="is-vertical">
        <input type="range" id="volumeSlider" min="0" max="9" step="1" value="${currentVolume}">
      </div>
    </div>
  `;

  gameWindow.insertAdjacentElement("afterend", playerContainer);

  const audio = getAudioElement();
  audio.volume = currentVolume / 9;

  const playPauseBtn = document.getElementById("playPauseButton");
  const prevBtn = document.getElementById("prevButton");
  const nextBtn = document.getElementById("nextButton");
  const progressBarContainer = document.getElementById("progress-bar-container");
  const progressBar = document.getElementById("progress");
  const currentTimeDisplay = document.getElementById("current-time");
  const durationDisplay = document.getElementById("duration-display");
  const volumeSlider = document.getElementById("volumeSlider");

  window._onSongEnded = function () {
    activePlaylist.playNext();
    playSongAtIndex();
  };

  const playSongAtIndex = () => {
    updateUI(activePlaylist);
    backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio);
    backendPlay(audio);
  };

  playPauseBtn.addEventListener("click", () => {
    const song = activePlaylist.getCurrentSong();
    let isPaused = true;

    if (isYouTubeSong(song)) {
      const state = ytPlayer?.getPlayerState?.();
      isPaused = !(state === YT.PlayerState.PLAYING);
    } else {
      isPaused = audio.paused;
    }

    if (isPaused) {
      backendPlay(audio);
    } else {
      backendPause(audio);
    }
  });

  nextBtn.addEventListener("click", () => {
    activePlaylist.playNext();
    playSongAtIndex();
  });

  prevBtn.addEventListener("click", () => {
    activePlaylist.playPrevious();
    playSongAtIndex();
  });

  audio.addEventListener("timeupdate", () => {
    if (!isYouTubeSong(activePlaylist.getCurrentSong()) && Number.isFinite(audio.duration) && audio.duration > 0) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = percent + "%";
      if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(audio.currentTime);
      if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    if (!isYouTubeSong(activePlaylist.getCurrentSong()) && durationDisplay && Number.isFinite(audio.duration)) {
      durationDisplay.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("ended", () => {
    window._onSongEnded();
  });

  progressBarContainer.addEventListener("click", (e) => {
    const duration = backendGetDuration();
    if (Number.isFinite(duration) && duration > 0) {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      backendSeekTo(percent * duration);
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = parseInt(e.target.value, 10);
    backendSetVolume(audio, currentVolume / 9);
  });

  updateUI(activePlaylist);
  backendSetSrcAndLoad(activePlaylist.getCurrentSong(), audio);
  backendPlay(audio);
}

setupMusicPlayer();
