import React, { useEffect, useState } from 'react';
import { Card, Col, List, Button, Spin, App } from 'antd';
import Movable from 'components/Column/Movable';
import { IssueType } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'redux/store';
import { repoValue } from 'redux/repo/selectors';
import { changesValue } from 'redux/changes/selectors';
import { toDoIssuesValue } from 'redux/toDoIssues/selectors';
import { inProgressIssuesValue } from 'redux/inProgressIssues/selectors';
import { addChange } from 'redux/changes/slice';
import { doneIssuesValue } from 'redux/doneIssues/selectors';
import { getDoneIssues } from 'redux/doneIssues/slice';
import { getInProgressIssues } from 'redux/inProgressIssues/slice';
import { getToDoIssues } from 'redux/toDoIssues/slice';

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
  const app = App.useApp();
  const dispatch: AppDispatch = useDispatch();
  const url = useSelector(repoValue);
  const changes = useSelector(changesValue);
  const repo = url.split('github.com/')[1];
  const toDoIssues = useSelector(toDoIssuesValue);
  const inProgressIssues = useSelector(inProgressIssuesValue);
  const doneIssues = useSelector(doneIssuesValue);

  useEffect(() => {
    backgroundUp('white');
  }, [column]);

  function objChange(columnIn: string, columnOut: string, id: number, issue: IssueType) {
    return {
      repo: repo,
      id: id,
      columnIn: columnIn,
      columnOut: columnOut,
      issue: issue,
    };
  }

  const handleDrop = (item: { name: string }) => {
    backgroundUp('white');

    if (item.name !== title) {
      const columnIn = item.name;
      const columnOut = title;

      const issue = column.find((el) => el.id === item.issue.id);

      dispatch(addChange(objChange(columnIn, columnOut, item.issue.id, issue)));

      switch (columnOut) {
        case 'ToDo':
          dispatch(getToDoIssues([...toDoIssues, issue]));
          break;

        case 'In Progress':
          dispatch(getInProgressIssues([...inProgressIssues, issue]));
          break;

        case 'Done':
          dispatch(getDoneIssues([...doneIssues, issue]));
          break;

        default:
          break;
      }
    }
  };

  return (
    <Col className="issues">
      <Card className="full-width-height" title={title} style={{ background }}>
        <div className="full-width-height">
          <List dataSource={column}>
            {column.map((issue) => (
              <Movable key={issue.id} issue={issue} title={title} onDrop={handleDrop} />
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
