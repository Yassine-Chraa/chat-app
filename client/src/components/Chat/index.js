import { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import onlineIcon from "../../icons/onlineIcon.png";
import closeIcon from "../../icons/closeIcon.png";
import "./chat.css";
const ENDPOINT = "http://localhost:5000/";
const socket = io(ENDPOINT);
const Chat = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (message.user === trimmedName) {
    isSentByCurrentUser = true;
  }

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    setRoom(room);
    setName(name);
    console.log("ok");
    socket.emit("join", { name, room }, (error) => {
      if (error) {
        console.log(error);
      }
    });
    return () => {
      socket.on("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  return (
    <div className="outerContainer">
      <div className="container">
        <div className="infoBar">
          <div className="leftInnerContainer">
            <img className="onlineIcon" src={onlineIcon} alt="online icon" />
            <h3>{room}</h3>
          </div>
          <div className="rightInnerContainer">
            <a href="/">
              <img src={closeIcon} alt="close icon" />
            </a>
          </div>
        </div>
        <ScrollToBottom className="messages">
          {messages.map((message, i) => (
            <div key={i}>
              {isSentByCurrentUser ? (
                <div className="messageContainer justifyEnd">
                  <p className="sentText pr-10">{trimmedName}</p>
                  <div className="messageBox backgroundBlue">
                    <p className="messageText colorWhite">
                      {ReactEmoji.emojify(message.text)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="messageContainer justifyStart">
                  <div className="messageBox backgroundLight">
                    <p className="messageText colorDark">
                      {ReactEmoji.emojify(message.text)}
                    </p>
                  </div>
                  <p className="sentText pl-10 ">{message.user}</p>
                </div>
              )}
            </div>
          ))}
        </ScrollToBottom>
        <form className="form">
          <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event) : null
            }
          />
          <button className="sendButton" onClick={(e) => sendMessage(e)}>
            Send
          </button>
        </form>
      </div>
      <div className="textContainer">
        {users ? (
          <div>
            <h1>People currently chatting:</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({ name }) => (
                  <div key={name} className="activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon} />
                  </div>
                ))}
              </h2>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Chat;
