import { Card, Col, List, Button, Spin } from 'antd';
import { nanoid } from 'nanoid';
import Movable from './Movable';
import { useDrop } from 'react-dnd';
import { IssueType } from '../../types';

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
  const [, drop] = useDrop({
    accept: 'Movable',
    drop: () => {
      backgroundUp('white');

      return { name: title };
    },
    canDrop: (item: { name: string }) => {
      const result = item.name !== title;

      if (!result) {
        backgroundUp('red');
      }

      return result;
    },
  });

  return (
    <Col className="issues">
      <Card className="full-width-height" title={title} style={{ background }}>
        <div ref={drop} className="full-width-height">
          <List dataSource={column}>
            {column.map((issue) => (
              <Movable
                issue={issue}
                title={title}
                key={nanoid()}
                didDrop={() => backgroundUp('white')}
              />
            ))}
          </List>
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
