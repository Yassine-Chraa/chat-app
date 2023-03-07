import { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import onlineIcon from "../../icons/onlineIcon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faSignOut } from "@fortawesome/free-solid-svg-icons";
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
    <div className="container">
      <div className="container">
        <div className="infoBar">
          <div className="leftInnerContainer">
            <FontAwesomeIcon
              icon={faCircle}
              color="blue"
              style={{ fontSize: 10, marginRight: 12 }}
            />
            <h3>{room}</h3>
          </div>
          <div className="rightInnerContainer">
            <a href="/">
              <FontAwesomeIcon icon={faSignOut} color="#fff" />
            </a>
          </div>
        </div>
        <div className="row">
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
        </div>
        <form className="form">
          <div className="row">
            <div className="col-md-8 mx-0">
              <input
                className="form-control"
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={({ target: { value } }) => setMessage(value)}
                onKeyPress={(event) =>
                  event.key === "Enter" ? sendMessage(event) : null
                }
              />
            </div>
            <div className="col-md-4 mt-2">
              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={(e) => sendMessage(e)}
              >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="row" style={{marginTop: 64}}>
        <div className="col-12 mx-2">
          {users ? (
            <div>
              <h1>People currently chatting:</h1>
              <div className="activeContainer">
                <ul class="list-group">
                  {users.map(({ name }) => (
                    <li class="list-group-item" key={name}>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;
