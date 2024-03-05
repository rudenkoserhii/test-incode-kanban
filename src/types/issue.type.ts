type IssueType = {
  id: number;
  order: number;
  title: string;
  number: number;
  updated_at: Date;
  user: { login: string };
  comments: number;
};

export { type IssueType };
