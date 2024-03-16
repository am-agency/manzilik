import React from 'react';
import { Link } from 'react-router-dom';
import { CHECKOUT_ROUTE } from '../../../utils/routes';
import { Badge } from 'antd';
import { headerIcons } from '../../../assets/icons/header';

interface CartIconProps {
  count: number;
}

const CartIcon = (props: CartIconProps) => {
  const { count } = props;
  return (
    <Link to={CHECKOUT_ROUTE}>
      <Badge count={count} className="cart-badge" size="small">
        <img src={headerIcons.cart} alt="cart" />
      </Badge>
    </Link>
  );
};

export default CartIcon;
