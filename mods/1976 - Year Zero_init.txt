RecReading=true
e.collect_results = true; 


campaignTrail_temp.achievements = {
"State of Siege" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/siege.png",
    "description" : "Win after having to replace your running mate as either candidate.",
    "cannotBeCheated" : true
  },
"The Third Century" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/bush.png",
    "description" : "Achieve the canonical ending as either candidate.",
    "cannotBeCheated" : true
  },
"Blow Out" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/blowout.png",
    "description" : "Win every state as Frank Church.",
    "cannotBeCheated" : true
  },
"Executive Action" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/action.png",
    "description" : "Lose DC while winning as Frank Church.",
    "cannotBeCheated" : true
  },
"Twilight's Last Gleaming" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/gleam.png",
    "description" : "Win as Ronald Reagan.",
    "cannotBeCheated" : true
  },
"Who?" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/who.png",
    "description" : "Win as Hubert Humphrey",
    "cannotBeCheated" : true
  },
"The Day of the Dolphin" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/dolphin.png",
    "description" : "Lose as Ronald Reagan.",
    "cannotBeCheated" : true
  },
"Cutter's Way" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/cutters.png",
    "description" : "Lose as Hubert Humphrey.",
    "cannotBeCheated" : true
  },
"The Stepford Wives" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/wives.png",
    "description" : "Win 400 Electoral Votes as Gerald Ford while campaigning with Betty Ford.",
    "cannotBeCheated" : true
  },
"Marathon Man" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/marathon.png",
    "description" : "Make a deal with Udall, and win the nomination as Frank Church.",
    "cannotBeCheated" : true
  },
"The MacIntosh Man" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/mack.png",
    "description" : "Stick with Sam Nunn and sweep the south as Frank Church.",
    "cannotBeCheated" : true
  },
"Capricorn One" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/capricorn.png",
    "description" : "Win with John Glenn while losing the south as Frank Church.",
    "cannotBeCheated" : true
  },
"Illustrious Corpses" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/corpses.png",
    "description" : "Win Wisconsin as Gerald Ford while doubling down.",
    "cannotBeCheated" : true
  },
"The Fury" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/thefury.png",
    "description" : "Win Texas after spreading skepticism about Kennedy's death.",
    "cannotBeCheated" : true
  },
"The Odessa File" : { 
    "image" : "https://itsastronomical.com/assets/1976YZ/ach/odessa.png",
    "description" : "Lose 49 states as Gerald Ford.",
    "cannotBeCheated" : true
  }
}
campaignTrail_temp.modBoxTheme = {
  "header_color": "#FAF9F9",
  "header_image_url": "https://itsastronomical.com/assets/1976YZ/imgur/62Th7Tx.png",
  "header_text_color": "#1E1E1E",
  "description_text_color": "#1E1E1E",
  "description_background_color": "#ffffff",
  "main_color": "#FAF9F9",
  "secondary_color": "#F01D1D",
  "ui_text_color": "#FFFFFF"
}

campaignTrail_temp.credits = "CTA and Neo, coded by ItsAstronomical and with help from:<button onclick='credits()'>others</button>";

corrr = `
<div style="font-size: 11px; font-family: monospace; color: white;">
  <h2 style="font-style: normal;">
    <img src="https://itsastronomical.com/assets/1976YZ/yz.gif" alt="title" style="width: 310px; object-fit: cover; margin-top: 0px; padding: .2em; margin-bottom: -4px;">
  </h2>
</div>
`;
  
window.credits = function () {
	const creditsList = ["Writing - Neo and CTA with help from Ettingermentum", "Coding - Astro and Mango with help from Obummer", "Visuals and Newsstands - Routevenus",]
	const text = creditsList.join('\n');

	alert(text);
}

