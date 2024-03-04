import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { repoValue } from '../../redux/repo/selectors';
import Notiflix from 'notiflix';
import axios, { AxiosError } from 'axios';
import { BASE_URL_STARS, DEFAULT_STARS } from '../../constants/constants';
import { App } from 'antd';

const Rote = (): JSX.Element | null => {
  const [stars, setStars] = useState<number>(DEFAULT_STARS);

  const url = useSelector(repoValue);

  const repo = url.split('github.com/')[1];

  const app = App.useApp();

  useEffect(() => {
    url &&
      (async function getData() {
        try {
          const { data } = await axios.get(BASE_URL_STARS.replace('"repo"', repo));

          if (!data) {
            return app.message.error('Whoops, something went wrong with Stars count!');
          }
          setStars(data.stargazers_count);
        } catch (error) {
          app.message.warning('Stars count not loaded, ' + (error as AxiosError).message);
        }
      })();
  }, [url]);

  return url ? (
    <h2 className="stars">
      {'\u2B50'}
      {stars > 1000 ? ` ${Math.ceil(stars / 1000)} K stars` : stars}
    </h2>
  ) : null;
};

export default Rote;
