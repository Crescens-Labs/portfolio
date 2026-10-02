# Hero background video, generation brief

One asset. Generate it once, at the highest quality your tool allows, then send it back and the encode and integration are handled here.

Everything below is written so it can be pasted into a video model without editing. The palette values are the real tokens from `app/tokens.css`, so what comes back sits inside the existing colour system instead of next to it.

---

## What the video is for

It replaces the hero's CSS gradient with something that moves. The requirement is unusual and it is the reason a stock "abstract dark background" will fail:

- **Text sits on top of it.** A 122px headline in `#FBFDFC` and a body line in `#858E8A`. Anything with high frequency detail or bright patches in the left two thirds destroys legibility.
- **It must never look like the subject.** The video is the room the type is standing in. The moment a viewer notices the video, it has failed.
- **It loops forever.** No cut, no fade, no visible restart.
- **It is dark.** Mean luminance around 6 to 9 percent. Most models will return something far brighter than intended, which is why the prompt states it three separate ways.

---

## The prompt

Paste this whole block.

```
A single continuous locked-off macro shot of heavy black silk fabric, filling
the entire frame, lit from the upper right by one soft distant key light.

The fabric is almost still. It breathes rather than blows: extremely slow,
low amplitude undulation, as if from air moving across a large room, not
from wind. Peak displacement is small. Nothing snaps, ripples fast, or
flutters. The whole movement completes roughly one cycle over fifteen
seconds.

Colour: near black with a cold desaturated green cast, not blue and not
neutral grey. Deep shadow reads as #050B08. The body of the fabric reads as
#08120E. The brightest highlight along a single fold in the upper right
reaches no higher than #1B2A22, a dark cool grey green, never white, never
bright. The lower left corner falls off to almost pure black with a faint
cool green fill so it is not dead flat.

Composition: the fold structure is concentrated in the upper right third of
the frame. The left two thirds and the lower half are broad, smooth,
near-black areas with almost no detail. There is no focal point, no centre
of interest, no object, no subject. The frame is deliberately empty.

Lighting: one soft key from the upper right at a grazing angle, so the light
travels across the weave rather than hitting it head on. Wide falloff. A
deep natural vignette toward all four corners. No rim light, no second
source, no coloured gel, no lens flare.

Texture: fine natural fabric weave visible only in the lit area, soft and
organic. Shallow depth of field with the near edge slightly soft. Subtle
natural film grain throughout.

Camera: completely static. No pan, no tilt, no dolly, no zoom, no handheld
drift, no parallax. Locked tripod, single continuous take, no cuts.

Mood: expensive, restrained, editorial, quiet. Like the background plate of
a luxury goods film. Photographic and real, not rendered, not CGI, not
digital abstract art.
```

## Negative prompt

Paste into the negative or exclusion field. If your tool has no such field, append it to the prompt as a sentence starting `Do not include:`.

```
text, letters, watermark, logo, people, hands, faces, objects, product,
particles, sparkles, bokeh dots, light streaks, lens flare, god rays, smoke,
fog, liquid, ink in water, neon, glow, purple, blue, teal, orange, warm
tones, saturated colour, gradient banding, high contrast, bright highlights,
white areas, blown out areas, centred focal point, symmetry, fast motion,
wind gusts, flapping, rippling water, camera movement, zoom, pan, dolly,
handheld shake, cuts, transitions, flicker, strobe, 3D render, CGI, plastic
sheen, digital abstract art, motion graphics, screensaver, stock footage
look, vignette burn, chromatic aberration
```

## Technical settings

| Setting | Value | Why |
|---|---|---|
| Aspect ratio | 16:9 | Reframed in CSS with `object-fit: cover`. A 9:16 version is not needed, see the mobile note below. |
| Resolution | 4K if offered, otherwise 1080p | Downscaling adds detail. Upscaling invents it. |
| Duration | 10 to 15 seconds | Long enough that the loop is not noticed, short enough to stay under budget. |
| Frame rate | 24fps | 30 and 60 read as video. 24 reads as film, and it is a third fewer frames to ship. |
| Motion strength | Lowest setting that still moves | Every model over-animates by default. If there is a slider, start at 20 percent. |
| Seed | Record it | If a variation is needed later, the same seed plus a tweaked prompt gets a sibling rather than a stranger. |

## What to send back

The raw file, unedited. No colour grade, no crop, no compression pass, no music track. The grade is applied in CSS so it stays locked to the design tokens, and the encode is done here because the budget is tight and the settings are specific.

## How to judge a result before sending it

Four checks, in order. If it fails any one of them, generate again rather than accepting it.

1. **Squint at it.** If any shape reads as a recognisable object, reject.
2. **Cover the right third with your hand.** The remaining two thirds should be almost featureless dark. If there is detail there, the headline will not sit on it.
3. **Watch it twice through without blinking.** If you can tell where it restarts, or if anything moves fast enough to catch the eye, reject.
4. **Turn the screen brightness down to about a quarter.** It should still read as fabric and not as a black rectangle. If it disappears entirely, the highlight is too dim; if it looks grey, it is too bright.

## Mobile

Handled in code, not in a second render, and this is deliberate.

At 390px the video is cropped to the centre by `object-fit: cover`, which is exactly where the frame is emptiest, so the crop costs nothing. A portrait re-render would put the fold structure back into the middle of a phone screen where the headline sits, which is worse.

What does change on mobile:

- The video does not load at all below 640px. A phone gets the existing CSS gradient, which is already good and costs zero bytes. The video is an enhancement for the screens that can afford it.
- It also does not load on a metered or save-data connection, or under `prefers-reduced-motion`, where a static poster frame is used instead.

## Integration, for reference

Encoding and wiring happen here once the file arrives. Recorded so the plan is checkable:

- Two encodes, AV1 in WebM and H.265 in MP4, both capped at roughly 1.4MB for the whole loop.
- A poster frame extracted from frame 1, served as a 12KB AVIF, so the first paint is never empty.
- `muted playsinline loop preload="none"`, decoded off the main thread, started after the hero has painted so it never competes with the headline for bandwidth.
- The existing grain and vignette layers stay on top of it. The grain is the identity and it does not get replaced by the video's own noise.
- The bloom ceiling in `app/tokens.css` still applies, so the contrast floor for the headline holds whatever the video does.

---

## Second asset, optional and lower priority

Only if the first one lands and you want more. Not needed for the page to be good.

A ten second **texture plate**: the same fabric, but static and evenly lit, no motion at all, shot as a single still. It would replace `public/grain.png` with something photographed rather than extracted, at higher resolution. Same prompt as above with `completely static, single frozen frame, no motion whatsoever` and the aspect ratio set to 1:1.
