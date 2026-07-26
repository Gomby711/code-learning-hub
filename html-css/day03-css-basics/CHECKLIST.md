# Day 3 Checklist

Open your edited `starter.html` (linked to your edited `starter.css`) in a browser and confirm:

- [ ] The heading "Specificity Test" renders GREEN (the `#main-title` ID rule beat both the element and class rules)
- [ ] The paragraph renders RED (the `.warning` class rule beat the plain `p` element rule)
- [ ] You can explain out loud, in your own words, why the heading result and the paragraph result each happened — specificity, not source order
- [ ] The `.box` div has visible padding (space between its border and its text) and a visible black border
- [ ] Open DevTools, click on `.box`, and check the Box Model diagram (usually in the Styles or Computed tab) — confirm the box's rendered width matches 200px total (not 200px content + extra for padding/border), proving `box-sizing: border-box` is working
- [ ] Temporarily comment out your `box-sizing: border-box` rule in DevTools (click the checkbox next to it in the Styles panel, don't edit your actual file) and watch the box visibly grow larger — then re-enable it and confirm it shrinks back

Compare against `solution.css` / `solution.html` if anything is unclear.
