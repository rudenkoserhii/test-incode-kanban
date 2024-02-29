import React, { useEffect, useState } from 'react';
import { Row } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { changesValue } from '../../redux/changes/selectors';
import { getToDoIssues, nextPageToDoIssues } from '../../redux/toDoIssues/slice';
import { getInProgressIssues, nextPageInProgressIssues } from '../../redux/inProgressIssues/slice';
import { getDoneIssues, nextPageDoneIssues } from '../../redux/doneIssues/slice';
import { repoValue } from '../../redux/repo/selectors';
import { BASE_URL, COLUMN_NAMES } from '../../constants/constants';
import Column from '../Column/Column';
import Notiflix from 'notiflix';
import axios, { AxiosError } from 'axios';
import { getFilteredIssues } from '../../helpers';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;
const FIRST_PAGE: number = 1;

const Boards: React.FC = () => {
  const [pageToDo, setPageToDo] = useState<number>(FIRST_PAGE);
  const [pageInProgress, setPageInProgress] = useState<number>(FIRST_PAGE);
  const [pageDone, setPageDone] = useState<number>(FIRST_PAGE);
  const [removeButtonToDo, setRemoveButtonToDo] = useState<boolean>(false);
  const [removeButtonInProgress, setRemoveButtonInProgress] = useState<boolean>(false);
  const [removeButtonDone, setRemoveButtonDone] = useState<boolean>(false);
  const [isLoadingToDo, setIsLoadingToDo] = useState<boolean>(false);
  const [isLoadingInProgress, setIsLoadingInProgress] = useState<boolean>(false);
  const [isLoadingDone, setIsLoadingDone] = useState<boolean>(false);

  const [, setToDoState] = useState([]);
  const [, setInProgressState] = useState([]);
  const [, setDoneState] = useState([]);

  const url = useSelector(repoValue);
  const dispatch = useDispatch();
  const changes = useSelector(changesValue);

  const repo = url.split('github.com/')[1];

  const toDoIssues = useSelector(toDoIssuesValue);
  const inProgressIssues = useSelector(inProgressIssuesValue);
  const doneIssues = useSelector(doneIssuesValue);

  useEffect(() => {
    url &&
      (async function getData() {
        setIsLoadingToDo(true);
        try {
          setRemoveButtonToDo(false);

          const toDo = await axios.get(BASE_URL.replace('"repo"', repo), {
            params: {
              state: 'open',
              assignee: 'none',
              page: pageToDo,
            },
          });

          if (!toDo.data) {
            return Notiflix.Notify.failure('Whoops, something went wrong with ToDo issues!');
          } else if (toDo.data.length === 0) {
            setRemoveButtonToDo(true);

            return Notiflix.Notify.failure('Whoops, no ToDo issues more!');
          }

          const filtered = getFilteredIssues(changes, repo, toDo.data, 'ToDo');

          pageToDo === 1
            ? dispatch(getToDoIssues(filtered))
            : dispatch(nextPageToDoIssues(filtered));
          setToDoState(toDoIssues);
        } catch (error) {
          Notiflix.Notify.warning((error as AxiosError).message);
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
          setRemoveButtonInProgress(false);

          const inProgress = await axios.get(BASE_URL.replace('"repo"', repo), {
            params: {
              state: 'open',
              assignee: '*',
              page: pageInProgress,
            },
          });

          if (!inProgress.data) {
            return Notiflix.Notify.failure('Whoops, something went wrong with In progress issues!');
          } else if (inProgress.data.length === 0) {
            setRemoveButtonInProgress(true);

            return Notiflix.Notify.failure('Whoops, no In Progress issues more!');
          }

          const filtered = getFilteredIssues(changes, repo, inProgress.data, 'In Progress');

          pageInProgress === 1
            ? dispatch(getInProgressIssues(filtered))
            : dispatch(nextPageInProgressIssues(filtered));
          setInProgressState(inProgressIssues);
        } catch (error) {
          Notiflix.Notify.warning((error as AxiosError).message);
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
          setRemoveButtonDone(false);
          const done = await axios.get(BASE_URL.replace('"repo"', repo), {
            params: {
              state: 'closed',
              page: pageDone,
            },
          });

          if (!done.data) {
            return Notiflix.Notify.failure('Whoops, something went wrong with Done issues!');
          } else if (done.data.length === 0) {
            setRemoveButtonDone(true);

            return Notiflix.Notify.failure('Whoops, no Done issues more!');
          }

          const filtered = getFilteredIssues(changes, repo, done.data, 'Done');

          pageDone === 1
            ? dispatch(getDoneIssues(filtered))
            : dispatch(nextPageDoneIssues(filtered));
          setDoneState(doneIssues);
        } catch (error) {
          Notiflix.Notify.warning((error as AxiosError).message);
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

  return (
    <div>
      <Row style={{ height: 'fit-content', width: '100%' }}>
        <DndProvider backend={HTML5Backend}>
          <Column
            title={TO_DO}
            removeButton={removeButtonToDo}
            column={toDoIssues}
            setPage={(title) => setPage(title)}
            isLoading={isLoadingToDo}
          />
          <Column
            title={IN_PROGRESS}
            removeButton={removeButtonInProgress}
            column={inProgressIssues}
            setPage={(title) => setPage(title)}
            isLoading={isLoadingInProgress}
          />
          <Column
            title={DONE}
            removeButton={removeButtonDone}
            column={doneIssues}
            setPage={(title) => setPage(title)}
            isLoading={isLoadingDone}
          />
        </DndProvider>
      </Row>
    </div>
  );
};

export default Boards;
