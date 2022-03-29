import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthenticationDocuments } from './documents';
import { isJWT } from 'class-validator';

describe('E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = testModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Authentication', () => {
    it('DoesFakeLoginRight', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: AuthenticationDocuments.fakeLogin,
          variables: {
            id: '9a9d1585-3da1-4fe8-8129-f42cb33d9ef8',
            phoneNumber: '+201020266599',
          },
        });

      const response = body.data.fakeLogin;
      expect(isJWT(response.accessToken)).toBe(true);
      expect(isJWT(response.refreshToken)).toBe(true);
    });
  });
});
