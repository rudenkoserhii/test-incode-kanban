import { useDispatch, useSelector } from 'react-redux';
import { addChange } from '../redux/changes/slice';
import { doneIssuesValue } from '../redux/doneIssues/selectors';
import { getDoneIssues } from '../redux/doneIssues/slice';
import { inProgressIssuesValue } from '../redux/inProgressIssues/selectors';
import { getInProgressIssues } from '../redux/inProgressIssues/slice';
import { repoValue } from '../redux/repo/selectors';
import { AppDispatch } from 'redux/store';
import { toDoIssuesValue } from '../redux/toDoIssues/selectors';
import { getToDoIssues } from '../redux/toDoIssues/slice';
import { objChange } from 'helpers';
import { useCallback } from 'react';

export const useDragAndDrop = (backgroundUp: (value: string) => void) => {
  const dispatch: AppDispatch = useDispatch();

  const url = useSelector(repoValue);
  const repo = url.split('github.com/')[1];

  const toDoIssues = useSelector(toDoIssuesValue);
  const inProgressIssues = useSelector(inProgressIssuesValue);
  const doneIssues = useSelector(doneIssuesValue);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      backgroundUp('default');
      const data = e.dataTransfer.getData('text/plain');
      const droppedIssue = JSON.parse(data);
      const {
        id: droppedIssueId,
        column: droppedIssueColumn,
        order: droppedIssueOrder,
      }: {
        id: string;
        column: string;
        order: number;
      } = droppedIssue;

      const targetIssue = e.target as HTMLDivElement;
      const { id: targetIssueId, dataset } = targetIssue;

      const targetIssueColumn = dataset['column'];
      const targetIssueOrder = Number(dataset['order']);

      if (data) {
        if (droppedIssueColumn !== targetIssueColumn) {
          switch (droppedIssueColumn) {
            case 'ToDo':
              const filteredToDoIssues = toDoIssues
                .filter((element) => element.id !== droppedIssueId)
                .map((element) => ({
                  ...element,
                  order: element.order > droppedIssueOrder ? element.order - 1 : element.order,
                }));

              dispatch(getToDoIssues(filteredToDoIssues));
              dispatch(
                addChange(
                  objChange(
                    targetIssueColumn as string,
                    droppedIssueColumn,
                    droppedIssueId,
                    droppedIssue,
                    repo
                  )
                )
              );
              filteredToDoIssues.forEach((issue) =>
                dispatch(
                  addChange(
                    objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue, repo)
                  )
                )
              );
              break;

            case 'In Progress':
              const filteredInProgressIssues = inProgressIssues
                .filter((element) => element.id !== droppedIssueId)
                .map((element) => ({
                  ...element,
                  order: element.order > droppedIssueOrder ? element.order - 1 : element.order,
                }));

              dispatch(getInProgressIssues(filteredInProgressIssues));
              dispatch(
                addChange(
                  objChange(
                    targetIssueColumn as string,
                    droppedIssueColumn,
                    droppedIssueId,
                    droppedIssue,
                    repo
                  )
                )
              );
              filteredInProgressIssues.forEach((issue) =>
                dispatch(
                  addChange(
                    objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue, repo)
                  )
                )
              );
              break;

            case 'Done':
              const filteredDoneIssues = doneIssues
                .filter((element) => element.id !== droppedIssueId)
                .map((element) => ({
                  ...element,
                  order: element.order > droppedIssueOrder ? element.order - 1 : element.order,
                }));

              dispatch(getDoneIssues(filteredDoneIssues));
              dispatch(
                addChange(
                  objChange(
                    targetIssueColumn as string,
                    droppedIssueColumn,
                    droppedIssueId,
                    droppedIssue,
                    repo
                  )
                )
              );
              filteredDoneIssues.forEach((issue) =>
                dispatch(
                  addChange(
                    objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue, repo)
                  )
                )
              );
              break;

            default:
              return;
          }

          switch (targetIssueColumn) {
            case 'ToDo':
              const updatedToDoIssues = [...toDoIssues, droppedIssue].map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = !isNaN(targetIssueOrder) ? targetIssueOrder : toDoIssues.length + 1;
                } else if (element.order >= targetIssueOrder && !isNaN(targetIssueOrder)) {
                  order = element.order + 1;
                }

                return { ...element, order };
              });

              dispatch(getToDoIssues(updatedToDoIssues));
              updatedToDoIssues.forEach((issue) => {
                if (issue.id !== droppedIssueId) {
                  dispatch(
                    addChange(
                      objChange(targetIssueColumn, targetIssueColumn, issue.id, issue, repo)
                    )
                  );
                }
              });

              break;

            case 'In Progress':
              const updatedInProgressIssues = [...inProgressIssues, droppedIssue].map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = !isNaN(targetIssueOrder) ? targetIssueOrder : inProgressIssues.length + 1;
                } else if (element.order >= targetIssueOrder && !isNaN(targetIssueOrder)) {
                  order = element.order + 1;
                }

                return { ...element, order };
              });

              dispatch(getInProgressIssues(updatedInProgressIssues));
              updatedInProgressIssues.forEach((issue) => {
                if (issue.id !== droppedIssueId) {
                  dispatch(
                    addChange(
                      objChange(targetIssueColumn, targetIssueColumn, issue.id, issue, repo)
                    )
                  );
                }
              });

              break;

            case 'Done':
              const updatedDoneIssues = [...doneIssues, droppedIssue].map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = !isNaN(targetIssueOrder) ? targetIssueOrder : doneIssues.length + 1;
                } else if (element.order >= targetIssueOrder && !isNaN(targetIssueOrder)) {
                  order = element.order + 1;
                }

                return { ...element, order };
              });

              dispatch(getDoneIssues(updatedDoneIssues));
              updatedDoneIssues.forEach((issue) => {
                if (issue.id !== droppedIssueId) {
                  dispatch(
                    addChange(
                      objChange(targetIssueColumn, targetIssueColumn, issue.id, issue, repo)
                    )
                  );
                }
              });

              break;

            default:
              return;
          }
        } else if (droppedIssueColumn === targetIssueColumn && droppedIssueId !== targetIssueId) {
          switch (droppedIssueColumn) {
            case 'ToDo':
              const updatedToDoIssues = toDoIssues.map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = isNaN(targetIssueOrder) ? toDoIssues.length : targetIssueOrder;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order >= targetIssueOrder &&
                  element.order < droppedIssueOrder
                ) {
                  order = element.order + 1;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
                  order = element.order - 1;
                } else if (isNaN(targetIssueOrder) && element.order > droppedIssueOrder) {
                  order = element.order - 1;
                } else if (
                  droppedIssueOrder < targetIssueOrder &&
                  element.order <= targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
                  order = element.order - 1;
                }

                return {
                  ...element,
                  order,
                };
              });

              dispatch(getToDoIssues(updatedToDoIssues));
              updatedToDoIssues.forEach((issue) =>
                dispatch(
                  addChange(
                    objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue, repo)
                  )
                )
              );

              break;

            case 'In Progress':
              const updatedInProgressIssues = inProgressIssues.map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = isNaN(targetIssueOrder) ? toDoIssues.length : targetIssueOrder;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order >= targetIssueOrder &&
                  element.order < droppedIssueOrder
                ) {
                  order = element.order + 1;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
                  order = element.order - 1;
                } else if (isNaN(targetIssueOrder) && element.order > droppedIssueOrder) {
                  order = element.order - 1;
                } else if (
                  droppedIssueOrder < targetIssueOrder &&
                  element.order <= targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
                  order = element.order - 1;
                }

                return {
                  ...element,
                  order,
                };
              });

              dispatch(getInProgressIssues(updatedInProgressIssues));
              updatedInProgressIssues.forEach((issue) =>
                dispatch(
                  addChange(
                    objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue, repo)
                  )
                )
              );

              break;

            case 'Done':
              const updatedDoneIssues = doneIssues.map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = isNaN(targetIssueOrder) ? toDoIssues.length : targetIssueOrder;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order >= targetIssueOrder &&
                  element.order < droppedIssueOrder
                ) {
                  order = element.order + 1;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
                  order = element.order - 1;
                } else if (isNaN(targetIssueOrder) && element.order > droppedIssueOrder) {
                  order = element.order - 1;
                } else if (
                  droppedIssueOrder < targetIssueOrder &&
                  element.order <= targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
                  order = element.order - 1;
                }

                return {
                  ...element,
                  order,
                };
              });

              dispatch(getDoneIssues(updatedDoneIssues));
              updatedDoneIssues.forEach((issue) =>
                dispatch(
                  addChange(
                    objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue, repo)
                  )
                )
              );

              break;

            default:
              return;
          }
        }
      }
    },
    [toDoIssues, inProgressIssues, doneIssues, dispatch, repo, backgroundUp]
  );

  return { handleDrop };
};
