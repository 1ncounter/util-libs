import { myContainer } from './inversfy/inversify.config';
import { TYPES } from './inversfy/types';
import { Warrior } from './inversfy/interfaces';

const ninja = myContainer.get(TYPES.Warrior) as Warrior;

console.log(ninja.fight());
