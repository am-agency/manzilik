import { notification } from 'antd';
import {
  HTTP_STATUS_401,
  HTTP_STATUS_404,
  MANZILIK_AI_B100_ERROR_CODE,
  MANZILIK_AI_B104_ERROR_CODE,
  CLIENT_TYPE_ERROR,
} from '../../settings';
import { getLayoutDirection } from '../../layouts';
import i18n from '../../i18n';

const noUserMsg = 'No current user';

export enum ErrorTypes {
  COGNITO = 'COGNITO',
  API = 'API',
  UNKNOWN = 'UNKNOWN',
}

export interface SystemError {
  message: string;
  statusCode?: string;
  execute: (callback: Function) => void;
  lang?: string;
}

class CognitoError implements SystemError {
  constructor(error: { name: string; message: string }) {
    //@TODO: the message should be an object with error name and message
    this.message = error.name + 'errorMessage' + error.message;
  }

  message: string;
  execute(callback: Function) {
    callback({}, this.message);
  }
}

class ApiError implements SystemError {
  constructor(error: {
    errors: { message: string; errorType: string; originalError: { response: { status: string } } }[];
  }) {
    const { errors } = error;
    this.message = (Array.isArray(errors) && errors.length > 0 && errors[0].message) || '';
    this.statusCode =
      (Array.isArray(errors) && errors.length > 0 && errors[0].errorType) ||
      errors[0].originalError.response.status ||
      '';
    this.lang = getLayoutDirection(i18n.language);
  }

  message: string;
  statusCode: string;
  lang: string | undefined;
  async execute(callback: Function | undefined) {
    callback!({}, this.message);
    if (this.statusCode === HTTP_STATUS_404) {
      return;
    }
    if (this.statusCode === HTTP_STATUS_401) {
      return;
    }
    if (this.statusCode === CLIENT_TYPE_ERROR) {
      localStorage.setItem('clientType', 'guest');
      return;
    }
    if (this.statusCode === MANZILIK_AI_B104_ERROR_CODE) {
      notification.error({
        message:
          this.lang === 'en'
            ? 'You cannot set your designs to “Private” unless you buy credits from Manzilik AI. Free credits only allow you to obtain “Public” designs that can be displayed on the platform.'
            : 'لا يمكنك جعل تصاميمك "خاصة" إلا بعد شراء نقاط من منزلك AI. تسمح لك النقاط المجانية بالحصول على تصاميم "عامة" يسمح بنشرها على المنصة.',
      });
      return;
    }
    if (this.statusCode === MANZILIK_AI_B100_ERROR_CODE) {
      notification.error({
        message:
          this.lang === 'en'
            ? ' Sorry, you ran out of the free balance that allows you to generate designs. Buying points from Manzilik AI will allow you to get more designs.'
            : 'عذراً، لقد استنفذت الرصيد المجاني من النقاط التي تسمح لك بالحصول على تصاميم. قم بشراء نقاط من منزلك AI للحصول على المزيد من التصاميم.',
      });
      return;
    }

    notification.error({ message: this.message });
  }
}

class UnKnownError implements SystemError {
  constructor(error: string) {
    this.message = error;
  }

  message: string;
  execute() {
    // do nothing
  }
}

export class ErrorFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getClass(type: string, error: any): SystemError {
    switch (type) {
      case ErrorTypes.COGNITO:
        return new CognitoError(error);
      case ErrorTypes.API:
        return new ApiError(error);
      case ErrorTypes.UNKNOWN:
        return new UnKnownError(error);
      default:
        throw Error('Unsupported error type');
    }
  }
}
