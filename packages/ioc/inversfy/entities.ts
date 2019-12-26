import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Warrior, Weapon, ThrowableWeapon } from './interfaces';
import { TYPES } from './types';

@injectable()
export class Katana implements Weapon {
  hit() {
    return 'cut!';
  }
}

@injectable()
export class Shuriken implements ThrowableWeapon {
  throw() {
    return 'hit!';
  }
}

@injectable()
export class Ninja implements Warrior {
  private _katana: Weapon;
  private _shuriken: ThrowableWeapon;

  constructor(
    @inject(TYPES.Weapon) katana: Katana,
    @inject(TYPES.ThrowableWeapon) shuriken: Shuriken
  ) {
    this._katana = katana;
    this._shuriken = shuriken;
  }

  public fight() {
    return this._katana.hit();
  }
  public sneak() {
    return this._shuriken.throw();
  }
}
