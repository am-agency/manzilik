import React from 'react';
import { getClientBasket } from '../../../pages/shopping/checkout/api';
import { setClientBasketActionCreator } from '../main/actions';

export const getUserBasket = async (dispatch: Function) => {
  try {
    const basket = await getClientBasket();
    if (basket) {
      dispatch(setClientBasketActionCreator(basket));
    }
  } catch (error) {
    console.debug('user basket error');
  }
};
