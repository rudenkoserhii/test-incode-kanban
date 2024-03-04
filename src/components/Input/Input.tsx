import { useState } from 'react';
import { Form, Input as AntInput, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { getRepo } from '../../redux/repo/slice';
import { AppDispatch } from '../../redux/store';
import { SnippetsOutlined } from '@ant-design/icons';
import { ValidateStatus } from 'antd/es/form/FormItem';

const Input = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [pattern] = useState<RegExp>(new RegExp('^https://github.com[^ "]+$'));
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const [validateStatus, setValidateStatus] = useState<ValidateStatus>('');

  const onFinish = (values: { url: string }): void => {
    dispatch(getRepo(values.url));
    form.resetFields();
    setIsValid(undefined);
    setValidateStatus('');
  };

  const validateRepoUrl = async (_: unknown, value: string): Promise<void> => {
    if (value === '') {
      setIsValid(undefined);
      setValidateStatus('');

      return;
    }
    if (!pattern.test(value)) {
      setIsValid(false);
      setValidateStatus('error');

      return Promise.reject(
        'Please enter a valid repo URL, for example: "https://github.com/facebook/react"'
      );
    }
    setIsValid(true);
    setValidateStatus('success');

    return Promise.resolve();
  };

  const suffix = (
    <SnippetsOutlined
      title="Paste"
      onClick={() =>
        navigator.clipboard.readText().then((text) => {
          form.setFieldsValue({ url: text });
          form.validateFields();
        })
      }
      style={{
        fontSize: 16,
        color: '#00b96b',
      }}
    />
  );

  return (
    <header>
      <Form form={form} onFinish={onFinish} role="form" layout={'inline'} name="basic">
        <Form.Item
          className="input-one"
          hasFeedback
          name={'url'}
          validateStatus={validateStatus}
          rules={[
            {
              validator: validateRepoUrl,
            },
          ]}
        >
          <AntInput allowClear placeholder="Please enter a repo URL" suffix={suffix} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!isValid}>
            Load issues
          </Button>
        </Form.Item>
      </Form>
    </header>
  );
};

export default Input;
