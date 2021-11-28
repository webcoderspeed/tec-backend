import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';


router.route('/forgotPassword').post(userController.forgotPassword);
router.route('/resetPassword/:token').put(userController.resetPassword);
router.post('/login', userController.authUser);

router.route('/add').post(protect, admin, userController.addUser);

router.route('/follow').put(protect, userController.followUser);

router.route('/unfollow').put(protect, userController.unFollowUser);

router
  .route('/profile')
  .get(protect, userController.getUserProfile)
  .put(protect, userController.updateUserProfile)

router
  .route('/')
  .post(userController.registerUser)
  .get(protect, admin, userController.getUsers);

router
  .route('/:id')
  .delete(protect, admin, userController.deleteUser)
  .get(protect, userController.getUserById)
  .put(protect, admin, userController.updateUser);

export default router;
