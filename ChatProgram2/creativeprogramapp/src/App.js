//import logo from './logo.svg';
import {Col, Row, Container } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NameRoom from './components/NameRoom';
import WaitingRoom from './components/waitingroom';
import GameRoom from './components/GameRoom';
import { useState, useEffect} from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function App() {
  const [conn, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [joinGameRoom, setJoinGameRoom] = useState(false);
  const [UsernamesArray, setUsernamesArray] = useState([]);
  const [usersInChatRoom, setUsersInChatRoom] = useState([]);
  const [UsernamesGameRoom, setUsernamesGameRoom] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [storyMessages, setStoryMessages] = useState([]);

  useEffect(() => {
    if (conn) {
      // Set up event listeners once the connection is established
      conn.on("ButtonGameStartedClicked", () => {
        //setGameStarted(true);
        setMessages([]);
        setJoinGameRoom(true);
        setMessages(messages => [...messages, { username: "admin", msg: "Game has started" }]);
      });

      conn.on("ReceiveStartGame", (username, msg) => {
        setMessages(messages => [...messages, { username, msg }]);
      });

      conn.on("GameRoomClients", (gameRoomClients) => {
        setUsernamesGameRoom(gameRoomClients);
        console.log("GameRoomClients", gameRoomClients);
        console.log("UsernamesGameRoom", UsernamesGameRoom);
      });
    }
  }, [conn]); // Only run this effect when `conn` changes

  const joinChatRoom = async (username, chatroom) => {
    try {
      // initiate a connection
      const newConn = new HubConnectionBuilder().withUrl("http://localhost:5000/chatHub").configureLogging(LogLevel.Information).build();

      // set up handler
      newConn.on("JoinSpecificChatRoom", (username, msg) => {
        setMessages(messages => [...messages, { username, msg }]);
      });

      newConn.on("ReceiveSpecificMessage", (username, msg) => {
        setMessages(messages => [...messages, { username, msg }]);
      });
      
      //// receives the valid messages and adds them into our storyMessages list for export
      newConn.on("ReceiveCorrectMessages", (username, msg) => {
        setStoryMessages(storyMessages =>[...storyMessages, { username, msg }]);
      });
      ///////

      newConn.on("UsersInChatRoom", (users) => {
        setUsersInChatRoom(usersInChatRoom => [...usersInChatRoom, { users }]);
        console.log("users", users);
        console.log("usersinchatroom:", usersInChatRoom);
      });

      newConn.on("WordListAcquired", (wordList) => {
        setMessages(messages => [...messages, { username: 'admin', msg: wordList }]);
        console.log("wordlist", wordList);
      });

      await newConn.start();
      await newConn.invoke("JoinSpecificChatRoom", { username, chatroom });
      setConnection(newConn);
      await newConn.invoke("SendRequiredWords", newConn);
    } catch (e) {
      console.log(e);
    }
  }

  const startGame = async () => {
    try {
      // Reset messages state
      //setMessages([]);
      
      console.log("This is conn from startGame", conn);
      await conn.invoke("StartGame", conn);

      // Initialize the word list and print it
      const message = await conn.invoke("InitializeRequiredWords");
      setMessages(messages => [...messages, { username: "admin", msg: message }]);

      const UsernamesArray = await conn.invoke("GetUsersInChatRoom", conn);
      setUsernamesArray(UsernamesArray);

      //setMessages(messages => [...messages, { username: "admin", msg: "Game has started" }]);
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  }

  const sendMessage = async (message) => {
    try {
      await conn.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div >
      <main>
        <Container>
          <Row class='px-5 my-5'>
            <Col sm='12'>
              <h1 className='font-weight-light'> Welcome to Creative Program Chat App</h1>
            </Col>
          </Row>
          {!conn ? <NameRoom joinChatRoom={joinChatRoom} /> : null}
          {conn && !joinGameRoom ? <WaitingRoom messages={messages} startGame={startGame} conn={conn} /> : null}
          {!joinGameRoom ? null : <GameRoom messages={messages} sendMessage={sendMessage} usersInChatRoom={usersInChatRoom} UsernamesArray={UsernamesArray} conn={conn} storyMessages={storyMessages}/>}
        </Container>
      </main>
    </div>
  );
};

export default App;
