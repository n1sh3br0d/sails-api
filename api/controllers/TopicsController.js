/**
 * TopicsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  find: async(req, res) => {
    let topic;
    let skip;
    let page = 1;
    let limit = 10;

    if (Object.keys(req.query).length !== 0) {
      if (req.query.page && parseInt(req.query.page) > 1) {
        page = req.query.page;
      }
      if (req.query.limit && parseInt(req.query.limit) > 0) {
        limit = req.query.limit;
      }
    }
    skip = (page - 1) * limit;

    topics = await Topics.find({select:['subject', 'id', 'owner']});
    if (page !== 1 || limit !== 10) {
      topics = await Topics.find({select:['subject', 'id', 'owner'], skip, limit});
    }
    if (topics.length > 0) {
      return res.json({topics});
    }
    else {
      return res.notFound();
    }
  },


  findOne: async(req, res) => {
    const id = req.params.id;

    let topic = await Topics.findOne({where: {id}, select: ['subject', 'id', 'body', 'owner']});
    //.populate('comments',{select: ['body'], skip, limit});
    if (!topic) {
      return res.notFound();
    }
    else {
      return res.json({topic});
    }
  },

  create: async(req, res) => {
    if (!req.body.subject || !req.body.body) {
      const error = 'subject and body required parameters';
      return res.badRequest(error);
    }
    const subject = req.body.subject;
    const body = req.body.body;

    let topic = await Topics.create({ subject, body, owner: req.id }).fetch();

    res.json(201,{topicid: topic.id});
  },


  update: async(req, res) => {
    const id = req.params.id;

    let topic = await Topics.findOne({id});

    if (!topic) {
      return res.notFound();
    } else {
      if (topic.owner === req.id) {
        let params = {};

        if (req.body.subject)  {
          params.subject = req.body.subject;
        }
        if (req.body.body) {
          params.body = req.body.body;
        }

        if (Object.keys(params).length === 0) {
          return res.badRequest('For update required one or more params');
        }

        await Topics.update({id}).set(params);
        return res.json();
      } else {
        return res.json(300, 'u can\'t update topic of another user');
      }
    }
  },


  destroy: async(req, res) => {
    const id = req.params.id;

    let topic = await Topics.findOne({id});

    if (!topic) {
      return res.notFound();
    }
    else {
      if (topic.owner === req.id) {
        await Topics.destroy({id});
        return res.json();
      } else {
        return res.json(300, 'u can\'t delete topic of another user');
      }
    }
  },


  byId: async(req, res) => {
    let topics;
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

    topics = await Topics.find({where: {owner: id}, select: ['subject','body', 'owner']});
    if (page !== 1 || limit !== 10) {
      topics = await Topics.find({where: {owner: id}, select: ['subject','body', 'owner'], skip, limit});
    }

    if (!topics) {
      return res.notFound();
    }
    else {
      return res.json({topics});
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

