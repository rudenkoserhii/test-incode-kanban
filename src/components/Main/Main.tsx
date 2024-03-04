import { Row, Col, Divider } from 'antd';
import Title from '../Title/Title';
import Rote from '../Rote/Rote';
import Boards from '../Boards/Boards';

export const Main = (): JSX.Element => (
  <main>
    <div>
      <Divider orientation="right">Title</Divider>
      <Row className="title">
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
