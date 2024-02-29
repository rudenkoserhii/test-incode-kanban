import { ColumnNamesType } from '../types/column-names.type';

export const COLUMN_NAMES: ColumnNamesType = {
  TO_DO: 'ToDo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const BASE_URL: string = 'https://api.github.com/repos/"repo"/issues';

export const BASE_URL_STARS: string = 'https://api.github.com/repos/"repo"';

export const BASE_URL_TOP: string =
  'https://api.github.com/search/repositories?q=stars:%3E1&sort=stars&per_page=15&page=1';

export const DEFAULT_STARS: number = 0;
