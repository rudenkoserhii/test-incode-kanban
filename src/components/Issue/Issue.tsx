import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

export type IssueProps = {
  issue: {
    id: number;
    title: string;
    number: number;
    updated_at: string;
    user: {
      login: string;
    };
    comments: number;
  };
};

const Issue: React.FC<IssueProps> = ({ issue }) => {
  const { id, title, number, updated_at, user, comments } = issue;

  const { login } = user;

  const days = Math.floor(
    (Number(new Date()) - Number(new Date(updated_at))) / 1000 / 60 / 60 / 24
  );

  return (
    <Card
      id={id.toString()}
      style={{
        background: 'transparent',
        border: 'none',
        borderRadius: '20px',
        boxShadow: '1px 1px 2px 2px black',
      }}
    >
      <Card.Meta title={title} description={`#${number} opened ${days} days ago`} />
      <Text>
        {login} | Comments: {comments}
      </Text>
    </Card>
  );
};

export default Issue;
