import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./styles.css";

import Room from "./components/Room";
import RoomList from "./components/RoomList";

import { io } from "socket.io-client";
const server_domain = "https://socket.chikarau.repl.co";
const socket = io(server_domain);

export default function App() {
  const [roomslist, setRoomsList] = useState([]);
  const [isError, setIsError] = useState(false);
  const [roomMessages, setroomMessages] = useState([]);
  const [selectedCurrentRoomID, setSelectedCurrentRoomID] = useState(0);

  const messagesEndRef = useRef(null);

  /****************
   * User Actions *
   ****************/
  const _selectRoom = async (evt, roomID) => {
    evt.preventDefault();

    if (roomID === selectedCurrentRoomID) {
      return;
    }

    setSelectedCurrentRoomID(roomID);
    try {
      //Emit a request of joining the room
      socket.emit("join-room", roomID);

      //Get Messages
      let { room } = await fetch_getRoomData(roomID);
      setroomMessages(room.messages);
    } catch (e) {
      console.log("_selectRoom ERROR");
      console.log(e);
    }
  };

  const _leaveRoom = async (evt, roomID) => {
    evt.preventDefault();

    setSelectedCurrentRoomID(0);
    setroomMessages([]);
    try {
      //Emit a request of joining the room
      socket.emit("leave-room", roomID);
    } catch (e) {
      console.log("_leaveRoom ERROR");
      console.log(e);
    }
  };

  const _sendMessage = async (evt, username, user_message) => {
    evt.preventDefault();
    console.log(username);
    console.log(user_message);

    if (username === "" || user_message === "") {
      return;
    }

    try {
      let temp = [...roomMessages];
      let msgObj = { username: username, user_message: user_message };
      temp.push(msgObj);
      setroomMessages(temp);

      socket.emit("new-message", {
        roomID: selectedCurrentRoomID,
        msgObj: msgObj
      });
    } catch (e) {
      console.log("_sendMessage ERROR");
      console.log(e);
    }
  };

  /******************
   * Get Rooms List *
   ******************/
  const _getRoomsList = async () => {
    try {
      let { roomslist } = await fetch_getRoomsList();
      setRoomsList(roomslist);
      setIsError(false);
    } catch (e) {
      console.log("_getRoomsList ERROR");
      console.log(e);
      setIsError(true);
    }
  };

  /**************
   * useEffects *
   **************/
  //IO CONNECTION
  useEffect(() => {
    socket.on("connection", () => {
      console.log("connected");
    });
  }, []);

  //GET ROOMS
  useEffect(() => {
    _getRoomsList();
  }, []);

  //RECIEVE NEW MESSAGES
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({});
    };
    scrollToBottom();

    socket.on("receive-message", (msgObj) => {
      let temp = [...roomMessages];
      temp.push(msgObj);

      if (temp.length > 0) {
        setroomMessages(temp);
      }
    });
  }, [roomMessages]);

  return !isError ? (
    <div className="container h-100">
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-6">
          <RoomList
            roomslist={roomslist}
            _selectRoom={_selectRoom}
            selectedCurrentRoomID={selectedCurrentRoomID}
          />
        </div>
        <div className="col-6">
          <Room
            selectedCurrentRoomID={selectedCurrentRoomID}
            roomMessages={roomMessages}
            _sendMessage={_sendMessage}
            _leaveRoom={_leaveRoom}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
    </div>
  ) : (
    <div>GET ROOM FAILED</div>
  );
}

function fetch_getRoomsList() {
  return axios.get(server_domain + "/getRoomsList").then((res) => res.data);
}

function fetch_getRoomData(_id) {
  return axios
    .post(server_domain + "/getRoomData", { _id: _id })
    .then((res) => res.data);
}
