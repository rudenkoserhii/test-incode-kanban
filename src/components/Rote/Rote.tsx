import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Notiflix from 'notiflix';
import axios from 'axios';
import RootStoreContext from '../RootStore';

export const Rote: React.FC = observer(() => {
  const { repoStore } = useContext(RootStoreContext);
  const [stars, setStars] = React.useState(0);
  const repo = repoStore.value.split('github.com/')[1];

  useEffect(() => {
    repoStore.value &&
      (async function getData() {
        try {
          const { data } = await axios.get(`https://api.github.com/repos/${repo}`);

          if (!data) {
            return Notiflix.Notify.failure('Whoops, something went wrong with Stars count!');
          }
          setStars(data.stargazers_count);
        } catch (error) {
          Notiflix.Notify.warning('Stars count not loaded, ' + error.message);
        }
      })();
  }, [repoStore.value]);

  return (
    repoStore.value && (
      <h2 style={{ marginBottom: '0px', fontSize: '26px' }}>
        {'\u2B50'}
        {stars > 1000 ? ` ${Math.ceil(stars / 1000)} K stars` : stars}
      </h2>
    )
  );
});
