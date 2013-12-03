## Big Event

Hi <%= userData.firstName %>, thanks for registering for an interview with Big Event. 
We have successfully registered you with the following information:

<% if(userType === 'committee') { %>
 - **Interview Type:** Committee Member
<% } else if(userType === 'leadership') { %>
 - **Interview Type:** Leadership Team Member
<% } else if(userType === 'coordinator') { %>
 - **Interview Type:** Project Coordinator
<% } %>
 - **Email:** <%= user.email %>
 - **First Name:** <%= userData.firstName %>
 - **Last Name:** <%= userData.lastName %>
 - **Interview Time:** <%= userData.time %>

If any of the above data is incorrect please visit the Big Event site to correct
it.
