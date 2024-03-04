import React, { useState } from 'react';
import Issue from 'components/Issue/Issue';
import { IssueType } from 'types';

type PropsMovable = {
  issue: IssueType;
  title: string;
  onDrop: (item: { name: string; issue: IssueType }) => void;
};

const Movable = ({ issue, title, onDrop }: PropsMovable): JSX.Element => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', title);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const { dropEffect } = e.dataTransfer;

    const name = e.dataTransfer.getData('text/plain');

    onDrop({ name, issue });

    if (dropEffect === 'move') {
      // Handle the drop effect if needed
    }
  };

  return (
    <div
      className="movable"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <Issue issue={issue} />
    </div>
  );
};

export default Movable;
