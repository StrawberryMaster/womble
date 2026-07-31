e = campaignTrail_temp;

            nct_stuff.themes[nct_stuff.selectedTheme].coloring_title = "#ff9600";

            nct_stuff.themes[nct_stuff.selectedTheme].coloring_window = "#ffffff";

            document.getElementsByClassName("game_header")[0].style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_title;

            $("#game_window")[0].style.backgroundColor = nct_stuff.themes[nct_stuff.selectedTheme].coloring_window;

            $(".container")[0].style.backgroundColor = "#00a000";

            document.getElementById("header").src = "https://file.garden/amaRjklJVCxI5kHj/Banner.jpg";

            document.body.background = "https://file.garden/amaRjklJVCxI5kHj/constitution.jpg";

            e.election_json = [{"model":"campaign_trail.election","pk":14,"fields":{"year":1916,"summary":"It is now time for the 1932 Irish General Election.  The issues of the day are your standard economic and social issues, as well as the legacy of the War of Independence and Civil War, the IRA, and the Anglo-Irish Treaty of 1922.<li>Eamon de Valera was the President of the Irish Republic during the War of Independence and the Irish CIvil War.  He is the leader of Fianna Fáil, a christian democratic party.</li><li>W.T. Cosgrave is the incumbent President of the Executive Council.  He is leader of Cumann na nGaedheal, a conservative party.</li>","image_url":"https://file.garden/amaRjklJVCxI5kHj/30bffb4a76487034fd2524bb3a16aea5.jpg","winning_electoral_vote_number":270,"advisor_url":"https://file.garden/amaRjklJVCxI5kHj/Puvis_de_Chavannes_Aisling.jpg","recommended_reading":"<ul>\n<li><a href=https://www.chicagotribune.com/opinion/editorials/ct-edit-chicago-tribune-biden-endorsement-20200925-lnyxsb5qvrftnjjmj3rnzj33jy-story.html>Our Case For Joe Biden</a></li>\n<li><a href=https://nationalinterest.org/feature/case-trump-166808>The Case For Trump</a></li>\n<li><a href=https://www.npr.org/2020/11/18/935730100/how-biden-won-ramping-up-the-base-and-expanding-margins-in-the-suburbs>How Biden Won: Ramping Up The Base And Expanding Margins In The Suburbs</a></li>\n<li><a href=https://www.prospectmagazine.co.uk/politics/donald-trump-joe-biden-us-election-almost-win-votes-concede>Why Did Trump Almost Win?</a></li>\n<li><a href=https://www.hoover.org/research/no-evidence-voter-fraud-guide-statistical-claims-about-2020-election>No Evidence For Voter Fraud: A Guide To Statistical Claims About The 2020 Election</a></li>\n</ul>","has_visits":1,"no_electoral_majority_image":"../static/images/2012-no-majority.jpg"}}];e.temp_election_list = [{"id":14,"year":1916,"is_premium":0,"display_year":"1932 Ireland"}];e.credits = "u/BlueWolf934";e.global_parameter_json = [{"model":"campaign_trail.global_parameter","pk":1,"fields":{"vote_variable":1.125,"max_swing":0.12,"start_point":0.94,"candidate_issue_weight":10,"running_mate_issue_weight":3,"issue_stance_1_max":-0.71,"issue_stance_2_max":-0.3,"issue_stance_3_max":-0.125,"issue_stance_4_max":0.125,"issue_stance_5_max":0.3,"issue_stance_6_max":0.71,"global_variance":0.01,"state_variance":0.005,"question_count":15,"default_map_color_hex":"#C9C9C9","no_state_map_color_hex":"#999999"}}];e.candidate_json = [{"model":"campaign_trail.candidate","pk":142,"fields":{"first_name":"","last_name":"Fianna Fáil","election":14,"party":"","state":"","priority":1,"description":"<b><li>Party: Fianna Fáil</li><li>Abbreviation: FF</li><li>Ideology: Christian Democracy</li></b>Fianna Fáil (translating to Warriors of Destiny) was founded in 1926 as a faction of Sinn Féin who decided to take their seats in the Dáil of the Irish Free State.  Led by Eamon de Valera, an American born republican leader, is a christian democratic party.  They seek to enter government for the first time in the decade-long history of the Irish Free State.","color_hex":"#006400","secondary_color_hex":null,"is_active":1,"image_url":"https://file.garden/amaRjklJVCxI5kHj/ff32b.jpg","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":null,"candidate_score":1,"running_mate":false,"scrollable":false}},{"model":"campaign_trail.candidate","pk":1002,"fields":{"first_name":"Éamon","last_name":"de Valera","election":14,"party":"Fianna Fáil","state":"Clare","priority":1,"description":"Former president of the Irish Republic during the Irish War of Independence, Eamon de Valera leads Fianna Fáil into the 1932 election.  A veteran of the 1916 Easter Rising, de Valera has a long history with the IRA, even leading them in the Irish Civil War.<br>de Valera is a christian democrat who seeks to keep in with social traditions, while expanding the welfare state.  Fianna Fáil has drawn criticism of socialism, but de Valera denies any such accusations. ","color_hex":"#006400","secondary_color_hex":null,"is_active":0,"image_url":"https://file.garden/amaRjklJVCxI5kHj/Eamon_de_Valera.jpg","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":"Former president of the Irish Republic during the Irish War of Independence, Eamon de Valera leads Fianna Fáil into the 1932 election.  A veteran of the 1916 Easter Rising, de Valera has a long history with the IRA, even leading them in the Irish Civil War.<br>de Valera is a christian democrat who seeks to keep in with social traditions, while expanding the welfare state.  Fianna Fáil has drawn criticism of socialism, but de Valera denies any such accusations. ","candidate_score":1,"running_mate":true,"scrollable":false,"partner":"0"}},{"model":"campaign_trail.candidate","pk":143,"fields":{"first_name":"","last_name":"Cumann na nGaedheal","election":14,"party":"Cumann na nGaedheal","state":"","priority":1,"description":"<b><li>Party: Cumann na nGaedheal</li><li>Abbreviation: CnanG</li><li>Ideology: Conservatism</li></b>Cumann na nGaedheal (Translating to Society of the Gaels), founded in 1923, was created as a splinter from Sinn Féin as the pro-treaty wing of Sinn Féin.  Liberal on economic policy, CnanG have stood in government since the beginning of the Irish Free State.","color_hex":"#0000ff","secondary_color_hex":null,"is_active":1,"image_url":"https://file.garden/amaRjklJVCxI5kHj/Shadow_of_the_Gunman_poster.jpg","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":null,"candidate_score":1,"running_mate":false,"scrollable":false}},{"model":"campaign_trail.candidate","pk":1004,"fields":{"first_name":"W.T.","last_name":"Cosgrave","election":14,"party":"Cumann na nGaedheal","state":"Cork Borough","priority":1,"description":"W.T. Cosgrave has been the President of the Executive Council since 1922.  Cosgrave served as a captain under Éamonn Ceannt during the Easter Rising, being sentenced to death, before it was commuted to life, later being released.<br>Cumann na nGaedheal was formed as a political party in favor of the Anglo-Irish Treaty.  Followers of Michael Collins who supported the end of the Irish War of Independence signed the treaty to end hostilities between the IRA and the British government.  This led to the Irish Civil War between the Pro-Treaty IRA, and the Anti-Treaty IRA.","color_hex":"#0000ff","secondary_color_hex":null,"is_active":0,"image_url":"https://file.garden/amaRjklJVCxI5kHj/William_Thomas_Cosgrave.jpg","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":"W.T. Cosgrave has been the President of the Executive Council since 1922.  Cosgrave served as a captain under Éamonn Ceannt during the Easter Rising, being sentenced to death, before it was commuted to life, later being released.<br>Cumann na nGaedheal was formed as a political party in favor of the Anglo-Irish Treaty.  Followers of Michael Collins who supported the end of the Irish War of Independence signed the treaty to end hostilities between the IRA and the British government.  This led to the Irish Civil War between the Pro-Treaty IRA, and the Anti-Treaty IRA.","candidate_score":1,"running_mate":true,"scrollable":false,"partner":"2"}},{"model":"campaign_trail.candidate","pk":144,"fields":{"first_name":"","last_name":"Labour","election":14,"party":"Labour","state":"","priority":1,"description":"Labour description","color_hex":"#ff0000","secondary_color_hex":null,"is_active":0,"image_url":"","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":null,"candidate_score":1,"running_mate":false,"scrollable":false}},{"model":"campaign_trail.candidate","pk":1006,"fields":{"first_name":"Thomas","last_name":"O'Connell","election":14,"party":"Labour","state":"Mayo South","priority":1,"description":"O'Connell description","color_hex":"#ff0000","secondary_color_hex":null,"is_active":0,"image_url":"","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":"O'Connell description","candidate_score":1,"running_mate":true,"scrollable":false,"partner":"4"}},{"model":"campaign_trail.candidate","pk":145,"fields":{"first_name":"","last_name":"Farmers'/Independents","election":14,"party":"Farmers'/Independent","state":"","priority":1,"description":"Farmers'/Independent description","color_hex":"#7f7f7f","secondary_color_hex":null,"is_active":0,"image_url":"","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":null,"candidate_score":1,"running_mate":false,"scrollable":false}},{"model":"campaign_trail.candidate","pk":1008,"fields":{"first_name":"","last_name":"None","election":14,"party":"Farmers'/Independent","state":"","priority":1,"description":"None description","color_hex":"#7f7f7f","secondary_color_hex":null,"is_active":0,"image_url":"","electoral_victory_message":"<h3>REAL PATRIOT DUMMY EXAMPLE SWEEPS</h3>","electoral_loss_message":"<h3>Fake News?</h3>","no_electoral_majority_message":"<h3>DUMMY EXAMPLE RETURNS TO HELL</h3>","description_as_running_mate":"None description","candidate_score":1,"running_mate":true,"scrollable":false,"partner":"6"}}];e.running_mate_json = [{"model":"campaign_trail.running_mate","pk":2001,"fields":{"candidate":142,"running_mate":1002}},{"model":"campaign_trail.running_mate","pk":2002,"fields":{"candidate":143,"running_mate":1004}},{"model":"campaign_trail.running_mate","pk":2003,"fields":{"candidate":144,"running_mate":1006}},{"model":"campaign_trail.running_mate","pk":2004,"fields":{"candidate":145,"running_mate":1008}}];


