/**
 * CommentsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async(req, res) => {
    const owner = req.id;
    const topic = req.params.id;
    if (!req.body.body) {
      return res.badRequest('body required parameters');
    }

    const body = req.body.body;

    comment = await Comments.create({ body, owner, topic }).fetch();

    return res.json(201,{commentid: comment.id});
  },


  findOne: async(req, res) => {
    const id = req.params.id;

    let comment = await Comments.findOne({where: {id},select:['body','owner','topic']});
    if (!comment) {
      return res.notFound();
    } else {
      return res.json({comment});
    }
  },

  destroy: async(req, res) => {
    const id = req.params.id;

    let comment = await Comments.findOne({id});

    if (!comment) {
      return res.notFound();
    }
    else {
      if (comment.owner === req.id) {
        await Comments.destroy({id});
        return res.json();
      } else {
        return res.json(300, 'u can\'t update comment of another user');
      }
    }
  },


  update: async(req, res) => {
    const id = req.params.id;

    let comment = await Comments.findOne({id});

    if (!comment) {
      return res.notFound();
    } else {
      if (comment.owner === req.id) {
        let body;

        if (req.body.body) {
          body = req.body.body;
        }

        if (!body) {
          return res.badRequest('For update required body parameter');
        }

        await Comments.update({id}).set({body});
        return res.json();
      } else {
        return res.json(300, 'u can\'t update comment of another user');
      }
    }
  },

  byId: async(req, res) => {
    let comments;
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
      comments = await Comments.find({where: {owner: id}, select: ['body', 'owner','topic']});
      if (page !== 1 || limit !== 10) {
        comments = await Comments.find({where: {owner: id}, select: ['body', 'owner','topic'], skip, limit});
      }
    } else if (req.params.model === 'topics') {
      comments = await Comments.find({where: {topic: id}, select: ['body', 'owner','topic']});
      if (page !== 1 || limit !== 10) {
        comments = await Comments.find({where: {topic: id}, select: ['body', 'owner','topic'], skip, limit});
      }
    }

    if (!comments) {
      return res.notFound();
    }
    else {
      return res.json({comments});
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

