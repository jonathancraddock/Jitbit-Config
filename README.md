# Jitbit Customisation

For reference:

* Homepage -> https://www.jitbit.com/ 
* Support -> https://www.jitbit.com/support/ 
* FAQ -> https://www.jitbit.com/helpdesk/faq/ 
* API Ref -> https://www.jitbit.com/helpdesk/helpdesk-api/#/
* On-Prem Guide -> https://www.jitbit.com/docs/helpdesk/!!!helpdesk-software-readme.htm

## CSS

Adjust title position:

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

Increase focus on section-category in list view:

```CSS
/* Highlight the Section>Category in main list view */
/* (JC, 24.9.2021) */
span.categoryName {
    color: #12659d;
    font-weight: 900;
    text-decoration: underline;
    background-color: #6495ed2e;
}
```

Modify green 'tag' displayed on main tickets view from `upd by tech` to `waiting`.

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

## Category 'Tooltip'

Testing a pop-up link to a Knowledge Base procedure when selecting a category:

```html
<a href="https://helpdesk.example.com/KB/View/12345-some-instructions" target="_blank" rel="noopener">
Open Guidance Doc
</a><br />
<em>(Opens in new tab.)</em>
```
^- *added to category 'description' field*

## User Import CSV

No header row, and use the following fields:

```text
username,password,email,firstname,lastname,company,phone,location,department
```

## Ticket Import CSV

No header row, and use the following fields:

```text
Subject, Body, Email, Category-name or ID, [Company-name, Assignee-username, Ticket-date, Custom-field-1, Custom-field-2...]
```
^- *body as HTML*

Normal example:
```html
"<!--html-->Please send a letter to Eileen Dover, inviting her to the edge of the Grand Canyon.<div><br>
</div>
<div>Thanks,</div>
<div>Random User</div>"
```

Weird example:
```html
"<!--html-->Test of ticket with ""quotes"" in the body.<div><br>
</div>
<div>And special characters, &lt;b&gt; and @ and some / \ characters. And what about a &amp;nbsp; or a &lt;script&gt; or a crazy combination of ""'""'""'""'"" or \""'/""""'\/&nbsp;</div>
<div><br>
</div>
<div>And a random "" to finish.</div>
<div><br>
</div>
<div>""</div>"
```
^- *single quote (within text) escaped as double-quote*
