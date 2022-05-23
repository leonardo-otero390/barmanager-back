import { Disposable } from '@prisma/client';

export interface NeededDisposable extends Disposable {
  quantity: number;
}
