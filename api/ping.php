<?php
//just echo out the date so it looks like an API that does something
echo date(DATE_RFC2822);

/*
A real app would check each item in the drink log, and save it to a database.

Then it would mark each saved log entry in the client side part of the app with a generated primary key.

You'd then know which entries have been saved to the server since the last time you were online.
*/
?>
