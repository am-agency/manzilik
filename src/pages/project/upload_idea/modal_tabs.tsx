import React, { useState } from 'react';
import { UPLOAD_PHOTO, SAVE_FROM_WEB } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { FormInstance, Tabs } from 'antd';
import { FileUploader } from './file_uploader';
import { IdeasFromWeb } from '../components/ideas_from_web';
import { useMainContext } from '../../../app/providers/main';
import { uploadAsset } from '../../../utils/assets_manager';
import { BaseEntity } from '../../../components/idea/types';
import { IDEA } from '../../../app/settings';
import { getBase64 } from '../../../utils';
import { addIdea } from '../api';
import { UploadFile } from 'antd/lib/upload/interface';
import { Idea } from '../../../API';
import { MakhzanDestination } from '.';
import { useModal } from '../../../app/providers/modal';
import { LOADING_UPLOADING_IDEA_IMAGE } from '../../../app/providers/main/loading_constants';

const { TabPane } = Tabs;

interface Props {
  form?: FormInstance;
  projectId: string;
  onUploadIdeaToProject: Function;
  setIsForceRefresh: Function;
}

export const ModalTabs = ({ form, projectId, onUploadIdeaToProject, setIsForceRefresh }: Props) => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { setModalVisible } = useModal();
  const [activeKey, setActiveKey] = useState<string>('1');

  const onTabChange = (tab: string) => {
    // when tab is changed, it will reset all the uploader fields
    form?.resetFields();
    setActiveKey(tab);
  };

  const initAddIdea = async () => {
    const idea: Idea = await addIdea({ project_id: projectId, photo: '', title: '', source: '' });
    return idea;
  };

  const onUploadIdea = (fileList: UploadFile[]) => {
    setIsForceRefresh(false);
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      requestApi(
        initAddIdea,
        {},
        (idea: BaseEntity) => {
          requestApi(
            uploadAsset,
            {
              file: file.originFileObj,
              file_name: idea.id,
              content_type: file.type,
              destination: MakhzanDestination.IDEA,
            },
            async (url: string, error: string) => {
              if (!error) {
                setIsForceRefresh(true);
                const photo = await getBase64(file.originFileObj);
                idea.photo = photo;
                idea.entity_id = idea.id;
                idea.tag = IDEA;
                onUploadIdeaToProject(idea);
              }
            }
          );
        },
        LOADING_UPLOADING_IDEA_IMAGE
      );
      setModalVisible?.(false);
    }
  };

  return (
    <Tabs defaultActiveKey="1" activeKey={activeKey} className="tabs" onChange={onTabChange}>
      <TabPane tab={t(UPLOAD_PHOTO)} key="1">
        <FileUploader onFinish={onUploadIdea} form={form!} />
      </TabPane>
      <TabPane tab={t(SAVE_FROM_WEB)} key="2">
        <IdeasFromWeb onUploadIdea={onUploadIdea} setActiveKey={setActiveKey} />
      </TabPane>
    </Tabs>
  );
};
