Sorted.js is a replacement for the popular but dated Sorttable.js. It's only purpose is to make sorting HTML tables as simple and easy as possible, with the bonus of also allowing specificed columns to be resized.

It's designed to gracefully handle any changes made to the table it's bound to, e.g. adding or removing columns and rows, changing values.

## Getting started
Include `sorted.js` somewhere in your page:
``` html
<script type="text/javascript" src="sorted.js"></script>
```

Give it a table element to bind to:
``` javascript
// Ensure `mytable` exists before calling
new Sorted(document.getElementById("mytable"))
```

And finally, be sure to add come CSS to provide some visual feedback, or use the included stylesheet:

``` html
<link rel="stylesheet" type="text/css" href="sorted.css">
```

## Features
* Designed to handle dynamic changes to table columns, rows and cells.
* No dependencies
* No hardcoded CSS
* No DOM injection.
* Sorts tables with multiple <tbody> elements, sorting each as it's own independent collection.
* Column resize capability

## Compatibility
Sorted.js works on all modern browsers. IE11 is also supported, though the included CSS doesn't work too well with IE11.

## How To...

### Exclude columns as sortable
To exclude a column from being sortable, add the `data-no-sort` attribute to the column header.

``` html
<th data-no-sort>Comments</th>
```

### Specify sort function
Sorted.js will guess an appropriate sort function based on the first value for each column, though you'll likely want to specify the sort function to use for certain columns. The available sort functions are:

* sortAlpha - Sorts the column alphabetically.
* sortNumeric - Sorts the column numerically. Strips non-numeric characters as to support a wide range of number formatting.
* sortNatural - A combination of sortAlpha and sortNumeric, sorting numbers numerically rather than alphabetically. Stricter than sortNumeric when determining what is considered a number.
* sortDate - Parses column values as dates and sorts accordingly.


### Sort by custom value
If the values in the table cells aren't appropriate for sorting, you can define an alternate sorting value by setting the `data-sort-value` attribute on the table cell.

``` html
<td data-sort-value="200">Two-hundred</td>
<td data-sort-value="11">Eleven</td>
<td data-sort-value="3000">Three-thousand</td>
```


### Change default sort direction
For each column you would like to change the default sort direction for, simply preset the `data-sort-state` attribute on the column header:

``` html
<th data-sort-state="sorted">My Column</th>
```

This will make Sorted.js believe it's already sorted that column ascendingly, and will therefore reverse sort it the next time it's clicked.

### Make a column resizable
To make a column resizable, add the `data-resizable` attribute to the column header.

``` html
<th data-resizable>My Resizable Column</th>
```

If you'd like the resize handle to be bigger, set the resizeHandleWidth option to your desired width when instantiating Sorted.js. Be sure to update the stylesheet to match.

```javascript
new Sorted(document.getElementById("mytable"), {resizeHandleWidth: 8})
```

### Sort on load
To sort the table on load, or otherwise trigger sorting programmatically (i.e. not on click), call .sort(), like so:

```javascript
var sorted = new Sorted(document.getElementById("mytable"))
sorted.sort(1) // Sorts the second column
```

Or...
```javascript
var myTable = document.getElementById("mytable")
new Sorted(myTable)
myTable.sorted.sort(1) // Sorts the second column
```

### Lock rows to the top or the bottom
The best way to keep certain rows at the top or bottom of your table, is to use semantic HTML. Anything you want to stay at the top should be put in <thead>, and anything you want to stay at the bottom of your table should be placed in <tfoot>. Sorted.js only sorts rows within <tbody>.

## Feedback
Please use Github's *Issues* tab to ask questions, report issues,  or provide feedback and suggestions.
