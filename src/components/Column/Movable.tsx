import { List } from 'antd';
import Issue from 'components/Issue/Issue';
import { IssueType } from 'types';

type PropsMovable = {
  issue: IssueType;
  title: string;
  startDragging: () => void;
  isDragging: boolean;
};

const Movable = ({ issue, title, startDragging, isDragging }: PropsMovable): JSX.Element => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: IssueType) => {
    startDragging();
    (e.target as HTMLLIElement).style.opacity = '0.4';
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ ...issue, column: title.replaceAll(' ', '').toLowerCase() })
    );
  };

  return (
    <List.Item
      draggable
      onDragStart={(e) => handleDragStart(e, issue)}
      onDragEnd={(e) => ((e.target as HTMLLIElement).style.opacity = '1')}
      id={issue.id.toString()}
      className={`movable ${title.replaceAll(' ', '').toLowerCase()}`}
      data-order={issue.order}
    >
      <Issue issue={issue} />
    </List.Item>
  );
};

export default Movable;
