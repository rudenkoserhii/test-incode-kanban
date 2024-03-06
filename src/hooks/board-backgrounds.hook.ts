import { useState } from 'react';
import { COLUMN_NAMES, DEFAULT_COLOR, CURRENT_COLUMN, SIBLING_COLUMN } from 'constants/constants';

const { TO_DO, IN_PROGRESS, DONE } = COLUMN_NAMES;

export const useBoardBackgrounds = () => {
  const [backgroundToDo, setBackgroundToDo] = useState<string>(DEFAULT_COLOR);
  const [backgroundInProgress, setBackgroundInProgress] = useState<string>(DEFAULT_COLOR);
  const [backgroundDone, setBackgroundDone] = useState<string>(DEFAULT_COLOR);

  const setBackGround = (color: string, column: string) => {
    if (color === 'default') {
      setBackgroundToDo(DEFAULT_COLOR);
      setBackgroundInProgress(DEFAULT_COLOR);
      setBackgroundDone(DEFAULT_COLOR);
    }
    if (color === 'current') {
      switch (column) {
        case TO_DO: {
          setBackgroundToDo(CURRENT_COLUMN);
          setBackgroundInProgress(SIBLING_COLUMN);
          setBackgroundDone(SIBLING_COLUMN);
          break;
        }

        case IN_PROGRESS: {
          setBackgroundToDo(SIBLING_COLUMN);
          setBackgroundInProgress(CURRENT_COLUMN);
          setBackgroundDone(SIBLING_COLUMN);
          break;
        }

        case DONE: {
          setBackgroundToDo(SIBLING_COLUMN);
          setBackgroundInProgress(SIBLING_COLUMN);
          setBackgroundDone(CURRENT_COLUMN);
          break;
        }

        default:
          return;
      }
    }
  };

  return {
    backgroundToDo,
    backgroundInProgress,
    backgroundDone,
    setBackGround,
  };
};
