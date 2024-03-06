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

export const useFetchIssues = (column: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nextPage, setNextPage] = useState<boolean>(false);

  const [, setIssuesState] = useState<IssueType[]>([]);
  const url = useSelector(repoValue);
  const dispatch: AppDispatch = useDispatch();
  const changes = useSelector(changesValue);
  const app = App.useApp();

  const repo = url.split('github.com/')[1];

  const selectIssues = () => {
    switch (column) {
      case 'ToDo':
        return useSelector(toDoIssuesValue);

      case 'In Progress':
        return useSelector(inProgressIssuesValue);

      case 'Done':
        return useSelector(doneIssuesValue);

      default:
        break;
    }
  };

  let issues = selectIssues();

  const fetchDataForColumn = async (page: number) => {
    const setParams = () => {
      switch (column) {
        case 'ToDo':
          return {
            state: 'open',
            assignee: 'none',
            page,
          };

        case 'In Progress':
          return {
            state: 'open',
            assignee: '*',
            page,
          };

        case 'Done':
          return {
            state: 'closed',
            page,
          };

        default:
          break;
      }
    };

    try {
      if (page > 1) setNextPage(false);

      const response = await axios.get(BASE_URL.replace('"repo"', repo), {
        params: setParams(),
      });

      if (checkNextPage(response.headers?.link, page)) {
        setNextPage(true);
      }

      if (!response.data) {
        app.message.error(`Whoops, something went wrong with ${column} issues!`);
      }
      if (response.data.length === 0) {
        app.message.error(`There are no ${column} issues on the server!`);
      }

      const filtered = getFilteredIssues(changes, repo, response.data, column);

      const getIssues = (filtered: IssueType[]) => {
        switch (column) {
          case 'ToDo':
            return getToDoIssues(filtered);

          case 'In Progress':
            return getInProgressIssues(filtered);

          case 'Done':
            return getDoneIssues(filtered);

          default:
            break;
        }
      };

      const nextPageIssues = (filtered: IssueType[]) => {
        switch (column) {
          case 'ToDo':
            return nextPageToDoIssues(filtered);

          case 'In Progress':
            return nextPageInProgressIssues(filtered);

          case 'Done':
            return nextPageDoneIssues(filtered);

          default:
            break;
        }
      };

      if (page === 1) {
        const getIssuesForColumn = getIssues(filtered);

        if (getIssuesForColumn) dispatch(getIssuesForColumn);
      } else {
        const nextPageIssuesForColumn = nextPageIssues(filtered);

        if (nextPageIssuesForColumn) dispatch(nextPageIssuesForColumn);
      }
      if (issues) setIssuesState(issues);
    } catch (error) {
      app.message.warning((error as AxiosError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchDataForColumn,
    isLoading,
    nextPage,
  };
};
