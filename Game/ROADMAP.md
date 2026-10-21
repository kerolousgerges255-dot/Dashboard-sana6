# Archangel Michael Game - Development Roadmap

## Project Overview
Create an interactive HTML game for kids (Grade 6) about Archangel Michael, celebrating his feast day (12th of every Coptic month). The game will be integrated into the existing Dashboard project.

## Source Material
- PDF: "أوراق عمل عن الملاك ميخائيل لكل المراحل" (10 pages)
- Content covers: Nursery, Primary, Middle School, High School levels
- Key themes: Michael as protector, "Who is like God?", spiritual strength without insult, Bible verses

## Game Concept: "Michael's Heavenly Quest"
A narrative-driven interactive game where kids help Archangel Michael protect God's children through different challenges.

### Game Flow
1. **Intro/Story** - Animated story of Archangel Michael
2. **Level 1: Word Search** - Find angelic words (Primary level)
3. **Level 2: Verse Memory** - Complete Psalm 34:7 (Nursery/Primary)
4. **Level 3: Bible Quiz** - Michael's actions in Scripture (Middle School)
5. **Level 4: Strength Challenge** - Choose wise responses (High School)
6. **Victory Screen** - Record name in "Hall of Faithful" (Excel/Google Sheets)

## Technical Architecture

### File Structure
```
Game/
├── michael-game.html          # Main game entry point
├── game-styles.css            # Shared styles
├── game-engine.js             # Core game logic
├── levels/
│   ├── level1-wordsearch.js
│   ├── level2-verse.js
│   ├── level3-quiz.js
│   └── level4-challenge.js
├── assets/
│   ├── images/                # Archangel Michael images
│   └── sounds/                # Optional sound effects
├── data/
│   └── questions.json         # Game data
├── leaderboard.html           # Hall of Fame page
└── ROADMAP.md                 # This file
```

### Integration with Dashboard
- Add "Game" button to dashboard.html hero banner and nav
- Link to `Game/michael-game.html`
- Share design tokens (colors, fonts) with dashboard
- Use same Google Apps Script for leaderboard (or new endpoint)

### Data Storage
- **Option A**: Google Sheets via Google Apps Script (matches dashboard pattern)
- **Option B**: LocalStorage for offline, sync when online
- **Option C**: Firebase (if configured)

Recommendation: Use Google Apps Script like the honor roll for consistency.

## Design System (Matching Dashboard)

### Colors
- `--paper`: #fffdf9
- `--paper-2`: #f6efe3
- `--maroon`: #7a1530 (primary brand)
- `--maroon-deep`: #4d0d1f
- `--maroon-bright`: #a5203f
- `--gold`: #c9a86a (angelic accent)
- `--gold-bright`: #e3c589
- `--heaven-blue`: #bce8fb (sky/angelic)
- `--ink`: #2b1015
- `--ink-soft`: #6b4a52

### Typography
- **Display**: 'Amiri', serif (for verses, titles)
- **UI**: 'Cairo', sans-serif (for buttons, text)
- Scale: clamp-based responsive sizing

### Visual Style
- Animated sky background (shared with dashboard)
- Gold/maroon gradient buttons
- Card-based UI with soft shadows
- Parallax sky effect

## Game Levels Detail

### Level 1: Word Search (Primary)
- Grid with hidden words: MICHAEL, ANGEL, HEAVEN, PRAYER, LIGHT, WINGS, PROTECT, HALO
- Touch/mouse drag to select
- Words from PDF page 7

### Level 2: Verse Completion (Nursery/Primary)
- Psalm 34:7 - "The angel of the LORD encampeth round about them that fear him, and delivereth them"
- Drag-and-drop or click-to-fill missing words
- Words: LORD, round, delivereth

### Level 3: Bible Quiz (Middle School)
- 3 questions from PDF page 8:
  1. Daniel 12:1 - Michael stands guard
  2. Jude 9 - Contended with devil, "The Lord rebuke thee"
  3. Revelation 12:7 - Fought dragon with angels
- Code breaker: "WHO IS LIKE GOD?" (Michael name meaning)
- True/False questions

### Level 4: Strength Challenge (High School)
- Scenario-based choices (from PDF page 9)
- "Someone insults you - what do you do?"
- Options: Insult back / Pray "Lord, You take care of it" / Ignore
- Teaches: Real strength = self-control, not hurtful reply
- Weekly challenge tracker (Sat-Fri)

## Leaderboard / Hall of Fame
- Fields: Name, Class, Date, Score, Level Completed
- Stored in Google Sheets via Apps Script
- Displayed on separate `leaderboard.html` page
- Linked from game victory screen

## Development Phases

### Phase 1: Foundation (Day 1)
- [ ] Create roadmap document ✓
- [ ] Set up file structure
- [ ] Create shared CSS (game-styles.css)
- [ ] Build game engine (state management, level progression)
- [ ] Create intro/story screen with Michael imagery

### Phase 2: Levels (Day 1-2)
- [ ] Level 1: Word Search
- [ ] Level 2: Verse Memory
- [ ] Level 3: Bible Quiz + Code Breaker
- [ ] Level 4: Strength Challenge

### Phase 3: Polish & Integration (Day 2)
- [ ] Victory screen + name entry
- [ ] Google Apps Script for leaderboard
- [ ] Leaderboard page
- [ ] Connect to dashboard (add game button)
- [ ] Test responsive design
- [ ] Add reduced motion support

### Phase 4: Deploy (Day 2)
- [ ] Copy images to Game/assets/images/
- [ ] Test on GitHub Pages
- [ ] Push to main

## Assets Needed
1. Archangel Michael images (from Game/images.jpeg and images (1).jpeg)
2. Possibly extract/crop from PDF pages
3. Consider icon illustrations for game elements

## Questions for Clarification
1. Should the game be in Arabic only, or bilingual (Arabic/English)?
2. Use existing images.jpeg / images (1).jpeg or need new illustrations?
3. Google Apps Script endpoint for leaderboard - create new or reuse honor roll?
4. Target age: Grade 6 (11-12 years) - adjust difficulty accordingly
5. Sound effects/music?

## Timeline
- **Today**: Phases 1-2 (core game playable)
- **Tomorrow**: Phases 3-4 (polished, integrated, deployed)

---
*Created for the Feast of Archangel Michael (12th of every Coptic month)*
*Integrated with: Dashboard-sana6 (Grade 6 Class Dashboard)*