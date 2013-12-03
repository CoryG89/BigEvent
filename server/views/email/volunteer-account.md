## Big Event

Hi <%= user.volunteer.firstName %>, your account data was recently modified,
please review the changes.

Here are your volunteer details that we've received:

 - **Email:** <%= user.email %>
 - **First Name:** <%= user.volunteer.firstName %>
 - **Last Name:** <%= user.volunteer.lastName %>
 - **Gender:** <%= user.volunteer.gender %>
 - **Address:** <%= user.volunteer.address %>
 - **City:** <%= user.volunteer.city %>
 - **State:** <%= user.volunteer.state %>
 - **Zip:** <%= user.volunteer.zip %>
 - **Phone:** <%= user.volunteer.phone %>
 - **Shirt Size:** <%= user.volunteer.shirtSize %>

If any of the above data is incorrect please visit the Big Event site to correct
it.
