## Big Event

Hi <%= staffMember.firstName %>, your account data was recently modified,
please review the changes.

Here are your application details that we've received:

<% if(userType === 'committee') { %>
 - **Registration Type:** Committee Member
<% } else if(userType === 'leadership') { %>
 - **Registration Type:** Leadership Team Member
<% } else if(userType === 'coordinator') { %>
 - **Registration Type:** Project Coordinator
<% } %>
 - **Email:** <%= user.email %>
 - **First Name:** <%= staffMember.firstName %>
 - **Last Name:** <%= staffMember.lastName %>
 - **Interview Time:** <%= staffMember.time %>

If any of the above data is incorrect please visit the Big Event site to correct
it.
