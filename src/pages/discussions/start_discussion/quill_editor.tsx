import React, { FunctionComponent, LegacyRef, ReactElement, useEffect, useRef, useState } from 'react';
import discussionsIcons from '../../../assets/icons/discussions';
import isUrl from 'is-url';
import ReactQuill, { Quill } from 'react-quill';
import { v4 as uuid } from 'uuid';
import { getLayoutDirection } from '../../../app/layouts';
import i18n from '../../../app/i18n';
import { useModal } from '../../../app/providers/modal';
import { message, Row } from 'antd';

import 'react-quill/dist/quill.snow.css';
import AddPoll from './add_poll';
import { BarChartOutlined } from '@ant-design/icons';
import { ADD_LINK, ADD_POLL, ADD_VIDEO, REMOVE_POLL, REQUIRED } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import AddLinkOrVideo from './components/add_link';
import { checkEmptyString, extractVideoUrl } from '../../../utils';
import { Discussion } from '../types';
import { useMainContext } from '../../../app/providers/main';
import { uploadAsset } from '../../../utils/assets_manager';
import { MakhzanDestination } from '../../project/upload_idea';
import { AR } from '../../../locales/constants';

const quillIcons = Quill.import('ui/icons');
const quillImage = Quill.import('formats/image');

quillIcons['bold'] = `<img src=${discussionsIcons.bold.icon} />`;
quillIcons['italic'] = `<img src=${discussionsIcons.italic.icon} />`;
quillIcons['bullet'] = `<img src=${discussionsIcons.bulleted_list.icon} />`;
quillIcons['list'] = `<img src=${discussionsIcons.numbered_list.icon} />`;
quillIcons['link'] = `<img src=${discussionsIcons.hyperlink.icon} />`;
quillIcons['image'] = `<img src=${discussionsIcons.image.icon} />`;
quillIcons['video'] = `<img src=${discussionsIcons.video.icon} />`;
quillIcons['align'].center = `<img src=${discussionsIcons.alignCenter.icon} />`;
quillIcons['align'].right = `<img src=${discussionsIcons.alignRight.icon} />`;
quillIcons.align[''] = `<img src=${discussionsIcons.alignLeft.icon} />`;

quillImage.className = 'img-editor';
Quill.register(quillImage, true);

interface QuillEditorProps {
  updateDiscussion?: Function;
  discussion?: Discussion;
  updateEditorValue?: Function;
  editorDefaultValue?: string;
}

