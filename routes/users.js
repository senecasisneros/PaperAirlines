'use strict';

const express = require('express');
const request = require('request');

const User = require('../models/user');

let router = express.Router();

//    users.js
//    /api/users

router.get('/', (req, res) => {
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users);
  });
});

router.delete('/all', (req, res) => {
  User.remove({}, err => {
    res.status(err ? 400 : 200).send(err);
  });
});


router.get('/profile', User.authMiddleware, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
});



// /api/users/profile
// router.put('/profile/:id', User.authMiddleware, (req, res) => {
//   // User.findByIdAndUpdate(req.params.id, req.body, err => {

//   User.editProfile(req.user._id, req.body, (err, editUser) => {
//     if(err) return res.status(400).send(err);
//     res.send(editUser);
//   })
// })
// });

// /api/users/profile
// router.put('/profile/:id', User.authMiddleware, (req, res) => {
//   User.editProfile(req.user._id, req.body, (err, editedUserObj) => {
//     if(err) return res.status(400).send(err);
//     res.send(editedUserObj);
//   })
// })

router.post('/login', (req, res) => {
  console.log('req.body:', req.body);

  User.authenticate(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  });
});

router.post('/signup', (req, res) => {
  User.register(req.body, (err, token) => {
    res.status(err ? 400 : 200).send(err || {token: token});
  });
});

////////////////////Facebook///////////////////
router.post('/facebook', (req, res) => {

  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');

  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: process.env.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(400).send({ message: accessToken.error.message });
    }

    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(400).send({ message: profile.error.message });
      }

      User.findOne({facebook: profile.id}, (err, user) => {
        if(err) return res.status(400).send(err);

        if(user) {

          let token = user.generateToken();
          res.send({token: token});
        } else {

          let newUser = new User({
            email: profile.email,
            displayName: profile.name,
            profileImage: profile.picture.data.url,
            facebook: profile.id
          });

          newUser.save((err, savedUser) => {
            if(err) return res.status(400).send(err);
            let token = savedUser.generateToken();
            res.send({token: token});
          });
        }
      });
    });
  });
});

module.exports = router;