if (!e.done) {
e.done = true;

campaignTrail_temp.election_json = [
    {
        "model": "campaign_trail.election",
        "pk": 10,
        "fields": {
            "year": 1976,
            "summary": "<div style='overflow-y:auto; height:190px'><p>America’s Bicentennial year is not a celebration, it’s a funeral. A death march for a way of life that its children and grandchildren will never know. The era of postwar prosperity has come to a screeching halt, thrown off course by rising prices, low growth, and high unemployment. Its politics are submerged in scandal. Watergate, Vietnam, CIA subterfuge. </p><p>As the nation claws into its third century, millions of Americans wonder if this is the end. Others pray that this long national nightmare can finally be put out of its misery. And a scattered few wonder if it was ever worth saving at all.</p><p>Frank Church and Gerald Ford are not among them. Both men believe that somewhere after World War II, America took a wrong turn. Towards deceitfulness, immorality, and despair. Each man believes they are the only one capable of getting the country back on track. Their clashing visions command tens of millions of supporters, and diverge wildly, but both avoid answering a simple question: are the nation’s best days already behind us?</p></div>",
            "image_url": "https://itsastronomical.com/assets/1976YZ/finalintro.jpg",
            "winning_electoral_vote_number": 270,
            "advisor_url": "https://itsastronomical.com/assets/1976YZ/imgur/xxTGoDB.gif",
            "recommended_reading": "<div style='overflow-y:scroll;height:370px;color:black;'><h2 style='margin-top: 0.5em;'>1976: Year Zero</h2><img src='https://itsastronomical.com/assets/1976YZ/intro.png' height='170px'><h4>Notes</h4><p style='padding:0px 65px'>On January 20, 1977, when Jimmy Carter stood on the dais of his inauguration as 39th President of the United States, he had nearly delivered an unusual speech. A call for the American people to repent. Quoting II Chronicles 7:14, he would have pushed the onus for the sins of Watergate and Vietnam away from the perpetrators, and on to the country itself, chastising them for their “wicked ways.” His staff vetoed the address, but it set the tone for the presidency that followed.</p><p style='padding:0px 65px'>Out of the ashes of the turbulent Sixties and the unending crises of the Seventies, what if there rose a President who knew exactly who was to blame for the loss of faith in government? Who fiercely challenged the military-industrial complex, multinational corporations, and the unaccountable security state? Would they have turned out any different than Jimmy Carter? The answers to these questions are unknowable. But this scenario takes an attempt at imagining a world where at the end of the country’s second century and the beginning of its third, America took another turn.</p><p style='padding:0px 65px'>Frank Church was far from a perfect politician. He was prone to sniffing the political winds, following the path of political expedience instead of courage. He was something of a showboater, always eager to step into the spotlight, sometimes at the detriment of the very causes he championed. He zealously clung to tradition on issues as varied as the Middle East and gun control. Yet, in this perilous moment for the nation, after the exile of Richard Nixon, he assumed the role of interrogator. In 1975 and 1976, no one in American politics was more dogged in their pursuit of how the nation had slipped into a moral abyss than Frank Church. From his perch on Senate Subcommittees, Church led televised hearings into how America had bogged itself down in the rice paddies of Vietnam and the darkened corridors of Watergate which had spawned such catastrophe.</p><p style='padding:0px 65px'>Our other primary figure in this scenario, Gerald Ford, was often pitted against Church as an antagonist, hanging on for dear life to the secrets of the Cold War and condemning his inquiries as harmful to national security. Yet Ford too was a fundamentally decent man, one who was as disgusted as Church was with the rampant criminality of Nixon’s cronies, and who took significant strides to deescalate military tensions around the world, even when it meant shunning his own right-wing base. He was ahead of his party on other issues too, even suggesting to aides that Barbara Jordan—a lesbian Black woman whose stirring invocations of the Constitution had made her one of the most admired Americans of the decade—would make an excellent justice on the nation’s highest court.</p><p style='padding:0px 65px'>But like Carter, Ford ventured down the path of introspection, then stopped, backed away, and ran. His pardon of Richard Nixon may have permanently damaged Americans’ faith in institutions and sent our country on the course toward total impunity for the ruling class which we endure today. This is not an attempt to needlessly condemn the morals of these men for their sins, but to speculate about the nature of the office itself. This scenario is an exploration of what occurs when someone in that position continues down that same path of questioning the very foundations of 20th century American power, and doesn’t turn back.</p><h4>Sources</h4><p><i>Fighting the Odds: The Life of Senator Frank Church</i> by <u>LeRoy Ashby and Rod Gramer</u></p><i>The Last Honest Man: The CIA, the FBI, the Mafia, and the Kennedys—and One Senator's Fight to Save Democracy</i> by <u>James Risen</u></p><i>A Season of Inquiry Revisited</i> by <u>Loch Johnson</u></p><i>Challenging the Secret Government: The Post-Watergate Investigations of the CIA and FBI</i> by <u>Kathryn Olmstead</u></p><i>The Invisible Bridge: The Fall of Nixon and the Rise of Reagan</i> by <u>Rick Perlstein</u></p><i>Marathon: The Pursuit of the Presidency 1972-1976</i> by <u>Jules Witcover</u></p><i>An Ordinary Man: The Surprising Life and Historic Presidency of Gerald R. Ford</i> by <u>Norton Smith</u></p></div>",
            "has_visits": 1,
            "no_electoral_majority_image": "https://www.jetsimon.com/public/static/images/2012-no-majority.jpg",
            "display_year": "1976 - Year Zero"
        }
    }
]

campaignTrail_temp.candidate_json = [
    {
        "model": "campaign_trail.candidate",
        "pk": 92,
        "fields": {
            "first_name": "Frank",
            "last_name": "Church",
            "election": 10,
            "party": "Democratic",
            "state": "Idaho",
            "priority": 2,
            "description": "<div style='height:340px'><p>Like millions of Americans, Frank Church had a boyhood hero. William Borah, Idaho’s iconoclastic Senator, was Church’s. A crusading politician whose fiery oratory was wielded to push back against foreign interventions, Borah was a figure of worship in Church’s childhood home, with the teenager even writing a defense of his ideology that was published in Boise’s local paper. Any time he gets asked who inspired him to enter politics, Church gives the same answer: Borah.</p><p>But when he came to Washington, Church had a rude awakening. Called ‘The Boy Senator’ for his youth, Church’s innocent outlook was shattered by his own colleagues, who let him in on open secrets, including Borah’s blatant corruption, his utter naïveté about the world, and his willingness to abandon his own causes out of sheer opportunism. Borah’s portrait now hangs in Church’s office, not out of worship, but as a warning. An artifact the Senator is forced to walk by each day, which reminds him of the sleaze and filth of politics, something Church has seen time and time again in his televised hearings on the rampant abuses of the American establishment.</p><p>Church’s investigations into sordid CIA plots and multinational corporations’ greed may have made him a household name—in 1975, one more widely known than the president—but there’s only so much fame can do. In 1976, Frank Church is running for president, not as the shameless self-promoter he’s tarred as, but as a man committed to reform. Church believes in returning this nation to its founding principles, steering it away from its imperial overextension, and restoring it to a republic. Americans can only pray he doesn’t bring it back to the days of Borah.</p></div>",
            "color_hex": "#4a759e",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 1,
            "image_url": "https://itsastronomical.com/assets/1976YZ/imgur/IlYSxWC.png",
            "electoral_victory_message": "tbd",
            "electoral_loss_message": "tbd",
            "no_electoral_majority_message": "tbd",
            "description_as_running_mate": "''",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 91,
        "fields": {
            "first_name": "Gerald",
            "last_name": "Ford",
            "election": 10,
            "party": "Republican",
            "state": "Michigan",
            "priority": 1,
            "description": "<div style='height:340px'><p>From his childhood in Grand Rapids, Michigan, Gerald Ford was taught that hard work, honesty, and just a little grit were all you needed to get on in life. Coming of age in the golden era of American politics, he, like most Americans, implicitly trusted in the federal government even when he did not agree with it. He wept for Roosevelt when he heard news of his president's death, and was proud to say that he was friendly with the Kennedy administration long ago. Things have changed in America since his youth—the collapse of trust in government as a result of the Vietnam War and Watergate has been disastrous—and with Nixon's resignation, Ford has been forced to clean up the mess.</p><p><i>President Ford</i> knows his way around Washington like the back of his hand, having first been elected to Congress twenty-eight years ago in spite of the shocking Democratic comeback victory led by Harry Truman, and in the pre-Watergate yesteryear he could commonly find himself as a more than influential character in the legislative process, despite having never been in the majority. Nowadays, it feels as if he has no power at all, held hostage by the all-powerful Congress he once loved dearly.</p><p>Gerald Ford sees that the world has changed around him—he is keenly aware that trust in his administration has all but evaporated since the Nixon pardon—and he knows that even more will be exposed if Frank Church is to win the presidency. Still, ever the pragmatic idealist, Ford sincerely believes that he can save Washington from itself, dragging it back to the past even if it must be through brute force. In Ford's eyes, failure this year will mean nothing less than the destruction of the American way of life—and victory will mean the restoration of America's moral soul.</p></div>",
            "color_hex": "#b03032",
            "secondary_color_hex": "#90C0FF",
            "is_active": 1,
            "image_url": "https://itsastronomical.com/assets/1976YZ/imgur/EOo8rCP.png",
            "electoral_victory_message": "tbd",
            "electoral_loss_message": "tbd",
            "no_electoral_majority_message": "tbd",
            "description_as_running_mate": "''",
            "candidate_score": 1,
            "running_mate": false
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 94,
        "fields": {
            "first_name": "Leonard H.",
            "last_name": "Marks",
            "election": 10,
            "party": "Independent",
            "state": "Texas",
            "priority": 3,
            "description": "''",
            "color_hex": "#505373",
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
        "pk": 93,
        "fields": {
            "first_name": "Lester",
            "last_name": "Maddox",
            "election": 10,
            "party": "American Independent",
            "state": "Georgia",
            "priority": 4,
            "description": "''",
            "color_hex": "#c97908",
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
            "first_name": "Barbara",
            "last_name": "Jordan",
            "election": 10,
            "party": "Democrat",
            "state": "Texas",
            "priority": 5,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://itsastronomical.com/assets/1976YZ/jordan.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style='overflow-y:auto; height:170px'><p>On the eve of Barbara Jordan’s statement concerning the move to impeach Richard M. Nixon, the Texas representative had sat through dozens of other showboating politicians’ speechifying. In all their hollow appeals to the constitution and phony reverence for its framers, she kept hearing their intonation of the document’s opening words. In her own speech, Jordan addressed this line directly:<br><i>\"'We the people' -- it is a very eloquent beginning. But when the Constitution of the United States was completed on the 17th of September in 1787, I was not included in that 'We the people.' I felt for many years that somehow George Washington and Alexander Hamilton just left me out by mistake. But through the process of amendment, interpretation and court decision, I have finally been included in 'We the people.'\"</i></p><p>What followed in the next 13 minutes has been hailed as one of the greatest speeches in American political history. Chairman Rodino wept openly in the chambers, Rep. Andrew Young said that “the heavens have opened up,” and a 100-year old Black man wrote to her office asking for a photograph of her that he could keep for “the rest of my life.” Less than a decade had passed since <i>de jure</i> racial apartheid segregated vast swaths of the country, and yet here was a Black woman in the halls of Congress, upholding the very framework which specifically excluded her and millions of others. That fundamental contradiction is not a flaw of Jordan’s brand of politics, but her greatest asset.</p><p>At a time when the party is in a state of turmoil at the New York City convention, with the South in revolt, liberals in disarray, and the party leadership flinching at the prospects of another Chicago, some would say choosing Jordan could be the worst mistake of your political career. “Haven’t we had enough division?” they will plead. It is true that she certainly comes with political risks, given still widespread racism, and the growing conservative movement in 1976. To make matters more complicated, she has little clout within her own Caucus, and is often perceived by her colleagues as aloof and austere. A Johnson acolyte born to a Texas minister, Jordan even supported the Vietnam War to the bitter end, long after it had passed its political expiration date. If her public stances made one sweat, her private life will make some party hands go into shock, with her sexuality being an open secret in Washington, given her decades-long relationship with another woman.</p><p>But is that not more evidence of her political strength? In this cynical age, bred by deceit and mistrust, if a Black woman in love with another woman, who stands far outside the Washington boy’s club, <i>still</i> believes in the promise of America, its constitution, and its people… who can’t?</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 96,
        "fields": {
            "first_name": "Sam",
            "last_name": "Nunn",
            "election": 10,
            "party": "Democrat",
            "state": "Georgia",
            "priority": 6,
            "description": "''",
            "color_hex": "#0000FF",
            "secondary_color_hex": "#90C0FF",
            "is_active": 0,
            "image_url": "https://itsastronomical.com/assets/1976YZ/nunn.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style='overflow-y:auto; height:170px'><p>Born and raised in the heart of Georgia, educated at Emory, and not yet 40, Sam Nunn exudes just the kind of energy you need to keep the Southern convention delegates from tearing up the seats. Related to Carl Vinson by blood, Nunn too has made expanding the U.S. military his crusade. It’s undoubtedly an odd fit for the Democratic ticket in ‘76, but with a staunch liberal at the top, perhaps a staunch conservative at the bottom can balance it?</p><p>First elected to the Senate in ‘72, Nunn is amiable enough with his colleagues, and has come off well in interviews, though not much is known about his ideological background. What pushed him to run for office? What are his ambitions for higher office? What does he have to say about the transformation of the South? It’s that last question that keeps Democrats up at night most, with the upheavals of Goldwater, Wallace, and Nixon’s southern strategy wildly changing the once-solid Democratic base. When Jimmy Carter was ahead in the polls, pundits thought the issue would be effectively neutralized, since the party could nominate one of Dixie’s boys, but Church had something to say about that.</p><p>What makes Nunn an attractive running mate is the very fact that he’s from Carter’s home state, an unsubtle bid to win over reluctant supporters of the Georgia Governor in the primaries. Nunn’s education at a prestigious Atlanta private school also separates the wheat from the chaff as far as Southern good ol’ boys are concerned. Otherwise, he’s a blank slate, allowing each faction of the party to project their wishes onto his supposed right-leaning streak. After all, he’s game to work with just about anybody, even the most controversial Republicans in Washington.</p></div>",
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
            "image_url": "https://itsastronomical.com/assets/1976YZ/glenn.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style='overflow-y:auto; height:170px'><p>John Glenn is many things. An astronaut, the first American to orbit the Earth, a Senator, a Kennedy friend, an Eagle Scout, a Presbyterian, and a Sunday school teacher. In other words, as one reporter memorably put it, he’s the ultimate square. A bonafide American hero, Glenn’s dull speaking style can bore anyone, most notably the state of Ohio, which collectively slept through its alarm and forgot to nominate him for U.S. Senate in 1970. Ultimately winning an upper chamber seat in the ‘74 post-Watergate massacre, Glenn’s straightforwardness and blunt communication might serve him well in a cynical environment, making anyone convinced he’s on their side. In essence, he’s the perfect running mate. Boring, inoffensive, and with enough clout to potentially boost the ticket’s prospects, but not enough to overshadow it.</p><p>It’s his close Kennedy association that could make him ideal, though. A good friend of Robert F. Kennedy, the Attorney General urged him to make his entry in politics in 1962, a call which Glenn heeded. At Kennedy’s death in ‘68, Glenn was there in the Ambassador Hotel, always by his side. Of course, his greatest achievement is itself the embodiment of that sparkling bygone Kennedy era, a physical representation of the New Frontier, and a font of patriotism.</p><p>It could also be an inherent flaw. There may be some grumbling in the south over such an explicit connection to President Kennedy and the progressivism of the early 60’s—though Glenn himself was a strict centrist who believed women couldn’t be astronauts. More worrying though is that Glenn’s most noteworthy achievement occurred 14 years ago. There are voters alive today who don’t even remember Mercury 7, and may think that Scott Carpenter’s historic sendoff,“Godspeed John Glenn,” is the title of a soap opera.</p></div>",
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
            "image_url": "https://itsastronomical.com/assets/1976YZ/dole.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style='overflow-y:auto; height:190px'><p>Ordinary folk look out to their government in the fallout from Watergate and see nothing except for a hollow husk, a cold war machine that will do anything to assert its own power—even Republican politicians have felt compelled to condemn the vast overreach—after all, who in the world could play defense for these demons? Senator Bob Dole would.</p><p>Hailing from the generation of men who threw themselves into the Second World War, the horrors he saw throughout Europe—and the searing wounds through his body that left him nearly paralyzed—have shaped his worldview since. Told he would never walk again, Dole grit his teeth and simply stood up, owing it all to the virtue of hard work and pride.</p><p>A stalwart conservative who defended Richard Nixon to his very final days, Dole can offer you nothing except undying loyalty and a lifeline to Ronald Reagan and a conservative movement you find more perplexing every passing day. He's willing to serve as an attack dog against Church and Barbara Jordan, even if that means getting his hands dirty. For better or worse, he's your hatchet man.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 100,
        "fields": {
            "first_name": "William",
            "last_name": "Ruckelshaus",
            "election": 10,
            "party": "Republican",
            "state": "Washington",
            "priority": 9,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://itsastronomical.com/assets/1976YZ/ruckelshaus.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style='overflow-y:auto; height:190px'><p>It has been less than three years since William Ruckelshaus cemented his name into the pages of history by being one of the first of many Republicans, or even government officials at large, to tell Richard Nixon no. The Nixon administration chided him and Attorney General Elliot Richardson as traitors, ensuring they soared to new, dizzying heights of national popularity, and now it seems the stars have aligned for Ruckelshaus to make his grand comeback in the Republican Party.</p><p>There are few men within the GOP who are free from the scathing remarks by voters and politicians alike branding them as corrupt, too defensive of Watergate, and all around scummy—as seen with signs from the Democratic National Convention poking fun at the \"Nixon-Ford\" administration—but Bill Ruckelshaus might make those voters see that the Republicans are still the party of good and honest government.</p><p>Unfortunately, Reagan has already publicly told the press that he's almost certainly unacceptable to the right, both for his egregious disrespect of President Nixon, as well as his moderate politics—but you're just about tired of taking orders from Ronald Reagan anyways.</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
    {
        "model": "campaign_trail.candidate",
        "pk": 101,
        "fields": {
            "first_name": "Bill",
            "last_name": "Simon",
            "election": 10,
            "party": "Republican",
            "state": "California",
            "priority": 9,
            "description": "''",
            "color_hex": "#FF0000",
            "secondary_color_hex": "#FFA0A0",
            "is_active": 0,
            "image_url": "https://itsastronomical.com/assets/1976YZ/billsimon.png",
            "electoral_victory_message": "''",
            "electoral_loss_message": "''",
            "no_electoral_majority_message": "''",
            "description_as_running_mate": "<div style='overflow-y:auto; height:190px'><p>When Gerald Ford entered his first cabinet meeting as President of the United States, Bill Simon had a piece of blunt advice for him: fire everyone. Including Simon.</p><p>It's that type of brazenness and ability to offend everyone that endears Ford to the Treasury Secretary. An ardent deficit hawk and proponent of a slash-and-burn approach to government spending, Simon's unafraid to let Ford—and every journalist in Washington—know when he hates something. On one level, this could afford him to Reagan's conservatives. They both agree on the need for permanent tax cuts and despise all of Vice President Rockefeller's initiatives. Inside those circles of the New Right, Simon's just about the most palatable choice Ford could select from his own cabinet. It's outside of the conference rooms of the Kansas City Sheraton Inn where the real troubles start.</p><p>No issue has been more damaging and perplexing to Ford than the state of the economy. He's burned through three commerce secretaries. He's been riding the inflation bronco and has been thrown off more than once. He's had to rein in the Saudis and other Arab states during seemingly unending energy shocks. At the center of all of that has been Bill Simon. There is no man more singularly associated with the state of the economy than him. If the President goes with him, nobody will be happier than Frank Church, who will already start measuring the Oval Office drapes. But since when has Ford ever worried about a pissant like that?</p></div>",
            "candidate_score": 0,
            "running_mate": true
        }
    },
]

campaignTrail_temp.running_mate_json = [
    {
        "model": "campaign_trail.running_mate",
        "pk": 1,
        "fields": {
            "candidate": 92,
            "running_mate": 95
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 2,
        "fields": {
            "candidate": 92,
            "running_mate": 96
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 3,
        "fields": {
            "candidate": 92,
            "running_mate": 97
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 4,
        "fields": {
            "candidate": 91,
            "running_mate": 99
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 5,
        "fields": {
            "candidate": 91,
            "running_mate": 100
        }
    },
    {
        "model": "campaign_trail.running_mate",
        "pk": 6,
        "fields": {
            "candidate": 91,
            "running_mate": 101
        }
    }
]

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
]

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
]

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
]

campaignTrail_temp.temp_election_list = [
    {
        "id": 10,
        "year": 1976,
        "is_premium": 0,
        "display_year": "1976 - Year Zero"
    }
]

let z = new MutationObserver((mutationsList, observer) => {
    let runningMateSummary = document.querySelector("#running_mate_summary");
    if (runningMateSummary) {
        $("#running_mate_id_button").click();
        observer.disconnect()
    }
});


z.observe(document, { subtree: true, childList: true });

}


nct_stuff.themes[nct_stuff.selectedTheme].coloring_window = "#e5e5e5" 
nct_stuff.themes[nct_stuff.selectedTheme].coloring_title = "#e5e5e5" 
$(".container")[0].style.backgroundColor = "transparent"
// $("#game_window")[0].style.backgroundImage = "url(https://itsastronomical.com/assets/1976YZ/imgur/ndN7gK0.png)" 
$("#game_window")[0].style.borderColor = "#C9C9C9"
$("#game_window")[0].style.coloring_window = "transparent" 
document.body.background = "https://itsastronomical.com/assets/1976YZ/imgur/ndN7gK0.png" 
document.getElementById("header").src = "https://itsastronomical.com/assets/1976YZ/imgur/Cm2HLFY.png" 
document.getElementById("wittyquote").color = "black" 
nct_stuff.themes[nct_stuff.selectedTheme].text_col = "black"
// document.getElementsByClassName("container")[0].style="background-image: url('https://itsastronomical.com/assets/1976YZ/imgur/ndN7gK0.png')"

HistHexcolour=["#539cbc","#c23636","#505373","#c97908"];
HistName=[" Frank Church"," Gerald Ford"," L.H. Marks"," Lester Maddox"];
HistEV=[490,47,0,0];
HistPV=["45,216,400","35,855,519","1,337,268","1,170,110"];
HistPVP=["54.1%","42.9%","1.6%","1.4%"];

function ensureMetaViewport() {
    if (!document.querySelector('meta[name="viewport"]')) {
        const m = document.createElement('meta');
        m.name = 'viewport';
        m.content = 'width=device-width, initial-scale=1';
        document.head.appendChild(m);
    }
}

function applyGlobalStyles(css, id = 'app-theme') {
    /*if ('adoptedStyleSheets' in document && 'replaceSync' in CSSStyleSheet.prototype) {
        if (!applyGlobalStyles.sheet) {
            applyGlobalStyles.sheet = new CSSStyleSheet();
            document.adoptedStyleSheets = [...document.adoptedStyleSheets, applyGlobalStyles.sheet];
        }
        applyGlobalStyles.sheet.replaceSync(css);
        return;
    }*/

    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('style');
        el.id = id;
        document.head.appendChild(el);
    }
    el.textContent = css;
}

const css = `
		#opponent_selection_id_back {
			display: none;
		}


		#results_container { color: #000000; }

		  .game_window,
		  .menu_container,
		  .inner_window_w_desc,
		  .description_window_small,
		  .content_box  {
			background-color: transparent !important;
		  }
		  
		  #game_window,
		  #menu_container,
		  #inner_window_w_desc,
		  #description_window_small,
		  #content_box {
			background-color: transparent !important;
		  }


		body {
			background-size: cover;
		}
		

		#visit_window {
            height: auto;
        }
        #visit_content {
            height: 79%;
        }

        #menu_container {
          background-color: transparent !important;
        }
        #overall_result_container {
            background-color: transparent !important;
        }
        #state_result_container {
            background-color: transparent !important;
        }
        #question_form {
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif!important;
            font-size:1em!important;
            line-height: 1;
        }
        #question_form form[name="question"] input[type="radio"][name="game_answers"] {
            margin-left: -6px; /* Adjust this value to move the button left */
        }
        #question_form form[name="question"] label {
            display: inline-block;
            vertical-align: top;
            max-width: 97%; /* Limit the label width so it wraps at an appropriate length */
            margin-bottom: 7px; 
        }
        .inner_inner_window {
        display: flex;
        flex-direction: column;
        }
        .inner_inner_window h3{
            padding: 5px;
        }
  
        .person_button{
          margin-top:0.2em
        }
        @media only screen and (max-width: 768px) {
  
            #inner_window_1,
            #inner_window_2,
            #inner_window_3,
            #inner_window_4{
                overflow:auto;
            }
            #visit_window {
                font-size: 1.8em;
                width: 90%;
                left:5%;
            }
            .inner_window_question button,
                #visit_window button,
                #map_footer{
                    line-height: 2.5em;
                }
            #drop_down_area_state {
                margin-left: auto;
                margin-right: auto;
            }
        }
		

        h3 {
            font-size: 1.08em !important;
            line-height: 17px;
        }
        #visit_window {
            height: auto;
        }
        #visit_content {
            height: 79%;
        }

         #question_form   {
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif!important;
            font-size:1em!important;
            line-height: 1;
        }
        #question_form form[name="question"] input[type="radio"][name="game_answers"] {
            //accent-color: #4CAF50; 
            margin-left: -6px; /* Adjust this value to move the button left */
        }
        // #question_form .radio-group input[type="radio"] {
        //     margin-left: -30px; /* Adjust this value to move the button left */
        // }
        #question_form form[name="question"] label {
            display: inline-block;
            vertical-align: top;
            max-width: 97%; /* Limit the label width so it wraps at an appropriate length */
            margin-bottom: 7px; 
        }
        .inner_inner_window {
          display: flex;
          flex-direction: column;
        }
        .inner_inner_window h3{
            padding: 5px;
        }

  
        .person_button{
          margin-top:0.2em
        }
        @media only screen and (max-width: 768px) {
  
            #inner_window_1,
            #inner_window_2,
            #inner_window_3,
            #inner_window_4{
                overflow:auto;
            }
            #visit_window {
                font-size: 1.8em;
                width: 90%;
                left:5%;
            }
            .inner_window_question button,
                #visit_window button,
                #map_footer{
                    line-height: 2.5em;
                }
            #drop_down_area_state {
                margin-left: auto;
                margin-right: auto;
            }
        }
`;

applyGlobalStyles(css, 'year-zero-styles');
      
tooltipList = [
      {searchString: "\"Bullethead\" Carter", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/dWWsELd.png> <div class=\"caption\">\"Bullethead\" Carter - Exactly what it sounds like.</div>"},
      {searchString: "Cаrter", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/dWWsELd.png> <div class=\"caption\">\"Bullethead\" Carter - Exactly what it sounds like.</div>"},

      {searchString: "Peter Fenn", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/fEnHB9t.png> <div class=\"caption\">Frank Church’s top political advisor and a top opposition researcher.</div>"},
      {searchString: "Fenn", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/fEnHB9t.png> <div class=\"caption\">Frank Church’s top political advisor and a top opposition researcher.</div>"},
      
      {searchString: "Henry Kimelman", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/NDlQINB.png> <div class=\"caption\">Formerly a major McGovern '72 donor, he's enamored with hopeless causes and is now funneling cash into the Church campaign.</div>"},
      {searchString: "Kimelman", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/NDlQINB.png> <div class=\"caption\">Formerly a major McGovern '72 donor, he's enamored with hopeless causes and is now funneling cash into the Church campaign.</div>"},

      {searchString: "Mo Udall", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/Bi9fki7.png>  <div class=\"caption\">A one-eyed Sunbelt wonder who’s 6’5 in cowboy boots.</div>"},
      {searchString: "Udall", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/Bi9fki7.png>  <div class=\"caption\">A one-eyed Sunbelt wonder who’s 6’5 in cowboy boots.</div>"},
      {searchString: "Morris Udall", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/Bi9fki7.png>  <div class=\"caption\">A one-eyed Sunbelt wonder who’s 6’5 in cowboy boots.</div>"},

      {searchString: "Jimmy Carter", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/g39nYU9.png> <div class=\"caption\">Former Georgia Governor who’s as ruthless as they come.</div>"},
      {searchString: "Carter", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/g39nYU9.png> <div class=\"caption\">Former Georgia Governor who’s as ruthless as they come.</div>"},

      {searchString: "Morris Dees Jr", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/FCXWFma.png> <div class=\"caption\">The Carter campaign’s national finance chairman.</div>"},

      {searchString: "Carl Burke", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/TedJENn.png> <div class=\"caption\">Frank Church’s childhood best friend and current campaign manager.</div>"},
      {searchString: "Burke", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/TedJENn.png> <div class=\"caption\">Frank Church’s childhood best friend and current campaign manager.</div>"},
      
      {searchString: "Bethine", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/c0kle49.png> <div class=\"caption\">Idaho’s 3rd Senator and future President.</div>"},
      {searchString: "Bethine Church", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/c0kle49.png> <div class=\"caption\">Idaho’s 3rd Senator and future President.</div>"},
      
      {searchString: "Verda", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/3TX8m2i.png> <div class=\"caption\">Frank Church’s Chief of Staff and his second most important advisor.</div>"},
      {searchString: "Verda Barnes", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/3TX8m2i.png> <div class=\"caption\">Frank Church’s Chief of Staff and his second most important advisor.</div>"},
      {searchString: "Barnes", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/3TX8m2i.png> <div class=\"caption\">Frank Church’s Chief of Staff and his second most important advisor.</div>"},
      
      {searchString: "William Landau", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/YLJI7cm.png> <div class=\"caption\">Frank Church’s 1976 campaign treasurer.</div>"},
      {searchString: "Landau", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/YLJI7cm.png> <div class=\"caption\">Frank Church’s 1976 campaign treasurer.</div>"},
      {searchString: "Bill Landau", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/YLJI7cm.png> <div class=\"caption\">Frank Church’s 1976 campaign treasurer.</div>"},
      
      {searchString: "George McGovern", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/ve6cPSQ.png> <div class=\"caption\">Means well.</div>"},
      {searchString: "McGovern", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/ve6cPSQ.png> <div class=\"caption\">Means well.</div>"},
      
      {searchString: "Jerry Levinson", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/bV7pTzO.png> <div class=\"caption\">Often called “Church’s brain.” Despised by the CIA.</div>"},
      {searchString: "Levinson", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/bV7pTzO.png> <div class=\"caption\">Often called “Church’s brain.” Despised by the CIA.</div>"},
      
      {searchString: "James Baker", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/e7uUO4B.png> <div class=\"caption\">Gerald Ford’s campaign chairman and the man who beat Reagan.</div>"},
      {searchString: "Baker", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/e7uUO4B.png> <div class=\"caption\">Gerald Ford’s campaign chairman and the man who beat Reagan.</div>"},
      
      {searchString: "Donald Rumsfeld", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/rDH1LHd.png> <div class=\"caption\">Ford’s Defense Secretary and former Chief of Staff.</div>"},
      {searchString: "Rumsfeld", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/rDH1LHd.png> <div class=\"caption\">Ford’s Defense Secretary and former Chief of Staff.</div>"},
      {searchString: "Don", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/rDH1LHd.png> <div class=\"caption\">Ford’s Defense Secretary and former Chief of Staff.</div>"},
      
      {searchString: "Dick Cheney", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/SmuYOd8.png> <div class=\"caption\">Gerald Ford’s Chief of Staff and campaign manager.</div>"},
      {searchString: "Cheney", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/SmuYOd8.png> <div class=\"caption\">Gerald Ford’s Chief of Staff and campaign manager.</div>"},
      {searchString: "Diсk", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/SmuYOd8.png> <div class=\"caption\">Gerald Ford’s Chief of Staff and campaign manager.</div>"},
      
      {searchString: "Betty Ford", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/05QrLGe.png> <div class=\"caption\">38th President of the United States.</div>"},
      {searchString: "Betty", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/05QrLGe.png> <div class=\"caption\">38th President of the United States.</div>"},
      
      {searchString: "Jerry Falwell", explanationText: "<img src=https://itsastronomical.com/assets/1976YZ/imgur/IHBFgQg.png> <div class=\"caption\">Godfather of the Christian Right and founder of the Moral Majority.</div>"},      
];

RecReading = true;
   
// music player

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
  addSong(song) {
    this.songs.push(song);
  }
  getCurrentSong() {
    return this.songs[this.currentSongIndex];
  }
  playNext() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
  }
  playPrevious() {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
  }
}

window.Playlist = Playlist;
window.Song = Song;

const CONFIG = {
  footer: {
    id: "new_footer",
    mountStyle: {
      left: "265px",
      bottom: "10px",
      width: "340px",
      height: "220px",
      zIndex: "50"
    }
  },
  fixed: {
    left: 20,
    peekBottom: 28,
    zIndex: 9999
  },
  glide: {
    peekPx: -10,
    scaleClosed: 0.75,
    scaleOpen: 0.90,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    durationMs: 420
  },
  skin: {
    playing: "url('https://itsastronomical.com/assets/1976YZ/imgur/I7jF0Ak.gif')",
    paused: "url('https://itsastronomical.com/assets/1976YZ/imgur/Bui2rFO.png')"
  },
  responsive: {
    startScaleWidth: 1920,
    hideWidth: 800,
    minScale: 0.7,
    maxScale: 1.0
  },
  autoplayOnce: true
};

const Utils = {
  raf: () => new Promise(r => requestAnimationFrame(() => r())),
  
  clamp: (n, min, max) => Math.min(max, Math.max(min, n)),
  
  getTP: () => window.TapePlayer,
  
  ensureAudio: (tp) => tp?.audio || document.getElementById("audio"),
  
  ensureTapeRecorder: (tp) => tp?.tapeRecorder || document.getElementById("tape-recorder"),
  
  replaceWithClone: (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    return clone;
  }
};

function createDefaultPlaylist() {
  const playlist = new Playlist();
  
  const songs = [
    ["Finale and End Title", "David Shire", "presidents.jpg", "nnxw4l7ftP5lNgnrs0UtRH3BzGkVBacm"],
    ["Commission and Main Title", "Michael Small", "parallax.jpg", "uwTMFX0y7KOs4nk0OunAGTMFzm8ptUUl"],
    ["Condor!", "Dave Grusin", "condor.jpg", "kIAz2FWCgZKzjc4LPLkRzga5oMKVCvbI"],
    ["On the Streets", "Mikis Theodorakis", "serpico.jpg", "MICGkQ9DmOBWh4wiAXUMqqTPux81MCSi"],
    ["Love Theme", "Danny Zeitlin", "invasion.jpg", "PtKm1GYrHLutxDzXEYVbaRaz9lv4Y2XZ"]
  ];
  
  songs.forEach(([title, artist, cover, audio]) => {
    playlist.addSong(new Song(
      title,
      artist,
      `https://itsastronomical.com/assets/1976YZ/albums/${cover}`,
      `https://audio.jukehost.co.uk/${audio}`
    ));
  });
  
  return playlist;
}

function changePlaylist(newPlaylist, opts = {}) {
  window.TapePlayer = window.TapePlayer || {};
  window.TapePlayer.playlist = newPlaylist;
  window.TapePlayer.playlist.currentSongIndex = opts.startIndex ?? 0;

  let audio = document.getElementById("audio");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "audio";
    document.body.appendChild(audio);
  }
  window.TapePlayer.audio = audio;

  const song = window.TapePlayer.playlist.getCurrentSong();
  const nextSrc = song.getAudioLink?.() ?? song.audioLink ?? song.link ?? "";

  const wasPlaying = !audio.paused;
  const prevVol = audio.volume;

  audio.src = nextSrc;
  audio.load();
  audio.volume = prevVol;

  if (typeof window.TapePlayer.updateUI === "function") {
    window.TapePlayer.updateUI();
  }

  const shouldPlay = (opts.autoplay ?? wasPlaying);
  if (shouldPlay) {
    audio.play().catch(() => {});
  }
}

window.changePlaylist = changePlaylist;

function buildPlayerUI(tapeRecorder, playlist, audio) {
  const infoOverlay = document.createElement("div");
  infoOverlay.id = "info-overlay";

  const titleDiv = document.createElement("div");
  titleDiv.id = "track-title";

  const artistDiv = document.createElement("div");
  artistDiv.id = "track-artist";

  infoOverlay.appendChild(titleDiv);
  infoOverlay.appendChild(artistDiv);
  tapeRecorder.appendChild(infoOverlay);

  // Cover art
  const coverWrapper = document.createElement("div");
  coverWrapper.id = "cover-wrapper";
  tapeRecorder.appendChild(coverWrapper);

  const coverBG = document.createElement("img");
  coverBG.id = "cover-bg";
  coverBG.src = "https://itsastronomical.com/assets/1976YZ/imgur/E2mOaNa.png";

  const coverArt = document.createElement("img");
  coverArt.id = "cover-art";
  coverArt.src = playlist.getCurrentSong().getCoverLink();

  coverWrapper.appendChild(coverBG);
  coverWrapper.appendChild(coverArt);

  // Controls
  const playerBottom = document.createElement("div");
  playerBottom.id = "player-bottom";
  tapeRecorder.appendChild(playerBottom);

  const controlsOverlay = document.createElement("div");
  controlsOverlay.id = "controls-overlay";

  const prevButton = document.createElement("button");
  prevButton.id = "prev-button";
  prevButton.textContent = "←";

  const nextButton = document.createElement("button");
  nextButton.id = "next-button";
  nextButton.textContent = "→";

  const volumeSlider = document.createElement("input");
  volumeSlider.id = "volume-slider";
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "100";
  volumeSlider.value = String(Math.round((audio.volume || 0.5) * 100));

  const toggleButton = document.createElement("button");
  toggleButton.id = "toggle-button";

  const progressContainer = document.createElement("div");
  progressContainer.id = "progress-container";

  const progressBar = document.createElement("input");
  progressBar.id = "progress-bar";
  progressBar.type = "range";
  progressBar.min = 0;
  progressBar.value = 0;
  progressBar.step = 1;

  progressContainer.appendChild(progressBar);

  controlsOverlay.appendChild(prevButton);
  controlsOverlay.appendChild(nextButton);
  controlsOverlay.appendChild(volumeSlider);
  controlsOverlay.appendChild(toggleButton);

  playerBottom.appendChild(controlsOverlay);
  playerBottom.appendChild(progressContainer);

  return { titleDiv, artistDiv, coverArt, prevButton, nextButton, volumeSlider, toggleButton, progressBar };
}

function setupEventHandlers(tp, elements) {
  const { titleDiv, artistDiv, coverArt, prevButton, nextButton, volumeSlider, toggleButton, progressBar } = elements;
  const audio = Utils.ensureAudio(tp);
  const tr = Utils.ensureTapeRecorder(tp);
  
  if (!audio || !tr) return;

  tp.updateUI = function updateUI() {
    const pl = tp.playlist;
    const song = pl?.getCurrentSong?.() || pl?.songs?.[pl?.currentSongIndex || 0];
    if (!song) return;

    const title = song.getTitle?.() ?? song.title ?? "";
    const artist = song.getArtist?.() ?? song.artist ?? "";
    const cover = song.getCoverLink?.() ?? song.coverLink ?? "";

    const shadow = "text-shadow: 0 2px 0 rgba(0,0,0,1), 0 4px 0 rgba(0,0,0,1), 0 6px 6px rgba(0,0,0,0.95), 0 10px 12px rgba(0,0,0,0.9);";
    
    if (titleDiv) titleDiv.innerHTML = `<span style="${shadow}">${title}</span>`;
    if (artistDiv) artistDiv.innerHTML = `<span style="${shadow}">${artist}</span>`;
    if (coverArt && cover) coverArt.src = cover;

    tr.style.backgroundImage = audio.paused ? CONFIG.skin.paused : CONFIG.skin.playing;
    if (toggleButton) toggleButton.textContent = audio.paused ? "Start" : "Stop";
  };

  const refresh = () => tp.updateUI?.();

  // Play/pause button
  if (toggleButton && !toggleButton.__bound) {
    toggleButton.__bound = true;
    toggleButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      refresh();
    }, { passive: false });
  }

  // Previous button
  if (prevButton && !prevButton.__bound) {
    prevButton.__bound = true;
    prevButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pl = tp.playlist;
      if (!pl) return;

      pl.playPrevious();
      const s = pl.getCurrentSong();
      audio.src = s.getAudioLink?.() ?? s.audioLink ?? "";
      audio.currentTime = 0;
      audio.play().catch(() => {});
      refresh();
    }, { passive: false });
  }

  // Next button
  if (nextButton && !nextButton.__bound) {
    nextButton.__bound = true;
    nextButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const pl = tp.playlist;
      if (!pl) return;

      pl.playNext();
      const s = pl.getCurrentSong();
      audio.src = s.getAudioLink?.() ?? s.audioLink ?? "";
      audio.currentTime = 0;
      audio.play().catch(() => {});
      refresh();
    }, { passive: false });
  }

  // Volume slider
  if (volumeSlider && !volumeSlider.__bound) {
    volumeSlider.__bound = true;
    volumeSlider.addEventListener("input", function () {
      audio.volume = parseFloat(this.value) / 100;
    });
  }

  // Progress bar
  if (progressBar && !progressBar.__bound) {
    progressBar.__bound = true;
    progressBar.addEventListener("input", (e) => {
      audio.currentTime = parseFloat(e.target.value);
    });
  }

  // Audio events
  if (!audio.__eventsbound) {
    audio.__eventsbound = true;

    audio.addEventListener("play", refresh);
    audio.addEventListener("pause", refresh);
    audio.addEventListener("loadeddata", refresh);

    audio.addEventListener("timeupdate", () => {
      const pb = document.getElementById("progress-bar");
      if (!pb || !audio.duration || isNaN(audio.duration)) return;
      pb.max = audio.duration;
      pb.value = audio.currentTime;
    });

    audio.addEventListener("ended", () => {
      const pl = tp.playlist;
      if (!pl) return;
      pl.playNext();
      const s = pl.getCurrentSong();
      audio.src = s.getAudioLink?.() ?? s.audioLink ?? "";
      audio.currentTime = 0;
      audio.play().catch(() => {});
      refresh();
    });
  }

  refresh();
}

