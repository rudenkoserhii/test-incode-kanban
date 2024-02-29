import React from 'react';
import { Card, Typography } from 'antd';
import { IssueType } from '../../types';

const { Text } = Typography;

const Issue = ({ issue }: { issue: IssueType }): JSX.Element => {
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
        width: '100%',
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
