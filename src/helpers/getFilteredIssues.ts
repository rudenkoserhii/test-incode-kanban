import { StateChanges, IssueType } from 'types';

export const getFilteredIssues = (
  changes: StateChanges['value'],
  repo: string,
  data: IssueType[],
  column: string
) => {
  console.log(changes);
  console.log(data);
  let filtered = [];

  if (changes.some((changedItem) => changedItem.repo === repo)) {
    console.log('click');
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