function setUndockedFixed(tr) {
  if (!tr) return;
  if (tr.parentNode !== document.body) document.body.appendChild(tr);
  
  tr.style.position = "fixed";
  tr.style.left = CONFIG.fixed.left + "px";
  tr.style.bottom = CONFIG.fixed.peekBottom + "px";
  tr.style.zIndex = String(CONFIG.fixed.zIndex);
  tr.style.pointerEvents = "auto";
}

function ensureMountScaffold(footerEl) {
  let tapeMount = document.getElementById("tape-mount");
  if (!tapeMount) {
    tapeMount = document.createElement("div");
    tapeMount.id = "tape-mount";
    tapeMount.style.position = "absolute";
    tapeMount.style.pointerEvents = "auto";
  }
  
  Object.assign(tapeMount.style, {
    left: CONFIG.footer.mountStyle.left,
    bottom: CONFIG.footer.mountStyle.bottom,
    width: CONFIG.footer.mountStyle.width,
    height: CONFIG.footer.mountStyle.height,
    zIndex: CONFIG.footer.mountStyle.zIndex
  });

  if (tapeMount.parentElement !== footerEl) footerEl.appendChild(tapeMount);

  let tapeGlider = document.getElementById("tape-glider");
  if (!tapeGlider) {
    tapeGlider = document.createElement("div");
    tapeGlider.id = "tape-glider";
    Object.assign(tapeGlider.style, {
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "0",
      pointerEvents: "auto",
      willChange: "transform",
      transition: `transform ${CONFIG.glide.durationMs}ms ${CONFIG.glide.easing}`
    });
    tapeMount.appendChild(tapeGlider);
  } else if (tapeGlider.parentElement !== tapeMount) {
    tapeMount.appendChild(tapeGlider);
  }

  let tapeHandle = document.getElementById("tape-handle");
  if (!tapeHandle) {
    tapeHandle = document.createElement("div");
    tapeHandle.id = "tape-handle";
    Object.assign(tapeHandle.style, {
      position: "absolute",
      left: "0",
      right: "0",
      top: "-18px",
      height: "18px",
      cursor: "ns-resize",
      background: "transparent",
      pointerEvents: "auto"
    });
    tapeGlider.appendChild(tapeHandle);
  } else if (tapeHandle.parentElement !== tapeGlider) {
    tapeGlider.appendChild(tapeHandle);
  }

  return { tapeMount, tapeGlider, tapeHandle };
}

