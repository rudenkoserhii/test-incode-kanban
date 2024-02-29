import { useRef } from 'react';
import { List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { getToDoIssues } from '../../redux/toDoIssues/slice';
import { getInProgressIssues } from '../../redux/inProgressIssues/slice';
import { getDoneIssues } from '../../redux/doneIssues/slice';
import { toDoIssuesValue } from '../../redux/toDoIssues/selectors';
import { inProgressIssuesValue } from '../../redux/inProgressIssues/selectors';
import { doneIssuesValue } from '../../redux/doneIssues/selectors';
import { COLUMN_NAMES } from '../../constants/constants';
import { addChange } from '../../redux/changes/slice';
import { repoValue } from '../../redux/repo/selectors';
import Issue from '../Issue/Issue';
import { IssueType } from '../../types';
import { AppDispatch } from '../../redux/store';

type PropsMovable = {
  issue: IssueType;
  title: string;
};

const Movable = ({ issue, title }: PropsMovable): JSX.Element => {
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

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: 'Movable',
    drop: () => ({ name: title }),
  });

  const [{ isDragging }, drag] = useDrag({
    item: { name: title },
    type: 'Movable',
    end: (item, monitor) => {
      const dropResult: { dropEffect: string; name: string } | null = monitor.getDropResult();

      if (
        dropResult &&
        Object.values(COLUMN_NAMES).includes(dropResult.name) &&
        dropResult.name !== title
      ) {
        switch (title) {
          case 'ToDo':
            dispatch(getToDoIssues(toDoIssues.filter((element) => element.id !== issue.id)));
            dispatch(addChange(objChange(dropResult.name, title, issue.id, issue)));
            break;

          case 'In Progress':
            dispatch(
              getInProgressIssues(inProgressIssues.filter((element) => element.id !== issue.id))
            );
            dispatch(addChange(objChange(dropResult.name, title, issue.id, issue)));
            break;

          case 'Done':
            dispatch(getDoneIssues(doneIssues.filter((element) => element.id !== issue.id)));
            dispatch(addChange(objChange(dropResult.name, title, issue.id, issue)));
            break;
        }
      }
      if (dropResult && dropResult.name !== title) {
        switch (dropResult.name) {
          case 'ToDo':
            dispatch(getToDoIssues([...toDoIssues, issue]));
            break;

          case 'In Progress':
            dispatch(getInProgressIssues([...inProgressIssues, issue]));
            break;

          case 'Done':
            dispatch(getDoneIssues([...doneIssues, issue]));
            break;
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  return (
    <List.Item
      ref={ref}
      style={{
        opacity,
        padding: '20px 20px 0px 20px',
        background: 'transparent',
        border: 'none',
      }}
    >
      <Issue issue={issue} />
    </List.Item>
  );
};

export default Movable;
