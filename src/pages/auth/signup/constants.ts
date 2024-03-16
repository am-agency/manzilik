/* eslint-disable @typescript-eslint/naming-convention */
export const PASSWORD_REGEX = new RegExp('.{8,}');

export const SAUDI_PHONE_REGEX = new RegExp(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/);
export const PHONE_REGEX = new RegExp(/^(\+\d{1,3}[- ]?)?\d{9,10}$/);
export const EMAIL_REGEX = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
export const EMAIL_VALIDATION = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
export const NUMBER_REGEX = new RegExp(/[0-9]/);
export const PHONE_REGEX_WITH_PLUS = new RegExp(/^\+\d+$/);
