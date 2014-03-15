/**
 * MainController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function (req, res) {
    res.view();
  },

  signup: function (req, res) {
    var username = req.param('username');
    var password = req.param('password');
    // Users.findByUsername(username)...
    // In v0.9.0 the find method returns an empty array when no results are found
    // when only one result is needed use findOne.
    Users.findOneByUsername(username)
    .done(function signupfindUser(err, usr){
      if (err) {
        // We set an error header here,
        // which we access in the views an display in the alert call.
        res.set('error', 'DB Error');
        // The error object sent below is converted to JSON
        res.send(500, { error: "DB Error" });
      } else if (usr) {
        // Set the error header
        res.set('error', 'Username already Taken');
        res.send(400, { error: "Username already Taken"});
      } else {
        var hasher = require("password-hash");
        password = hasher.generate(password);

        Users.create({ username: username, password: password, photoUrl: null, twitterUsername: null })
        .done(function signupCreatUser(error, user) {
          if (error) {
            // Set the error header
            res.set('error', 'DB Error');
            res.send(500, { error: "DB Error" });
          } else {
            req.session.user = user;
            res.send(user);
          }
        });
      }
    });
  },

  login: function (req, res) {
    var username = req.param('username');
    var password = req.param('password');

    // Users.findByUsername(username)...
    // In v0.9.0 the find method returns an empty array when no results are found
    // when only one result is needed use findOne.
    Users.findOneByUsername(username)
    .done(function loginfindUser(err, usr){
      if (err) {
        // We set an error header here,
        // which we access in the views an display in the alert call.
        res.set('error', 'DB Error');
        // The error object sent below is converted to JSON
        res.send(500, { error: "DB Error" });
      } else {
        if (usr) {
          var hasher = require("password-hash");
          if (hasher.verify(password, usr.password)) {
            req.session.user = usr;

            CurrentUsers.create(usr.toObject()).done(function(error, user) {
                CurrentUsers.publishCreate(usr.toObject());
            });

            res.send(usr);
          } else {
            // Set the error header
            res.set('error', 'Wrong Password');
            res.send(400, { error: "Wrong Password" });
          }
        } else {
          res.set('error', 'User not Found');
          res.send(404, { error: "User not Found"});
        }
      }
    });
  },

  logout: function (req, res) {
    if (req.session.user) {
        var username = req.session.user.username;
        req.session.user = null;

        CurrentUsers.findOneByUsername(username).done(function(err, usr){
            if (err) {
                res.set('error', 'DB Error');
                res.send(500, { error: "DB Error" });
            } else {
                if (usr) {
                    usr.destroy(function(e){
                        CurrentUsers.publishDestroy(usr.id);
                    });
                }
            }
        });
    }
    res.redirect('/');
  },

  chat: function (req, res) {
    if (req.session.user) {
      var username = req.session.user.username;
      res.view({ username: username });
    } else {
      res.redirect('/');
    }
  }

};
