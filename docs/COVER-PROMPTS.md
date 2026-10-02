# Project cover prompts

Reusable recipes for the device shots on the Featured work covers, the case study plates, and case study galleries. The look follows the reference (kudos.framer.media/projects): one device, dark studio box, key light from above, the project's own screen on the glass.

**The rule that governs everything below:** what is on the screen must be a real capture of the real product. An AI-drawn interface on a laptop is a fabricated screenshot, and the tagline does not survive one. AI is allowed to build the room and the device around a real screenshot, never to invent the screen.

---

## Path A, recommended: screenshot only, the site draws the laptop

The site already renders the laptop in CSS (`components/Device.tsx`). All a project needs is one capture.

| Spec | Value |
|---|---|
| Aspect | 16:10 exactly |
| Size | 2560 x 1600 (renders crisp on retina at full banner width) |
| Format | `.webp`, quality 82 to 86, target under 250 KB |
| Location | `public/work/<slug>/cover.webp` |
| Content | The product's single best screen, real data or clearly fake demo data, no personal data, no client names that are not cleared |
| Browser chrome | None. Capture the viewport only, the laptop is the frame |
| Theme | Dark UI where the product has one, so it sits in the dark stage; a light UI is fine, it reads as a lit screen |

Then add one line to the study in `content/work.ts`:

```ts
cover: { src: '/work/pawtrait/cover.webp', alt: 'Pawtrait template editor with a collar sheet open' },
```

The title card on the screen is replaced, everywhere the study appears, with no other change.

**What to capture, per project**

| Project | Best screen |
|---|---|
| SimplyBox | The unified inbox with a grounded reply open beside its source document |
| RoyaleCard Arena | The draft and ban screen mid-match, or the arena with the three buttons visible |
| Snapose | The operator dashboard with the finance and waste panel |
| Pawtrait | The template editor with a collar or keychain sheet laid out |
| Franchise System | The outlet overview: sales, stock and staff on one screen (anonymise the chain) |

---

## Path B, photographic device shots from a real screenshot

For gallery frames inside a case study, social posts, or a deck. Use an image model that accepts a reference image (GPT Image, Nano Banana, Midjourney with an image prompt, Firefly). Attach the real screenshot as the reference, and tell the model to place it, not to redraw it.

### B1. Laptop, the cover shot

```
Photorealistic studio product shot of a modern space-black laptop, lid open at
about 105 degrees, seen straight on from slightly above the deck, centered
horizontally and standing in the lower 60% of the frame.

The laptop screen displays EXACTLY the attached screenshot, edge to edge inside
the bezel, undistorted, unedited, all text left as it is. Do not redraw, restyle,
translate, or add anything to the screen.

Background: a seamless dark studio sweep, graphite green-black (#0A0E0C at the
floor rising to #1B211E at the top), one soft key light from directly above
falling off toward the corners, a faint horizon where the floor meets the wall.
Subtle contact shadow under the laptop. Very fine film grain over the whole image.
Restrained, editorial, premium, quiet. No props, no hands, no plants, no
reflections of people, no logos on the laptop, no text in the image other than
the screenshot.

Aspect ratio 4:5, 2400 x 3000.
```

### B2. Tablet, the detail shot

```
Photorealistic studio product shot of a dark-grey tablet in portrait, standing
upright on its edge, front facing camera, centered, lower two thirds of the frame.
The tablet screen shows EXACTLY the attached screenshot, undistorted and unedited.
Same studio as the laptop shot: graphite green-black seamless sweep, single soft
key light from above, faint floor horizon, soft contact shadow, very fine film
grain. No props, no hands, no logos, no extra text. Aspect ratio 4:5, 2400 x 3000.
```

### B3. Phone, the mobile shot

```
Photorealistic studio product shot of a black modern smartphone, upright, front
facing, slightly cropped by the bottom edge of the frame, centered. The phone
screen shows EXACTLY the attached screenshot, undistorted and unedited, status
bar included as captured. Graphite green-black seamless studio, one soft key
light from above, very fine film grain, nothing else in frame. No hands, no
logos, no added text. Aspect ratio 4:5, 2400 x 3000.
```

### Negative prompt, for models that take one

```
redrawn UI, invented interface, gibberish text, changed text, extra windows,
watermark, brand logo on device, apple logo, hands, people, desk props, plants,
coffee, bokeh lights, colored gels, neon, purple, blue tint, heavy vignette,
tilted horizon, fisheye, low resolution, oversharpened
```

### After generating

1. Check the screen against the original screenshot, word for word. If one character changed, regenerate or composite the real screenshot back onto the screen in an editor.
2. Export `.webp` at 2400 x 3000, quality 82, under 400 KB.
3. Save to `public/work/<slug>/` with a descriptive name (`laptop-editor.webp`, `phone-gallery.webp`).
4. Add it to the study's `gallery` array in `content/work.ts` with a real alt text.

---

## Palette reference for any of the above

| Role | Hex |
|---|---|
| Floor | `#0A0E0C` |
| Mid wall | `#101512` |
| Top wall | `#1B211E` |
| Key light tint | `#C6D5CB` at low strength |
| Accent, if anything glows | `#F9B4D6`, sparingly, never as a light source |
