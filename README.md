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

## Category 'Tooltip'

Testing a pop-up link to a Knowledge Base procedure when selecting a category:

```html
<a href="https://helpdesk.example.com/KB/View/12345-some-instructions" target="_blank" rel="noopener">
Open Guidance Doc
</a><br />
<em>(Opens in new tab.)</em>
```
^- *added to category 'description' field*
