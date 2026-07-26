# Day 12 Checklist

- [ ] The form fields show a plain gray border on page load (not red, even though they're empty and `required`)
- [ ] Typing an invalid email (no `@`) and then clicking away shows a red border
- [ ] Typing a valid username (3+ letters) shows a green border
- [ ] Before deleting anything, you actually opened DevTools, inspected one of the `.broken-box` elements, and observed in the Styles panel that nothing was actually wrong with `.broken-box` or `.broken-layout` themselves (proving the bug, if it were live, would have been the separate `!important` rule, not these)
- [ ] After your fix, the 3 boxes display side by side, equal width, with visible gaps between them
- [ ] You can explain, in your own words, why the `!important` rule in the starter file was dangerous even though it happened to target an id that didn't exist yet — what would happen the moment someone added `id="special-box-override"` to any element anywhere on the page?

Compare against `solution.css` if anything is unclear.
