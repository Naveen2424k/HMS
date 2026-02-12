const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, authorize('Admin'), getUsers)
    .post(protect, authorize('Admin'), createUser);

router.route('/:id/role').put(protect, authorize('Admin'), updateUserRole);
router.route('/:id').delete(protect, authorize('Admin'), deleteUser);

module.exports = router;
