import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';

/**
 * @desc - Get all posts
 * @route - GET /api/posts
 * @access - Public
*/
export const getPosts = asyncHandler(async (req, res, next) => {
  const keyword = req.query.keyword
    ? {
      title: {
        $regex: req.query.keyword,
        $options: 'gi',
      },
      content: {
        $regex: req.query.keyword,
        $options: 'gi',
      },
    }
    : {};

  const posts = await Post.find({
    ...keyword,
  });

  if (posts) {
    res.status(200).json({
      count: posts.length,
      posts,
    });
  } else {
    res.status(404).json({
      message: 'No posts found',
    });
  }
});

/**
  @desc - Get a single post
  @route - GET /api/posts/:id
  @access - Public
*/
export const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - Create a post
  @route - POST /api/posts
  @access - Private
*/
export const createPost = asyncHandler(async (req, res, next) => {
  const { title, content, image } = req.body;

  const post = await Post.create({
    userId: req.user._id,
    title,
    content,
    image,
  });

  if (post) {
    res.status(201).json(post);
  } else {
    res.status(400).json({
      message: 'Invalid post data',
    });
  }
});

/**
  @desc - Update a post
  @route - PUT /api/posts/:id
  @access - Private
*/
export const updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const { title, content, image } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.image = image ?? post.image;

    await post.save();

    res.status(200).json(post);

  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - Delete a post
  @route - DELETE /api/posts/:id
  @access - Private
*/
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    await post.remove();

    res.status(200).json({
      message: 'Post removed',
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - Get all posts by user
  @route - GET /api/posts/user/:id
  @access - Private
*/
export const getPostsByUser = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({
    userId: req.params.id,
  });

  if (posts) {
    res.status(200).json(posts);
  } else {
    res.status(404).json({
      message: 'No posts found',
    });
  }
});

/**
  @desc - comment on a post
  @route - POST /api/posts/:id/comment
  @access - Private
*/
export const commentOnPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const { comment } = req.body;

    const newComment = {
      userId: req.user._id,
      postId: req.params.id,
      comment,
    };

    post.comments.push(newComment);

    await post.save();

    res.status(201).json({
      comment: post.comments,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - delete a comment
  @route - DELETE /api/posts/:id/comment/:commentId
  @access - Private
*/
export const deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId.toString()
    );

    if (!comment) {
      return res.status(404).json({
        message: 'No comment found',
      });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    // remove comment which match comment id
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId.toString()
    );

    await post.save();

    res.status(200).json({
      comments: post.comments,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - reply to a comment
  @route - POST /api/posts/:id/comment/:commentId/reply
  @access - Private
*/
export const replyToComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId.toString()
    );

    if (!comment) {
      return res.status(404).json({
        message: 'No comment found',
      });
    }

    const { reply } = req.body;

    const newReply = {
      userId: req.user._id,
      postId: req.params.id,
      commentId: req.params.commentId,
      reply,
    };

    comment.replies.push(newReply);

    await post.save();

    res.status(201).json({
      replies: comment.replies,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - delete a reply
  @route - DELETE /api/posts/:id/comment/:commentId/reply/:replyId
  @access - Private
*/
export const deleteReply = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentId.toString()
    );

    if (!comment) {
      return res.status(404).json({
        message: 'No comment found',
      });
    }

    const reply = comment.replies.find(
      (reply) => reply._id.toString() === req.params.replyId.toString()
    );

    if (!reply) {
      return res.status(404).json({
        message: 'No reply found',
      });
    }

    if (reply.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    // remove reply which match reply id
    comment.replies = comment.replies.filter(
      (reply) => reply._id.toString() !== req.params.replyId.toString()
    );

    await post.save();

    res.status(200).json({
      replies: comment.replies,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - like a post
  @route - POST /api/posts/:id/like
  @access - Private
*/
export const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const like = post.likes.find(
      (like) => like.userId.toString() === req.user._id.toString()
    );

    if (like) {
      return res.status(400).json({
        message: 'Post already liked',
      });
    }

    const newLike = {
      userId: req.user._id,
      postId: req.params.id,
    }

    post.likes.push(newLike);

    await post.save();

    res.status(201).json({
      likes: post.likes,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - dislike a post
  @route - DELETE /api/posts/:id/dislike
  @access - Private
*/
export const dislikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const dislike = post.dislikes.find(
      (dislike) => dislike.userId.toString() === req.user._id.toString()
    );

    if (dislike) {
      return res.status(400).json({
        message: 'Post already disliked',
      });
    }

    const newDislike = {
      userId: req.user._id,
      postId: req.params.id,
    }

    post.dislikes.push(newDislike);

    await post.save();

    res.status(201).json({
      dislikes: post.dislikes,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});

/**
  @desc - increase sharecount on post
  @route - POST /api/posts/:id/share
  @access - Private
*/
export const sharePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    post.shareCount++;

    await post.save();

    res.status(201).json({
      shareCount: post.shareCount,
    });
  } else {
    res.status(404).json({
      message: 'No post found',
    });
  }
});
