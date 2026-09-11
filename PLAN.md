# Game Plan: Cipher Cat: The Mystery of the Brass Box

## Concept & Visual Identity
- **Visual Aesthetic:** 1930s vintage detective noir merged with Rubber Hose animation (Cuphead/Felix the Cat) and Franco-Belgian Ligne Claire (Hergé / Tintin) linework, framed in nostalgic Professor Layton puzzle solving and LucasArts 90s point-and-click verb bar.
- **Atmosphere:** Sepia and warm ochre tones, vintage CRT & 16mm film grain flickers, vignette edges, authentic jazz noir soundscapes and mechanical sound effects using Web Audio API synthesis.
- **Narrative:** You and Inspector Felix Claws (an anthropomorphic trench-coated detective cat) are locked inside the private office of the vanished detective J.H. Whitmore. The door is bolted by an electro-mechanical deadbolt. To escape, you must investigate Whitmore's study, crack his secret cipher journal, align the gears of the mystical Brass Puzzle Box, unlock the hidden safe to reveal the Steampunk Cryptex, and decode the master keyword to escape into the rain-soaked 1930s city night!

## Key Interactive Systems & Puzzles
1. **Interactive Point-and-Click Room:**
   - Seamless cursor system with LucasArts verb actions: `Look`, `Pick Up`, `Talk / Ask Felix`, `Use Item`.
   - Interactive Hotspots across the scene:
     - **The Vintage Desk:** Typewriter with encoded letter draft, Banker's green lamp toggle, Glowing Mystery Box.
     - **The Wall Safe:** Heavy steel tumbler safe requiring a 3-stage combination lock hidden in the office clues.
     - **The Secret Bookshelf:** "Truth Always Finds A Way" philosophy book mechanism that opens a hidden drawer.
     - **Inspector Felix Claws:** Animated companion cat who offers witty 1930s noir dialogue, deductive hints, and reacts to discovered items.
     - **The Coat Rack & Fedora:** Hidden brass key inside the trench coat pocket.
     - **The Moonlight Window:** Reveals luminous watermarked symbols when examined with Felix's glowing magnifying glass.
     - **The Exit Door:** Heavy brass deadbolt mechanism requiring the final master keycard and code.

2. **Puzzle 1: The Secret Bookshelf Sequence**
   - Book titles correspond to Detective Whitmore's motto on the wall poster: *"Truth Always Finds A Way"*.
   - Selecting the correct sequence of books tilts the bookshelf mechanism and ejects the **Golden Dial Key**.

3. **Puzzle 2: The Mechanical Brass Puzzle Box (Close-up Minigame)**
   - 4 rotatable brass symbol dials: Star (★), Moon (☾), Eye (👁), Pyramid (▲).
   - Gear ratio mechanics: turning one dial engages gear teeth that affect neighboring tumblers.
   - Aligning the symbols indicated in the typewriter memo unlocks the box, revealing the **Silver Safe Dial** and **Whitmore's Diary Page**.

4. **Puzzle 3: The Wall Safe Combination**
   - Rotating tumbler with tactile audio clicks.
   - Combination derived from the clock on the wall, the calendar date, and the telephone rotary dial: `10 - 4 - 28`.
   - Opening safe unlocks the **Steampunk Cryptex Decoding Device**.

5. **Puzzle 4: The Steampunk Cryptex (Layered Cipher Minigame)**
   - 5 rotating letter/symbol rings.
   - Using the Detective's Glowing Magnifying Glass over the diary clue reveals the keyword: `L-U-X-O-R` or ancient alchemical ciphers.
   - Solving opens the cryptex tube, dispensing the **Brass Master Key** for the office door!

6. **Atmospheric Polish:**
   - 1930s Film Grain & Projector Dust canvas overlay with toggle switch.
   - Muted sepia color grading filter.
   - Procedural Web Audio API sound generator: mechanical clicks, typewriter clatter, safe tumbler ratchets, triumphant puzzle chimes, and retro jazz noir chords.
   - Responsive inventory tray and Layton-style puzzle header dialogs.

## Verification
- Interactive room clicks trigger dialogue, items added to inventory.
- Close-up inspection views for Puzzle Box, Cryptex, Safe, and Typewriter.
- Audio synthesis works seamlessly without external asset latency.
- Full victory state and escape cinematic ending sequence.
