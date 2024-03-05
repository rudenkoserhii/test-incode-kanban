import { ColumnNamesType } from 'types';

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

export const FIRST_PAGE: number = 1;

export const CURRENT_COLUMN: string = 'rgba(255, 255, 0, 0.1)';
export const SIBLING_COLUMN: string = 'rgba(0, 185, 107, 0.1)';
export const DEFAULT_COLOR: string = 'rgba(255, 255, 255, 1)';
