const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');

router.get('/:id', controller.profile);
router.post('/:id/follow', controller.follow);
router.post('/:id/unfollow', controller.unfollow);

module.exports = router;
