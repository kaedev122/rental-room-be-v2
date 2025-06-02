import { BaseListStatusEnum } from '@constants/constants';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import mongoose, { ClientSession } from 'mongoose';
import { CallbackWithoutResultAndOptionalError } from 'mongoose';
import { SearchCondition } from '../types/common.types';
import axios from 'axios';
import { Logger } from 'winston';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

function getRandomCharFromString(str) {
  const randomIndex = Math.floor(Math.random() * str.length);

  return str[randomIndex];
}

export const convertStartDate = (time: string) => {
  const d = time ? new Date(time) : new Date();
  d.setUTCHours(0);
  d.setUTCMinutes(0);
  d.setUTCSeconds(0);
  d.setUTCMilliseconds(100);

  return d;
};

export const convertEndDate = (time: string) => {
  const d = time ? new Date(time) : new Date();
  d.setUTCHours(23);
  d.setUTCMinutes(59);
  d.setUTCSeconds(59);
  d.setUTCMilliseconds(999);

  return d;
};

/**
 * Random password cho user
 * @param {number} length độ dài của password
 * @returns {string}
 */
export function generateRandomString(length) {
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()';

  const allChars = uppercaseLetters + lowercaseLetters + numbers + specialChars;

  const randomUppercase = getRandomCharFromString(uppercaseLetters);
  const randomLowercase = getRandomCharFromString(lowercaseLetters);
  const randomNumber = getRandomCharFromString(numbers);
  const randomSpecialChar = getRandomCharFromString(specialChars);

  let randomPass = '';
  randomPass += randomUppercase;
  randomPass += randomLowercase;
  randomPass += randomNumber;
  randomPass += randomSpecialChar;

  for (let i = 0; i < length - 4; i++) {
    randomPass += getRandomCharFromString(allChars);
  }

  return randomPass;
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export function validateHash(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, ''),
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'",
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
}

/**
 * random string for userCode
 * @param {number} length
 * @returns {string}
 */
export function randomString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

/**
 * Tạo số ngẫu nhiên dựa trên min và max. Mặc định là 6
 * @param {Number} min Số chữ số
 * @param {Number} max Số chữ số
 * @returns ```Number``` Số ngẫu nhiên dựa trên min và max
 */
export const generateRandomNumber = (min = 6, max = 6) => {
  // eslint-disable-next-line no-param-reassign
  max = max >= min ? max : min;
  let maxDigit = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < max; i++) {
    maxDigit += '9';
  }
  let minDigit = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < min; i++) {
    minDigit += i === 0 ? '1' : '0';
  }
  const number = crypto.randomInt(Number(minDigit), Number(maxDigit));

  return number;
};

export function getConditionQuery<
  T extends { status?: string; keyword?: string },
>(query: T): SearchCondition {
  const condition: SearchCondition = {};

  if (query.status && BaseListStatusEnum.includes(query.status)) {
    condition.status = query.status;
  }

  if (query.keyword) {
    condition.$or = [
      { name: { $regex: query.keyword, $options: 'i' } },
      { code: { $regex: query.keyword, $options: 'i' } },
    ];
  }

  return condition;
}

export function addIsDeletedToQuery(
  this: mongoose.Query<unknown, unknown>,
  done: CallbackWithoutResultAndOptionalError,
) {
  const query = this.getQuery() as any;

  if (!query?.isDeleted) {
    void this.where({
      isDeleted: false,
    });
  }

  done();
}

export const fixedTwoDigitNumber = (num: any): number => {
  if (!Number(num)) return 0;
  return Number(Math.round(Number(num) * 100) / 100);
};

export const replaceValidStringAddress = (str: string) => {
  if (str && typeof str === 'string')
    str = str.replace(/[^a-zA-Z0-9 /_-]/gi, '');

  return str;
};

export const hashApiKey = (apiKey: string) => {
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return hash;
};

export function convertTimeZone(offset: number): string {
  const sign = offset >= 0 ? '+' : '-';

  const absoluteOffset = Math.abs(offset);

  const hours = Math.floor(absoluteOffset);
  const minutes = (absoluteOffset - hours) * 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${sign}${formattedHours}:${formattedMinutes}`;
}

export async function safeCommitTransaction(
  session: ClientSession,
  logger: Logger,
  contextMessage?: string,
) {
  try {
    await session.commitTransaction();
  } catch (err: any) {
    const hasUnknownResult = err?.hasErrorLabel?.(
      'UnknownTransactionCommitResult',
    );
    const isWriteTimeout = err?.message?.includes('wtimeout');

    if (hasUnknownResult || isWriteTimeout) {
      logger?.warn?.(
        `⚠️ Timeout khi commit transaction, nhưng transaction *có thể* đã được commit thành công. ${
          contextMessage || ''
        } Error: ${err.message}`,
      );
    } else {
      throw err;
    }
  }
}
