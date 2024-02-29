import { IssueType } from './issue.type';

type StateChanges = {
  value: StateChangesItem[] | [];
};

type StateChangesItem = {
  repo: string;
  data: {
    id: number;
    columnIn: string;
    columnOut: string;
    issue: IssueType;
  }[];
};

export { type StateChanges, type StateChangesItem };
