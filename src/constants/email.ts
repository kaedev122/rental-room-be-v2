export const MT_SEND_PWD_NEW_USER = 'E002';
export const MT_OTP_FORGOT_PWD = 'E00009';
export const MT_CHANGED_PWD = 'E00010';
export const ACTIVATE_PW_ACCOUNT = '1ED47';

export const TOPUP_REQUEST_EMAIL = 'E019';
export const ACCEPT_TOPUP_EMAIL = 'E017';
export const DECLINE_TOPUP_EMAIL = 'E018';
export const CANCEL_ORDER_EMAIL = 'E020';
export const ADD_SURCHARGE_EMAIL = 'E021';
export const REFUND_ORDER_EMAIL = 'E020';
export const SENT_PAYMENT_TO_SELLER_EMAIL = 'E022';
export const AUTO_PAYMENT_ORDER_EMAIL = 'E023';
export const NOT_AUTO_PAYMENT_ORDER_EMAIL = 'E024';

export const REGEX_OBJ = {
  EMAIL:
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
  // EMAIL: /^\w+([.]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/,
  // EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  PWD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*)(+=.<>{}/\\[\]:;'"|~`_-])[A-Za-z\d!@#$%^&*)(+=.<>{}/\\[\]:;'"|~`_-]/,
  PHONE_NUMBER: /[0-9()+\-]/,
  LINK_PATTERN:
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;%=.]+$/,
  PAYPAL_TRANSACTION_CODE: /[A-Z]{2}\.?\d{6}\.\d{4}/,
  ZIPCODE_PATTERN: /^\d{5}(-\d{4})?$/,
};
