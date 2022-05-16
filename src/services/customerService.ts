import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { httpErrors } from '../errors/HttpError.js';
import {
  CustomerLogin,
  NewCustomerData,
} from '../interface/customerInterfaces.js';
import * as customerRepository from '../repositories/customerRepository.js';

export async function signUp(createUserData: NewCustomerData) {
  const existingUser = await customerRepository.findByEmail(
    createUserData.email
  );
  if (existingUser) throw httpErrors.conflict('Email must be unique');

  const hashedPassword = bcrypt.hashSync(createUserData.password, 12);
  await customerRepository.insert({
    ...createUserData,
    password: hashedPassword,
  });
}

export async function findById(id: number) {
  const user = await customerRepository.findById(id);
  if (!user) throw httpErrors.notFound('User not found');
  return user;
}

export async function logIn(data: CustomerLogin) {
  const { password, id } = await customerRepository.findByEmail(data.email);
  if (!password) {
    throw httpErrors.unauthorized('Email or password is incorrect');
  }

  const isValidPassword = bcrypt.compareSync(data.password, password);
  if (!isValidPassword) {
    throw httpErrors.unauthorized('Email or password is incorrect');
  }

  return jwt.sign({ customerId: id }, process.env.JWT_SECRET);
}