async function initHoverGlide(tapeGlider, tapeHandle) {
  if (!tapeGlider || tapeGlider.dataset.inited === "1") return;
  tapeGlider.dataset.inited = "1";

  await Utils.raf();
  await Utils.raf();

  const rect = tapeGlider.getBoundingClientRect();
  const h = rect.height || 220;
  const hidePx = Math.max(0, h - CONFIG.glide.peekPx);

  const prevTransition = tapeGlider.style.transition;
  tapeGlider.style.transition = "none";
  tapeGlider.style.transform = `scale(${CONFIG.glide.scaleClosed}) translateY(${hidePx}px)`;
  tapeGlider.getBoundingClientRect();
  tapeGlider.style.transition = prevTransition || `transform ${CONFIG.glide.durationMs}ms ${CONFIG.glide.easing}`;

  const openTape = () => (tapeGlider.style.transform = `scale(${CONFIG.glide.scaleOpen}) translateY(0px)`);
  const closeTape = () => (tapeGlider.style.transform = `scale(${CONFIG.glide.scaleClosed}) translateY(${hidePx}px)`);

  if (!tapeGlider.__hoverBound) {
    tapeGlider.__hoverBound = true;
    tapeGlider.addEventListener("mouseenter", openTape);
    tapeGlider.addEventListener("mouseleave", closeTape);
    tapeHandle.addEventListener("mouseenter", openTape);
    tapeHandle.addEventListener("mouseleave", closeTape);
  }

  closeTape();
}

