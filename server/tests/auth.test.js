import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([{ statusCode: 202 }])
}));

import app from '../index.js';
import User from '../models/User.js';
import Verification from '../models/Verification.js';
import bcrypt from 'bcrypt';
process.env.JWT_SECRET = 'testsecret';


let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
  await Verification.deleteMany();
});

describe('Email verification flow', () => {
  it('should register and create a verification entry', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@wcupa.edu',
      password: 'MySecret123!'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Verification code sent/i);

    const verification = await Verification.findOne({ email: 'test@wcupa.edu' });
    expect(verification).toBeTruthy();
    expect(verification.code).toBeDefined();
    expect(verification.password).toMatch(/^\$2[aby]/); // bcrypt hash check
  });

  it('should verify code and create user', async () => {
    const hashedPass = await bcrypt.hash('MySecret123!', 10);
    const code = '123456';

    await Verification.create({
      email: 'verify@wcupa.edu',
      password: hashedPass,
      code,
      expiresAt: new Date(Date.now() + 60000) // valid for 1 minute
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'verify@wcupa.edu',
      verificationCode: code
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/account created/i);

    const user = await User.findOne({ email: 'verify@wcupa.edu' });
    expect(user).toBeTruthy();
    expect(user.password).toBe(hashedPass);
  });

  it('should reject invalid verification code', async () => {
    const hashedPass = await bcrypt.hash('TestPass123!', 10);
    await Verification.create({
      email: 'wrongcode@wcupa.edu',
      password: hashedPass,
      code: '654321',
      expiresAt: new Date(Date.now() + 60000)
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'wrongcode@wcupa.edu',
      verificationCode: '000000' // wrong code
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid or expired/i);
  });

  it('should reject expired verification code', async () => {
    const hashedPass = await bcrypt.hash('Expired123!', 10);
    await Verification.create({
      email: 'expired@wcupa.edu',
      password: hashedPass,
      code: '999999',
      expiresAt: new Date(Date.now() - 1000) // already expired
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'expired@wcupa.edu',
      verificationCode: '999999'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid or expired/i);
  });

  it('should reject non-WCU email during registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'notwcu@gmail.com',
      password: 'Test123!'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/WCU email/i);
  });

  it('should block login before email verification', async () => {
    const hashedPass = await bcrypt.hash('LoginFail123!', 10);

    await User.create({
      email: 'notverified@wcupa.edu',
      password: hashedPass,
      isVerified: false
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'notverified@wcupa.edu',
      password: 'LoginFail123!'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email not verified/i);
  });

  it('should allow login after verification', async () => {
    const hashedPass = await bcrypt.hash('LoginOK123!', 10);

    await User.create({
      email: 'verified@wcupa.edu',
      password: hashedPass,
      isVerified: true
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'verified@wcupa.edu',
      password: 'LoginOK123!'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
