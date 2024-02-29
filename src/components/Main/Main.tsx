import { Row, Col } from 'antd';
import Title from '../Title/Title';
import { Rote } from '../Rote/Rote';
import Boards from '../Boards/Boards';

export const Main = () => (
  <main>
    <div>
      <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Col>
          <Title />
        </Col>
        <Col>
          <Rote />
        </Col>
      </Row>
    </div>
    <Boards />
  </main>
);
