# Tidal Mixer

A browser colour-mixing game. Blend two colours to match a target, or mix freely in the sandbox. No build step and no dependencies.

## Play modes
- **Match**: 8 rounds. Pick two tubes and set the blend to recreate the target. Each round scores up to 100 (perceptual distance in OKLab), for a top score of 800.
- **Daily**: the same 8 rounds for everyone on a given UTC date.
- **Sandbox**: every sRGB colour (16,777,216) through a picker, hex, RGB sliders, named colours and an eyedropper, with five mix modes (Perceptual, Light, sRGB, Hue arc, Paint).

## Files
- `index.html` page markup
- `css/style.css` styles
- `js/app.js` colour maths, game, saved scores (`Backend`) and the animated background

## Run locally
Open `index.html`, or serve the folder: `python3 -m http.server` and visit http://localhost:8000.

## Publish on GitHub Pages
1. Create a repository and push these files to the `main` branch.
2. Open Settings, then Pages. Under Build and deployment choose Deploy from a branch, select `main` and `/ (root)`, and save.
3. Your game goes live at `https://<your-username>.github.io/<repository>/` after a minute or so.

## Back-end
GitHub Pages hosts static files only, so scores are stored in the visitor's own browser (`localStorage`, key `tidal-mixer:v1`). All storage goes through the `Backend` object at the top of the game section in `js/app.js`. To share a global leaderboard, replace its methods (`submitScore`, `leaderboard`, `best`, `stats`, `reset`) with calls to a hosted service such as Supabase or Firebase. The game code does not need to change.

## Tweaking
- Rounds per run: `total` in the `G` object.
- Scoring strictness: the `.25` in the lock-in handler (smaller is harder).
- Add a licence file of your choice before sharing.
