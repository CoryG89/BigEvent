## Big Event

Hi, <%= user.first_name %>! We successfully received your submitted job request. We received the following details:

 - **Email:** <%= user.email %>
 - **First Name:** <%= user.first_name %>
 - **Last Name:** <%= user.last_name %>
 - **Address:** <%= user.address %>
 - **City:** <%= user.city %>
 - **State:** <%= user.state %>
 - **Zip:** <%= user.zip %>
 - **Phone:** <%= user.phone %>
 - **Alternate Phone** <%= user.altphone %>
 - **Estimated No. of Volunteers:** <%= user.numvolunteers %>
 - **Description:** <%= user.description %>

This job request will have to be reviewed by a Big Event staff member before it is accepted. You will receive another notification when this job request has been reviewed.
