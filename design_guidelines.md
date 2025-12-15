# Design Guidelines - Kuis Ketenagakerjaan

## Design Approach
**Material Design System** - Selected for educational clarity, familiar patterns for students, and strong form/button components that support the quiz interaction model.

## Core Design Principles
1. **Clarity First**: Educational content demands easy readability and obvious interaction patterns
2. **Progressive Disclosure**: One screen, one task - minimize cognitive load
3. **Encouraging Feedback**: Positive reinforcement through visual feedback on interactions

## Typography System
- **Primary Font**: Inter or Roboto via Google Fonts CDN
- **Heading Scale**: 
  - H1: 2.5rem (40px) - Page titles
  - H2: 1.75rem (28px) - Section headers
  - H3: 1.25rem (20px) - Question numbers
- **Body Text**: 1rem (16px) with 1.6 line-height for readability
- **Weight Hierarchy**: Bold (700) for headings, Medium (500) for emphasis, Regular (400) for body

## Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, 8, and 12 for consistent rhythm
- Tight spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4, m-6 (between elements)
- Section spacing: py-8, py-12 (vertical sections)
- Container: max-w-2xl centered for optimal reading width on quiz content

## Page-Specific Layouts

### 1. Nama Siswa Input Page
**Structure**: Centered single-column card layout
- Container: max-w-md centered vertically and horizontally
- Card elevation with rounded corners (rounded-lg)
- Welcome heading (H1) with institution/topic subtitle
- Single text input field with clear label
- Large primary button below
- Spacing: p-8 within card, gap-6 between elements

### 2. Quiz Interface
**Structure**: Fixed question card with navigation footer
- Question card: max-w-3xl centered with p-8
- Progress indicator at top: "Soal X dari 10" with visual progress bar
- Question text (H2) with generous top padding
- Answer options: Vertical stack with gap-3
- Each option: Full-width button with left-aligned text, rounded-md, p-4
- Navigation: Sticky footer with "Sebelumnya" and "Selanjutnya" buttons

### 3. Hasil Akhir Page
**Structure**: Success card with score summary and leaderboard preview
- Top section: Centered celebration card (max-w-lg)
  - Large score display (H1 size) with "Total Skor" label
  - Student name confirmation
  - Encouraging message based on score tier
  - Primary CTA: "Lihat Semua Skor" button
- Bottom section (if showing leaderboard): max-w-3xl table/list
  - Simple table with Rank, Nama, Skor columns
  - Highlight current student's row

### 4. Leaderboard/Scores Page
**Structure**: Data table layout
- Page header with title and "Kuis Baru" button
- Responsive table: max-w-4xl centered
- Columns: No., Nama Siswa, Skor, Tanggal
- Row styling: Alternate subtle background on rows for scannability
- Mobile: Stack table cells vertically with labels

## Component Library

### Buttons
**Primary**: Full background, medium rounded corners (rounded-md), py-3 px-6, medium font weight
**Secondary**: Outlined style, same sizing as primary
**Answer Options**: Full-width, left-aligned text, icon or radio indicator on left, hover state with subtle background

### Form Inputs
**Text Input**: 
- Full-width within container
- Border with rounded-md
- py-3 px-4 for comfortable touch targets
- Focus ring for accessibility
- Clear label above input (mb-2)

### Cards
**Elevation**: Subtle shadow (shadow-md)
**Borders**: Rounded corners (rounded-lg)
**Padding**: p-6 to p-8 depending on content density
**Background**: Clean surface with slight elevation from page background

### Progress Indicators
**Progress Bar**: 
- Full-width horizontal bar at top of quiz
- Filled portion indicates completed questions
- Height: h-2, rounded-full

### Tables/Lists
**Headers**: Semibold text, subtle bottom border, py-3 px-4
**Rows**: py-3 px-4, border-bottom on all but last
**Responsive**: Convert to stacked cards on mobile (< 640px)

## Responsive Breakpoints
- **Mobile**: Base (< 640px) - Single column, full-width components, reduced padding
- **Tablet**: md (768px+) - Comfortable reading width maintained
- **Desktop**: lg (1024px+) - Maximum container widths applied

## Interaction Patterns
1. **Quiz Flow**: Linear progression with clear next/previous actions
2. **Answer Selection**: Single-choice radio behavior with visual selected state
3. **Form Validation**: Inline error messages below input if name is empty
4. **Score Submission**: Loading state on submission button
5. **Success State**: Confetti or subtle celebration animation on results page (one-time, non-looping)

## Accessibility Standards
- Minimum touch target: 44x44px for all interactive elements
- Keyboard navigation: Tab through all interactive elements
- Focus indicators: Visible focus rings on all focusable elements
- Labels: All inputs have associated labels
- Contrast: Minimum WCAG AA contrast ratios for all text

## Images
**No large hero images required** - This is a functional educational tool where clarity and immediate task focus are paramount. Any decorative elements should be minimal iconography (graduation cap, checklist icons) used sparingly in headers or success states.