quotes = [`If war comes upon us, it will come as a thief in the night. ー Éamon de Valera`, `For our demands most moderate are,
We only want the earth. ー James Connolly `]
customquote = quotes[Math.floor((Math.random() * quotes.length))]

corrr="\n<h2>Rian Feachtais Nua</h2><font id='wittyquote' size='4' color='white'><em>" + customquote + "</em></font>"

campaignTrail_temp.modBoxTheme = {
     "header_color": "#23297a",
     "header_text_color": "#FFFFFF",
     "description_text_color": "#FFFFFF",
     "description_background_color": "#6EBC99",
     "main_color": "#23297a",
     "secondary_color": "#009A44",
     "ui_text_color": "#FFFFFF"
}
campaignTrail_temp.musicOn = true
campaignTrail_temp.musicSrc = "https://file.garden/amaRjklJVCxI5kHj/John%20McCormack%20-%20Nearer%20My%20God%20To%20Thee%20%5BKweZQzKgIUM%5D.mp3"

function modifyForm() {
  try {
    const form = document.querySelector('form[name="game_type_selection"]');
    const select = form.querySelector('select[name="game_type_id"]');
  
    // change option value
    const option = select.querySelector('option[value="2"]');
    option.textContent = 'Default (Dáil Proportional)';

    // Remove second option
    select.querySelector('option[value="1"]').remove();
  
    // change h3 text
    const h3 = form.querySelector('h3');
    h3.textContent = 'How would you like the seats to be allocated?';
  } catch {}
}
window.setInterval(modifyForm,200)
function changeOpponentSelectionDescription() {
  try {
    const opponentSelectionDescription = document.getElementById("opponent_selection_description_window");
    opponentSelectionDescription.innerHTML = `<p><strong>Use the default method of allocating seats in the Dáil Éireann.</strong></p><p>Ireland uses a proportional system where constituencies receive between three and nine seats in the Dail.  Voting is done by single transferable vote (STV).</p><p>If one party does not hold a majority, a coalition can be formed with multiple parties.</p>`;
  } catch {}
}
window.setInterval(changeOpponentSelectionDescription,200)


