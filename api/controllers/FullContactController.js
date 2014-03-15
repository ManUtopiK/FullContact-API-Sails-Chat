/**
 * FullContactController
 *
 * @module		:: Controller
 * @description	:: Handles webhooks from the FullContact API.
 */

module.exports = {

  webhook: function (req, res) {
    var photoUrl = '';
    var photos = req.body.result.photos;
    if ( photos ) {
      for (var i=0; i<photos.length; i++) {
        if (photos[i].isPrimary) {
          photoUrl = photos[i].url;
          break;
        }
      }
    }

    var userId = parseInt(req.param('userId'));
    // Update the user record.
    Users.findOne(userId).done(function(err, user) {
      user.photoUrl = photoUrl;
      user.save(function(err) {
        Users.publishUpdate(user.id, {
          photoUrl : photoUrl
        });
      });
    });

    // Also update the currently-signed-in user, if present.
    CurrentUsers.findOne(userId).done(function(err, user) {
      user.photoUrl = photoUrl;
      user.save(function(err) {
        CurrentUsers.publishUpdate(user.id, {
          photoUrl : photoUrl
        });
      });
    });

    res.send(200);
  }

};
