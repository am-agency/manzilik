import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';

//@TODO: make two different types one for signup and another for login params
interface SignUpParams {
  username: string;
  password: string;
  role?: string;
  subscribe?: boolean;
  recaptcha: string;
  first_name: string;
  last_name: string;
  referral_code: string;
}

export const signUpWithCognito = async (params: SignUpParams) => {
  const response = await Auth.signUp({
    ...params,
    attributes: {
      name: params.username,
      'custom:user_group': params.role,
      'custom:custom': JSON.stringify({
        newsletters_subscription: params.subscribe ? 1 : 0,
        first_name: params.first_name,
        last_name: params.last_name,
        referral_code: params.referral_code,
      }),
    },
    validationData: { recaptchaToken: params.recaptcha },
  });

  const { user, userConfirmed, userSub } = response;

  return { user: { ...user, userConfirmed: userConfirmed, id: userSub }, role: params.role };
};

export const signInWithCognito = async (params: SignUpParams) => {
  const response = await Auth.signIn({
    ...params,
  });
  return { user: response.user };
};

export const resendSignupCode = async (username: string) => {
  const response = await Auth.resendSignUp(username);
  return response;
};

export const confirmCode = async (params: { username: string; code: string }) => {
  const response = await Auth.confirmSignUp(params.username, params.code);
  return response;
};

export const signInWithGoogle = async (referral_code: string) => {
  const user = await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Google,
    customState: referral_code,
  });

  return { user };
};

export const signInWithFacebook = async () => {
  const user = await Auth.federatedSignIn({
    provider: CognitoHostedUIIdentityProvider.Facebook,
  });
  return { user };
};

export const getCurrentUser = async () => {
  const user = await Auth.currentAuthenticatedUser();
  return { user };
};
interface ChangePasswordParams {
  user: string;
  oldPassword: string;
  newPassword: string;
}

export const changePassword = async (params: ChangePasswordParams) => {
  const response = await Auth.changePassword(params.user, params.oldPassword, params.newPassword);
  return response;
};

export const logoutUser = async () => {
  await Auth.signOut();
};
