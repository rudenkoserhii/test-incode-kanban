import { useSelector } from 'react-redux';
import { Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { getTitles } from 'helpers';
import { repoValue } from '../../redux/repo/selectors';

const { Link } = Typography;

const Title = (): JSX.Element | null => {
  const url = useSelector(repoValue);

  return url ? (
    <Typography.Title level={1} className="title__box">
      <Link
        className="link"
        href={url
          .split('/')
          .splice(0, url.split('/').length - 1)
          .join('/')}
        target="_blank"
      >
        <span>{getTitles(url, 0)}</span>
      </Link>
      <RightOutlined
        style={{
          marginInline: 16,
          fontSize: 16,
          color: '#00b96b',
        }}
      />
      <Link href={url} target="_blank" className="link">
        <span>{getTitles(url, 1)}</span>
      </Link>
    </Typography.Title>
  ) : null;
};

export default Title;
