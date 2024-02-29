import { ConfigProvider } from 'antd';
import Input from './components/Input/Input';
import { Main } from './components/Main/Main';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import TopRated from './components/TopRated/TopRated';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#00b96b' } }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TopRated />
          <Input />
          <Main />
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
