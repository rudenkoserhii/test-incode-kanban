// stores/IssueStore.ts
import { makeAutoObservable } from 'mobx';

export class IssueModel {
  id: number;
  title: string;
  number: number;
  updated_at: string;
  user: {
    login: string;
  };
  comments: number;

  constructor(issue: any) {
    this.id = issue.id;
    this.title = issue.title;
    this.number = issue.number;
    this.updated_at = issue.updated_at;
    this.user = issue.user;
    this.comments = issue.comments;
    makeAutoObservable(this);
  }
}

export class IssueStore {
  issues: IssueModel[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIssues(issues: any[]) {
    this.issues = issues.map((issue) => new IssueModel(issue));
  }

  addIssue(issue: any) {
    this.issues.push(new IssueModel(issue));
  }
}

export const issueStore = new IssueStore();
