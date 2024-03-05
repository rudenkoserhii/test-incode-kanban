import { Card, Col, Button, Spin } from 'antd';
import { nanoid } from 'nanoid';
import Movable from 'components/Column/Movable';
import { IssueType } from 'types';
import { useState } from 'react';
import { COLUMN_NAMES } from 'constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addChange } from '../../redux/changes/slice';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';
import { getDoneIssues } from '../../redux/doneIssues/slice';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { getInProgressIssues } from '../../redux/inProgressIssues/slice';
import { repoValue } from '../../redux/repo/selectors';
import { AppDispatch } from 'redux/store';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { getToDoIssues } from '../../redux/toDoIssues/slice';

type PropsColumn = {
  column: IssueType[];
  title: string;
  setPage: (value: string) => void;
  background: string;
  backgroundUp: (value: string) => void;
  removeButton: boolean;
  isLoading: boolean;
};

const Column = ({
  column,
  title,
  setPage,
  background,
  backgroundUp,
  removeButton,
  isLoading,
}: PropsColumn): JSX.Element => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();

  const url = useSelector(repoValue);
  const repo = url.split('github.com/')[1];

  const toDoIssues = useSelector(toDoIssuesValue);
  const inProgressIssues = useSelector(inProgressIssuesValue);
  const doneIssues = useSelector(doneIssuesValue);

  function objChange(columnIn: string, columnOut: string, id: string, issue: IssueType) {
    return {
      repo: repo,
      id: id,
      columnIn: columnIn,
      columnOut: columnOut,
      issue: issue,
    };
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setIsDragging(false);

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
      Object.values(COLUMN_NAMES).forEach(() => {
        if (droppedIssueColumn !== targetIssueColumn) {
          switch (droppedIssueColumn) {
            case 'ToDo':
              const filteredToDoIssues = toDoIssues
                .filter((element) => element.id !== droppedIssueId)
                .map((element) => ({
                  ...element,
                  order: droppedIssueOrder > element.order ? element.order - 1 : element.order,
                }));

              dispatch(getToDoIssues(filteredToDoIssues));
              dispatch(
                addChange(
                  objChange(
                    targetIssueColumn as string,
                    droppedIssueColumn,
                    droppedIssueId,
                    droppedIssue
                  )
                )
              );
              filteredToDoIssues.forEach((issue) =>
                dispatch(
                  addChange(objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue))
                )
              );
              break;

            case 'In Progress':
              const filteredInProgressIssues = inProgressIssues
                .filter((element) => element.id !== droppedIssueId)
                .map((element) => ({
                  ...element,
                  order: droppedIssueOrder > element.order ? element.order - 1 : element.order,
                }));

              dispatch(getInProgressIssues(filteredInProgressIssues));
              dispatch(
                addChange(
                  objChange(
                    targetIssueColumn as string,
                    droppedIssueColumn,
                    droppedIssueId,
                    droppedIssue
                  )
                )
              );
              filteredInProgressIssues.forEach((issue) =>
                dispatch(
                  addChange(objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue))
                )
              );
              break;

            case 'Done':
              const filteredDoneIssues = doneIssues
                .filter((element) => element.id !== droppedIssueId)
                .map((element) => ({
                  ...element,
                  order: droppedIssueOrder > element.order ? element.order - 1 : element.order,
                }));

              dispatch(getDoneIssues(filteredDoneIssues));
              dispatch(
                addChange(
                  objChange(
                    targetIssueColumn as string,
                    droppedIssueColumn,
                    droppedIssueId,
                    droppedIssue
                  )
                )
              );
              filteredDoneIssues.forEach((issue) =>
                dispatch(
                  addChange(objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue))
                )
              );
              break;

            default:
              return;
          }

          switch (targetIssueColumn) {
            case 'ToDo':
              const updatedToDoIssues = [...toDoIssues, droppedIssue].map((element) => ({
                ...element,
                order:
                  element.order >= droppedIssueOrder && element.id !== droppedIssueId
                    ? element.order + 1
                    : element.order,
              }));

              dispatch(getToDoIssues(updatedToDoIssues));
              updatedToDoIssues.forEach((issue) => {
                if (issue.id !== droppedIssueId) {
                  dispatch(
                    addChange(objChange(targetIssueColumn, targetIssueColumn, issue.id, issue))
                  );
                }
              });

              break;

            case 'In Progress':
              const updatedInProgressIssues = [...inProgressIssues, droppedIssue].map(
                (element) => ({
                  ...element,
                  order:
                    element.order >= droppedIssueOrder && element.id !== droppedIssueId
                      ? element.order + 1
                      : element.order,
                })
              );

              dispatch(getInProgressIssues(updatedInProgressIssues));
              updatedInProgressIssues.forEach((issue) => {
                if (issue.id !== droppedIssueId) {
                  dispatch(
                    addChange(objChange(targetIssueColumn, targetIssueColumn, issue.id, issue))
                  );
                }
              });

              break;

            case 'Done':
              const updatedDoneIssues = [...doneIssues, droppedIssue].map((element) => ({
                ...element,
                order:
                  element.order >= droppedIssueOrder && element.id !== droppedIssueId
                    ? element.order + 1
                    : element.order,
              }));

              dispatch(getDoneIssues(updatedDoneIssues));
              updatedDoneIssues.forEach((issue) => {
                if (issue.id !== droppedIssueId) {
                  dispatch(
                    addChange(objChange(targetIssueColumn, targetIssueColumn, issue.id, issue))
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
                  order = targetIssueOrder;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order >= targetIssueOrder &&
                  element.order < droppedIssueOrder
                ) {
                  order = element.order - 1;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
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
                  addChange(objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue))
                )
              );

              break;

            case 'In Progress':
              const updatedInProgressIssues = inProgressIssues.map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = targetIssueOrder;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order >= targetIssueOrder &&
                  element.order < droppedIssueOrder
                ) {
                  order = element.order - 1;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
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
                  addChange(objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue))
                )
              );

              break;

            case 'Done':
              const updatedDoneIssues = doneIssues.map((element) => {
                let { order } = element;

                if (element.id === droppedIssueId) {
                  order = targetIssueOrder;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order >= targetIssueOrder &&
                  element.order < droppedIssueOrder
                ) {
                  order = element.order - 1;
                } else if (
                  droppedIssueOrder > targetIssueOrder &&
                  element.order > droppedIssueOrder
                ) {
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
                  addChange(objChange(droppedIssueColumn, droppedIssueColumn, issue.id, issue))
                )
              );

              break;

            default:
              return;
          }
        }
      });
    }
  };

  return (
    <Col className="issues">
      <Card className="full-width-height" title={title} style={{ background }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="full-width-height"
        >
          <ul className={`ant-list ${title.replaceAll(' ', '').toLowerCase()}`}>
            {column &&
              column.length > 0 &&
              [...column]
                .sort((a, b) => a.order - b.order)
                .map((issue) => (
                  <Movable
                    issue={issue}
                    title={title}
                    key={nanoid()}
                    startDragging={() => setIsDragging(true)}
                    isDragging={isDragging}
                  />
                ))}
          </ul>
          {removeButton && (
            <Button className="loadMore" type="primary" onClick={() => setPage(title)}>
              Load more
            </Button>
          )}
        </div>
        {isLoading && (
          <Spin
            style={{
              margin: '0px auto 0px auto',
              display: 'block',
            }}
          />
        )}
      </Card>
    </Col>
  );
};

export default Column;
