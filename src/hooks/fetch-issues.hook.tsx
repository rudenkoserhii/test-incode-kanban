import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { App, Divider, Row } from 'antd';
import axios, { AxiosError } from 'axios';
import Column from 'components/Column/Column';
import {
  BASE_URL,
  COLUMN_NAMES,
  FIRST_PAGE,
  SIBLING_COLUMN,
  CURRENT_COLUMN,
  DEFAULT_COLOR,
} from 'constants/constants';
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

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;

export const useFetchIssues = (
  page: number,
  column: string,
  repo: string,
  dispatch: AppDispatch,
  setIssuesState: (issues: IssueType[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  setNextPage: (nextPage: boolean) => void
) => {
  const app = App.useApp();
  const url = BASE_URL.replace('"repo"', repo);
  const changes = useSelector(changesValue);

  useEffect(() => {
    url &&
      (async function getData() {
        setIsLoading(true);
        try {
          setNextPage(false);

          const issuesResponse = await axios.get(url, {
            params: {
              state: column === 'Done' ? 'closed' : 'open',
              assignee: column === 'In Progress' ? '*' : 'none',
              page,
            },
          });

          if (checkNextPage(issuesResponse.headers?.link, page)) {
            setNextPage(true);
          }

          if (!issuesResponse.data) {
            return app.message.error(`Whoops, something went wrong with ${column} issues!`);
          }
          if (issuesResponse.data.length === 0) {
            app.message.error(`There are no ${column} issues on the server!`);
          }

          const filtered = getFilteredIssues(changes, repo, issuesResponse.data, column);

          page === 1
            ? dispatch(
                column === 'ToDo'
                  ? getToDoIssues(filtered)
                  : column === 'In Progress'
                    ? getInProgressIssues(filtered)
                    : getDoneIssues(filtered)
              )
            : dispatch(
                column === 'ToDo'
                  ? nextPageToDoIssues(filtered)
                  : column === 'In Progress'
                    ? nextPageInProgressIssues(filtered)
                    : nextPageDoneIssues(filtered)
              );

          setIssuesState(
            column === 'ToDo'
              ? useSelector(toDoIssuesValue)
              : column === 'In Progress'
                ? useSelector(inProgressIssuesValue)
                : useSelector(doneIssuesValue)
          );
        } catch (error) {
          app.message.warning((error as AxiosError).message);
        } finally {
          setIsLoading(false);
        }
      })();
  }, [url, page]);
};

export default useFetchIssues;
