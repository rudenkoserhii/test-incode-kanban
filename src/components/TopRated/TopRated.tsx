import { useEffect, useState } from 'react';
import Notiflix from 'notiflix';
import axios, { AxiosError } from 'axios';
import { BASE_URL_TOP } from '../../constants/constants';
import Title from 'antd/es/typography/Title';
import { Button, Card, Skeleton, Space, Typography } from 'antd';
// import Title from 'antd/es/typography/Title';

const TopRated = (): JSX.Element => {
  const [repos, setRepos] = useState<{ name: string; url: string }[] | []>([]);
  const [isloadingTop, setIsLoadingTop] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingTop(true);
    (async function getData() {
      try {
        const { data } = await axios.get(BASE_URL_TOP);

        if (!data) {
          return Notiflix.Notify.failure('Whoops, something went wrong with Top Rated Repos!');
        }
        setRepos(
          data.items.map(({ name, svn_url }: { name: string; svn_url: string }) => ({
            name,
            url: svn_url,
          }))
        );
        setIsLoadingTop(false);
      } catch (error) {
        Notiflix.Notify.warning('Top Rated Repos not loaded, ' + (error as AxiosError).message);
      }
    })();
    setIsLoadingTop(false);
  }, []);
  console.log(repos);

  return (
    <>
      <Title style={{ marginBottom: '0px', fontSize: '26px' }}>Top Rated Repos</Title>
      {isloadingTop ? (
        <Space>
          <Skeleton.Button active={true} size={'small'} shape={'default'} block={true} />
          <Skeleton.Button active={true} size={'small'} shape={'default'} block={true} />
        </Space>
      ) : (
        <Space direction="vertical">
          {repos &&
            repos.length > 0 &&
            repos.map(({ name, url }) => (
              <Card>
                <Typography.Text>{name}</Typography.Text>
                <Typography.Text>{url}</Typography.Text>
                <Button title="Copy link" />
              </Card>
            ))}
        </Space>
      )}
    </>
  );
};

export default TopRated;
