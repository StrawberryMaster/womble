# womble
A series of tools/addons/etc for The Campaign Trail mods

## Addon notes
### Banner changer
The [banner changer](./src/banner_changer.js) is a simple tool for changing the candidate banner logos. It includes a single function, `changeImage()`, which takes an image URL as an argument and updates the banner logo to that image. For example:

```javascript
changeImage("https://i.imgur.com/A1674e8.png");
```

Ideally, it should be used within the `cyoAdventure` function of a mod, but can be used anywhere. Second example:

```javascript
if (e.running_mate_last_name === "Gephardt") {
    changeImage("https://i.imgur.com/BHzPf4K.png");
}
```

### Candidate remover/restorer
[`candidateRemover`](./src/candidateRemover.ts) is a tool for removing candidates from the election, and optionally restoring them later. It includes both `removeCandidate()` and `restoreCandidate()`. For a quick cheat-sheet:

#### removeCandidate
- `removeCandidate(301);` - removes candidate 301, distributes their votes proportionally among the other candidate
- `removeCandidate(301, { touch: 'both' });` - same as above, but overwrites existing polls (and so shows immediately on the map)
- `removeCandidate(301, { mode: 'toCandidate', target: 300, touch: 'both' });` removes candidate 301, gives their voteshare to candidate 300
- `removeCandidate(301, { mode: 'weights', weights: { 302: 3, 303: 1 }, touch: 'final' });` - removes candidate 301, distributes their voteshare 75% to candidate 302 and 25% to 303, if both are present in-state

#### restoreCandidate
- `restoreCandidate(301, { touch: 'both' });` - restores candidate 301. I missed them
- `restoreCandidate(301, { touch: 'final' });` - restores 301, *but* only makes them appear at the final results

### "Continue" button editor
The [continue button editor](continue_button_editor.js) is a simple tool for changing the text of the "Continue" button that appears after booting up a mod. You need to replace the text content of the button with your desired text. For example:
```javascript
electionBtn.innerHTML = "Your text here";
```

# Mod notes
Mods listed here are in various stages of development, and may be incomplete or buggy. Some may be intended for private use, but are being shared here for the sake of open-source-ness. Finally, a few others were canceled before they were finished, but are being shared here for the sake of "what could have been", or are here after being removed from the CTS mod gallery.

I do not own the content in these mods (unless otherwise specified), and am not responsible for any of it. All credit goes to the original creators. If you are the creator or responsible for any of the content in these mods and would like it removed, please contact me so I can take it down.

See [the mods folder](./mods) for the full list of mods. Included here are:
- DeanDemocracy '68: a mod where James Dean, alive and well, runs for president in 1968. He faces off against the real-life candidates of that year, as well as a few other ones. Available running mates for Dean include Montgomery Clift, Robert Kennedy, Richard Daley, and Frank Sinatra. Running mates for Nixon are Spiro Agnew, Ronald Reagan, John Lindsay, and George Bush. Finally, George Wallace's running mates are Curtis LeMay, Ezra Taft Benson, and John Wayne. I might get back to this eventually now that I have the codes, but much of our progress on the question has been lost.
- 2012 Razistorija: made by the group [Memorandum Teleoptik](https://memorandumteleoptik.org/) and is centered around the 2012 presidential election in Yugoslavia, in an alternate timeline where the country was not dissolved in the 1990s. This is a patched version that includes a few bug fixes and quality of life improvements (especially to the political compass within the mod), but is otherwise the same as the original release.
- 2028: Smoke In The Air: J.D. Vance vs. "an 18-year-old genderfluid Deltarune fan [that] somehow got the nomination and convinced some random dude they shitposted with 3 years ago to join the ticket."
- 2028: Soul of the Nation: a Harris 2028 mod made by Mari. A Trump side was made but seemingly never released, though the Harris side is complete and available here. 