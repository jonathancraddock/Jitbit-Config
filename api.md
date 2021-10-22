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

-----
