import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { BASE_URL_TOP } from '../../constants/constants';
import { Divider, Dropdown, Skeleton, Space, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const TopRated = (): JSX.Element => {
  const [repos, setRepos] = useState<{ name: string; url: string }[] | []>([]);
  const [isloadingTop, setIsLoadingTop] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingTop(true);
    (async function getData() {
      try {
        const { data } = await axios.get(BASE_URL_TOP);

        if (!data) {
          return message.error('Whoops, something went wrong with Top Rated Repos!');
        }
        setRepos(
          data.items.map(({ name, svn_url }: { name: string; svn_url: string }) => ({
            name,
            url: svn_url,
          }))
        );
        setIsLoadingTop(false);
      } catch (error) {
        message.warning('Top Rated Repos not loaded, ' + (error as AxiosError).message);
      }
    })();
  }, []);

  const items: MenuProps['items'] = repos.map(({ name, url }, id) => ({
    label: `${name} - ${url}`,
    key: id.toString(),
  }));

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const label = (items as { label: string; key: string }[]).find(
      (item) => item?.key === key
    )?.label;

    if (label) {
      navigator.clipboard.writeText(label.split(' - ')[1]);
      message.info(`Link to repo ${label.split(' - ')[0]} copied to the ClipBoard!`);
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
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{ height: '1.5rem' }}>
              Select and Click for the copying to the ClipBoard!
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Skeleton>
    </>
  );
};

export default TopRated;
