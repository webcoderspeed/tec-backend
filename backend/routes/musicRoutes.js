import express from 'express';
const router = express.Router();
import * as musicController from '../controllers/musicController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

router
  .route('/')
  .get(musicController.getMusic)
  .post(protect, musicController.createMusic);

router
  .route('/:id')
  .get(musicController.getMusicById)
  .put(protect, musicController.updateMusic)
  .delete(protect, musicController.deleteMusic);

router
  .route('/playlist').get(protect, musicController.getPlaylist);

router
  .route('/playlist/:id')
  .post(protect, musicController.createPlaylist)

// .put(protect, musicController.updatePlaylist)
// .delete(protect, musicController.deletePlaylist);

export default router;