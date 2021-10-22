# API Experiments

* [Initial test calls to API via NodeRED](#initial-test-calls-to-api-via-nodered)  
* [Automation rule POST new ticket and use NodeRED to GET a field](#automation-rule-post-new-ticket-and-use-nodered-to-get-a-field)  
* [Create a ticket and update a custom field](#create-a-ticket-and-update-a-custom-field)  
* [Trigger based on age of ticket](#trigger-based-on-age-of-ticket)  
* [Submit YAML via Email](#submit-yaml-via-email)  

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

## Create a ticket and update a custom field

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

## Trigger based on age of ticket

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

## Submit YAML via Email

Experiment to pull a block of YAML data from an email, and write it to custom fields. Following a 'front-matter' style of syntax, placing the YAML between a header `---` and a footer `---`. Strict front-matter should begin on line one (I believe) but in this case it makes no difference. Also, the Jitbit API returns the ticket Body as HTML, and hence the regex/replace to strip out the tags.

```javascript
var emailBody = msg.payload.Body;
var emailYaml = emailBody.replace(/<(.|\n)*?>/g, '');

var starts = emailYaml.indexOf("---")+3;
var endsAt = emailYaml.indexOf("---", emailYaml.indexOf("---") + 1);

if (endsAt-starts<3) { msg.payload = "yaml : null"; } else
  { msg.payload = emailYaml.substring(starts,endsAt); }

return msg;
```
^- *test script to prove the `indexOf` combo!*

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/9a080ab923b42a99ad7cfcd7736c8ae2a40998f6/screencap/jitbit-post-yaml.png)

Jitbit automation rule triggers an HTTP POST when a new ticket is created in a specified category.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/84fba9338730ef51c56dfde7c988fdc8f03cf94d/screencap/nodered-yaml-to-custom.png)

Grab the ticket ID and extract the block of YAML.

```javascript
// Store ID and Body
msg.ticketId = msg.payload.ticketId;
var emailBody = msg.payload.emailBody;

// Write YAML to payload
var emailYaml = emailBody.replace(/<(.|\n)*?>/g, '');
var starts = emailYaml.indexOf("---")+3;
var endsAt = emailYaml.indexOf("---", emailYaml.indexOf("---") + 1);
if (endsAt-starts<3) { msg.payload = "yaml : null"; } else
  { msg.payload = emailYaml.substring(starts,endsAt); }

// Set the authorisation header
msg.headers = {};
msg.headers.Authorization = 'Bearer xxxxxxxxxxxx';

return msg;
```

> There's no meaningful validation here, unless it's missing altogether...

Using the NodeRED YAML node to turn that into a JSON object makes it easy to pick up the values required for the custom field data.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/4f9674d78a98121728b1e8d940b43d7b0aee7436/screencap/yaml-to-json.png)

```javascript
// Set values
var colour = "&cf4xxx1="+msg.payload.colour;
var speed = "&cf4xxx2="+msg.payload.speed;
var pin = "&cf4xxx3="+msg.payload.pin;

//favourite colour = 4xxx1
//maximum speed    = 4xxx2
//debit card pin   = 4xxx3

// Values
var customFields = colour+speed+pin;

// Set the URL (set custom fields API)
msg.url = "https://your-domain.jitbit.com/helpdesk/api/SetCustomFields?TicketId="+msg.ticketId+customFields;

return msg;
```

In this first test case, the email was sent as follows:

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/f7568ae69943477344d35a40c8cbec7987950034/screencap/yaml-email-example.png)

And the fields are populated almost immediately:

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/b15694b179c750294337e550294e5f679dbd2964/screencap/yaml-custom-fields-filled.png)

A niche requirement perhaps, but could be handy if there's a requirement to accept data from a 3rd party who can't directly call the API.