const QuillEditor: FunctionComponent<QuillEditorProps> = (props: QuillEditorProps) => {
  const quillRef: LegacyRef<ReactQuill> = useRef(null);
  const { showModal } = useModal();
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [isLoaded, setLoaded] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>();
  const { updateDiscussion, discussion, updateEditorValue, editorDefaultValue } = props;

  useEffect(() => {
    updateDiscussion?.('photo', photoUrl);
  }, [photoUrl]);

  const editor = quillRef?.current?.getEditor();
  const formats = ['bold', 'italic', 'list', 'bullet', 'link', 'image', 'video', 'align'];

  const videoHandler = (values: { text: string; link: string }) => {
    let url = values.link;
    url = extractVideoUrl(url);
    const cursorPosition: number | undefined = editor?.getSelection?.(true)?.index || 0;

    if (url != null && cursorPosition !== undefined && isUrl(url)) {
      editor?.insertEmbed(cursorPosition, 'video', url);
      editor?.insertText(editor?.getLength()! + 1, ' ');
      editor?.setSelection?.(editor?.getLength() + 1, 0);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageHandler = (e: any) => {
    const input = document.createElement('input');
    input.id = 'file';
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input?.files![0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        const cursorPosition: number | undefined = editor?.getSelection?.(true)?.index || 0;
        editor?.insertText(editor?.getLength()! + 1, ' ');
        editor?.setSelection?.(editor?.getLength() + 1, 0);
        if (cursorPosition !== undefined) {
          requestApi(
            uploadAsset,
            {
              file: file,
              file_name: uuid(),
              content_type: file.type,
              destination: MakhzanDestination.GENERAL,
            },
            async (url: string, error: string) => {
              if (!error) {
                const photoUrl = url;
                if (!discussion?.photo) {
                  setPhotoUrl(photoUrl);
                }
                editor?.insertEmbed(cursorPosition + 1, 'image', photoUrl);
                editor?.insertText(editor?.getLength()! + 1, ' ');
                editor?.setSelection?.(editor?.getLength() + 1, 0);
              }
            }
          );

          document.getElementById('file') && document.removeChild(document.getElementById('file')!);
        }
      } else {
        console.warn('Only images can be uploaded here.');
      }
    };
  };

  const insertLink = (values: { text: string; link: string }) => {
    editor?.insertText?.(editor?.getLength() + 1, values.text, 'link', values.link);
    editor?.setSelection?.(editor?.getLength() + 1, 0);
  };

  const handleLink = () => {
    showModal(
      t(ADD_LINK),
      <AddLinkOrVideo insertLink={insertLink} quillRef={quillRef?.current!} />,
      'modal-wrapper',
      '',
      <div />
    );
  };

  const handleVideo = () => {
    showModal(
      t(ADD_VIDEO),
      <AddLinkOrVideo isVideo insertLink={videoHandler} quillRef={quillRef?.current!} />,
      'modal-wrapper',
      '',
      <div />
    );
  };

  const defineHandlers = () => {
    const toolbar = editor?.getModule('toolbar');
    toolbar?.addHandler('link', handleLink);
    toolbar?.addHandler('video', handleVideo);
    toolbar?.addHandler('image', imageHandler);
    editor?.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      delta?.ops?.forEach(function (match) {
        if (match.insert.image) {
          delete match.insert.image;
        }
      });
      return delta;
    });
    editor?.focus();
  };

  const initiateEditorDirection = () => {
    editor?.format('align', i18n.language === AR ? 'right' : editor?.format('align', 'left'));
    editor?.focus();
  };

  useEffect(() => {
    defineHandlers();
    setLoaded(true);
  }, [isLoaded]);

  useEffect(() => {
    initiateEditorDirection();
  }, [i18n.language]);

  return (
    <ReactQuill
      ref={quillRef}
      defaultValue={discussion?.description || editorDefaultValue}
      modules={{
        toolbar: {
          container: '#toolbar',
        },
      }}
      className={getLayoutDirection(i18n.language)}
      formats={formats}
      preserveWhitespace
      onChange={async (value) => {
        try {
          message.destroy();
          await checkEmptyString(
            value,
            (val: string) => {
              updateDiscussion?.('description', val);
              updateEditorValue?.(val);
            },
            t(REQUIRED)
          );
        } catch (error) {
          message.error(t(REQUIRED));
        }
      }}
      theme="snow"
    />
  );
};
interface Props {
  addPoll?: boolean;
  togglePoll?: Function;
  withPoll?: boolean;
  updateDiscussion?: Function;
  updateEditorValue?: Function;
  discussion?: Discussion;
  editorDefaultValue?: string;
}

const Editor: FunctionComponent<Props> = (props: Props) => {
  const { addPoll, togglePoll, withPoll, updateDiscussion, discussion, updateEditorValue, editorDefaultValue } = props;
  const { t } = useTranslation();

  return (
    <>
      <QuillEditor
        updateDiscussion={updateDiscussion}
        discussion={discussion}
        updateEditorValue={updateEditorValue}
        editorDefaultValue={editorDefaultValue}
      />
      <div className="toolbar" id="toolbar">
        <MarkButton format="bold" className="ql-bold" />
        <MarkButton format="link" className="ql-link" />
        <MarkButton format="link2" className="ql-image" />
        <MarkButton format="link4" className="ql-video" />
        <MarkButton format="italic" className="ql-italic" />
        <MarkButton format="numbered-list" className="ql-list" />
        <MarkButton className="ql-align" value="right" />
        <MarkButton className="ql-align" value="center" />
        <MarkButton className="ql-align" value="" />
        <MarkButton format="bulleted-list" className="ql-list ql-bullet" />
        {withPoll && (
          <Row justify="end" className="add-poll-btn">
            <span
              onClick={() => {
                if (addPoll) {
                  updateDiscussion?.('polls', []);
                }
                togglePoll?.(!addPoll);
              }}
            >
              <BarChartOutlined />
              &nbsp; {!addPoll ? t(ADD_POLL) : t(REMOVE_POLL)}
            </span>
          </Row>
        )}
      </div>
      {addPoll && <AddPoll updateDiscussion={updateDiscussion} discussion={discussion} />}
    </>
  );
};

interface ButtonProps {
  format?: string;
  icon?: ReactElement;
  className?: string;
  value?: string;
}

const MarkButton: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  const { className, value } = props;
  return <button value={value} className={`editor-btn ${className}`}></button>;
};

export default Editor;
