/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'pages/homepage'
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  'post /users/signup': 'UsersController.create',
  'post /users/signin': 'UsersController.login',

  'get /users/restore':'UsersController.restore',
  'get /users/': 'UsersController.find',
  'get /users/:id': 'UsersController.findOne',
  'patch /users/:id': 'UsersController.update',
  'delete /users/:id': 'UsersController.destroy',

  'post /topics/': 'TopicsController.create',
  'get /topics/': 'TopicsController.find',
  'get /topics/:id': 'TopicsController.findOne',
  'patch /topics/:id': 'TopicsController.update',
  'delete /topics/:id': 'TopicsController.destroy',
  'get /:model/:id/topics': 'TopicsController.byId',

  'post /topics/:id': 'CommentsController.create',
  'get /comments/:id': 'CommentsController.findOne',
  'patch /comments/:id': 'CommentsController.update',
  'delete /comments/:id': 'CommentsController.destroy',
  'get /:model/:id/comments': 'CommentsController.byId',

  'post /comments/:id': 'LikesController.create',
  'get /:model/:id/likes':'LikesController.byId',

};
