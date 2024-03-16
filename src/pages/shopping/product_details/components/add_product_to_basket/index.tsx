import { Button, Row, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Product } from '../../../../../API';
import { shoppingIcons } from '../../../../../assets/icons/shopping';
import Separator from '../../../../../components/separator';
import { CONTINUE_SHOPPING, GO_TO_BASKET, PRODUCT_WAS_ADDED_TO_BASKET } from '../../../../../locales/strings';
import { PRODUCTS_MAIN_ROUTE } from '../../../../../utils/routes';

interface Props {
  product: Product;
}

export const AddProductToBasket: FunctionComponent<Props> = ({ product }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="img-container">
        <img src={product.photo_url!} className="img-fit-content rounded-border" />
      </div>
      <Separator vertical={8} />
      <Typography.Text>
        <img src={shoppingIcons.successIcon} className="success-icon" />
        {t(PRODUCT_WAS_ADDED_TO_BASKET)}
      </Typography.Text>
      <Separator vertical={12} />
      <Row justify="center" className="modal-btns">
        <Button type="primary" className="go-to-basket">
          <Link to="/checkout">{t(GO_TO_BASKET)}</Link>
        </Button>
        <Separator horizontal={5} />
        <Button className="keep-shopping">
          <Link to={PRODUCTS_MAIN_ROUTE}>{t(CONTINUE_SHOPPING)} </Link>
        </Button>
      </Row>
      <Separator vertical={8} />
    </div>
  );
};
