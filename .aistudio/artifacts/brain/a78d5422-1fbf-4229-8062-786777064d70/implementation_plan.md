# Life OS Notes & Planner — Color & AI Editor Refinement

## Exact Color Design Tokens

### Light Mode
- Outer background: `#e6e3dc`
- Card background (paper): `#fbfaf6`
- Sidebar: `#f2efe8`
- Main text: `#2a2d2e`
- Secondary text: `#85877f`
- Border / divider: `#e4e0d5`
- Muted Emerald (accent): `#3b7562`
- Light green (active/tag): `#dfeae4`
- Chip / secondary button: `#ece8de`
- High priority / overdue: `#b0503e`
- Medium priority: `#a67c2e`
- Primary button: `#46484a` (text `#fbfaf6`)

### Dark Mode
- Outer background: `#17191a`
- Card background: `#212425`
- Sidebar: `#1b1d1e`
- Main text: `#e8e6df`
- Secondary text: `#8f9189`
- Border / divider: `#303435`
- Muted Emerald (brightened): `#6fae98`
- Dark green (active/tag): `#26382f`
- Chip / secondary button: `#2b2f30`
- Alert red: `#d98a76`
- Alert amber: `#d1a64f`

### Editor & AI Features
1. **Immersive Large Note Editor**: Full-screen or spacious editing modal with clean distraction-free layout.
2. **Formatting Toolbar**: Rich formatting tools (Bold, Italic, H1/H2, Bullet list, Checklist, Image Upload/Paste, Text Color picker, Highlight picker).
3. **Image Attachment**: Ability to insert image files into the note.
4. **AI Assistant**: Server-side Gemini API (`gemini-3.8-flash`) endpoint to answer questions about the note content, summarize, or expand text.
