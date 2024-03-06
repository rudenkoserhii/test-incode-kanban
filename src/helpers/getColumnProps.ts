import { COLUMN_NAMES } from 'constants/constants';
import { IssueType } from 'types';

export const getColumnProps = (
  columnTitle: string,
  nextPageToDo: boolean,
  toDoIssues: IssueType[],
  backgroundToDo: string,
  isLoadingToDo: boolean,
  nextPageInProgress: boolean,
  inProgressIssues: IssueType[],
  backgroundInProgress: string,
  isLoadingInProgress: boolean,
  nextPageDone: boolean,
  doneIssues: IssueType[],
  backgroundDone: string,
  isLoadingDone: boolean
) => {
  switch (columnTitle) {
    case COLUMN_NAMES.TO_DO:
      return {
        removeButton: nextPageToDo,
        column: toDoIssues,
        background: backgroundToDo,
        isLoading: isLoadingToDo,
      };

    case COLUMN_NAMES.IN_PROGRESS:
      return {
        removeButton: nextPageInProgress,
        column: inProgressIssues,
        background: backgroundInProgress,
        isLoading: isLoadingInProgress,
      };

    case COLUMN_NAMES.DONE:
      return {
        removeButton: nextPageDone,
        column: doneIssues,
        background: backgroundDone,
        isLoading: isLoadingDone,
      };

    default:
      return {};
  }
};
