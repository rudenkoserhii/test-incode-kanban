import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { App, Divider, Row } from 'antd';
import axios, { AxiosError } from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from 'components/Column/Column';
import { BASE_URL, COLUMN_NAMES, FIRST_PAGE, GREEN, RED } from 'constants/constants';
import { checkNextPage, getFilteredIssues } from 'helpers';
import { AppDispatch } from 'redux/store';
import { IssueType } from 'types';
import { changesValue } from '../../redux/changes/selectors';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';
import { getDoneIssues, nextPageDoneIssues } from '../../redux/doneIssues/slice';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { getInProgressIssues, nextPageInProgressIssues } from '../../redux/inProgressIssues/slice';
import { repoValue } from '../../redux/repo/selectors';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { getToDoIssues, nextPageToDoIssues } from '../../redux/toDoIssues/slice';

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;

const Boards = (): JSX.Element => {
  const [pageToDo, setPageToDo] = useState<number>(FIRST_PAGE);
  const [pageInProgress, setPageInProgress] = useState<number>(FIRST_PAGE);
  const [pageDone, setPageDone] = useState<number>(FIRST_PAGE);
  const [isLoadingToDo, setIsLoadingToDo] = useState<boolean>(false);
  const [isLoadingInProgress, setIsLoadingInProgress] = useState<boolean>(false);
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);
  const [nextPageToDo, setNextPageToDo] = useState<boolean>(false);
  const [nextPageInProgress, setNextPageInProgress] = useState<boolean>(false);
  const [nextPageDone, setNextPageDone] = useState<boolean>(false);

  const [, setToDoState] = useState<IssueType[]>([]);
  const [, setInProgressState] = useState<IssueType[]>([]);
  const [, setDoneState] = useState<IssueType[]>([]);

  const url = useSelector(repoValue);
  const dispatch: AppDispatch = useDispatch();
  const changes = useSelector(changesValue);

  const app = App.useApp();

  const repo = url.split('github.com/')[1];

  let toDoIssues = useSelector(toDoIssuesValue);
  let inProgressIssues = useSelector(inProgressIssuesValue);
  let doneIssues = useSelector(doneIssuesValue);

  useEffect(() => {
    url &&
      (async function getData() {
        setIsLoadingToDo(true);
        try {
          setNextPageToDo(false);

          const toDo = await axios.get(BASE_URL.replace('"repo"', repo), {
            params: {
              state: 'open',
              assignee: 'none',
              page: pageToDo,
            },
          });

          if (checkNextPage(toDo.headers?.link, pageToDo)) {
            setNextPageToDo(true);
          }

          if (!toDo.data) {
            return app.message.error('Whoops, something went wrong with ToDo issues!');
          }
          if (toDo.data.length === 0) {
            app.message.error('There are no ToDo issues on server!');
          }

          const filtered = getFilteredIssues(changes, repo, toDo.data, 'ToDo');

          pageToDo === 1
            ? dispatch(getToDoIssues(filtered))
            : dispatch(nextPageToDoIssues(filtered));
          setToDoState(toDoIssues);
        } catch (error) {
          app.message.warning((error as AxiosError).message);
        } finally {
          setIsLoadingToDo(false);
        }
      })();
  }, [url, pageToDo]);

  useEffect(() => {
    url &&
      (async function getData() {
        setIsLoadingInProgress(true);
        try {
          setNextPageInProgress(false);

          const inProgress = await axios.get(BASE_URL.replace('"repo"', repo), {
            params: {
              state: 'open',
              assignee: '*',
              page: pageInProgress,
            },
          });

          if (checkNextPage(inProgress.headers?.link, pageInProgress)) {
            setNextPageToDo(true);
          }

          if (!inProgress.data) {
            return app.message.error('Whoops, something went wrong with InProgress issues!');
          }
          if (inProgress.data.length === 0) {
            app.message.error('There are no InProgress issues on server!');
          }

          const filtered = getFilteredIssues(changes, repo, inProgress.data, 'In Progress');

          pageInProgress === 1
            ? dispatch(getInProgressIssues(filtered))
            : dispatch(nextPageInProgressIssues(filtered));
          setInProgressState(inProgressIssues);
        } catch (error) {
          app.message.warning((error as AxiosError).message);
        } finally {
          setIsLoadingInProgress(false);
        }
      })();
  }, [url, pageInProgress]);

  useEffect(() => {
    url &&
      (async function getData() {
        setIsLoadingDone(true);
        try {
          setNextPageDone(false);
          const done = await axios.get(BASE_URL.replace('"repo"', repo), {
            params: {
              state: 'closed',
              page: pageDone,
            },
          });

          if (checkNextPage(done.headers?.link, pageDone)) {
            setNextPageDone(true);
          }
          if (!done.data) {
            return app.message.error('Whoops, something went wrong with Done issues!');
          }
          if (done.data.length === 0) {
            app.message.error('There are no Done issues on server!');
          }

          const filtered = getFilteredIssues(changes, repo, done.data, 'Done');

          pageDone === 1
            ? dispatch(getDoneIssues(filtered))
            : dispatch(nextPageDoneIssues(filtered));
          setDoneState(doneIssues);
        } catch (error) {
          app.message.warning((error as AxiosError).message);
        } finally {
          setIsLoadingDone(false);
        }
      })();
  }, [url, pageDone]);

  function setPage(title: string) {
    title === 'ToDo' && setPageToDo((prev) => prev + 1);
    title === 'In Progress' && setPageInProgress((prev) => prev + 1);
    title === 'Done' && setPageDone((prev) => prev + 1);
  }

  const [backgroundToDo, setBackgroundToDo] = useState<string>('white');
  const [backgroundInProgress, setBackgroundInProgress] = useState<string>('white');
  const [backgroundDone, setBackgroundDone] = useState<string>('white');

  const setBackGround = (color: string, column: string) => {
    if (color === 'white') {
      setBackgroundToDo('white');
      setBackgroundInProgress('white');
      setBackgroundDone('white');
    }
    if (color === 'red') {
      switch (column) {
        case 'ToDo': {
          setBackgroundToDo(RED);
          setBackgroundInProgress(GREEN);
          setBackgroundDone(GREEN);
          break;
        }

        case 'InProgress': {
          setBackgroundToDo(GREEN);
          setBackgroundInProgress(RED);
          setBackgroundDone(GREEN);
          break;
        }

        case 'Done': {
          setBackgroundToDo(GREEN);
          setBackgroundInProgress(GREEN);
          setBackgroundDone(RED);
          break;
        }

        default:
          return;
      }
    }
  };

  return (
    <div>
      <Divider orientation="right">Issues</Divider>
      <Row className="boards__row">
        <DndProvider backend={HTML5Backend}>
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
            backgroundUp={(color: string) => setBackGround(color, 'InProgress')}
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
        </DndProvider>
      </Row>
    </div>
  );
};

export default Boards;
