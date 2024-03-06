import { List } from 'antd';
import Issue from 'components/Issue/Issue';
import React, { useRef } from 'react';
import { IssueType } from 'types';

type PropsMovable = {
  issue: IssueType;
  title: string;
  backgroundUp: (value: string) => void;
};

const Movable = React.memo(({ issue, title, backgroundUp }: PropsMovable): JSX.Element => {
  const draggableRef = useRef<HTMLLIElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setTimeout(() => backgroundUp('current'));
    if (draggableRef.current) {
      draggableRef.current.style.opacity = '0.4';
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({ ...issue, column: title }));
  };

  const handleDragEnd = () => {
    if (draggableRef.current) {
      draggableRef.current.style.opacity = '1';
    }
  };

  return (
    <List.Item
      ref={draggableRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      id={issue.id.toString()}
      className="movable"
      data-order={issue.order}
      data-column={title}
    >
      <Issue issue={issue} />
    </List.Item>
  );
});

export default Movable;
