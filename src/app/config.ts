import Amplify from 'aws-amplify';
import { AppSyncAuthenticationType } from './types';
const {
  REACT_APP_COGNITO_REDIRECT_SIGN_OUT_URL,
  REACT_APP_COGNITO_REDIRECT_SIGN_IN_URL,
  REACT_APP_COGNITO_DOMAIN,
  REACT_APP_USER_POOL_ID,
  REACT_APP_REGION,
  REACT_APP_USER_POOL_WEB_CLIENT_ID,
  REACT_APP_APPSYNC_REGION,
  REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
  REACT_APP_APPSYNC_API_KEY,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_IDENTITY_POOL_ID,
  REACT_APP_RECAPTCHA_SECRET_KEY,
} = process.env;

export const awsConfig = {
  Auth: {
    region: REACT_APP_REGION,
    userPoolId: REACT_APP_USER_POOL_ID,
    userPoolWebClientId: REACT_APP_USER_POOL_WEB_CLIENT_ID,
    identityPoolId: REACT_APP_IDENTITY_POOL_ID,
  },
  recaptcha: {
    secretKey: REACT_APP_RECAPTCHA_SECRET_KEY,
  },
  oauth: {
    domain: REACT_APP_COGNITO_DOMAIN,
    scope: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
    redirectSignIn: REACT_APP_COGNITO_REDIRECT_SIGN_IN_URL,
    redirectSignOut: REACT_APP_COGNITO_REDIRECT_SIGN_OUT_URL,
    responseType: 'code',
  },
  Storage: {
    region: REACT_APP_REGION,
    bucket: REACT_APP_STORAGE_BUCKET,
  },
  aws_appsync_graphqlEndpoint: REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
  aws_appsync_region: REACT_APP_APPSYNC_REGION,
  aws_appsync_authenticationType: AppSyncAuthenticationType.API_KEY,
  aws_appsync_apiKey: REACT_APP_APPSYNC_API_KEY,
};

export const awsConfigure = () => {
  Amplify.configure(awsConfig);
};
