## Big Event

Hi <%= user.wlData.first_name %>, thanks for volunteering with Big Event to serve your Auburn community. We have successfully registered you for the day of the event.

Here are your volunteer details that we've received:

 - **Name:** <%= user.wlData.name %>
 - **Email:** <%= user.wlData.emails.account %>
 - **Gender:** <%= user.eventData.gender %>
 - **Address:** <%= user.eventData.address %>
 - **City:** <%= user.eventData.city %>
 - **State:** <%= user.eventData.state %>
 - **Zip:** <%= user.eventData.zip %>
 - **Phone:** <%= user.eventData.phone %>
 - **Shirt Size:** <%= user.eventData.shirtsize %>

If any of the above data is incorrect please visit the Big Event site to correct it.
