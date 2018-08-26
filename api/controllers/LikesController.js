/**
 * LikesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add: async(req, res) => {
    const owner = req.id;
    const comment = req.params.id;

    like = await Likes.findOrCreate({where: { comment, owner }}, { comment, owner })
    .exec(async(error, result, wasCreated)=> {
      if (error) {
        return res.serverError();
      }
      if(wasCreated) {
        return res.json(201);
      } else {
        await Likes.destroy({where: { comment, owner }});
        return res.json();
      }
    });
  },


  byId: async(req, res) => {
    let where;
    let select = ['comment','owner'];
    let likes;
    let skip;
    let page = 1;
    let limit = 10;
    let id = req.params.id;

    if (Object.keys(req.query).length !== 0) {
      if (req.query.page && parseInt(req.query.page) > 1) {
        page = parseInt(req.query.page);
      }
      if (req.query.limit && parseInt(req.query.limit) > 0) {
        limit = req.query.limit;
      }
    }
    skip = (page - 1) * limit;

    if (req.params.model === 'users') {
      where = {owner: id};
    } else if (req.params.model === 'comments') {
      where = {comment:id};
    }

    likes = await Likes.find({where, select});
    if (page !== 1 || limit !== 10) {
      likes = await Likes.find({where, select, skip, limit});
    }

    if (!likes) {
      return res.notFound();
    }
    else {
      return res.json({likes});
    }
  },


  ////////////////////////////////////////////////////////////////////////

  addToCollection: async(req, res) => {
    res.notFound();
  },
  removeFromCollection: async(req, res) => {
    res.notFound();
  },

  replaceCollection: async(req, res) => {
    res.notFound();
  },

};

