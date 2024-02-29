import { StateChanges } from '../types/changes.type';
import { IssueType } from '../types/issue.type';

export const getFilteredIssues = (
  changes: StateChanges['value'],
  repo: string,
  data: IssueType[],
  column: string
) => {
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