function updateCandidateForm() {
  formobserver.disconnect();
  const heading = document.querySelector("#candidate_form form h3");

  if (heading) {
    heading.textContent = "Please select your party:";
  }
  formobserver.observe(document.documentElement, { childList: true, subtree: true });
}
if(!formobserver){
  var formobserver = new MutationObserver(updateCandidateForm);
  formobserver.observe(document.documentElement, { childList: true, subtree: true });
}

function updateRunningMateForm() {
  runformobserver.disconnect();
  const heading = document.querySelector("#running_mate_form form h3");

  if (heading) {
    heading.textContent = "Please select your leader:";
  }
  runformobserver.observe(document.documentElement, { childList: true, subtree: true });
}
if(!runformobserver){
var runformobserver = new MutationObserver(updateRunningMateForm);
runformobserver.observe(document.documentElement, { childList: true, subtree: true });
}

function toggleContinueForLeaderScreen() {
  try {
    const rmForm = document.getElementById("running_mate_form");
    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
    const continueBtn = buttons.find(b => (b.textContent || b.value || "").trim().toLowerCase() === "continue");
    if (!continueBtn) return;
    if (rmForm && rmForm.offsetParent !== null && rmForm.textContent.includes("Cosgrave")) {
      continueBtn.style.display = "none";
    } else if (continueBtn.style.display === "none") {
      continueBtn.style.display = "";
    }
  } catch {}
}
window.setInterval(toggleContinueForLeaderScreen, 200);

function removeCandidateSummary() {
   sumobserver.disconnect();
  const candidateSummary = document.querySelector("#candidate_summary");
  if (candidateSummary) {
    const ulList = candidateSummary.querySelector("ul");
    if (ulList) {
      candidateSummary.removeChild(ulList);
    }
  }
  sumobserver.observe(document.body, {childList: true,subtree: true});
}
if(!sumobserver){
var sumobserver = new MutationObserver(removeCandidateSummary);
sumobserver.observe(document.body, {childList: true,subtree: true});
}