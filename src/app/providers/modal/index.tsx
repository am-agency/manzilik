import React, { ReactNode, useContext, useEffect } from 'react';
import { Button, Col, ConfigProvider, Form, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { getLayoutDirection } from '../../layouts';
import { CANCEL, CREATE, REQUIRED } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../main';
import { useHistory } from 'react-router';
import { GuestUserModal } from '../../../components/guest_user_modal';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
interface Props {
  children: React.ReactElement;
}

export interface ModalState {
  showModal: (
    title: ReactNode,
    component: React.ReactElement,
    className: string,
    okButtonText: string,
    footer?: React.ReactElement
  ) => void;
  form?: FormInstance;
  setModalVisible?: (visible: boolean) => void;
}

const initState: ModalState = {
  showModal: (
    title: ReactNode,
    component: React.ReactElement,
    className: string,
    okButtonText: string,
    customFooter?: React.ReactElement
  ) => null,
};

const ModalContext = React.createContext<ModalState>(initState);
export const useModal = () => React.useContext(ModalContext);

interface DefaultFooterProps {
  onSubmit: (event: unknown) => void;
  onCancel: (event: unknown) => void;
  okButtonText: string;
}

const DefaultFooter: React.FunctionComponent<DefaultFooterProps> = (props: DefaultFooterProps) => {
  const { t } = useTranslation();

  return (
    <Col>
      <Button onClick={props.onCancel} className="footer-cancel">
        {t(CANCEL)}
      </Button>
      <Button type="primary" onClick={props.onSubmit}>
        {t(props.okButtonText)}
      </Button>
    </Col>
  );
};

export const ModalProvider: React.FunctionComponent<Props> = (props: Props) => {
  const { children } = props;
  const [title, setTitle] = React.useState<ReactNode>();
  const [className, setClassName] = React.useState<string>();
  const [visible, setVisible] = React.useState(false);
  const [component, setComponent] = React.useState<React.ReactElement>();
  const [footer, setFooter] = React.useState<React.ReactElement>();
  const [resetOnClose, setResetOnClose] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const history = useHistory();
  const { roomTypes: roomTypesList } = useContext(SharedStateContext) as SharedStateInterface;

  const onCancel = () => {
    setVisible(false);
    if (resetOnClose) {
      form.resetFields();
    }
  };

  const showModal = (
    title: ReactNode,
    component: React.ReactElement | undefined,
    className: string,
    okButtonText: string,
    customFooter?: React.ReactElement | undefined
  ) => {
    if (userState.isAuthenticated) {
      if (customFooter) {
        /**
         * If custom footer provided, it means the logic will be also passed to control this feature,
         * so we stop the automatic reset for the form in this special case.
         */
        setResetOnClose(false);
      }

      if (resetOnClose) {
        form.resetFields();
      }

      setVisible(true);
      setTitle(title);
      setClassName(className);
      if (component) {
        setComponent(component);
      }

      if (customFooter) {
        setFooter(customFooter);
      } else {
        setFooter(<DefaultFooter onSubmit={onFinish} onCancel={onCancel} okButtonText={okButtonText} />);
      }
    } else {
      setIsModalVisible(true);
    }
  };

  const setModalVisible = setVisible;

  const onFinish = async () => {
    form
      .validateFields()
      .then(() => {
        form.submit();
        setVisible(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    setVisible(false);
    form.resetFields();
  }, [history?.location?.pathname]);

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: `${t(REQUIRED)}`,
        },
      }}
      direction={getLayoutDirection(i18n.language)}
    >
      <ModalContext.Provider value={{ showModal, form, setModalVisible }} {...props}>
        <React.Fragment>
          {children}
          <Modal
            centered
            closable={false}
            forceRender={true}
            footer={footer}
            visible={visible}
            title={title}
            onCancel={onCancel}
            onOk={onFinish}
            okText={t(CREATE)}
            cancelText={t(CANCEL)}
            destroyOnClose
            className={`${className} ${getLayoutDirection(i18n.language)}`}
          >
            <div className="modal-form">
              {component && React.cloneElement(component, { ...component.props, form, roomTypesList })}
            </div>
          </Modal>
        </React.Fragment>
      </ModalContext.Provider>
      <GuestUserModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </ConfigProvider>
  );
};

export default ModalProvider;
