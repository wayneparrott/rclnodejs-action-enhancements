/* eslint-disable import/prefer-default-export */

import { TypeClass, TypeClassName } from 'rclnodejs';

/**
 * 
 * @param typeClass 
 * @returns 
 */
export function typeClass2String<T extends TypeClass>(typeClass: T): TypeClassName  {
  switch (typeof typeClass) {
    case 'string': 
      return typeClass;
      break;
    case 'object':
      if (typeClass.package && typeClass.type && typeClass.name) {
        return `${typeClass.package}/${typeClass.type}/${typeClass.name}` as TypeClassName;
      }
      break;
    case 'function':
      return typeClass2String(typeClass());
    default:
      throw new Error('Unknown typeClass');
  }

  throw new Error('Unknown typeClass');
}
