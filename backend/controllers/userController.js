import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import * as userValidators from '../validators/userValidators.js';
import sendEmail from '../utils/emailSender.js';
import crypto from 'crypto';

/**
 * @desc Auth user & generate token
 * @route POST /api/users/login
 * @access PUBLIC
 * @body  { email, password }
 */
export const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  userValidators.validateLogin(req.body, next);

  const user = await User.findOne({ email });

  if (!user) {
    throw Error('User not found!');
  }

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      file: user.file,
      phone: user.phone,
      createdAt: user.createdAt,
      followers: user.followers,
      followings: user.followings,
    });
  } else {
    res.status(401);
    throw new Error('Invalid password');
  }
});

/**
 * @desc Register a new user & generate token
 * @route POST /api/users
 * @access PUBLIC
 * @body  { name, email, password, isAdmin -> true | false }
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  userValidators.validateRegister(req.body, next);

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      token: generateToken(user._id),
      createdAt: user.createdAt,
      file: user.file,
      followers: user.followers,
      followings: user.followings,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc get user profile
 * @route GET /api/users/profile
 * @access PRIVATE [ LOGGED IN USER PROFILE ]
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      file: user.file,
      phone: user.phone,
      followers: user.followers,
      followings: user.followings,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


/**
 * @desc update user profile
 * @route PUT /api/users/profile
 * @access PRIVATE [ LOGGED IN USER PROFILE ]
 * @body  { name, email, password, phone, file, isAdmin -> true | false }
 */
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  userValidators.validateUpdateUserProfile(req.body, next);

  const user = await User.findById(req.user._id);

  if (user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user) {
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.file = req.body.file ?? user.file;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
      phone: updatedUser.phone,
      file: updatedUser.file,
      followers: updatedUser.followers,
      followings: updatedUser.followings,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc get all users
 * @route GET /api/users
 * @access PRIVATE [ ADMIN ]
 */
export const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
      name: {
        $regex: req.query.keyword,
        $options: 'gi',
      },
    }
    : {};

  const users = await User.find({ ...keyword });
  res.status(200).json(users);
});

/**
 * @desc delete user
 * @route DELETE /api/users/:id
 * @access PRIVATE [ ADMIN ]
 * @param  [id]
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc get user
 * @route GET /api/users/:id
 * @access PRIVATE [ ADMIN ]
 * @param [id]
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


/**
 * @desc update user
 * @route PUT /api/users/:id
 * @access PRIVATE [ ADMIN ]
 * @param [id]
 * @body  { name, email, password, phone, file, role -> retailer | expert | admin }
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  userValidators.validateUpdateUser(req.body, next);

  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.file = req.body.file ?? user.file;
    user.password = req.body.password ?? user.password;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();

    if (updatedUser) {
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
        phone: updatedUser.phone,
        file: updatedUser.file,
        followers: updatedUser.followers,
        followings: updatedUser.followings,
      });
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


/**
 * @desc add a new user
 * @route POST /api/users/add
 * @access PRIVATE [ ADMIN ]
 * @body  { name, email, password, phone, file, isAdmin -> true | false }
 */
export const addUser = asyncHandler(async (req, res, next) => {
  userValidators.validateAddUser(req.body, next);

  const { name, email, password, isAdmin, file, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    userExists.name = name;
    await userExists.save();
    return res.status(201).json(userExists);
  }

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
    file,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      phone: user.phone,
      token: generateToken(user._id),
      createdAt: user.createdAt,
      file: user.file,
      followers: user.followers,
      followings: user.followings,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc follow user
 * @route PUT /api/users/follow?userId
 * @access PRIVATE [ LOGGED IN USER PROFILE ]
 * @query  { userId }
 */
export const followUser = asyncHandler(async (req, res, next) => {
  userValidators.validateFollowUserId(req.query, next);

  const { userId } = req.query;

  try {
    const userToFollow = await User.findById(userId);

    if (!userToFollow) throw new Error('User does not exists');

    const currentUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          followings: {
            userId,
          },
        },
      },
      { new: true },
      async (err, user) => {
        if (err) throw new Error(err);

        if (user) {
          await User.findByIdAndUpdate(
            { _id: userId },
            {
              $set: {
                followers: {
                  userId: req.user._id,
                },
              },
            },
            { new: true }
          );
        }
      }
    );

    res.status(200).json(currentUser);
  } catch (err) {
    res.status(400);
    throw new Error(err);
  }

});

/**
 * @desc unfollow user
 * @route PUT /api/users/unfollow?userId
 * @access PRIVATE [ LOGGED IN USER PROFILE ]
 * @query  { userId }
 */
export const unFollowUser = asyncHandler(async (req, res, next) => {
  userValidators.validateFollowUserId(req.query, next);

  const { userId } = req.query;

  try {
    const userToUnFollow = await User.findById(userId);

    if (!userToUnFollow) throw new Error('User does not exists');

    const currentUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          followings: {
            userId,
          },
        },
      },
      { new: true },
      async (err, user) => {
        if (err) throw new Error(err);

        if (user) {
          await User.findByIdAndUpdate(
            { _id: userId },
            {
              $pull: {
                followers: {
                  userId: req.user._id,
                },
              },
            },
            { new: true }
          );
        }
      }
    );

    res.status(200).json(currentUser);
  } catch (err) {
    res.status(400);
    throw new Error(err);
  }
});

/**
 * @desc forgot password
 * @route POST /api/users/forgotPassword
 * @body  { email }
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found!');
  }

  // generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save();

  // sended it back to user's email
  const resetURL = `${process.env.CLIENT_URL}/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PUT request with your new password and password Confirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      message: `Token send to the email`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error('There was an error sending the email. Try again later!');
  }
});

/**
 * @desc reset password
 * @route PUT /api/users/resetPassword
 * @params  { token }
 * @body { password, confirmPassword  }
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  // get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');


  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // if token is not expired, and there is a user, set the new password
  if (!user) {
    res.status(400);
    throw new Error("Token is invalid or has expired");
  }

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password === confirmPassword) {
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  } else {
    res.status(400)
    throw new Error("Password didn't match")
  }

  // Update the user in, send JWT

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
    file: user.file,
    phone: user.phone,
    createdAt: user.createdAt,
    followers: user.followers,
    followings: user.followings,
  });

});
