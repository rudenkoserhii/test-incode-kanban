import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, Divider, App as AntApp } from 'antd';
import Input from 'components/Input/Input';
import Logo from 'components/Logo/Logo';
import Main from 'components/Main/Main';
import TopRated from 'components/TopRated/TopRated';
import { persistor, store } from './redux/store';
import FloatButtonTop from 'components/FloatButtonTop/FloatButtonTop';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <AntApp>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <div>
              <Logo />
              <Divider orientation="right">Input Link</Divider>
              <Input />
            </div>
            <TopRated />
            <Main />
            <FloatButtonTop />
          </PersistGate>
        </Provider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
