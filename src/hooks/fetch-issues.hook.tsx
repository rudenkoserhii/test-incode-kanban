import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { App } from 'antd';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from 'constants/constants';
import { checkNextPage, getFilteredIssues } from 'helpers';
import { AppDispatch } from 'redux/store';
import { IssueType } from 'types';
import { changesValue } from '../redux/changes/selectors';
import { doneIssuesValue } from '../redux/doneIssues/selectors';
import { getDoneIssues, nextPageDoneIssues } from '../redux/doneIssues/slice';
import { inProgressIssuesValue } from '../redux/inProgressIssues/selectors';
import { getInProgressIssues, nextPageInProgressIssues } from '../redux/inProgressIssues/slice';
import { repoValue } from '../redux/repo/selectors';
import { toDoIssuesValue } from '../redux/toDoIssues/selectors';
import { getToDoIssues, nextPageToDoIssues } from '../redux/toDoIssues/slice';

export const useFetchIssues = () => {
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

  const fetchData = async (pageToDo: number, pageInProgress: number, pageDone: number) => {
    try {
      if (pageToDo > 1) setNextPageToDo(false);
      if (pageInProgress > 1) setNextPageInProgress(false);
      if (pageDone > 1) setNextPageDone(false);

      const [toDoResponse, inProgressResponse, doneResponse] = await Promise.all([
        axios.get(BASE_URL.replace('"repo"', repo), {
          params: {
            state: 'open',
            assignee: 'none',
            page: pageToDo,
          },
        }),
        axios.get(BASE_URL.replace('"repo"', repo), {
          params: {
            state: 'open',
            assignee: '*',
            page: pageInProgress,
          },
        }),
        axios.get(BASE_URL.replace('"repo"', repo), {
          params: {
            state: 'closed',
            page: pageDone,
          },
        }),
      ]);

      if (checkNextPage(toDoResponse.headers?.link, pageToDo)) {
        setNextPageToDo(true);
      }
      if (checkNextPage(inProgressResponse.headers?.link, pageInProgress)) {
        setNextPageInProgress(true);
      }
      if (checkNextPage(doneResponse.headers?.link, pageDone)) {
        setNextPageDone(true);
      }

      if (!toDoResponse.data) {
        app.message.error('Whoops, something went wrong with ToDo issues!');
      }
      if (toDoResponse.data.length === 0) {
        app.message.error('There are no ToDo issues on the server!');
      }

      if (!inProgressResponse.data) {
        app.message.error('Whoops, something went wrong with InProgress issues!');
      }
      if (inProgressResponse.data.length === 0) {
        app.message.error('There are no InProgress issues on the server!');
      }

      if (!doneResponse.data) {
        app.message.error('Whoops, something went wrong with Done issues!');
      }
      if (doneResponse.data.length === 0) {
        app.message.error('There are no Done issues on the server!');
      }

      const filteredToDo = getFilteredIssues(changes, repo, toDoResponse.data, 'ToDo');
      const filteredInProgress = getFilteredIssues(
        changes,
        repo,
        inProgressResponse.data,
        'In Progress'
      );
      const filteredDone = getFilteredIssues(changes, repo, doneResponse.data, 'Done');

      if (pageToDo === 1) {
        dispatch(getToDoIssues(filteredToDo));
      } else {
        dispatch(nextPageToDoIssues(filteredToDo));
      }
      setToDoState(toDoIssues);

      if (pageInProgress === 1) {
        dispatch(getInProgressIssues(filteredInProgress));
      } else {
        dispatch(nextPageInProgressIssues(filteredInProgress));
      }
      setInProgressState(inProgressIssues);

      if (pageDone === 1) {
        dispatch(getDoneIssues(filteredDone));
      } else {
        dispatch(nextPageDoneIssues(filteredDone));
      }
      setDoneState(doneIssues);
    } catch (error) {
      app.message.warning((error as AxiosError).message);
    } finally {
      setIsLoadingToDo(false);
      setIsLoadingInProgress(false);
      setIsLoadingDone(false);
    }
  };

  return {
    fetchData,
    isLoadingToDo,
    isLoadingInProgress,
    isLoadingDone,
    nextPageToDo,
    nextPageInProgress,
    nextPageDone,
  };
};
