-----

## HTTP POST Action

The automation rule HTTP POST "3. Do This" does not support the full range of email template fields... I'd hoped it would. The following syntax worked fine for me, and can trigger a further API call to pick up any other fields you might want.

![](https://github.com/jonathancraddock/Jitbit-Custom/blob/9a080ab923b42a99ad7cfcd7736c8ae2a40998f6/screencap/jitbit-post-yaml.png)

* "#subject#"
* "#url#"
* "#from#"
* "#fromEmail#"
* "#body#"
* "#technician#"
* "#cf_XXXX#"
* "#date#"
* "#ticketId#"
* #priority#
* "#statusId#"
* "#most_recent_message#"

-----

## Time Based Rules

Following some slightly unexpected timings using rules based on "2 hr before due date", etc, received the following update.

> "Timer-based automation rules are checked twice an hour randomly; if the condition of the rule are met, it fires. If not, the check is postponed."  

-----
