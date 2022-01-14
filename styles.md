-----

## Custom CSS and JS

The following sections and notes are intended for demo and proof-of-concept. Additional testing is required. In particular, I know there are potential conditions that may not be matched by these CSS selectors. (Input field types that are not in use by this instance, etc, and the selectors would need to be modified to target those elements.)

-----

### Adjust title position

In this example, it was to ensure the baseline of the text was better aligned with the shape of the logo.

```CSS
/* Adjust alignment of "Helpdesk Title" */
/* (JC, 24.9.2021) */
#divBigHeader .topheader #logo #spanTitle {
    font-family: sans-serif;
    margin-left: -14px;
    position: relative;
    top: 4px;
}
```

-----

### Additional (colour) emphasis on "overdue" ticket

The default highlighting for the row displaying an overdue ticket is a delicate shade of pink! It's quite subtle, and if additional emphasis is required, the following CSS would target those rows:

```CSS
table.horizseparated tr.overdue td {
    background-color: #fffadf;
}
```

This example is a pale orange.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/bfba28aef24cd8a9f1eb2bb92634803ff95225b2/screencap/orange-overdue-row.png)

-----

### Alternative aesthetic for custom fields

In this demo, custom fields are stacked vertically with some additional behaviours:

* font size is increased
* field widths are extended/matched
* mandatory fields have their placeholder coloured red
* the field with focus has a bold yellow/black border
* the background is pale grey
* white-space is increased for improved clarity

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/ee7337a306532c7b446063ddb67d9f83e7d9ccf8/screencap/vertical-fields-yellow-focus.png)

```css
(css in review...)
```
^- *demo is functional, but current custom CSS syntax can be simplified*

-----

### Gradient vs Plain colour on menu/tab bar

If for example your corporate colour scheme required a named colour code and no gradient.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/a64b86d1f402ee1b9c75ad2d1bdb456ca3b79cd3/screencap/tab-menu-gradient.png)  
^- *default*

```css
/* Set menu/tab bar background colour */
.tabmenu2, .tabmenu li.active a, .blueheader {
    background-color: #667280;
}

/* Remove shaded gradient from menu/tab bar */
.tabmenu2 {
  background-image: none;
}
```

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/a64b86d1f402ee1b9c75ad2d1bdb456ca3b79cd3/screencap/tab-menu-plain.png)  
^- *plain colour and no gradient*

-----

### The rounded box that surrounds custom fields on 'new ticket' page

For example, to draw additional attention to custom fields, particularly for new tech staff, who may not be familiar with Jitbit.

```css
#trCustomFields td .outerroundedbox {
  background-color: #4a6c9182;
}
```

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/99f6f543f9bab1427c39fd9dd1809f006ffdd888/screencap/custom-field-background.png)

Or, to add a border to draw attention towards a specified ID:

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/e32a30f62d490a6afd4fc9cf5658eabaa85cce58/screencap/yellow-input-highlight.png)

```css
#CustomFieldValue44285 {
  border-style: solid;
  border-color: #eaea6d;
  border-width: 3px;
}
```

Or for a yellow/black border on "focused" text fields:

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/9a59a937d359f3b49a167b799ce216c6eb8edb22/screencap/yellow-black-border.png)

```css
[id^="CustomFieldValue"]:focus {
  outline: 3px solid #fd0;
  outline-offset: 0;
  box-shadow: inset 0 0 0 2px #000;
  border-radius: 0;
}
```

There's no 'class' directly applied to these fields, but could consider "starts with" selectors such as `[id^="CustomFieldValue"]:focus`, whilst also remembering to take into account existing selectors, such as `input[type="text"]`, etc.

Along similar lines, target the background colour of mandatory custom fields:

```css
select.required, .report-input input.required, textarea.required {
  background-color: #f9e9dd;
}
```

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/2698f9cb9377b1a859bc0be2774270d7f4886847/screencap/mandatory-background.png)  
^- *example*

-----

### Custom Fields Stacked Vertically

If users are more comfortable with vertical fields, there may be a simple CSS tweak to alter the default horizontal format.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0ce50883325879d8dd6a8c6851b2c4d26c9fbf6d/screencap/fields-as-blocks_anon.PNG)

Custom CSS:

```css
.report-settings div.report-input {
  clear: both;
  width: 100%;
}

.report-settings div.report-input label {
  float: left;
  width: 10em;
  margin-right: 1em;
}

.report-settings div.report-input input[type="text"], .report-settings div.report-input select, div.report-input textarea {
  width: 60%;
}

div.report-settings div.report-input textarea {
  width: 60% !important;
}
```

-----

### Red placeholder text on mandatory custom fields

