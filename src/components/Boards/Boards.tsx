import React, { useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import { Column } from '../Column/Column';
import Notiflix from 'notiflix';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { observer } from 'mobx-react-lite';
import RootStoreContext from '../../RootStoreContext';

import { COLUMN_NAMES } from '../../constants/constants';

const Boards: React.FC = observer(() => {
  const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;
  const {
    pageToDo,
    pageInProgress,
    pageDone,
    removeButtonToDo,
    removeButtonInProgress,
    removeButtonDone,
    isLoadingToDo,
    isLoadingInProgress,
    isLoadingDone,
    setPageToDo,
    setPageInProgress,
    setPageDone,
    setRemoveButtonToDo,
    setRemoveButtonInProgress,
    setRemoveButtonDone,
    setIsLoadingToDo,
    setIsLoadingInProgress,
    setIsLoadingDone,
  } = useContext(RootStoreContext.boardsStore);

  const { toDoIssues, inProgressIssues, doneIssues } = useContext(RootStoreContext);

  const url = useContext(RootStoreContext.repoStore).value;
  const dispatch = useContext(RootStoreContext.dispatch);
  const changes = useContext(RootStoreContext.changesStore);

  const repo = url.split('github.com/')[1];

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
        } catch (error) {
          Notiflix.Notify.warning(error.message);
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
        } catch (error) {
          Notiflix.Notify.warning(error.message);
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
        } catch (error) {
          Notiflix.Notify.warning(error.message);
        } finally {
          setIsLoadingDone(false);
        }
      })();
  }, [url, pageDone]);

  return (
    <Container>
      <Row style={{ height: 'fit-content', width: '100%' }}>
        <DndProvider backend={HTML5Backend}>
          <Column
            style={{ height: '100%' }}
            title={TO_DO}
            removeButton={removeButtonToDo}
            column={toDoIssues}
            setPage={() => setPageToDo(TO_DO)}
            isLoading={isLoadingToDo}
          />
          <Column
            style={{ height: '100%' }}
            title={IN_PROGRESS}
            removeButton={removeButtonInProgress}
            column={inProgressIssues}
            setPage={() => setPageInProgress(IN_PROGRESS)}
            isLoading={isLoadingInProgress}
          />
          <Column
            style={{ height: '100%' }}
            title={DONE}
            removeButton={removeButtonDone}
            column={doneIssues}
            setPage={() => setPageDone(DONE)}
            isLoading={isLoadingDone}
          />
        </DndProvider>
      </Row>
    </Container>
  );
});

export default Boards;
