const supertest = require('supertest');

let token;
let topicid;
let topicid2;
let userid;


describe('#Prepare for next test', () => {
  it('grab token', done => {
    supertest(sails.hooks.http.app)
    .post('/users/signin')
    .send({ email: 'user2@mail.com', password: 'test' })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) =>{
      if (err) {
        throw err;
      }
      if (!res.body.token) {
        throw new Error('Server should return token');
      }
      token = res.body.token;
      done();
    });
  });
});


describe('TopicsController.find', () => {

  describe('#Get list topics', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get('/topics/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topics) {
          throw new Error('Server should return list topics');
        }
        userid = res.body.topics[0]['owner'];
        topicid2 = res.body.topics[0]['id'];
        done();
      });
    });
  });

  describe('#Get list topics (limit 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get('/topics/?limit=2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topics || res.body.topics.length > 2) {
          throw new Error('Server should return list topics <= 2');
        }
        done();
      });
    });
  });

  describe('#Get list topics (limit 2 and page 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get('/topics/?limit=2&page=2')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topics || res.body.topics.length > 2) {
          throw new Error('Server should return list topics <= 2');
        }
        done();
      });
    });
  });

});

describe('#TopicsController.byId', () => {

  describe('#Get list topics of user', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/topics`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topics) {
          throw new Error('Server should return list topics');
        }
        done();
      });
    });
  });

  describe('#Get list topics of user (limit 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/topics/?limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topics || res.body.topics.length > 2) {
          throw new Error('Server should return list topics <= 2');
        }
        done();
      });
    });
  });

  describe('#Get list topics of user (limit 2 and page 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/topics/?page=2&limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topics || res.body.topics.length > 2) {
          throw new Error('Server should return list topics <= 2');
        }
        done();
      });
    });
  });

});


describe('TopicsController.findOne', () => {

  describe('#Get topic', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/topics/${topicid2}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/, done);
    });
  });

  /*describe('#Get user\'s topic', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/topics/${topicid2}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/, done);
    });
  });*/

});

describe('TopicsController.create', () => {

  describe('#Create topic', () => {
    it('should return 201', done => {
      supertest(sails.hooks.http.app)
      .post('/topics/')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject: 'testSubject', body: 'testBody' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.topicid) {
          throw new Error('Server should return topicid');
        }
        topicid = res.body.topicid;
        done();
      });
    });
  });

  describe('#Create topic with missing parameter', () => {
    it('should return 400', done => {
      supertest(sails.hooks.http.app)
      .post('/topics')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject: 'testSubject' })
      .expect(400)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Create topic without token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .post('/topics')
      .send({ subject: 'testSubject', body: 'testBody' })
      .expect(401)
      .expect('Content-Type', /json/, done);
    });
  });

});


describe('TopicsController.update', () => {

  describe('#Update topic', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .patch(`/topics/${topicid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ subject: 'newTestSubject' })
      .expect(200)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Update topic without token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .patch(`/topics/${topicid}`)
      .send({ subject: 'newTestSubject' })
      .expect(401)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Update topic without parameters', () => {
    it('should return 400', done => {
      supertest(sails.hooks.http.app)
      .patch(`/topics/${topicid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /json/,done);
    });
  });


  describe('#Update topic of another user', () => {
    it('should return 300', done => {
      supertest(sails.hooks.http.app)
      .patch(`/topics/${topicid2}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ subject: 'newTestSubject' })
      .expect(300)
      .expect('Content-Type', /json/, done);
    });
  });
});


describe('TopicsController.delete', () => {

  describe('#Delete topic without token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .delete(`/topics/${topicid}`)
      .expect(401)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Delete topic', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .delete(`/topics/${topicid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Delete topic of another user', () => {
    it('should return 300', done => {
      supertest(sails.hooks.http.app)
      .delete(`/topics/${topicid2}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(300)
      .expect('Content-Type', /json/, done);
    });
  });

});
