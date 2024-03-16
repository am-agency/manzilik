import React, { useState } from 'react';
import { ConfigProvider, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useTranslation } from 'react-i18next';
import { RoomType, Project } from '../../../../../../API';
import { getLayoutDirection } from '../../../../../../app/layouts';
import { ModalTitle } from '../../../../../../components/modal_title';
import { REQUIRED, CREATE_PROJECT, CREATE, CANCEL } from '../../../../../../locales/strings';
import AddNewProject from '../../../../../projects/add_new_project';
import tagIcon from '../../../../../../assets/icons/tag.svg';

//  This component is a separate modal to show two modals at the same time within save idea operation
const CreateNewProject = ({
  roomTypesList,
  postCreateProject,
  onCancel,
}: {
  roomTypesList?: RoomType[];
  postCreateProject: Function;
  onCancel: Function;
}) => {
  const { i18n, t } = useTranslation();
  const [form] = useForm();
  const [isVisible, setInVisible] = useState<boolean>(true);

  return (
    <ConfigProvider
      form={{
        validateMessages: {
          required: `${t(REQUIRED)}`,
        },
      }}
      direction={getLayoutDirection(i18n.language)}
    >
      <Modal
        centered
        closable={false}
        forceRender={true}
        visible={isVisible}
        title={<ModalTitle icon={tagIcon} title={t(CREATE_PROJECT)} />}
        onCancel={() => {
          setInVisible(false);
          form.resetFields();
          onCancel();
        }}
        onOk={form.submit}
        okText={t(CREATE)}
        cancelText={t(CANCEL)}
        destroyOnClose
        className={`${getLayoutDirection(i18n.language)} modal-wrapper`}
      >
        <div className="modal-form">
          <AddNewProject
            postAddProject={(newProject: Project) => {
              postCreateProject(newProject);
            }}
            form={form}
            roomTypesList={roomTypesList}
          />
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default CreateNewProject;
