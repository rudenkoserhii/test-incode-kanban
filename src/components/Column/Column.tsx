import { Card, Col, Button, Spin } from 'antd';
import { nanoid } from 'nanoid';
import Movable from 'components/Column/Movable';
import { IssueType } from 'types';
import { useDragAndDrop } from 'hooks';

type PropsColumn = {
  column?: IssueType[];
  title: string;
  setPage: (value: string) => void;
  background?: string;
  backgroundUp: (value: string) => void;
  removeButton?: boolean;
  isLoading?: boolean;
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
  const { handleDrop } = useDragAndDrop(backgroundUp);

  return (
    <Col className="issues">
      <Card className="full-width-height" title={title} style={{ background }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="full-width-height"
          data-column={title}
        >
          <ul className={`ant-list ${title.replaceAll(' ', '').toLowerCase()}`}>
            {column &&
              column.length > 0 &&
              [...column]
                .sort((a, b) => a.order - b.order)
                .map((issue) => (
                  <Movable issue={issue} title={title} key={nanoid()} backgroundUp={backgroundUp} />
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
