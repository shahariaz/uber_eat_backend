import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

const GRAPHQL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let connection: DataSource;

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
      await connection.dropDatabase(); // Drops database after tests
      await connection.destroy(); // Closes database connection
    }
    await app.close();
  });

  describe('createAccount', () => {
    const EMAIL = 'shahariaz.info@gmail.com';
    it('should create a user', async () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
        createUser(input: {
          email: "${EMAIL}",
          password: "123456",
          role: Client  
        }) {
          ok
          error
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
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
          email: "${EMAIL}",
          password: "123456",
          role: Client  
        }) {
          ok
          error
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
          console.log('from 2nd', res.body.data);
          expect(res.body.data.createUser.ok).toBe(false);
          expect(res.body.data.createUser.error).not.toBe(null);
        });
    });
  });

  it.todo('userProfile');
  it.todo('login');
  it.todo('me');
  it.todo('verifyEmail');
  it.todo('editProfile');
});
