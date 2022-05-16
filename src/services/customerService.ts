import bcrypt from 'bcrypt';
import { httpErrors } from '../errors/HttpError.js';
import { NewCustomerData } from '../interface/customerInterfaces.js';
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
