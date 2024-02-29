import React, { useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import ListGroup from 'react-bootstrap/ListGroup';
import { Issue } from '../Issue/Issue';
import { useDrag, useDrop } from 'react-dnd';
import RootStoreContext from '../RootStore';

export const Movable: React.FC<{ issue: any; title: string }> = ({ issue, title }) => {
  const {
    getToDoIssues,
    getInProgressIssues,
    getDoneIssues,
    addChange,
    toDoIssuesValue,
    inProgressIssuesValue,
    doneIssuesValue,
    repoValue,
  } = useContext(RootStoreContext);
  const url = repoValue;
  const repo = url.split('github.com/')[1];

  function objChange(columnIn, columnOut, id, issue) {
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
      const dropResult = monitor.getDropResult(item);

      if (
        dropResult &&
        Object.values(COLUMN_NAMES).includes(dropResult.name) &&
        dropResult.name !== title
      ) {
        switch (title) {
          case 'ToDo':
            getToDoIssues(toDoIssuesValue.filter((element) => element.id !== issue.id));
            addChange(objChange(dropResult.name, title, issue.id, issue));
            break;

          case 'In Progress':
            getInProgressIssues(inProgressIssuesValue.filter((element) => element.id !== issue.id));
            addChange(objChange(dropResult.name, title, issue.id, issue));
            break;

          case 'Done':
            getDoneIssues(doneIssuesValue.filter((element) => element.id !== issue.id));
            addChange(objChange(dropResult.name, title, issue.id, issue));
            break;
        }
      }
      if (dropResult && dropResult.name !== title) {
        switch (dropResult.name) {
          case 'ToDo':
            getToDoIssues([...toDoIssuesValue, issue]);
            break;

          case 'In Progress':
            getInProgressIssues([...inProgressIssuesValue, issue]);
            break;

          case 'Done':
            getDoneIssues([...doneIssuesValue, issue]);
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
    <ListGroup.Item
      as="li"
      action
      ref={ref}
      className="movable-item"
      style={{
        opacity,
        padding: '20px 20px 0px 20px',
        background: 'transparent',
        border: 'none',
      }}
    >
      <Issue issue={issue} />
    </ListGroup.Item>
  );
};

Movable.propTypes = {
  issue: PropTypes.object,
  title: PropTypes.string,
};
