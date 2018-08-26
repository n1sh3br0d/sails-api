/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const secretkey = sails.config.custom.secretKey;
const api_key = sails.config.custom.api_key;
const DOMAIN = sails.config.custom.DOMAIN;
const mailgun_from = sails.config.custom.mailgun_from;



const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});



module.exports = {
  find: async(req, res) => {
    let users;
    let skip;
    let page = 1;
    let limit = 10;

    if (Object.keys(req.query).length !== 0) {
      if (req.query.page && parseInt(req.query.page) > 1) {
        page = parseInt(req.query.page);
      }
      if (req.query.limit && parseInt(req.query.limit) > 0) {
        limit = req.query.limit;
      }
    }
    skip = (page - 1) * limit;

    users = await Users.find({select:['name','id']});
    if (page !== 1 || limit !== 10) {
      users = await Users.find({select:['name','id'], skip, limit});
    }

    if (users.length > 0) {
      return res.json({users});
    } else {
      return res.notFound();
    }
  },


  findOne: async(req, res) => {
    let user;
    const id = req.params.id;

    if (req.id && req.params.id === req.id) {
      user = await Users.findOne({where: {id},select:['name','id','email']});
    } else {
      user = await Users.findOne({where: {id},select:['name','id']}); //.populate('topics',{select: ['subject']});
    }
    if (!user) {
      return res.notFound();
    } else {
      return res.json({user});
    }
  },


  update: async(req, res) => {
    const id = req.params.id;

    if (id !== req.id) {
      return res.json(300, 'u can\'t update account of another user');
    }

    let params = {};
    if (req.body.name) {
      let exist = await Users.findOne({name: req.body.name});
      if (!exist) {
        params.name = req.body.name.toLowerCase();
      } else {
        return res.badRequest(`${req.body.name} busy`);
      }
    }
    if (req.body.password) {
      params.password = req.body.password;
    }

    if (Object.keys(params).length === 0) {return res.badRequest('For update required one or more params');}

    let x = await Users.update(id)
    .set(params);

    res.json();
  },


  destroy: async(req, res) => {
    const id = req.params.id;

    if (id !== req.id) {
      return res.json(300, 'u can\'t delete account of another user');
    }

    let x = await Users.destroy({id}).fetch();

    if (x.length === 0) {
      return res.badRequest('invalid userid');
    } else {
      sails.log(`user ${x[0].name} deleted`);
      return res.json();
    }
  },


  create: async(req, res) => {
    if (!req.body.name || !req.body.password || !req.body.email) {
      const error = 'name, password and email required parameters';
      return res.badRequest(error);
    }
    const name = req.body.name.toLowerCase();
    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    let exist = await Users.findOne({name});


    if (!exist) {
      await Users.findOrCreate({ email }, { name, email, password })
      .exec(async(error, user, wasCreated)=> {
        if (error) {
          return res.serverError();
        }

        if(wasCreated) {
          sails.log('Created a new user: ' + user.name);
          return res.json(201,{userid: user.id});
        } else {
          return res.badRequest('email already exists');
        }
      });
    } else {
      return res.badRequest('user already exists');
    }
  },


  login: async(req, res) => {
    if (!req.body.password || !req.body.email) {
      const error = 'password and email required parameters';
      return res.json(401,error);
    }

    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    let x = await Users.findOne({email}).decrypt();

    if (!x) {
      return res.json(401,'invalid email');
    } else {
      password !== x.password ? res.json(401,'invalid password') :
        jwt.sign({
          email: x.email,
          id: x.id,
        }, secretkey,
        {
          expiresIn: '1h'
        }, (error,token) => {
          if (error) {
            return res.serverError();
          }
          if (token) {
            return res.json({token});
          }
        });
    }
  },

  restore: async(req, res) => {
    let  email;
    if (req.query && req.query.email) {
      email = req.query.email.toLowerCase();
    } else { 
      res.badRequest('email required');
    }

    let user = await Users.findOne({where: {email},select:['email']});

    let data = {
      from: mailgun_from,
      to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
      subject: 'Restore password',
      text: `Restore password ${user.password}`
    };

    if (user) {
      mailgun.messages().send(data,(error, body) => {
        if (error) {
          res.serverError();
        }
        if (body) {
          res.json('We send email with password');
        }
      });
    } else {
      res.badRequest('email invalid');
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

