import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;


const replySchema = new mongoose.Schema(
  {
    reply: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    commentId: {
      type: ObjectId,
      ref: 'Comment',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: ObjectId,
      ref: 'Post',
      required: true,
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const dislikeSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    comments: [commentSchema],
    likes: [likeSchema],
    dislikes: [dislikeSchema],
    shareCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
