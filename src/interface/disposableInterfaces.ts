import { Disposable } from '@prisma/client';

export interface NeededDisposable extends Disposable {
  quantity: number;
}

export interface FormatedDisposable
  extends Omit<NeededDisposable, 'id' | 'measurementId' | 'price'> {
  price: string;
}
