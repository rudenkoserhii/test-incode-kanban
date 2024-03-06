import { useState } from 'react';

import { FIRST_PAGE } from 'constants/constants';

export const useSetPage = () => {
  const [pageToDo, setPageToDo] = useState<number>(FIRST_PAGE);
  const [pageInProgress, setPageInProgress] = useState<number>(FIRST_PAGE);
  const [pageDone, setPageDone] = useState<number>(FIRST_PAGE);

  const setPage = (title: string) => {
    if (title === 'ToDo') {
      setPageToDo((prev) => prev + 1);
    } else if (title === 'In Progress') {
      setPageInProgress((prev) => prev + 1);
    } else if (title === 'Done') {
      setPageDone((prev) => prev + 1);
    }
  };

  return { pageToDo, pageInProgress, pageDone, setPage };
};
