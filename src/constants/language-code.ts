/* eslint-disable @typescript-eslint/naming-convention */
export enum LanguageCode {
  en_US = 'en_US',
  vi_VN = 'vi_VN',
}

export const ListLanguageCode: string[] = Object.values(LanguageCode);
export const supportedLanguageCount = ListLanguageCode.length;
