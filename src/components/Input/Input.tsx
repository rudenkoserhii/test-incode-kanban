import React, { useState } from 'react';
import { Form, Input as AntInput, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { getRepo } from '../../redux/repo/slice';

const Input: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [pattern] = useState(new RegExp('^(ftp|http|https):\\/\\/[^ "]+$'));

  const onSubmit = (values: { repoUrl: string }) => {
    dispatch(getRepo(values.repoUrl));
    form.resetFields();
  };

  const validateRepoUrl = (_: unknown, value: string) => {
    if (!pattern.test(value)) {
      return Promise.reject('Please enter a valid repo URL');
    }

    return Promise.resolve();
  };

  return (
    <header>
      <Form form={form} onFinish={onSubmit} role="form">
        <Form.Item
          name="repoUrl"
          rules={[
            {
              required: true,
              message: 'Please enter a repo URL',
            },
            {
              validator: validateRepoUrl,
            },
          ]}
        >
          <AntInput
            type="text"
            placeholder="Enter repo URL. For example https://github.com/facebook/react"
          />
        </Form.Item>
        <Button
          data-testid="button"
          type="primary"
          htmlType="submit"
          style={{
            whiteSpace: 'nowrap',
            borderColor: 'rgb(108,117,125)',
            background: 'lightgrey',
            color: 'rgb(33,37,41)',
          }}
        >
          Load issues
        </Button>
      </Form>
    </header>
  );
};

export default Input;
