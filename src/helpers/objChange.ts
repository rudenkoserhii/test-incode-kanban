import { IssueType } from 'types';

export const objChange = (
  columnIn: string,
  columnOut: string,
  id: string,
  issue: IssueType,
  repo: string
) => ({
  repo: repo,
  id: id,
  columnIn: columnIn,
  columnOut: columnOut,
  issue: issue,
});
