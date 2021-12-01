import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Music from '../models/musicModel.js';

/**
 * @desc - Get all music
 * @route - GET /api/music
 * @access - Public
 * @param - req.query.keyword
 */
export const getMusic = asyncHandler(async (req, res, next) => {
  const keyword = req.query.keyword
    ? {
      title: {
        $regex: req.query.keyword,
        $options: 'gi',
      },
      artist: {
        $regex: req.query.keyword,
        $options: 'gi',
      },
      album: {
        $regex: req.query.keyword,
        $options: 'gi',
      },
    }
    : {};

  const music = await Music.find(keyword);

  if (music) {
    res.status(200).json({
      music,
    });
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - Get music by id
 * @route - GET /api/music/:id
 * @access - Public
 * @param - req.params.id
 */
export const getMusicById = asyncHandler(async (req, res, next) => {
  const music = await Music.findById(req.params.id);

  if (music) {
    res.status(200).json(music);
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - Create music
 * @route - POST /api/music
 * @access - Private
 * @param - req.body.title, req.body.artist, req.body.album, req.body.genre, req.body.year, req.body.file
 */
export const createMusic = asyncHandler(async (req, res, next) => {
  const { title, artist, album, genre, year, file } = req.body;

  const music = await Music.create({
    title,
    artist,
    album,
    genre,
    year,
    file,
    userId: req.user._id,
  });

  if (music) {
    res.status(201).json({
      music,
    });
  } else {
    res.status(400).json({
      message: 'Invalid music data',
    });
  }
});

/**
 * @desc - Update music
 * @route - PUT /api/music/:id
 * @access - Private
 * @param - req.body.title, req.body.artist, req.body.album, req.body.genre, req.body.year, req.body.file
 */
export const updateMusic = asyncHandler(async (req, res, next) => {
  const music = await Music.findById(req.params.id);

  if (music) {
    const { title, artist, album, genre, year, file } = req.body;

    music.title = title ?? music.title;
    music.artist = artist ?? music.artist;
    music.album = album ?? music.album;
    music.genre = genre ?? music.genre;
    music.year = year ?? music.year;
    music.file = file ?? music.file;

    await music.save();

    res.status(200).json(music);
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - Delete music
 * @route - DELETE /api/music/:id
 * @access - Private
 * @param - req.params.id
 */
export const deleteMusic = asyncHandler(async (req, res, next) => {
  const music = await Music.findById(req.params.id);

  if (music) {
    await music.remove();

    res.status(200).json({
      message: 'Music removed',
    });
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - Get music by user
 * @route - GET /api/music/user/:id
 * @access - Private
 * @param - req.params.id
 */
export const getMusicByUser = asyncHandler(async (req, res, next) => {
  const music = await Music.find({ userId: req.params.id });

  if (music) {
    res.status(200).json({
      music,
    });
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - create a playlist for a user
 * @route - POST /api/music/playlist/:id
 * @access - Private
 */
export const createPlaylist = asyncHandler(async (req, res, next) => {
  const music = await Music.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!user) throw new Error('User not found');

  if (music) {

    const newMusic = {
      name: music.title,
      musicId: music._id,
    }

    user.musicPlaylist.push(newMusic);
    await user.save();

    res.status(200).json({
      message: 'Music added to playlist',
    });
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - delete a playlist for a user
 * @route - DELETE /api/music/playlist/:id
 * @access - Private
 * @param - req.params.id
 */
export const deletePlaylist = asyncHandler(async (req, res, next) => {
  const music = await Music.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!user) throw new Error('User not found');

  if (music) {
    const musicPlaylist = user.musicPlaylist.filter(item => item.musicId !== req.params.id);
    user.musicPlaylist = musicPlaylist;
    await user.save();

    res.status(200).json({
      message: 'Music removed from playlist',
      playlist: user.musicPlaylist,
    });
  } else {
    res.status(404).json({
      message: 'No music found',
    });
  }
});

/**
 * @desc - get a playlist for a user
 * @route - GET /api/music/playlist
 * @access - Private
 */
export const getPlaylist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new Error('User not found');

  res.status(200).json({
    playlist: user.musicPlaylist,
  });
  next();
});
