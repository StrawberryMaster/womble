# womble
A series of tools/addons/etc for The Campaign Trail mods

## Addon notes
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