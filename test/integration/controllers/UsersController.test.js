const supertest = require('supertest');

let token;
let userid;
let userid2;



describe('UsersController.create', () => {

  describe('#Register', () => {
    it('should return 201', done => {
      supertest(sails.hooks.http.app)
      .post('/users/signup')
      .send({ email: 'test@test.com', password: 'test', name: 'test' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        if (!res.body.userid) {
          throw new Error('Server should return userid');
        }
        userid = res.body.userid;
        done();
      });
    });
  });

  describe('#Register with missing parameter', () => {
    it('should return 400', done => {
      supertest(sails.hooks.http.app)
      .post('/users/signup')
      .send({ email: 'invalid@value' })
      .expect(400)
      .expect('Content-Type', /json/,done);
    });
  });

  describe('#Register with existed unique value', () => {
    it('should return 400', done => {
      supertest(sails.hooks.http.app)
      .post('/users/signup')
      .send({ email: 'test@test.com', password: 'test', name: 'test' })
      .expect(400)
      .expect('Content-Type', /json/,done);
    });
  });

});


describe('UsersController.login', () => {

  describe('#Login', () => {
    it('should return token', done => {
      supertest(sails.hooks.http.app)
      .post('/users/signin')
      .send({ email: 'test@test.com', password: 'test' })
      .expect(200)
      .expect('Content-Type', /json/,)
      .end((err, res) => {
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

  describe('#Login with invalid value', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .post('/users/signin')
      .send({ email: 'invalid@value', password: 'invalid_value' })
      .expect(401)
      .expect('Content-Type', /json/,done);
    });
  });

  describe('#Login with missing parameter', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .post('/users/signin')
      .send({ email: 'invalid@value' })
      .expect(401)
      .expect('Content-Type', /json/,done);
    });
  });
});


describe('UsersController.find', () => {

  describe('#Get list users', () => {
    it('should return list users', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        if (!res.body.users) {
          throw new Error('Server should return list of users');
        }
        userid2 = res.body.users[0]['id'];
        done();
      });
    });
  });

  describe('#Get list users without token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/`)
      .expect(401)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Get list users (limit 2)', () => {
    it('should return list users', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/?limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        if (!res.body.users || res.body.users.length > 2) {
          throw new Error('Server should return list of users <=2');
        }
        done();
      });
    });
  });

  describe('#Get list users (limit 2 and page 2)', () => {
    it('should return list users', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/?page=2&limit=2`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        if (!res.body.users || res.body.users.length > 2) {
          throw new Error('Server should return list of users <=2');
        }
        done();
      });
    });
  });

});


describe('UsersController.findOne', () => {

  describe('#Get account', () => {
    it('should return email', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        if (!res.body.user.email) {
          throw new Error('Server should return user info with email');
        }
        done();
      });
    });
  });

  describe('#Get account without token', () => {
    it('shouldn\'t return email', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        if (res.body.user.email) {
          throw new Error('Server should return user info without email');
        }
        done();
      });
    });
  });

  describe('#Get account of another user', () => {
    it('shouldn\'t return email', done => {
      supertest(sails.hooks.http.app)
      .get(`/users/${userid2}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        if (res.body.user.email) {
          throw new Error('Server should return user info without email');
        }
        done();
      });
    });
  });

});


describe('UsersController.update', () => {

  describe('#Update', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .patch(`/users/${userid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'test@test.com', password: 'test' })
      .expect(200)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Update without token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .patch(`/users/${userid}`)
      .send({ email: 'test@test.com', password: 'test' })
      .expect(401)
      .expect('Content-Type', /json/,done);
    });
  });

  describe('#Update with invalid token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .patch(`/users/${userid}`)
      .set('Authorization', `Bearer 123`)
      .send({ email: 'test@test.com', password: 'test' })
      .expect(401)
      .expect('Content-Type', /json/,done);
    });
  });

  describe('#Update without parameters', () => {
    it('should return 400', done => {
      supertest(sails.hooks.http.app)
      .patch(`/users/${userid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Update account of another user', () => {
    it('should return 300', done => {
      supertest(sails.hooks.http.app)
      .patch(`/users/${userid2}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invalid@value' })
      .expect(300)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Update with existed unique value', () => {
    it('should return 400', done => {
      supertest(sails.hooks.http.app)
      .patch(`/users/${userid}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'test' })
      .expect(400)
      .expect('Content-Type', /json/, done);
    });
  });

});


describe('UsersController.delete', () => {

  describe('#Delete account of another user', () => {
    it('should return 300', done => {
      supertest(sails.hooks.http.app)
      .delete(`/users/${userid2}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invalid@value' })
      .expect(300)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Delete without token', () => {
    it('should return 401', done => {
      supertest(sails.hooks.http.app)
      .delete(`/users/${userid}`)
      .expect(401)
      .expect('Content-Type', /json/, done);
    });
  });

  describe('#Delete', () => {
    it('should return 200', done => {
      supertest(sails.hooks.http.app)
      .delete(`/users/${userid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/, done);
    });
  });

});
