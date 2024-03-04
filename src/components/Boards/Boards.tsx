import React, { useEffect, useState } from 'react';
import { App, Divider, Row, message } from 'antd';
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
import { checkNextPage, getFilteredIssues } from '../../helpers';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';
import { IssueType } from '../../types';
import { AppDispatch } from '../../redux/store';

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;
const FIRST_PAGE: number = 1;

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

  const toDoIssues = useSelector(toDoIssuesValue);
  const inProgressIssues = useSelector(inProgressIssuesValue);
  const doneIssues = useSelector(doneIssuesValue);

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
            // return Notiflix.Notify.failure('Whoops, something went wrong with ToDo issues!');
            return app.message.error('Whoops, something went wrong with ToDo issues!');
          }
          if (toDo.data.length === 0) {
            // return Notiflix.Notify.failure('There are no ToDo issues!');
            return app.message.error('There are no ToDo issues!');
          }
          // else if (toDo.data.length === 0) {
          //   setRemoveButtonToDo(true);

          //   return Notiflix.Notify.failure('Whoops, no ToDo issues more!');
          // }

          const filtered = getFilteredIssues(changes, repo, toDo.data, 'ToDo');

          pageToDo === 1
            ? dispatch(getToDoIssues(filtered))
            : dispatch(nextPageToDoIssues(filtered));
          setToDoState(toDoIssues);
        } catch (error) {
          // Notiflix.Notify.warning((error as AxiosError).message);
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
            // return Notiflix.Notify.failure('Whoops, something went wrong with InProgress issues!');
            return app.message.error('Whoops, something went wrong with InProgress issues!');
          }
          if (inProgress.data.length === 0) {
            // return Notiflix.Notify.failure('There are no InProgress issues!');
            return app.message.error('There are no InProgress issues!');
          }
          // else if (inProgress.data.length === 0) {
          //   setRemoveButtonInProgress(true);

          //   return Notiflix.Notify.failure('Whoops, no In Progress issues more!');
          // }

          const filtered = getFilteredIssues(changes, repo, inProgress.data, 'In Progress');

          pageInProgress === 1
            ? dispatch(getInProgressIssues(filtered))
            : dispatch(nextPageInProgressIssues(filtered));
          setInProgressState(inProgressIssues);
        } catch (error) {
          // Notiflix.Notify.warning((error as AxiosError).message);
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
            // return Notiflix.Notify.failure('Whoops, something went wrong with Done issues!');
            return app.message.error('Whoops, something went wrong with Done issues!');
          }
          if (done.data.length === 0) {
            // return Notiflix.Notify.failure('There are no Done issues!');
            return app.message.error('There are no Done issues!');
          }

          // else if (done.data.length === 0) {
          //   setRemoveButtonDone(true);

          //   return Notiflix.Notify.failure('Whoops, no Done issues more!');
          // }

          const filtered = getFilteredIssues(changes, repo, done.data, 'Done');

          pageDone === 1
            ? dispatch(getDoneIssues(filtered))
            : dispatch(nextPageDoneIssues(filtered));
          setDoneState(doneIssues);
        } catch (error) {
          // Notiflix.Notify.warning((error as AxiosError).message);
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
    const red: string = 'rgba(185, 0, 0, 0.1)';
    const green: string = 'rgba(0, 185, 107, 0.1)';

    if (color === 'white') {
      setBackgroundToDo('white');
      setBackgroundInProgress('white');
      setBackgroundDone('white');
    }
    if (color === 'red') {
      switch (column) {
        case 'ToDo': {
          setBackgroundToDo(red);
          setBackgroundInProgress(green);
          setBackgroundDone(green);
          break;
        }

        case 'InProgress': {
          setBackgroundToDo(green);
          setBackgroundInProgress(red);
          setBackgroundDone(green);
          break;
        }

        case 'Done': {
          setBackgroundToDo(green);
          setBackgroundInProgress(green);
          setBackgroundDone(red);
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