function updateResponsiveScale() {
  const tr = document.getElementById("tape-recorder");
  if (!tr) return;

  const mounted = !!document.getElementById("tape-mount");
  if (mounted) {
    tr.style.transform = "";
    tr.style.transformOrigin = "";
    tr.style.opacity = "";
    tr.style.pointerEvents = "";
    return;
  }

  const w = window.innerWidth;
  
  const t = Utils.clamp(
    (w - CONFIG.responsive.hideWidth) / (CONFIG.responsive.startScaleWidth - CONFIG.responsive.hideWidth),
    0,
    1
  );

  const scale = CONFIG.responsive.minScale + (t * (CONFIG.responsive.maxScale - CONFIG.responsive.minScale));
  const translateY = (1 - scale) * 160;

  tr.style.transformOrigin = "bottom left";
  tr.style.transform = `scale(${scale}) translateY(${translateY}px)`;
  tr.style.opacity = scale <= 0.05 ? "0" : "1";
  tr.style.pointerEvents = scale <= 0.05 ? "none" : "auto";
}

function initializeTapePlayer() {
  if (window.TapePlayer?.ready) return window.TapePlayer;

  const playlist = createDefaultPlaylist();

  let audio = document.getElementById("audio");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "audio";
    document.body.appendChild(audio);
  }
  if (!audio.src) audio.src = playlist.getCurrentSong().getAudioLink();

  let tapeRecorder = document.getElementById("tape-recorder");
  if (!tapeRecorder) {
    tapeRecorder = document.createElement("div");
    tapeRecorder.id = "tape-recorder";
    Object.assign(tapeRecorder.style, {
      width: "495px",
      height: "325px",
      transform: "scale(0.85)",
      backgroundPosition: "center",
      backgroundSize: "cover",
      position: "fixed",
      left: CONFIG.fixed.left + "px",
      bottom: "-260px",
      zIndex: String(CONFIG.fixed.zIndex),
      transition: `bottom ${CONFIG.glide.durationMs}ms ${CONFIG.glide.easing}`,
      display: "block",
      margin: "0 auto"
    });
    document.body.appendChild(tapeRecorder);
  }

  const alreadyBuilt = tapeRecorder.querySelector("#player-bottom");
  let elements;

  if (!alreadyBuilt) {
    elements = buildPlayerUI(tapeRecorder, playlist, audio);
  } else {
    elements = {
      titleDiv: document.getElementById("track-title"),
      artistDiv: document.getElementById("track-artist"),
      coverArt: document.getElementById("cover-art"),
      prevButton: document.getElementById("prev-button"),
      nextButton: document.getElementById("next-button"),
      volumeSlider: document.getElementById("volume-slider"),
      toggleButton: document.getElementById("toggle-button"),
      progressBar: document.getElementById("progress-bar")
    };
  }

  window.TapePlayer = {
    ready: true,
    playlist,
    audio,
    tapeRecorder,
    updateUI: null,

    attachTo(mountEl) {
      if (!mountEl) return false;
      mountEl.appendChild(tapeRecorder);
      tapeRecorder.style.position = "absolute";
      tapeRecorder.style.left = "0px";
      tapeRecorder.style.bottom = "0px";
      tapeRecorder.style.zIndex = "10";
      this.updateUI?.();
      return true;
    }
  };

  setupEventHandlers(window.TapePlayer, elements);

  if (CONFIG.autoplayOnce && !window.__TapeAutoplayDone) {
    window.__TapeAutoplayDone = true;
    audio.play().catch(() => {});
  }

  return window.TapePlayer;
}

