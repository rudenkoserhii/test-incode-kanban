import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Divider, Row } from 'antd';
import Column from 'components/Column/Column';
import { COLUMN_NAMES, FIRST_PAGE } from 'constants/constants';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { repoValue } from '../../redux/repo/selectors';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { useBoardBackgrounds, useFetchIssues } from 'hooks';

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;

const Boards = (): JSX.Element => {
  const [pageToDo, setPageToDo] = useState<number>(FIRST_PAGE);
  const [pageInProgress, setPageInProgress] = useState<number>(FIRST_PAGE);
  const [pageDone, setPageDone] = useState<number>(FIRST_PAGE);

  const url = useSelector(repoValue);

  let toDoIssues = useSelector(toDoIssuesValue);
  let inProgressIssues = useSelector(inProgressIssuesValue);
  let doneIssues = useSelector(doneIssuesValue);

  const {
    fetchData,
    isLoadingToDo,
    isLoadingInProgress,
    isLoadingDone,
    nextPageToDo,
    nextPageInProgress,
    nextPageDone,
  } = useFetchIssues();

  useEffect(() => {
    if (!url) return;
    fetchData(pageToDo, pageInProgress, pageDone);
  }, [url, pageToDo, pageInProgress, pageDone]);

  function setPage(title: string) {
    title === 'ToDo' && setPageToDo((prev) => prev + 1);
    title === 'In Progress' && setPageInProgress((prev) => prev + 1);
    title === 'Done' && setPageDone((prev) => prev + 1);
  }

  const { backgroundToDo, backgroundInProgress, backgroundDone, setBackGround } =
    useBoardBackgrounds();

  return (
    <div>
      <Divider orientation="right">Issues</Divider>
      <Row className="boards__row">
        <Column
          title={TO_DO}
          removeButton={nextPageToDo}
          column={toDoIssues}
          setPage={(title) => setPage(title)}
          background={backgroundToDo}
          backgroundUp={(color: string) => setBackGround(color, 'ToDo')}
          isLoading={isLoadingToDo}
        />
        <Column
          title={IN_PROGRESS}
          removeButton={nextPageInProgress}
          column={inProgressIssues}
          setPage={(title) => setPage(title)}
          background={backgroundInProgress}
          backgroundUp={(color: string) => setBackGround(color, 'In Progress')}
          isLoading={isLoadingInProgress}
        />
        <Column
          title={DONE}
          removeButton={nextPageDone}
          column={doneIssues}
          setPage={(title) => setPage(title)}
          background={backgroundDone}
          backgroundUp={(color: string) => setBackGround(color, 'Done')}
          isLoading={isLoadingDone}
        />
      </Row>
    </div>
  );
};

export default Boards;
