'use strict';

var staffRoles = {
    executive: 1,
    committee: 1,
    leadership: 1
};

var statusTypes = ['Approved', 'Declined', 'Finished Interview', 'Scheduled for Interview'];

function isRequestFromUser(req) {
    return !(
        typeof req.session.user === 'undefined' ||
        typeof req.session.user.role === 'undefined'
    );
}

function isStaffRole(role) {
    return typeof staffRoles[role] !== 'undefined';
}

function isApprovedStaff(status)
{
    return statusTypes[status] === 'Approved';
}

function isRequestFromStaff(req) {
    if(isRequestFromUser(req) && isStaffRole(req.session.user.role))
    {
        //we have to make sure all but executive types have been approved through the interview proccess
        if(req.session.user.role !== 'executive')
        {
            return isApprovedStaff(req.session.user.status);
        }
        else
        {
            return true;
        }
    }
    return false;
}

module.exports = function () {
    return function (req, res, next) {
        if (typeof res.locals.isStaff !== 'boolean') {
            var isReqFromStaff = isRequestFromStaff(req);
            res.locals.isStaff = isReqFromStaff;
        }
        next();
    };
};
