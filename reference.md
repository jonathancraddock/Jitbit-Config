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

-----
