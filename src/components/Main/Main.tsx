import { Row, Col, Divider } from 'antd';
import Title from 'components/Title/Title';
import Rote from 'components/Rote/Rote';
import Boards from 'components/Boards/Boards';

const Main = (): JSX.Element => (
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

export default Main;
