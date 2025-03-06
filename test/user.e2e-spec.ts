import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { CreateAccountResponse, LoginResponse } from './interface';
import { User } from 'src/users/entites/user.entity';
import { query } from 'express';

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'shaharaiz.info@gmail.com',
  password: '123456',
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;
  let token: string | null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get TypeORM database connection
    connection = app.get(DataSource);
  });

  afterAll(async () => {
    if (connection) {
      await connection.dropDatabase();
      await connection.destroy();
    }
    await app.close();
  });

  describe('createAccount', () => {
    it('should create a user', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
        createUser(input: {
          email: "${testUser.email}",
          password: "${testUser.password}",
          role: Client  
        }) {
          ok
          error
        }
      }`,
        })
        .expect(200)
        .expect((res: CreateAccountResponse) => {
          expect(res.body.data.createUser.ok).toBe(true);
          expect(res.body.data.createUser.error).toBe(null);
        });
    });
    it('should fail if user already exists', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
        createUser(input: {
          email: "${testUser.email}",
          password: "${testUser.password}",
          role: Client  
        }) {
          ok
          error
        }
      }`,
        })
        .expect(200)
        .expect((res: CreateAccountResponse) => {
          expect(res.body.data.createUser.ok).toBe(false);
          expect(res.body.data.createUser.error).not.toBe(null);
        });
    });
  });

  describe('login', () => {
    it('should Login with correct credentials', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation{
   login(input:{ email:"${testUser.email}",password:"${testUser.password}"}){ok,error,token}
}
        `,
        })
        .expect(200)
        .expect((res: LoginResponse) => {
          expect(res.body.data.login.ok).toBe(true);
          expect(res.body.data.login.error).toBe(null);
          expect(res.body.data.login.token).toEqual(expect.any(String));
          token = res.body.data.login.token;
        });
    });
    it('should fail on wrong credentials', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation{
   login(input:{ email:"${testUser.email}",password:"1234"}){ok,error,token}
}
        `,
        })
        .expect(200)
        .expect((res: LoginResponse) => {
          expect(res.body.data.login.ok).toBe(false);
          expect(res.body.data.login.error).not.toBe(null);
          expect(res.body.data.login.error).toBe('Wrong password');
          expect(res.body.data.login.token).toBe(null);
        });
    });
  });
  describe('userProfile', () => {
    beforeAll(async () => {
      const userRepo = connection.getRepository(User);
      const [user] = await userRepo.find();
    });
    it('should see a user profile', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token!)
        .send({
          query: `
          {
         userProfile(userId:1)
         { ok,error,user
          {
         email,id
          }  
         }
         }`,
        })
        .expect(200)
        .expect((res) => {
          console.log('res.body', res.body);
          expect(res.body.data.userProfile.ok).toBe(true);
          expect(res.body.data.userProfile.error).toBe(null);
          expect(res.body.data.userProfile.user.email).toBe(testUser.email);
        });
    });
    it('should not find a profile', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token + '1')
        .send({
          query: `
          {
         userProfile(userId:1)
         { ok,error,user
          {
         email,id
          }  
         }
         }`,
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.statusCode).toBe(401);
          expect(res.body.error).toBe('Unauthorized');
          expect(res.body).not.toBe(null);
        });
    });
  });
  describe('me', () => {
    it('should find my profile', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', token!)
        .send({
          query: `
          {
       me{email,id}
            }`,
        })
        .expect((res) => {
          expect(res.body.data.me.email).toBe(testUser.email);
          expect(res.body.data.me.id).toBe(1);
        });
    });
    it('should not allow logged out user', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          {
       me{email,id}
            }`,
        })
        .expect(200)
        .expect((res) => {
          const [error] = res.body.errors;
          expect(error.message).toBe('Forbidden resource');
        });
    });
  });
  it.todo('verifyEmail');
  it.todo('editProfile');
});
