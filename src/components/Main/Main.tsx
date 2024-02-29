import React from 'react';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Title } from '../Title/Title';
import { Rote } from '../Rote/Rote';
import { Boards } from '../Boards/Boards';

export const Main: React.FC = () => (
  <main>
    <Container>
      <Row style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Col>
          <Title />
        </Col>
        <Col>
          <Rote />
        </Col>
      </Row>
    </Container>
    <Boards />
  </main>
);
