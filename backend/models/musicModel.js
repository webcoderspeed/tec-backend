import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// write a scehma for the music
const musicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  file: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  }
});

const Music = mongoose.model('Music', musicSchema);

export default Music;
