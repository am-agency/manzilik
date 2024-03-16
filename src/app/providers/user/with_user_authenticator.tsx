import React, { ComponentType, FunctionComponent } from 'react';
import { Auth } from 'aws-amplify';

import { loginActionCreator, logoutActionCreator } from '../main/actions';
import { useHistory } from 'react-router-dom';
import { useMainContext } from '../main';
import { LOGIN_ROUTE } from '../../../utils/routes';

/**
 * checkAuthenticationDispatcher: Check if the user cookies include the correct information about the user or not.
 * @param dispatch
 */
export const checkAuthenticationDispatcher = async (dispatch: Function) => {
  // This function will check if the user authenticated or not, by using the local storage.
  try {
    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

    const user = currentAuthenticatedUser.attributes;
    user.userConfirmed = true;
    user.isUserLoaded = true;

    if (user) {
      dispatch(loginActionCreator(user, user['custom:user_group']));
    }
  } catch (err) {
    dispatch(logoutActionCreator());
  }
};

function withUserAuthenticator<P>(
  WrappedComponent: FunctionComponent<P>,
  FallBackComponent?: FunctionComponent<P>
): ComponentType<P> {
  /**
   * @param WrappedComponent: the child which must be rendered if the user is authenticated
   * @param FallBackComponent: if we passed this component it means we need to show it instead of routing to
   *  login in case the user is not authenticated
   */
  const AppWithAuthenticator: FunctionComponent<P> = (props) => {
    const { userState } = useMainContext();

    const history = useHistory();

    if (!userState.isAuthenticated && !FallBackComponent) {
      history.push(LOGIN_ROUTE);
      return <span />;
    } else if (!userState.isAuthenticated && FallBackComponent) {
      return <FallBackComponent {...props} />;
    } else if (userState.isAuthenticated && userState.isUserConfirmed === false && FallBackComponent) {
      return <FallBackComponent {...props} />;
    }
    {
      /* All the wrapped componet can access the state using the `useUserState` as well as dispatch */
    }

    return <WrappedComponent {...props} />;
  };
  return AppWithAuthenticator;
}

export { withUserAuthenticator };
