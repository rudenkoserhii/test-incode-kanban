import { IssueType } from 'types';

type StateChanges = {
  value: StateChangesItem[] | [];
};

type StateChangesItem = {
  repo: string;
  data: {
    id: string;
    columnIn: string;
    columnOut: string;
    issue: IssueType;
  }[];
};

export { type StateChanges, type StateChangesItem };
