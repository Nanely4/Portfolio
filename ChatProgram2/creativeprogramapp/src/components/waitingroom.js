import { Form, Button, Col, Row } from "react-bootstrap";
import MessageContainer from "./MessageContainer"
//import { useState } from 'react';

const WaitingRoom = ({ startGame , messages, conn}) => {

    const handleStartGame = (e) => {
        e.preventDefault();
        startGame(); // Call startGame when the Start Game button is clicked
    };

    return (
      <Form onSubmit={handleStartGame}>
        <Row className="px-5 py-5">
            <Col sm={10}>
                <h2>WaitingRoom</h2>
            </Col>
            <Col>

            </Col>
        </Row>
        <Row className="px-5 py-5">
            <Col sm={12}>
                <MessageContainer messages={messages} />
            </Col>
            <Col sm={12}>
                <hr />
                <Button variant="success" type="submit">Start Game</Button>
            </Col>
        </Row>
    </Form>
    );
};

export default WaitingRoom;
