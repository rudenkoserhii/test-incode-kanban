import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import RootStoreContext from '../RootStore';

const Input: React.FC = observer(() => {
  const { repoStore, getRepo } = useContext(RootStoreContext);

  function onSubmit(e) {
    e.preventDefault();
    getRepo(e.target[0].value);
    e.target.reset();
  }

  return (
    <header>
      <form className="d-flex" onSubmit={onSubmit} role="form">
        <input
          role="input"
          type="text"
          placeholder="Enter repo url. For example https://github.com/facebook/react"
          pattern='^(ftp|http|https):\/\/[^ "]+$'
          value={repoStore.value}
          onChange={(e) => (repoStore.value = e.target.value)}
        />
        <button
          data-testid="button"
          type="submit"
          style={{
            whiteSpace: 'nowrap',
            borderColor: 'rgb(108,117,125)',
            background: 'lightgrey',
            color: 'rgb(33,37,41)',
          }}
        >
          Load issues
        </button>
      </form>
    </header>
  );
});

export default Input;
