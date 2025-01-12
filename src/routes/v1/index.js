const express = require('express');
import auth from '../../modules/auth/route';
import user from '../../modules/users/routes';
import userReferCode from '../../modules/userReferCode/routes';
import contract from '../../modules/contracts/routes';
import agentNote from '../../modules/agentNote/routes';
import request from '../../modules/requests/routes';
import payment from '../../modules/payments/routes';
import company from '../../modules/company/route';
import statistics from '../../modules/statistics/routes';
import upload from '../../modules/upload/router';
import systemNotification from '../../modules/systemConfiguration/routes';
import notifications from '../../modules/notifications/routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/userReferCode', userReferCode);
router.use('/contracts', contract);
router.use('/agentNote', agentNote);
router.use('/requests', request);
router.use('/payments', payment);
router.use('/company', company);
router.use('/statistics', statistics);
router.use('/upload', upload);
router.use('/notifications', notifications);
router.use('/systemConfiguration', systemNotification);

module.exports = router;
