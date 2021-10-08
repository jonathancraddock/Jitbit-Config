# Jitbit Customisation / Notes

For reference:

* Homepage -> https://www.jitbit.com/ 
* Github -> https://github.com/jitbit  
* Support -> https://www.jitbit.com/support/ 
* FAQ -> https://www.jitbit.com/helpdesk/faq/ 
* API Ref -> https://www.jitbit.com/helpdesk/helpdesk-api/#/
* On-Prem Guide -> https://www.jitbit.com/docs/helpdesk/!!!helpdesk-software-readme.htm

FAQ and Support:

* https://www.jitbit.com/helpdesk/automation-rules-description/
* https://support.jitbit.com/helpdesk/KB/View/3618726-how-to-escalate-a-ticket-and-create-slas-in-jitbit-helpdesk  
* https://support.jitbit.com/helpdesk/KB/View/5491721-customizing-your-ticket-statuses  
* "Is approver" -> https://support.jitbit.com/helpdesk/Ideas/9551  

## Custom CSS and JS

Suitable for demo and proof-of-concept only. Additional testing required!

-----

**Adjust title position:**

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

**EXPERIMENTAL - Higlight entire row for "Critical" priority:**

Critical is indicated via a coloured badge icon, and this was a test to draw additional attention to the row.

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

**Increase emphasis on section-category in list view:**

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

**Modify green 'tag' displayed on main tickets view from `upd by tech` to `waiting`.**

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

## Category 'Tooltip'

Testing a pop-up link to a Knowledge Base procedure when selecting a category:

```html
<a href="https://helpdesk.example.com/KB/View/12345-some-instructions" target="_blank" rel="noopener">
Open Guidance Doc
</a><br />
<em>(Opens in new tab.)</em>
```
^- *added to category 'description' field*

> **TIP:** Note that page will route ok with only the ID specified. Eg/ `https://helpdesk.example.com/KB/View/12345-`. This may help avoid broken links where a title is edited. **UPDATE:** More accurately, it looks like everything after the `-` is ignored, so the actual title doesn't matter, but I'd still stick with the previous tip! ;-) Eg/ Drop the first and last parts of the URI and go with: `/KB/View/12345-`

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

## Email Template Reference

* **#What_Happened#** - is replaced with the main notification text. i.g. "The ticket has been closed" or "The ticket has been updated - [reply text]" etc. etc.  
* **#What_Happened_Short#** - Same as #What_Happened#, but truncated to 100 symbols.  
* **#Category#** - is replaced with the ticket category
* **#Subject#** - is replaced with the ticket subject
* **#From#** - who has submitted the ticket (full name if specified, otherwise - username)
* **#FromEmail#** - who has submitted the ticket
* **#FirstName#** - who has submitted the ticket (if specified)
* **#LastName#** - who has submitted the ticket (if specified)
* **#Originator#** - person that performed the action (added a comment or closed the ticket etc.)
* **#Priority#** - ticket priority
* **#Status#** - ticket status
* **#Body#** - ticket body
* **#URL#** - is replaced with a link to the ticket
* **#Recipients#** - is replaced with recipients list (email addresses) for the reply being added
* **#Recent_messages#** - 5 most recent entries from the ticket log (5 most recent replies)
* **#XRecent_messages#** - X most recent entries, where X is a number. E.g. #10Recent_messages"
* **#Most_recent_message#** - the one most recent entry from the ticket log (latest reply)
* **#Custom_Fields#** - all custom fields in the ticket. Only "public" fields are included (i.e. not "techs-only" or "admins-only"). You can also add individual custom fields by their ID's, using the #CF_1234# mask, where "1234" is the custom field ID. This way you can include even non-public custom fields (admins-only/techs-only).
* **#Company#** - name of the ticket originator's company
* **#Department#** - name of the ticket originator's department
* **#Location#** - name of the ticket originator's location
* **#Attachments#** - outputs a list of all ticket attachments with download links
* **#TicketID#** - outputs the ticket's unique ID-number in the helpdesk system
* **#Technician#** - the agent assigned to the ticket ("technician")
* **#TechnicianEmail#** - the email of the agent assigned to the ticket
* **#Date#** - the ticket date - when it has been submitted
* **#DueDate#** - the ticket due date - if set
* **#TimeSpent#** - time spent on the ticket by technicians
* **#Via#** - the ticket origin (email, web, live chat, etc.)
* **#Recent_Attachments#** - outputs a list of attachments from the last reply (warning: this mask works only if the notification is a "new ticket" or a "ticket updated" notification)
* **#Suggested_KB_articles#** - shows a list of links to Knowledge Base articles that are similar to the ticket (empty if no similar articles were found)
* **#Subscribers#** - replaced with a list of the ticket's subscribers (usernames)
* **#NonTechSubscribers#** - replaced with a list of the ticket's subscribers, but only those who are not admins or technicians.
* **#RatingLinks#** - replaced with customer satisfaction feedback prompt "Please rate your experience" and 3 links "Good/OK/Bad". If you'd like to customize the prompt text, use this #RatingLinks(Please rate our service)# NOTE: this mask works only in "Ticket Closed" emails sent to ticket creator, other subscribers won't receive it. Thus, if you have "Send updates to all aubscribers in CC" - this mask wont work too.
* **#Unsubscribe#** - replaced with an "unsubscribe from this ticket" link  

