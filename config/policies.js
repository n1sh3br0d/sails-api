/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  UsersController: {
    'destroy': 'isLoggedIn',
    'update': 'isLoggedIn',
    'findOne': 'isLoggedInEasy',
    'find': 'isLoggedIn'
  },
  TopicsController: {
    'create': 'isLoggedIn',
    'update': 'isLoggedIn',
    'destroy': 'isLoggedIn'
  },
  CommentsController: {
    'create': 'isLoggedIn',
    'update': 'isLoggedIn',
    'destroy': 'isLoggedIn'
  },
  LikesController: {
    'create': 'isLoggedIn'
  }
};
