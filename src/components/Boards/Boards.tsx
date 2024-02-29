import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { changesValue } from '../../redux/changes/selectors';
import { getToDoIssues, nextPageToDoIssues } from '../../redux/toDoIssues/slice';
import { getInProgressIssues, nextPageInProgressIssues } from '../../redux/inProgressIssues/slice';
import { getDoneIssues, nextPageDoneIssues } from '../../redux/doneIssues/slice';
import { repoValue } from '../../redux/repo/selectors';
import { COLUMN_NAMES } from '../../constants/constants';
import Column from '../Column/Column';
import Notiflix from 'notiflix';
import axios, { AxiosError } from 'axios';

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;

const Boards: React.FC = () => {
  const [pageToDo, setPageToDo] = useState(1);
  const [pageInProgress, setPageInProgress] = useState(1);
  const [pageDone, setPageDone] = useState(1);
  const [removeButtonToDo, setRemoveButtonToDo] = useState(false);
  const [removeButtonInProgress, setRemoveButtonInProgress] = useState(false);
  const [removeButtonDone, setRemoveButtonDone] = useState(false);
  const [isLoadingToDo, setIsLoadingToDo] = useState(false);
  const [isLoadingInProgress, setIsLoadingInProgress] = useState(false);
  const [isLoadingDone, setIsLoadingDone] = useState(false);

  const [, setToDoState] = useState([]);
  const [, setInProgressState] = useState([]);
  const [, setDoneState] = useState([]);

  const url = useSelector(repoValue);
  const dispatch = useDispatch();
  const changes = useSelector(changesValue);

  const repo = url.split('github.com/')[1];

  const toDoIssues = useSelector((state) => state.toDoIssues);
  const inProgressIssues = useSelector((state) => state.inProgressIssues);
  const doneIssues = useSelector((state) => state.doneIssues);

  useEffect(() => {
    url &&
      (async function getData() {
        setIsLoadingToDo(true);
        try {
          setRemoveButtonToDo(false);

          const toDo = await axios.get(`https://api.github.com/repos/${repo}/issues`, {
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

          let filtered = [];

          if (changes.some((a) => a.repo === repo)) {
            filtered = toDo.data.filter(
              (a) =>
                !changes
                  .find((b) => b.repo === repo)
                  .data.some((d) => a.id === d.id && 'ToDo' === d.columnOut)
            );
            changes
              .find((e) => e.repo === repo)
              .data.forEach((f) => f.columnIn === 'ToDo' && filtered.push(f.issue));
          } else {
            filtered = toDo.data;
          }

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

          const inProgress = await axios.get(`https://api.github.com/repos/${repo}/issues`, {
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

          let filtered = [];

          if (changes.some((a) => a.repo === repo)) {
            filtered = inProgress.data.filter(
              (a) =>
                !changes
                  .find((b) => b.repo === repo)
                  .data.some((d) => a.id === d.id && 'In Progress' === d.columnOut)
            );
            changes
              .find((e) => e.repo === repo)
              .data.forEach((f) => f.columnIn === 'In Progress' && filtered.push(f.issue));
          } else {
            filtered = inProgress.data;
          }

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
          const done = await axios.get(`https://api.github.com/repos/${repo}/issues`, {
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

          let filtered = [];

          if (changes.some((a) => a.repo === repo)) {
            filtered = done.data.filter(
              (a) =>
                !changes
                  .find((b) => b.repo === repo)
                  .data.some((d) => a.id === d.id && 'Done' === d.columnOut)
            );
            changes
              .find((e) => e.repo === repo)
              .data.forEach((f) => f.columnIn === 'Done' && filtered.push(f.issue));
          } else {
            filtered = done.data;
          }

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
            style={{ height: '100%' }}
            title={TO_DO}
            removeButton={removeButtonToDo}
            column={toDoIssues}
            setPage={(title) => setPage(title)}
            isLoading={isLoadingToDo}
          />
          <Column
            style={{ height: '100%' }}
            title={IN_PROGRESS}
            removeButton={removeButtonInProgress}
            column={inProgressIssues}
            setPage={(title) => setPage(title)}
            isLoading={isLoadingInProgress}
          />
          <Column
            style={{ height: '100%' }}
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
