'use strict';

var staffRoles = {
    executive: 1,
    committee: 1,
    leadership: 1
};

function isRequestFromUser(req) {
    return !(
        typeof req.session.user === 'undefined' ||
        typeof req.session.user.role === 'undefined'
    );
}

function isStaffRole(role) {
    return typeof staffRoles[role] !== 'undefined';
}

function isRequestFromStaff(req) {
    return isRequestFromUser(req) && isStaffRole(req.session.user.role);
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
