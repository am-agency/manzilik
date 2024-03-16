import { Col, Row, Typography } from 'antd';
import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { EntityTags, Magazine, TV } from '../../../../components/idea/types';
import { IdeaDestination } from '../../../../app/settings';
import { IdeaCard } from '../../../../components/idea';
import { PluginTypes } from '../../types';
interface Props {
  magazine?: Magazine | TV;
}
export const ArticleContent: FunctionComponent<Props> = (props: Props) => {
  const [children, setChildren] = useState<ReactElement[]>([]);

  const convertDataToHTML = async () => {
    const placeholders = props.magazine?.page?.placeholders;

    await placeholders?.forEach((elem: { plugins: PlaceHolder[] }) => {
      const newChildren = elem.plugins.map((plg: Plugin) => {
        return getHTMLElement(plg)!;
      });
      setChildren(newChildren);
    });
  };

  useEffect(() => {
    convertDataToHTML();
  }, [props.magazine?.id]);

  return <div className="content-article">{children.map((child) => React.cloneElement(child, {}))}</div>;
};

const getHTMLElement: (plg: PlaceHolder) => ReactElement | undefined = (plg: PlaceHolder) => {
  switch (plg.plugin_type) {
    case PluginTypes.TextPlugin:
      const Text: ReactElement = <div dangerouslySetInnerHTML={{ __html: plg?.body || plg?.plugin_data?.body! }}></div>;
      return Text;
    case PluginTypes.Bootstrap4PicturePlugin:
      if (plg.attributes?.tag === 'idea' || plg.plugin_data?.attributes?.tag === 'idea') {
        const Card: ReactElement = (
          <IdeaCard
            entity={{
              photo: plg?.external_picture || plg?.plugin_data?.external_picture!,
              id: plg.attributes?.idea_id! || plg.plugin_data?.attributes?.idea_id,
            }}
            tag={EntityTags.IDEA}
            ideaDestination={IdeaDestination.searchIdeas}
          />
        );
        return Card;
      } else {
        const Image: ReactElement = (
          <img
            className="rounded-border img-fit-content"
            src={plg?.external_picture || plg?.plugin_data?.external_picture!}
          />
        );
        return Image;
      }
    case PluginTypes.Bootstrap4GridRowPlugin:
      const RoSection: ReactElement = <RowSection sections={plg?.children}></RowSection>;
      return RoSection;
    case PluginTypes.Bootstrap4GridColumnPlugin:
      const ColSection: ReactElement = <ColumSection sections={plg.children}></ColumSection>;
      return ColSection;
    case PluginTypes.Bootstrap4LinkPlugin:
      const Link: ReactElement = (
        <a href={plg?.plugin_data?.external_link!}>
          <Typography.Link>{plg?.plugin_data?.name}</Typography.Link>
        </a>
      );
      return Link;
    default:
      return <div />;
  }
};

interface SectionProps {
  sections?: Plugin[];
}

export const RowSection: FunctionComponent<SectionProps> = (props: SectionProps) => {
  const children = props.sections?.map((plg: Plugin) => getHTMLElement(plg)!);
  return <Row>{children?.map((child) => React.cloneElement(child, {}))}</Row>;
};

export const ColumSection: FunctionComponent<SectionProps> = (props: SectionProps) => {
  const children = props.sections?.map((plg: Plugin) => getHTMLElement(plg)!);
  const colStyle = { display: 'flex', flex: 1 };
  return <Col style={colStyle}>{children?.map((child) => React.cloneElement(child, {}))}</Col>;
};

export interface PlaceHolder {
  plugin_type?: string;
  external_picture?: string;
  body?: string;
  link_url?: string;
  attributes?: Attributes;
  plugin_data?: PluginData;
  children?: {
    content_type?: string;
    plugin_type?: string;
    name?: string;
    plugin_data?: PluginData;
    children?: Plugin[];
  }[];
}

interface Plugin {
  content_type?: string;
  plugin_type?: string;
  name?: string;
  attributes?: Attributes;
  external_picture?: string;
  plugin_data?: PluginData;
}

interface PluginData {
  body?: string;
  external_picture?: string;
  external_link?: string;
  name?: string;
  link_url?: string;
  attributes?: Attributes;
}

interface Attributes {
  tag?: string;
  idea_id?: string;
}
