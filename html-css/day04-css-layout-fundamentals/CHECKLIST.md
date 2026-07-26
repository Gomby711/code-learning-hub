# Day 4 Checklist

- [ ] The two `.inline-test` spans stay side by side on one line, and their `width: 150px` is visibly ignored (their light blue background only wraps their text, not 150px wide)
- [ ] The two `.block-test` divs each start on their own new line and are visibly 150px wide with a light green background
- [ ] The "NEW" badge sits pinned to the top-right corner of the gray card, not the top-right corner of the browser window
- [ ] Temporarily remove `position: relative` from `.card` in DevTools (uncheck it in the Styles panel) and observe the badge jump to pin against the whole page instead — then confirm it moves back once you re-check it
- [ ] Using DevTools, measure the gap between the "First box" and "Second box" — confirm it's 30px, not 50px
- [ ] You can explain, in your own words, why margin collapsing happens and that it does NOT apply to padding or to horizontal margins

Compare against `solution.css` if anything is unclear.
