# EVA Reference

This folder stores local reference data used by VoynichLab when explaining or comparing against EVA transliteration.

Primary source:

- Rene Zandbergen, "Voynich MS - Text Analysis - Transliteration of the Text": https://www.voynich.nu/transcr.html

Current files:

- `eva-basic-alphabet.json`: Basic EVA character list, source notes, EVA2 font metadata, per-character codepoints, and the `fachys` example used in the portal.
- `eva-font/EVA2.ttf`: Local copy of the EVA2 font used by the portal to render Voynich EVA glyphs.

Notes:

- EVA is treated here as a transliteration system, not as a decipherment.
- The `fachys` example is used because it is the first EVA word of the manuscript in the f1r text used by this project.
- The portal displays `fachys` as ordinary EVA Latin transcription, then renders the same character sequence with the EVA2 font to show the corresponding Voynich EVA glyphs.
- The downloaded `EVA2.ttf` maps Basic EVA glyphs onto the lowercase Latin transcription characters, so the visible portal glyph row uses `f a c h y s` with the EVA font rather than private-use entities.
- Numeric character codes are kept only as metadata, not as visible portal text.
