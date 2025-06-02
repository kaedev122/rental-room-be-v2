export enum BaseStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export const BaseListStatusEnum: string[] =
  Object.values(BaseStatusEnum);

export enum BaseMainStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export const BaseListMainStatusEnum: string[] =
  Object.values(BaseMainStatusEnum);

export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TimezoneOffset {
  m12 = '-12',
  m11 = '-11',
  m10 = '-10',
  m9 = '-9',
  m8 = '-8',
  m7 = '-7',
  m6 = '-6',
  m5 = '-5',
  m4 = '-4',
  m3 = '-3',
  m2 = '-2',
  m1 = '-1',
  zero = '0',
  p1 = '1',
  p2 = '2',
  p3 = '3',
  p4 = '4',
  p5 = '5',
  p6 = '6',
  p7 = '7',
  p8 = '8',
  p9 = '9',
  p10 = '10',
  p11 = '11',
  p12 = '12',
}

export enum TimezoneOffsetWCountry {
  gmt_minus_12 = 'Pacific/Baker',
  gmt_minus_11 = 'Pacific/Niue',
  gmt_minus_10 = 'Pacific/Honolulu',
  gmt_minus_9 = 'America/Anchorage',
  gmt_minus_8 = 'America/Los_Angeles',
  gmt_minus_7 = 'America/Denver',
  gmt_minus_6 = 'America/Chicago',
  gmt_minus_5 = 'America/New_York',
  gmt_minus_4 = 'America/Halifax',
  gmt_minus_3 = 'America/Sao_Paulo',
  gmt_minus_2 = 'Atlantic/South_Georgia',
  gmt_minus_1 = 'Atlantic/Azores',
  gmt_0 = 'Europe/London',
  gmt_1 = 'Europe/Paris',
  gmt_2 = 'Europe/Athens',
  gmt_3 = 'Europe/Moscow',
  gmt_4 = 'Asia/Dubai',
  gmt_5 = 'Asia/Karachi',
  gmt_6 = 'Asia/Dhaka',
  gmt_7 = 'Asia/Ho_Chi_Minh',
  gmt_8 = 'Asia/Singapore',
  gmt_9 = 'Asia/Tokyo',
  gmt_10 = 'Australia/Sydney',
  gmt_11 = 'Pacific/Noumea',
  gmt_12 = 'Pacific/Auckland',
}

export const thirdPartyUrls = {
  googleReCaptVerify: 'https://www.google.com/recaptcha/api/siteverify',
};

export function escapeRegExp(str: string): string {
  return str.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&');
}
export const ListTimezoneOffset: string[] = Object.values(TimezoneOffset);

export function getFileExtension(filename: string): string | undefined {
  return (
    filename.substring(filename.lastIndexOf('.') + 1, filename.length) ||
    undefined
  );
}

export enum fileFormat {
  PNG = 'png',
  JPG = 'jpg',
  EPS = 'eps',
  TIF = 'tif',
  PSD = 'psd',
}

function parseTimeZone(timeZone: string): number {
  const match = timeZone.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) throw new Error('Invalid timezone format');

  const [, sign, hours, minutes] = match;
  const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
  return (sign === '+' ? 1 : -1) * totalMinutes;
}

function formatDate(date: Date, timeZone: string): string {
  const timeZoneOffset = parseTimeZone(timeZone);
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const convertedDate = new Date(utcDate.getTime() + timeZoneOffset * 60000);

  const day = String(convertedDate.getDate()).padStart(2, '0');
  const month = String(convertedDate.getMonth() + 1).padStart(2, '0');
  const year = convertedDate.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatDateReport(date: Date, timeZone: any): string {
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const convertedDate = new Date(
    utcDate.getTime() + Number(timeZone) * 3600000,
  );

  const day = String(convertedDate.getDate()).padStart(2, '0');
  const month = String(convertedDate.getMonth() + 1).padStart(2, '0');
  const year = convertedDate.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getDatesInRange(
  startDate: string,
  endDate: string,
  timeZone: string,
): string[] {
  const dateArray: string[] = [];
  const currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);

  while (currentDate <= endDateTime) {
    dateArray.push(formatDate(currentDate, timeZone));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export function getDatesInRangeWithTime(
  startDate: string,
  endDate: string,
  timeZone: string,
): { date: string; startDate: Date; endDate: Date }[] {
  const dateArray: { date: string; startDate: Date; endDate: Date }[] = [];

  const currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);

  while (currentDate <= endDateTime) {
    const localStart = new Date(currentDate);
    const utcStart = new Date(localStart.getTime());
    const utcEnd = new Date(utcStart.getTime() + 24 * 60 * 60 * 1000 - 1);

    dateArray.push({
      date: formatDate(currentDate, timeZone),
      startDate: utcStart,
      endDate: utcEnd,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export function getDatesInRangeReport(
  startDate: any,
  endDate: any,
  timeZone: any,
): string[] {
  const dateArray: string[] = [];
  const currentDate = new Date(startDate);
  const endDateTime = new Date(endDate);

  while (currentDate <= endDateTime) {
    dateArray.push(formatDateReport(currentDate, timeZone));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

export const listStatesUS = [
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'UM-81',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'UM-84',
  'ID',
  'IL',
  'IN',
  'IA',
  'UM-86',
  'UM-67',
  'KS',
  'KY',
  'UM-89',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'UM-71',
  'MN',
  'MS',
  'MO',
  'MT',
  'UM-76',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'UM-95',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UM',
  'VI',
  'UT',
  'VT',
  'VA',
  'UM-79',
  'WA',
  'WV',
  'WI',
  'WY',
];

export const MILITARY_AND_ISLAND_STATES = new Set([
  'AK',
  'HI',
  'GU',
  'VI',
  'AA',
  'AP',
  'AE',
  'PR',
  'MP',
  'AS',
]);

export const REGEX_FILTER_SEARCH_KEY = /[.*+?^${}()|[\]\\]/g;

export const filterAlphaCharacters = (keyword: string) => {
  if (typeof keyword !== 'string') {
    return '';
  }
  return keyword.replaceAll(REGEX_FILTER_SEARCH_KEY, '\\$&');
};

export const ACCESS_TOKEN = 'access-token';
