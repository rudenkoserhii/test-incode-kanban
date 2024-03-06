import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Divider, Row } from 'antd';
import Column from 'components/Column/Column';
import { COLUMN_NAMES } from 'constants/constants';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { repoValue } from '../../redux/repo/selectors';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { useBoardBackgrounds, useFetchIssues, useSetPage } from 'hooks';
import { getColumnProps } from 'helpers';

const Boards = (): JSX.Element => {
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

  const { pageToDo, pageInProgress, pageDone, setPage } = useSetPage();

  useEffect(() => {
    if (!url) return;
    fetchData(pageToDo, pageInProgress, pageDone);
  }, [url, pageToDo, pageInProgress, pageDone]);

  const { backgroundToDo, backgroundInProgress, backgroundDone, setBackGround } =
    useBoardBackgrounds();

  return (
    <div>
      <Divider orientation="right">Issues</Divider>
      <Row className="boards__row">
        {Object.values(COLUMN_NAMES).map((columnTitle) => (
          <Column
            key={columnTitle}
            title={columnTitle}
            setPage={(title) => setPage(title)}
            backgroundUp={(color: string) => setBackGround(color, columnTitle)}
            {...getColumnProps(
              columnTitle,
              nextPageToDo,
              toDoIssues,
              backgroundToDo,
              isLoadingToDo,
              nextPageInProgress,
              inProgressIssues,
              backgroundInProgress,
              isLoadingInProgress,
              nextPageDone,
              doneIssues,
              backgroundDone,
              isLoadingDone
            )}
          />
        ))}
      </Row>
    </div>
  );
};

export default Boards;
