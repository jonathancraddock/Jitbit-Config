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

-----

## Initial test calls to API via NodeRED

Confirm authorisation, and query a ticket:

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/7eca828954c4e2addc8cb96253adc04a6df38a25/screencap/nodered-api-test-01.png)

* `/api/Authorization`  
* `/api/ticket?id=40xxxx54`

This initial test was via my own user token, which you can query at: `/User/Token`

In NodeRED, built the header as follows:

```javascript
msg.payload = "";
msg.headers = {};
msg.headers['Authorization'] = 'Bearer xxxxxxxxxxxx';
return msg;
```

A successful authorisation returns the user's name and other details, the ticket appears to be returned without custom fields, but there is a separate call, `/api/TicketCustomFields?id=`, which returns them as an array of objects.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/ca13ec309df3c8d2f582e683624f49db950e0e69/screencap/api-custom-fields.png)

-----

## Automation rule POST new ticket and use NodeRED to GET a field

As a proof of concept, this Jitbit automation rule is triggered whenever a new ticket is created in a specified category.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0f25a6b41ff5d54b5500f57219339b02717322de/screencap/jitbit-new-ticket-post.png)

The ticket ID is sent to a NodeRED prototype flow - essentially an HTTP endpoint which waits for a second, and then pulls a couple of fields from the ticket.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0f25a6b41ff5d54b5500f57219339b02717322de/screencap/nodered-query-new-ticket.png)

In this case, looking for the company name and the creation date of the ticket, but same principle for any field on the ticket, and (with a small tweak) any custom field too.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0f25a6b41ff5d54b5500f57219339b02717322de/screencap/nodered-new-ticket-debug.png)

Not 100% sure how this is useful, but demonstrates a function could be written to feed an external dashboard system, or for use with an external notification system (SMS or a push notification service), or if pre-defined alerts are required with more precise timings than Jitbit can deliver internally...

-----

**Trigger based on age of ticket (*concept*)**

So far as I can tell, there is no trigger to target a ticket that has reached a certain age; say, 20 days old, regardless of its due-date (if any). However, using an admin-only custom field (hidden, in effect), a scheduled API call could be used to trigger a sequence of rules after a specified delay. (A change of status could be a potential trigger, but if you want to ignore 'closed' tickets, using a custom field may be safer.)

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/b5b00941ab4962a00577b67e3dcad4f5b169a815/screencap/trigger-custom-edit.png)

In this example, the custom field `44566` named "Aged-20" is a combo-dropdown, **no** or **yes**, with no set as the default. The automation rule will only target tickets that are not already closed, and that conditions could be expanded - perhaps only a specified category requires this 20 day rule?

With a simple API call:

```text
/helpdesk/api/SetCustomField?ticketId=xxxxxx&fieldId=44566&value=yes
```

...the rule is triggered, the status and priority are updated, and the email is sent to all subscribers.

-----

## Custom CSS and JS

The following sections and notes are suitable for demo and proof-of-concept only. Additional testing is required. In particular, I know there are several conditions that will not be matched by these CSS selectors. (Input field types that are not in use by this instance, etc, and the selectors would need to be modified to target those elements.)

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

**The rounded box that surrounds custom fields on 'new ticket' page**

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

**Custom Fields Stacked Vertically**

If users are more comfortable with vertical fields, there may be a simple CSS tweak to alter the default horizontal format.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0ce50883325879d8dd6a8c6851b2c4d26c9fbf6d/screencap/fields-as-blocks_anon.PNG)

Custom CSS:

```css
.report-settings div.report-input {
  clear: both;
  width: 100%;
}

label {
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

**Red placeholder text on mandatory custom fields**

To highlight the `placeholder` of a custom field, eg/ not other required fields such as 'subject'.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0446d216e583d5953b165a61ae337f697c3817ec/screencap/mandatory-custom-empty.png)

```css
div.report-input .required::placeholder {
  color: #ff00005c;
}
```

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/0446d216e583d5953b165a61ae337f697c3817ec/screencap/mandatory-custom-filled.png)

Text returns to default black when fields are in use.

-----

**EXPERIMENTAL - Higlight entire row for "Critical" priority:**

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

-----

## Automation Rule Notes

> "Timer-based automation rules are checked twice an hour randomly; if the condition of the rule are met, it fires. If not, the check is postponed."  
^- *explains some minor time discrepencies I had been noticing with emails triggered by due-date related rules...*

-----

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

