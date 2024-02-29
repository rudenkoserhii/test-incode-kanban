import React from 'react';
import { Card, Col, List, Button, Spin } from 'antd';
import { nanoid } from 'nanoid';
import Movable from './Movable';
import { useDrop } from 'react-dnd';
import { IssueType } from '../../types';

type PropsColumn = {
  column: IssueType[];
  title: string;
  setPage: (value: string) => void;
  removeButton: boolean;
  isLoading: boolean;
};

const Column = ({ column, title, setPage, removeButton, isLoading }: PropsColumn): JSX.Element => {
  const [, drop] = useDrop({
    accept: 'Movable',
    drop: () => ({ name: title }),
  });

  return (
    <Col style={{ width: 'calc((100% / 3)' }}>
      <Card
        style={{ height: '100%' }}
        title={title}
        extra={
          !removeButton &&
          column.length !== 0 && (
            <Button
              onClick={() => setPage(title)}
              style={{
                margin: '10px auto 0px auto',
                width: '50%',
              }}
            >
              Load more
            </Button>
          )
        }
      >
        <ul ref={drop} style={{ height: '100%' }}>
          {column.map((issue) => (
            <Movable issue={issue} title={title} key={nanoid()} />
          ))}
        </ul>
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
