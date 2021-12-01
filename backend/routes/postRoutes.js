import express from 'express';
const router = express.Router();
import * as postController from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

router
  .route('/').get(postController.getPosts)
  .post(protect, postController.createPost);

router
  .route('/user')
  .get(protect, postController.getPostsByUser);

router
  .route('/:id')
  .get(postController.getPost)
  .put(protect, postController.updatePost)
  .delete(protect, postController.deletePost);



router
  .route('/:id/comment')
  .post(protect, postController.commentOnPost)
  .get(protect, postController.getPostComment);

router
  .route('/:id/comment/:commentId')
  .delete(protect, postController.deleteComment);

router
  .route('/:id/comment/:commentId/reply')
  .post(protect, postController.replyToComment);

router
  .route('/:id/comment/:commentId/reply/:replyId')
  .delete(protect, postController.deleteReply);

router
  .route('/:id/like')
  .post(protect, postController.likePost);

router
  .route('/:id/dislike')
  .post(protect, postController.dislikePost);

router
  .route('/:id/share')
  .post(protect, postController.sharePost);


export default router;
