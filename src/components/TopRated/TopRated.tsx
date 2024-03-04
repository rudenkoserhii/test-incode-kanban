import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { BASE_URL_TOP } from '../../constants/constants';
import { Divider, Dropdown, Skeleton, Space, App } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { LabelProps } from '../../types';

const TopRated = (): JSX.Element => {
  const [repos, setRepos] = useState<{ name: string; url: string }[] | []>([]);
  const [isloadingTop, setIsLoadingTop] = useState<boolean>(false);
  const app = App.useApp();

  useEffect(() => {
    setIsLoadingTop(true);
    (async function getData() {
      try {
        const { data } = await axios.get(BASE_URL_TOP);

        if (!data) {
          return app.message.error('Whoops, something went wrong with Top Rated Repos!');
        }
        setRepos(
          data.items.map(({ name, svn_url }: { name: string; svn_url: string }) => ({
            name,
            url: svn_url,
          }))
        );
        setIsLoadingTop(false);
      } catch (error) {
        app.message.warning('Top Rated Repos not loaded, ' + (error as AxiosError).message);
      }
    })();
  }, []);

  const items: MenuProps['items'] = repos.map(({ name, url }, id) => ({
    label: (
      <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span
        // style={{
        //   display: 'inline-block',
        //   overflow: 'hidden',
        //   textOverflow: 'ellipsis',
        //   whiteSpace: 'nowrap',
        //   maxWidth: '30%',
        // }}
        >
          <b>{name.replace(name[0], name[0].toUpperCase())}</b>
        </span>
        <span
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '70%',
          }}
        >
          {url}
        </span>
      </span>
    ),
    key: id.toString(),
  }));

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const label = (items as { label: LabelProps; key: string }[]).find(
      (item) => item?.key === key
    )?.label;

    const spanFirst = label?.props.children[0].props.children.props.children;
    const spanSecond = label?.props.children[1].props.children;

    if (spanSecond && spanFirst) {
      navigator.clipboard.writeText(spanSecond.toString());
      app.message.info(`Link to repo ${spanFirst.toString()} copied to the ClipBoard!`);
    }
  };

  const paragraphProps = {
    rows: 0,
    width: ['100%'],
  };

  return (
    <>
      <Divider orientation="right">Top Rated Repos</Divider>
      <Skeleton active loading={isloadingTop} paragraph={{ ...paragraphProps }}>
        <Dropdown
          menu={{
            items,
            onClick,
          }}
        >
          <a onClick={(e) => e.preventDefault()} className="dropdown">
            <Space>
              Select and Click for the copying to the ClipBoard!
              <DownOutlined
                style={{
                  fontSize: 16,
                  color: '#00b96b',
                }}
              />
            </Space>
          </a>
        </Dropdown>
      </Skeleton>
    </>
  );
};

export default TopRated;
