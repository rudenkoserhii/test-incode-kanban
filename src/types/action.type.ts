import { IssueType } from 'types';

type ActionType = {
  payload: IssueType[];
  type: string;
};

type ActionChangesType = {
  payload: {
    repo: string;
    id: string;
    columnIn: string;
    columnOut: string;
    issue: IssueType;
  };
  type: string;
};

export { type ActionType, type ActionChangesType };
