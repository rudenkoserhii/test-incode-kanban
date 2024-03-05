import { StateChanges, IssueType } from 'types';

export const getFilteredIssues = (
  changes: StateChanges['value'],
  repo: string,
  data: IssueType[],
  column: string
) => {
  data = (data as IssueType[]).map((item, idx) => ({
    id: item.id,
    order: idx + 1,
    title: item.title,
    number: item.number,
    updated_at: item.updated_at,
    user: {
      login: item.user.login,
    },
    comments: item.comments,
  }));

  let filtered = [];

  if (changes.some((changedItem) => changedItem.repo === repo)) {
    filtered = data.filter(
      (firstSearch) =>
        !changes
          .find((secondSearch) => secondSearch.repo === repo)
          ?.data.some(
            (thirdSearch) => firstSearch.id === thirdSearch.id && column === thirdSearch.columnOut
          )
    );
    changes
      .find((firstSearch) => firstSearch.repo === repo)
      ?.data.forEach(
        (secondSearch) => secondSearch.columnIn === column && filtered.push(secondSearch.issue)
      );
  } else {
    filtered = data;
  }

  return filtered;
};