To highlight the `placeholder` of a custom field, eg/ not other required fields such as 'subject'.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0446d216e583d5953b165a61ae337f697c3817ec/screencap/mandatory-custom-empty.png)

```css
div.report-input .required::placeholder {
  color: #ff00005c;
}
```

Dropdowns appear more tricky to target, by their nature, but also because of the use of inline styles. The following displays the default placeholder in red, and reverts to black when a selection is made. (Works because the inline styling is rewritten on a mouse-down event.)
```css
.report-settings div.report-input select.required[style*="color:#aaa;"] {
    color: #faafaf !important;
}
```

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0446d216e583d5953b165a61ae337f697c3817ec/screencap/mandatory-custom-filled.png)

Text returns to default black when fields are in use.

-----

### EXPERIMENTAL - Higlight entire row for "Critical" priority:

Critical is normally indicated via a small coloured badge icon, towards the right of the affected row, and this was a test to draw additional attention to the entire row.

> **TIP:** See also, the proposed `:has` selector -> https://css-tricks.com/did-you-know-about-the-has-css-selector/ although doesn't seem to be supported by any browsers yet?

jQuery (in custom JS panel)
```javascript
// Add '.criticalRow' to parent row that contains a 'critical' priority tag
// (JC, 4.10.2021)
$(".priority2").parents('tr').addClass("criticalRow");
```
^-*target any parent row that contains a '.priority2' span element*

CSS (in custom CSS panel)
```css
/* Amber background to row with 'critical' priority tag */
/* (JC, 4.10.2021) */
table.horizseparated tr.criticalRow td {
  transition: all 0.2s ease;
  background-color: #fbb32b40;
}

/* Pale-Amber background to row (hover) with 'critical' priority tag */
/* (JC, 4.10.2021) */
table.horizseparated tr.criticalRow:hover td {
  transition: all 0.2s ease;
  background-color: #fbb32b20;
}
```

Example of row highlighting, using jQuery to target the 'parent' element of any row that contains a 'critical' span.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/afe3387eac7dd48100cef5731666e82079bd460f/screencap/highlight-row.png "example row highlight")

> **TIP:** In the browser console, entering `typeof jQuery` will return `function` if jQuery is loaded, and `undefined` if it's not loaded. Quick and easy, without having to look at the page source...

-----

### Edit Tab Menu Headings

Alter menu headings:

![](https://github.com/jonathancraddock/Jitbit-Config/blob/main/screencap/tab-menu-edit.png)

> **NOTE:** Jitbit support responded there's no supported method for modifying these headings.

```
$('.tabmenu2 li:nth-child(1) a').text($('.tabmenu2 li:nth-child(1) a').text().replace('Unanswered','New'));
$('.tabmenu2 li:nth-child(2) a').text($('.tabmenu2 li:nth-child(2) a').text().replace('Unclosed','Open'));
```
^- *unanswered becomes new, unclosed becomes open...*

-----

### Increase emphasis on section-category in list view:

```CSS
/* Highlight the Section>Category in main list view */
/* (JC, 24.9.2021) */
span.categoryName {
    color: #12659d;
    font-weight: 900;
    background-color: #6495ed2e;
}
```
In this example, placing pale blue highlight on section/category.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/a9614d2dccec8c450f8e5fd0f36e933a2c49c198/screencap/highlight-category.png "category highlight")

-----

### Modify green 'tag' displayed on main tickets view from `upd by tech` to `waiting`.

```CSS
/* Hide 'upd by tech' from main list view */
/* proof of concept arising from question raised in demo */
/* (JC, 01.10.2021) */
.badge.tech-badge {
    background-color: #70c45c;
    position: relative;
    visibility: hidden;
}

/* Add wording+background via pseudo-class */
/* (JC, 01.10.2021) */
.badge.tech-badge::after {
    visibility: visible;
    content: "waiting";
    background-color: #70c45c;
    padding: 3px 5px;
    border-radius: 3px;
    line-height: 9px;
    margin: -3px -5px -1px 0;
    float: right;
}
```

-----

### Category 'Tooltip'

Testing a pop-up link to a Knowledge Base procedure when selecting a category:

```html
<a href="https://helpdesk.example.com/KB/View/12345-some-instructions" target="_blank" rel="noopener">
Open Guidance Doc
</a><br />
<em>(Opens in new tab.)</em>
```
^- *added to category 'description' field*

> **TIP:** Note that page will route ok with only the ID specified. Eg/ `https://helpdesk.example.com/KB/View/12345-`. This may help avoid broken links where a title is edited. **UPDATE:** More accurately, it looks like everything after the `-` is ignored, so the actual title doesn't matter, but I'd still stick with the previous tip! ;-) Eg/ Drop the first and last parts of the URI and go with: `/KB/View/12345-`

-----
