const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/add-user', userController.addUser);
router.post('/delete-user', userController.deleteUser);
router.post('/edit-user', userController.editUser);
router.post('/edit-phoneno', userController.editPhoneNumber);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/searchByUserName', userController.searchByUserName);

module.exports = router;