import React, { useState } from 'react';
import { Form, Input as AntInput, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { getRepo } from '../../redux/repo/slice';
import { AppDispatch } from '../../redux/store';
import Search from 'antd/es/input/Search';
import { SnippetsOutlined } from '@ant-design/icons';

const Input = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [pattern] = useState<RegExp>(new RegExp('^(ftp|http|https):\\/\\/[^ "]+$'));
  const [isValid, setIsValid] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<string>('');

  const onSubmit = (values: { repoUrl: string }): void => {
    dispatch(getRepo(values.repoUrl));
    form.resetFields();
  };

  const validateRepoUrl = async (_: unknown, value: string): Promise<void> => {
    console.log(value);
    if (!pattern.test(value)) {
      setIsValid(false);

      return Promise.reject('Please enter a valid repo URL');
    }
    setIsValid(true);

    return Promise.resolve();
  };

  const suffix = (
    <SnippetsOutlined
      onClick={() => navigator.clipboard.readText().then((text) => setDefaultValue(text))}
      style={{
        fontSize: 16,
        color: '#1677ff',
      }}
    />
  );

  return (
    <header>
      <Form form={form} onFinish={onSubmit} role="form" layout={'inline'}>
        {/* <Form.Item
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
          <Search
            placeholder="Enter repo URL. For example https://github.com/facebook/react"
            enterButton="Load issues"
            size="large"
            loading={false}
          />
          <Search
            type="text"
            placeholder="Enter repo URL. For example https://github.com/facebook/react"
          />
          <Button data-testid="button" type="primary" htmlType="submit">
            Load issues
          </Button> */}
        <Form.Item
          // hasFeedback
          validateStatus="validating"
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
            allowClear
            placeholder="Please enter a repo URL"
            suffix={suffix}
            defaultValue={defaultValue}
          />
        </Form.Item>
        <Button
          data-testid="button"
          type="primary"
          htmlType="submit"
          disabled={false}
          style={{ width: 100 }}
        >
          Load issues
        </Button>
      </Form>
    </header>
  );
};

export default Input;
