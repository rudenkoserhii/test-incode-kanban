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

  function objChange(columnIn: string, columnOut: string, id: number, issue: IssueType) {
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
    } = droppedIssue;

    const targetIssue = e.target as HTMLDivElement;
    const { id: targetIssueId, classList: targetIssueClassList, dataset } = targetIssue;
    const targetIssueColumn = targetIssueClassList.item(2);
    const targetIssueOrder = dataset['order'];

    console.log(droppedIssueId, droppedIssueColumn, droppedIssueOrder);
    console.log(targetIssueId, targetIssueColumn, targetIssueOrder);

    if (data) {
      Object.values(COLUMN_NAMES).forEach((column) => {
        const columnEdited = column.replaceAll(' ', '').toLowerCase();

        if (droppedIssueColumn !== targetIssueColumn) {
          switch (droppedIssueColumn) {
            case 'todo':
              dispatch(
                getToDoIssues(toDoIssues.filter((element) => element.id !== droppedIssueId))
              );
              dispatch(addChange(objChange(dropResult.name, title, droppedIssueId, droppedIssue)));
              break;

            case 'inprogress':
              dispatch(
                getInProgressIssues(inProgressIssues.filter((element) => element.id !== issue.id))
              );
              dispatch(addChange(objChange(dropResult.name, title, issue.id, issue)));
              break;

            case 'done':
              dispatch(getDoneIssues(doneIssues.filter((element) => element.id !== issue.id)));
              dispatch(addChange(objChange(dropResult.name, title, issue.id, issue)));
              break;
          }
          switch (targetIssueColumn) {
            case 'todo':
              dispatch(getToDoIssues([...toDoIssues, issue]));
              break;

            case 'inprogress':
              dispatch(getInProgressIssues([...inProgressIssues, issue]));
              break;

            case 'done':
              dispatch(getDoneIssues([...doneIssues, issue]));
              break;
          }
        } else if (droppedIssuesColumn === targetIssueColumn && droppedIssueId !== targetIssueId) {
          switch (columnEdited) {
            case 'todo':
              dispatch(getToDoIssues([...toDoIssues, issue]));
              break;

            case 'inprogress':
              dispatch(getInProgressIssues([...inProgressIssues, issue]));
              break;

            case 'done':
              dispatch(getDoneIssues([...doneIssues, issue]));
              break;
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
