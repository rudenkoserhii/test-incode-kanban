import React from 'react';
import { useSelector } from 'react-redux';
import { repoValue } from '../../redux/repo/selectors';
import { Typography } from 'antd';

const { Link } = Typography;

const Title: React.FC = () => {
  const url = useSelector(repoValue);

  return (
    url && (
      <Typography.Title level={1} style={{ margin: '0px', fontSize: '26px', color: 'blue' }}>
        <Link
          href={url
            .split('/')
            .splice(0, url.split('/').length - 1)
            .join('/')}
          target="_blank"
        >
          <span>
            {url.split('github.com/')[1].split('/')[0].charAt(0).toUpperCase() +
              url.split('github.com/')[1].split('/')[0].slice(1)}
          </span>
        </Link>
        {' > '}
        <Link href={url} target="_blank">
          <span>
            {url.split('github.com/')[1].split('/')[1].charAt(0).toUpperCase() +
              url.split('github.com/')[1].split('/')[1].slice(1)}
          </span>
        </Link>
      </Typography.Title>
    )
  );
};

export default Title;
