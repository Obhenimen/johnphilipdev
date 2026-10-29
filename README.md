# johnphilipdev — personal portfolio

Plain HTML, CSS, and JavaScript. No framework and no build step.

## Structure

```
index.html                 Home: hero, research pipeline, expertise, publications, software, about, news, contact
research.html              PhD research in detail (CFD, LFRN, RL, multi-fidelity GP, diffusion, HPC)
projects/
  mystudysidekick.html     Case study
  poscholars.html          Case study
  animal-game.html         Case study
  mitrawriter.html         Case study (beta Dec 2026)
css/styles.css             All styles, mobile-first, light/dark themes
js/main.js                 Mobile menu, theme toggle, scroll reveal, video autoplay, back-to-top
assets/
  img/                     Photo and video posters
  video/                   Compressed web videos
  docs/                    CV PDF served by the "Download CV" buttons
Philip_Obhenimen_John_CV.tex   CV source (not needed on the live site)
```

## Updating the CV

```sh
tectonic -o assets/docs Philip_Obhenimen_John_CV.tex   # writes the PDF straight to assets/docs/
```

Uses the `fontawesome` (v4) package because `fontawesome5` crashes Tectonic.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

To test on your phone, connect it to the same Wi-Fi and open `http://<your-mac-ip>:8000`.

## Filling in content

Search for `TODO` to find placeholders:

```sh
grep -rn TODO --include=*.html .
```

## Adding videos

Raw simulation exports are far too heavy for mobile, so compress them first. Aim for under 5 MB per clip.

```sh
ffmpeg -i input.mp4 -vf "scale=1280:-2:flags=lanczos" -c:v libx264 -crf 28 -preset slow \
  -pix_fmt yuv420p -an -movflags +faststart assets/video/name.mp4
ffmpeg -ss 15 -i input.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 4 assets/img/name-poster.jpg
```

Then embed it (set `width`/`height` to the encoded size so the layout doesn't jump):

```html
<figure class="media-figure">            <!-- add is-portrait for tall videos -->
  <video src="assets/video/name.mp4" poster="assets/img/name-poster.jpg" width="1280" height="720"
         data-autoplay muted loop playsinline preload="none" aria-label="..."></video>
  <figcaption>...</figcaption>
</figure>
```

`data-autoplay` makes `js/main.js` play the video only while it's on screen.

## Deploy

Any static host works. GitHub Pages, Netlify, and Cloudflare Pages are free: point them at this folder with no build command.
Keep the raw source files (videos, `.tex`, extra PDFs) out of the deployed folder or add them to `.gitignore`.
