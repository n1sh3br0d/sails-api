const supertest = require('supertest');

let token;
let userid;
let commentid;


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

describe('#Prepare for next test', () => {
  it('grab userid', done => {
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
      done();
    });
  });
});

describe('#Prepare for next test', () => {
  it('grab commentid', done => {
    supertest(sails.hooks.http.app)
    .get(`/users/${userid}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) =>{
      if (err) {
        throw err;
      }
      if (!res.body.comments) {
        throw new Error('Server should return list topics');
      }
      commentid = res.body.comments[0]['id'];
      done();
    });
  });
});

describe('LikesController.byId', () => {

  describe('#Get list likes of comment', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/comments/${commentid}/likes`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.likes) {
          throw new Error('Server should return list of likes');
        }
        //likeid = res.body.likes[0]['id'];
        done();
      });
    });
  });

  describe('#Get list likes of comment (limit 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/comments/${commentid}/likes?limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.likes || res.body.likes.length > 2) {
          throw new Error('Server should return list of likes <=2');
        }
        done();
      });
    });
  });

  describe('#Get list likes of comment (limit 2 and page 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/comments/${commentid}/likes/?limit=2&page=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.likes || res.body.likes.length > 2) {
          throw new Error('Server should return list likes <= 2');
        }
        done();
      });
    });
  });

  describe('#Get list likes of user', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/likes`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.likes) {
          throw new Error('Server should return list likes');
        }
        done();
      });
    });
  });

  describe('#Get list likes of user (limit 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/likes/?limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.likes || res.body.likes.length > 2) {
          throw new Error('Server should return list likes <= 2');
        }
        done();
      });
    });
  });

  describe('#Get list likes of user (limit 2 and page 2)', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}/likes/?page=2&limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) {
          throw err;
        }
        if (!res.body.likes || res.body.likes.length > 2) {
          throw new Error('Server should return list likes <= 2');
        }
        done();
      });
    });
  });

});

