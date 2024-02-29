import { useSelector } from 'react-redux';
import { repoValue } from '../../redux/repo/selectors';
import { Typography } from 'antd';
import { getTitles } from '../../helpers/getTitles';

const { Link } = Typography;

const Title = (): JSX.Element | null => {
  const url = useSelector(repoValue);

  return url ? (
    <Typography.Title level={1} style={{ margin: '0px', fontSize: '26px', color: 'blue' }}>
      <Link
        href={url
          .split('/')
          .splice(0, url.split('/').length - 1)
          .join('/')}
        target="_blank"
      >
        <span>{getTitles(url, 0)}</span>
      </Link>
      {' > '}
      <Link href={url} target="_blank">
        <span>{getTitles(url, 1)}</span>
      </Link>
    </Typography.Title>
  ) : null;
};

export default Title;
