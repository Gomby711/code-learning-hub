# Day 5 Checklist

- [ ] The navbar shows "MySite" pinned to the left and the three links pinned to the right, both vertically centered in the dark bar
- [ ] Shrink your browser window narrower and confirm the navbar items stay pinned to opposite edges (this is `justify-content: space-between` at work)
- [ ] The centered box sits exactly in the middle of its light gray container, both horizontally and vertically
- [ ] All three columns are the same width as each other
- [ ] All three columns are the same HEIGHT as each other, even though their text content is different lengths (this is the default `align-items: stretch` at work — you didn't need to set any explicit height)
- [ ] In DevTools, click the `.columns` container and try changing `justify-content` and `flex-direction` live to see how the layout changes, then reload to reset
- [ ] You can explain, in your own words, what the "main axis" and "cross axis" are for a `flex-direction: row` container vs a `flex-direction: column` container

Compare against `solution.css` if anything is unclear.
