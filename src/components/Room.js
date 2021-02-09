import React, { useState, useRef, useEffect } from "react";

import MessageInput from "./MessageInput";

export default function Room(props) {
  let roomMessagesDisplay = props.roomMessages.map((e, index = 0) => {
    return (
      <p key={index++}>
        {e.username} : {e.user_message}
      </p>
    );
  });
  return props.selectRoomID !== 0 ? (
    <>
      <div className="row justify-content-end">
        <button
          className="btn btn-danger"
          onClick={(e) => {
            props._leaveRoom(e, props.selectedCurrentRoomID);
          }}
        >
          Exit
        </button>
      </div>

      <div
        className="border"
        id="messagesChat"
        style={{ height: 300, overflowY: "scroll" }}
      >
        {roomMessagesDisplay}
        <div ref={props.messagesEndRef} />
      </div>
      <MessageInput _sendMessage={props._sendMessage} />
    </>
  ) : (
    <div>Please select a room</div>
  );
}
