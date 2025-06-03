export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*)(+=.<>{}/\\[\]:;'"|~`_-])[A-Za-z\d!@#$%^&*)(+=.<>{}/\\[\]:;'"|~`_-]{12,32}/;
export const EMAIL_PATTERN = /^\w+([.]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/;

export const PAD_NUMBER_PREFIX = {
  APARTMENT: 'APR',
  BILL: 'BL',
  CONTRACT: 'CON',
  CUSTOMER: 'CUS',
  PAYMENT_RECEIPT: 'PR',
  USER: 'RR',
}