function initAutoMount() {
  let scheduled = false;
  let lastAttachTarget = null;

  function reconcile() {
    scheduled = false;

    const tp = Utils.getTP();
    if (!tp) return;

    const audio = Utils.ensureAudio(tp);
    const tr = Utils.ensureTapeRecorder(tp);
    if (!audio || !tr) return;

    const footerEl = document.getElementById(CONFIG.footer.id);

    if (footerEl) {
      const { tapeGlider, tapeHandle } = ensureMountScaffold(footerEl);

      if (tp.ready && typeof tp.attachTo === "function" && lastAttachTarget !== tapeGlider) {
        lastAttachTarget = tapeGlider;
        tp.attachTo(tapeGlider);
      } else if (tr.parentElement !== tapeGlider) {
        tapeGlider.appendChild(tr);
      }

      tr.style.pointerEvents = "auto";
      initHoverGlide(tapeGlider, tapeHandle).catch(() => {});
    } else {
      lastAttachTarget = null;
      setUndockedFixed(tr);
    }
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(reconcile);
  }

  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type !== "childList") continue;
      const nodes = [...m.addedNodes, ...m.removedNodes];
      for (const n of nodes) {
        if (!n || n.nodeType !== 1) continue;
        const el = n;
        if (
          el.id === CONFIG.footer.id ||
          el.id === "tape-recorder" ||
          el.id === "tape-mount" ||
          el.id === "tape-glider" ||
          el.querySelector?.(`#${CONFIG.footer.id}`) ||
          el.querySelector?.("#tape-recorder") ||
          el.querySelector?.("#tape-mount") ||
          el.querySelector?.("#tape-glider")
        ) {
          schedule();
          return;
        }
      }
    }
  });

  obs.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("resize", () => {
    const tg = document.getElementById("tape-glider");
    if (tg) tg.dataset.inited = "";
    schedule();
  }, { passive: true });

  schedule();

  return {
    stop: () => obs.disconnect(),
    sync: () => schedule()
  };
}

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    label { display: inline-block; }
    
    .mytooltip, .inner_window_question h3 .mytooltip {
      position: relative; display: inline-block; cursor: pointer; text-decoration: none;
      background: linear-gradient(180deg, rgba(255, 235, 59, 0) 45%, rgba(255, 235, 59, 0.9) 45%, rgba(255, 235, 59, 0.9) 90%, rgba(255, 235, 59, 0) 90%);
      padding: 0 4px;
    }
    
    .mytooltip::after, .inner_window_question h3 .mytooltip::after {
      content: ""; position: absolute; left: -3px; right: -3px; bottom: 0.15em; height: 0.9em;
      background: rgba(255, 235, 59, 0.7); border-radius: 0.6em 0.4em 0.6em 0.4em;
      filter: blur(0.7px); transform: rotate(-0.6deg); z-index: -1; pointer-events: none;
    }

    .mytooltip .mytooltiptext {
      position: fixed; z-index: 999999; width: 260px; background: #fff;
      border: 1px solid rgba(0,0,0,0.55); box-shadow: 0 8px 22px rgba(0,0,0,0.35);
      border-radius: 2px; padding: 12px 12px 18px 12px; opacity: 0;
      pointer-events: none; transition: opacity 0.2s; font-size: 13px; line-height: 1.35em;
    }
    
    .mytooltip .mytooltiptext img {
      width: 100%; max-width: 100%; height: auto; display: block; background: #f3f3f3;
      border: 1px solid rgba(0,0,0,0.18); border-radius: 2px; max-height: 220px; object-fit: contain;
    }
    
    .mytooltip .mytooltiptext .caption, .mytooltip .mytooltiptext p,
    .mytooltip .mytooltiptext span, .mytooltip .mytooltiptext div {
      margin: 0 !important; text-align: center;
    }
    
    .mytooltip:hover .mytooltiptext { opacity: 1; transition-delay: 0.5s; }

    #new_footer {
      position: relative; width: 100%; display: flex; justify-content: center;
      align-items: center; padding: 0 !important; margin: 0 !important; gap: 0px;
      transform: translateY(22px);
    }

    #candidate_container { width: 354px; height: 272px; margin: 0; padding: 0; flex-shrink: 0; }
    #ques_banner { width: 260px; height: 272px; margin: 0 3px; padding: 0; flex-shrink: 0; }
    #new_footer > div:last-child { width: 341px; height: 253px; margin: 0; padding: 0; flex-shrink: 0; }
    #new_footer img { display: block; margin: 0; padding: 0; }
    #new_footer * { box-sizing: border-box; }

    #game_window {
      display: flex; flex-direction: column; height: 648px !important;
      width: 970px !important; position: relative !important; overflow: hidden !important;
    }

    #inner_window_1 { height: 42%; }
    #inner_window_1, #inner_window_2, #inner_window_3, #inner_window_4 { overflow: auto; }
    #inner_window_2, #inner_window_3 { height: 82%; }
    #inner_window_3 { overflow: hidden !important; }

    #below_header, #inner_window_2, #inner_window_3, #inner_window_4 {
      min-width: 968px; min-height: 549px; max-width: 968px; max-height: 549px;
      margin: auto;
    }

    .inner_window_question {
      height: 314px !important; margin-bottom: -45px !important;
      background-image: url('https://itsastronomical.com/assets/1976YZ/imgur/uFZzk4y.png');
    }
    
    .inner_inner_window h3 {
      min-width: 940px; background-color: rgba(0, 0, 0, 0.1); color: black;
      border: 1px solid #494949; outline: none !important;
      padding: 8px 12px; margin-left: -1px; margin-top: -1px;
    }

    #question_form p { margin: 0.15em 0 !important; }
    #question_form br { display: none !important; }
    #question_form input[type="radio"] { float: left; margin: 0.02em 6px 0 0; }
    
    #question_form input[type="radio"] + label {
      display: block; margin-left: 20px; line-height: 1.0; cursor: pointer; font-size: 13px;
      -webkit-box-decoration-break: clone; box-decoration-break: clone; padding: 0.02em 0.1em;
      background-image: linear-gradient(to right, rgba(255, 215, 0, 0.65), rgba(255, 215, 0, 0.65));
      background-repeat: no-repeat; background-size: 0% 100%; background-position: left center;
      border-radius: 4px; transition: background-size 420ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    #question_form input[type="radio"] + label:hover,
    #question_form input[type="radio"] + label:focus,
    #question_form input[type="radio"]:checked + label {
      background-size: 100% 100%; outline: none; font-size: 12px;
    }

    #question_form input[type="radio"] + label::after { content: ""; display: table; clear: both; }
    .inner_inner_window { min-height: 264px !important; }
    .inner_window_question p { margin-top: 0px !important; }

    #tape-recorder {
      width: 495px; height: 325px; transform: scale(0.85);
      background-position: center; background-size: cover;
      position: absolute; display: block; margin: 0 auto;
    }
    
    #info-overlay {
      position: absolute; top: 10px; left: 10px; color: #fff;
      font-family: sans-serif; text-shadow: 1px 1px 2px black;
    }
    
    #track-title { font-size: 18px; font-weight: bold; }
    #track-artist { font-size: 14px; margin-top: 3px; }
    
    #cover-wrapper {
      position: absolute; bottom: 10px; left: 50%;
      transform: translateX(-50%); z-index: 1; pointer-events: none;
    }
    
    #cover-bg {
      position: absolute; width: 200px; bottom: 0;
      left: 50%; transform: translateX(-50%);
    }
    
    #cover-art {
      position: absolute; width: 180px; bottom: 50px;
      left: 50%; transform: translateX(-50%);
    }
    
    #player-bottom {
      position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2;
    }
    
    #controls-overlay {
      display: flex; flex-direction: row; align-items: center; gap: 10px;
    }
    
    #prev-button, #next-button, #toggle-button {
      appearance: auto; font: normal 1rem inherit; color: buttontext;
      text-align: center; cursor: pointer; background-color: buttonface;
      margin: 0; border: 2px outset buttonborder; padding: 6px 10px; min-width: 60px;
    }
    
    #prev-button:hover, #next-button:hover, #toggle-button:hover {
      border-style: inset; background-color: #e0e0e0;
    }
    
    #volume-slider {
      -webkit-appearance: none; appearance: none; width: 100px; height: 14px;
      background-color: buttonface; border: 2px solid buttonborder;
      border-radius: 0; margin: 0; padding: 0; cursor: pointer;
    }
    
    #volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 14px; height: 24px;
      background: buttonface; border: 2px solid buttonborder;
      border-radius: 0; cursor: pointer; margin-top: -5px;
    }
    
    #volume-slider::-moz-range-thumb {
      width: 14px; height: 24px; background: buttonface;
      border: 2px solid buttonborder; border-radius: 0; cursor: pointer;
    }
    
    #progress-container {
      display: flex; flex-direction: row; width: 100%; justify-content: center;
    }
    
    #progress-bar {
      -webkit-appearance: none; appearance: none; width: 200px; height: 14px;
      background-color: #515151; border: 2px solid buttonborder;
      border-radius: 0; margin: 0; padding: 0; cursor: pointer;
    }
    
    #progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none; width: 14px; height: 24px;
      background: #d0d0d0; border: 2px solid buttonborder;
      border-radius: 0; cursor: pointer; margin-top: -5px;
    }
    
    #progress-bar::-moz-range-thumb {
      width: 14px; height: 24px; background: #d0d0d0;
      border: 2px solid buttonborder; border-radius: 0; cursor: pointer;
    }
    
    #bonus_menu_area { margin-top: 120px; }
    
    #tape-mount { pointer-events: auto !important; background: transparent !important; }
    #tape-glider, #tape-recorder { pointer-events: auto !important; }
    #tape-recorder * { pointer-events: auto !important; }
    #toggle-button, #prev-button, #next-button { pointer-events: auto !important; }
  `;
  document.head.appendChild(style);
}

injectStyles();

document.addEventListener("mousemove", e => {
  const tip = document.querySelector(".mytooltip:hover .mytooltiptext");
  if (!tip) return;
  tip.style.left = e.clientX + 12 + "px";
  tip.style.top = e.clientY + 18 + "px";
});

initializeTapePlayer();
window.__TapeController = initAutoMount();

window.addEventListener("resize", updateResponsiveScale, { passive: true });
setInterval(updateResponsiveScale, 350);
requestAnimationFrame(updateResponsiveScale);

// this is for the candidate selector screen
function enableCandidatePhotoPile() {
  const STYLE_ID = "ct_candidate_pile_styles";
  const ROOT_UNDER_ID = "ct_candidate_pile_root_under";
  const ROOT_TOP_ID = "ct_candidate_pile_root_top";

  const raf = () => new Promise(r => requestAnimationFrame(r));
  const doubleRaf = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  const injectStylesOnce = () => {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
        #visit_window { height: auto; }
        #visit_content { height: 79%; }
        @keyframes show { 0% { opacity: 0; } 100% { opacity: 1; } }
        
        #election_night_window img, #visit_content img {
            opacity: 0.95; width: 260px; height: auto;
            border: 1px solid transparent; outline: 1px solid #201F1A;
            box-shadow: none !important;
        }

        .overlay_window {
            border: none !important; top: 23px !important; opacity: 0; 
            animation: show 150ms ease-in-out forwards;
        }

        #inner_window_3 { position: relative !important; overflow: hidden !important; }
        #inner_window_3 #candidate_form { display: none !important; }

        #inner_window_3 #candidate_description_window {
            width: 736px !important; height: 493px !important;
            overflow: auto !important; padding: 18px 70px !important;
            box-sizing: border-box !important; position: relative !important;
            left: 179px; z-index: 2 !important;
            background-image: url('https://i.imgur.com/r3aVu5z.png');
            white-space: normal !important; overflow-wrap: break-word !important;
        }

        .ctRedactWord { white-space: nowrap; }
        .ctRedactChar {
            background: #000; color: transparent;
            transition: background-color 350ms linear, color 350ms linear;
            transition-delay: var(--d, 0ms); 
        }
        .ctRedactReveal .ctRedactChar { background-color: transparent; color: inherit; }

        #${ROOT_UNDER_ID} {
            position: absolute; left: 18px; top: 68px; width: 260px; height: 520px;
            z-index: 1; pointer-events: none;
        }
        #${ROOT_TOP_ID} {
            position: absolute; left: 18px; top: 28px; width: 260px; height: 520px;
            z-index: 6; pointer-events: none;
        }

        .ctPileCard {
            position: absolute; left: 0; top: 0; width: 240px; height: 286px;
            transform-origin: 50% 80%; cursor: pointer; pointer-events: auto;
            border-radius: 0; background: white; padding: 8px;
            box-sizing: border-box; box-shadow: 0 10px 22px rgba(0,0,0,0.25);
            /* Standard transition for hover/blur effects */
            transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms ease;
            will-change: transform;
        }
        .ctPileCard img { width: 100%; height: 100%; display: block; object-fit: cover; }
        .ctPileCard.ctBlur { filter: blur(1.35px) saturate(0.92) brightness(0.92); }
        .ctPileCard.ctTop { filter: none; }
        
        .ctPileClip {
            position: absolute; width: 64px; height: 64px; left: 10px; top: -8px;
            z-index: 50; pointer-events: none; background-repeat: no-repeat;
            background-size: contain; background-position: center; transform: rotate(-6deg);
        }

        .ctMetaLine {
             font-family: "Special Elite", "Courier Prime", "Courier New", monospace;
             font-size: 18px; font-weight: 700; margin-bottom: 10px;
        }
    `;
    document.head.appendChild(s);
  };

  const normalizeDescNode = (descNode) => {
    if (!descNode) return;
    descNode.querySelectorAll("#candidate_image").forEach(el => el.remove());
    const ul = descNode.querySelector("ul");
    if (ul) {
      const txt = Array.from(ul.querySelectorAll("li")).map(li => li.textContent.replace(/^.*?:/, "").trim()).join(" | ");
      const line = document.createElement("div");
      line.className = "ctMetaLine";
      line.textContent = txt;
      ul.replaceWith(line);
    }
    const inner = descNode.querySelector("#candidate_summary > div[style*='height']");
    if (inner) { inner.style.height = "auto"; inner.style.overflow = "visible"; }
  };

  const applyUnredactEffect = (descEl) => {
    if (!descEl) return;
    const meta = descEl.querySelector(".ctMetaLine");
    const walker = document.createTreeWalker(descEl, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
            if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            if (n.parentElement.closest(".ctMetaLine") || n.parentElement.closest("button")) return NodeFilter.FILTER_REJECT;
            if (meta && (meta.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING) === 0) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    
    const totalLength = nodes.reduce((acc, n) => acc + n.nodeValue.length, 0);
    const interval = Math.max(1.75, Math.min(12, 2000 / (totalLength || 1)));

    let charIndex = 0;
    for (const n of nodes) {
        const frag = document.createDocumentFragment();
        const parts = n.nodeValue.split(/(\s+)/);
        for (const part of parts) {
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
            const span = document.createElement("span");
            span.className = "ctRedactWord";
            for (const char of part) {
                const s = document.createElement("span");
                s.className = "ctRedactChar";
                s.textContent = char;
                s.style.setProperty('--d', (charIndex++ * interval).toFixed(1) + 'ms');
                span.appendChild(s);
            }
            frag.appendChild(span);
        }
        n.parentNode.replaceChild(frag, n);
    }
  };

  const buildCandidateCache = async (inner) => {
    const sel = inner.querySelector("#candidate_id");
    const desc = inner.querySelector("#candidate_description_window");
    if (!sel || !desc) return null;
    
    const prevVis = inner.style.visibility;
    inner.style.visibility = "hidden";
    
    const cache = [];
    const opts = Array.from(sel.options);
    const orig = sel.value;

    for (const opt of opts) {
      sel.value = opt.value;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      await raf(); await raf();
      
      const clone = desc.cloneNode(true);
      normalizeDescNode(clone);
      cache.push({ 
          id: opt.value, 
          name: opt.textContent, 
          imgSrc: (desc.querySelector("img")?.src || ""), 
          descHTML: clone.innerHTML 
      });
    }

    sel.value = orig;
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    await raf(); await raf();
    inner.style.visibility = prevVis;
    return cache;
  };

  const ensurePile = async () => {
    const inner = document.querySelector("#inner_window_3");
    if (!inner || inner.dataset.ctPileBuilt) return;
    inner.dataset.ctPileBuilt = "true";

    injectStylesOnce();
    const sel = inner.querySelector("#candidate_id");
    const cache = await buildCandidateCache(inner);
    if (!cache) return;

    const clipSrc = (window.ctCandidatePileClipSrc || "").trim();
    [...cache.map(c => c.imgSrc), clipSrc].forEach(s => s && (new Image().src = s));

    const underRoot = document.createElement("div"); underRoot.id = ROOT_UNDER_ID;
    const topRoot = document.createElement("div"); topRoot.id = ROOT_TOP_ID;
    inner.appendChild(underRoot); inner.appendChild(topRoot);

    const cards = new Map();
    const currentId = sel.value;
    const ordered = [...cache];
    const topIdx = ordered.findIndex(c => c.id === currentId);
    if (topIdx > -1) ordered.unshift(...ordered.splice(topIdx, 1));

    const frag = document.createDocumentFragment();
    ordered.forEach(c => {
        const d = document.createElement("div");
        d.className = "ctPileCard";
        d.dataset.cid = c.id;
        d.innerHTML = `<img src="${c.imgSrc}" alt="${c.name}">`;
        frag.appendChild(d);
        cards.set(c.id, d);
    });
    underRoot.appendChild(frag);

    const clip = document.createElement("div");
    clip.className = "ctPileClip";
    if (clipSrc) clip.style.backgroundImage = `url("${clipSrc}")`;
    topRoot.appendChild(clip);

    const renderLayout = () => {
        const top = topRoot.querySelector(".ctPileCard") || underRoot.querySelector(".ctPileCard");
        if (top && top.parentElement !== topRoot) topRoot.insertBefore(top, clip);
        
        if (top) {
            top.className = "ctPileCard ctTop";
            top.style.transform = `translate(0px, 0px) rotate(-7deg)`;
            top.style.zIndex = "1000";
        }

        let i = 0;
        for (const child of underRoot.children) {
            if (!child.classList.contains("ctPileCard")) continue;
            child.className = "ctPileCard ctBlur";
            child.style.transform = `translate(${(i+1)*2}px, ${(i+1)*56}px) rotate(-11deg)`;
            child.style.zIndex = String(900 - i);
            i++;
        }
        clip.style.display = (clipSrc && top) ? "block" : "none";
    };

    const setDescription = (id) => {
        const desc = inner.querySelector("#candidate_description_window");
        const data = cache.find(c => c.id === id);
        if (!desc || !data) return;
        
        desc.classList.remove("ctRedactReveal");
        desc.innerHTML = data.descHTML;
        applyUnredactEffect(desc);
        void desc.offsetWidth;
        requestAnimationFrame(() => desc.classList.add("ctRedactReveal"));
    };

    const flipToTop = async (id) => {
        const card = cards.get(id);
        const topCard = topRoot.querySelector(".ctPileCard");
        if (!card || (topCard && topCard.dataset.cid === id)) return;

        const all = [...cards.values()];
        const firsts = all.map(el => el.getBoundingClientRect());

        if (topCard) underRoot.prepend(topCard);
        topRoot.insertBefore(card, clip);
        
        if (sel) { sel.value = id; sel.dispatchEvent(new Event("change", { bubbles: true })); }
        setDescription(id);

        renderLayout();

        const lasts = all.map(el => el.getBoundingClientRect());
        
        all.forEach((el, i) => {
            const dx = firsts[i].left - lasts[i].left;
            const dy = firsts[i].top - lasts[i].top;
            
            el.style.transition = "none";
            el.style.transform = `${el.style.transform} translate(${dx}px, ${dy}px)`;
        });

        void document.body.offsetWidth; 
        
        setTimeout(() => {
            all.forEach(el => {
                el.style.transition = "";
                if (el.parentElement === topRoot) {
                    el.style.transform = `translate(0px, 0px) rotate(-7deg)`;
                } else {
                    const idx = Array.from(underRoot.children).indexOf(el);
                    el.style.transform = `translate(${(idx+1)*2}px, ${(idx+1)*56}px) rotate(-11deg)`;
                }
            });
        }, 20);
    };

    setDescription(sel.value);
    renderLayout();

    let locked = false;
    const onClick = (e) => {
        const t = e.target.closest(".ctPileCard");
        if (!t || locked) return;
        locked = true;
        flipToTop(t.dataset.cid).finally(() => setTimeout(() => locked = false, 560));
    };

    topRoot.addEventListener("click", onClick);
    underRoot.addEventListener("click", onClick);
    sel.addEventListener("change", (e) => {
        if(e.isTrusted && !locked) {
            const id = sel.value;
            if(topRoot.querySelector(".ctPileCard")?.dataset.cid !== id) {
                locked = true;
                flipToTop(id).finally(() => setTimeout(() => locked = false, 560));
            }
        }
    });
  };

  const obs = new MutationObserver((mutations) => {
     for(const m of mutations) if(m.type==='childList' && document.getElementById("inner_window_3")) ensurePile();
  });
  obs.observe(document.body, { childList: true, subtree: true });
  if (document.querySelector("#inner_window_3")) ensurePile();
}

enableCandidatePhotoPile();