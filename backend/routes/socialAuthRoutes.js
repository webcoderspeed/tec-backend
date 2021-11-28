import express from 'express';
const router = express.Router();
import passportFacebook from '../auth/facebook.js';
import passportGoogle from '../auth/google.js';
import generateToken from '../utils/generateToken.js';

// LOGIN ROUTES
router.get('/login/success', async (req, res) => {


  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      token: generateToken(req.user._id),
      file: req.user.file,
      phone: req.user.phone,
      createdAt: req.user.createdAt,
      followers: req.user.followers,
      followings: req.user.followings,
    })
  }
})

// FACEBOOK ROUTES
router.get('/facebook', passportFacebook.authenticate('facebook', {
  scope: 'email'
}));

router.get('/facebook/redirect', passportFacebook.authenticate('facebook', {
  failureRedirect: "/login/failed",
  successRedirect: process.env.CLIENT_URL
}));

// GOOGLE ROUTES
router.get('/google', passportGoogle.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/redirect', passportGoogle.authenticate('google', {
  failureRedirect: "/login/failed",
  successRedirect: process.env.CLIENT_URL
}));


// auth logout
router.get('/logout', (req, res) => {
  req.logOut();
  res.status(200).clearCookie('express:sess.sig', {
    path: '/'
  });
  res.status(200).clearCookie('express:sess', {
    path: '/'
  });
  req.session.destroy(function (err) {
    if (err) return console.log(err)
    res.redirect(process.env.CLIENT_URL);
  });
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

export default router