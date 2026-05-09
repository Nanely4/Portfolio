import { useEffect } from "react";
import { Row, Col} from "react-bootstrap";
import MessageContainer from "./MessageContainer"
import SendMessageForm from "./SendMessageForm";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useState } from 'react';

const GameRoom = ({ messages, sendMessage, usersInChatRoom, UsernamesArray, conn, storyMessages}) => {

    //console.log("Inside of GameRoom.js");
    //console.log("These are the users in ChatRoom:", usersInChatRoom);
    //console.log("This is usernamesarray:", UsernamesArray);
    //const [callingRandomUsers, setCallingRandomUsers] = useState(false); // State variable to track whether to call GetRandomUser

    //**implementation for export function changes**
    // handle function for when the Export Button is clicked; Downloads only the valid story messages from game into a text file
    // Reference: https://stackoverflow.com/questions/43135852/javascript-export-to-text-file
    const handleExportButtonClick = () => {
        // Make messages into text file
        const InGameMessages = storyMessages.map(storyMessages => `${storyMessages.username}: ${storyMessages.msg}`).join('\n');
        
        // Download into a text file called messages.txt
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(InGameMessages));
        element.setAttribute('download', 'messages.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div>
            <Row className="px-5 py-5">
                <Col sm={10}>
                    <h2>GameRoom</h2>
                </Col>
                <Col>
                <button onClick={handleExportButtonClick}>Export</button>
                </Col>
            </Row>
            <Row className="px-5 py-5">
                <Col sm={12}>
                    <MessageContainer messages={messages} />
                </Col>
                <Col sm={12}>
                    <SendMessageForm sendMessage={sendMessage} />
                </Col>
            </Row>
        </div>
    );
};

export default GameRoom;
