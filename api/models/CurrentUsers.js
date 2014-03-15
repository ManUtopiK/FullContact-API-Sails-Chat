/**
 * CurrentUsers
 *
 * @module      :: Model
 * @description :: Represents users who are signed-in to the app.
 *
 */

module.exports = {

  attributes: {
      username: 'STRING',
      password: 'STRING',
      photoUrl: 'STRING',
      twitterUsername: 'STRING'
  }

};
