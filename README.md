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

**Create a ticket and update a custom field (*test*)**

I believe this needs to be a two stage process:

* create the ticket (get the ID number)
* update the custom field

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/56f561db7395a6ab424269b4fecfdf5fb1d1b479/screencap/new-ticket-custom-field.png)

Creating the ticket is straightforward. Specify the ID numbers of the **category** and **user**, and supply the **body**, **subject** and **tags** as strings. You can supply a `priorityId` if you like. (https://www.jitbit.com/helpdesk/helpdesk-api/#/?id=ticket-post)

```javascript
msg.headers = {};
msg.headers.Authorization = 'Bearer xxxxxxxxxxxx';

msg.payload = {
 "categoryId": "4xxxx3",
 "body": "This is a test from NodeRED. (008)",
 "subject": "Test 008",
 "userId": "1xxxxxx4",
 "tags": "NodeRED"
};

msg.url = "https://your-domain.jitbit.com/helpdesk/api/ticket";
return msg;
```

The API call returns the ticket number, so save that, and then update the custom field.

```javascript
var ticketId = msg.payload;
var fieldId = "4xxx7";
var customVal = "D123456";

msg.url = "https://your-domain.jitbit.com/helpdesk/api/SetCustomField?ticketId="+ticketId+"&fieldId="+fieldId+"&value="+customVal;

msg.payload="";
return msg;
```

And ideally confirm the `msg.statusCode` (not the msg.payload) and it should be `200`.

-----

**Trigger based on age of ticket (*concept*)**

So far as I can tell, there is no trigger to target a ticket that has reached a certain age; say, 20 days old, regardless of its due-date (if any). However, using an admin-only custom field (hidden, in effect), a scheduled API call could be used to trigger a sequence of rules after a specified delay. (A change of status could be a potential trigger, but if you want to ignore 'closed' tickets, using a custom field may be safer.)

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/b5b00941ab4962a00577b67e3dcad4f5b169a815/screencap/trigger-custom-edit.png)

In this example, the custom field `44566` named "Aged-20" is a combo-dropdown, **no** or **yes**, with no set as the default. The automation rule will only target tickets that are not already closed, and those conditions could be expanded - perhaps only a specified category requires this 20 day rule?

> Also consider impact if **other** custom fields are edited on the same ticket. Perhaps add an additional `status isn't escalated` condition, to prevent it being triggered repeatedly?

With a simple API call:

```text
/helpdesk/api/SetCustomField?ticketId=xxxxxx&fieldId=44566&value=yes
```

...the rule is triggered, the status and priority are updated, and the email is sent to all subscribers.



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

