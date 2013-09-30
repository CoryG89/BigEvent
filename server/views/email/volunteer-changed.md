## Big Event

Hi <%= user.first_name %>, your account data was recently modified,
please review the changes.

Here are your volunteer details that we've received:

 - **Email:** <%= user.email %>
 - **First Name:** <%= user.first_name %>
 - **Last Name:** <%= user.last_name %>
 - **Gender:** <%= user.gender %>
 - **Address:** <%= user.address %>
 - **City:** <%= user.city %>
 - **State:** <%= user.state %>
 - **Zip:** <%= user.zip %>
 - **Phone:** <%= user.phone %>
 - **Shirt Size:** <%= user.shirtsize %>

If any of the above data is incorrect please visit the Big Event site to correct it.
