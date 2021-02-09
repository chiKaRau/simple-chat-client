import React, { useState, useRef, useEffect } from "react";

export default function RoomList(props) {
  let roomsListDisplay = props.roomslist.map((e, index = 0) => {
    return (
      <div
        className="p-5 m-3 bg-warning"
        style={{
          border: props.selectedCurrentRoomID === e._id && "2px solid black"
        }}
        onClick={(evt) => props._selectRoom(evt, e._id)}
        key={index++}
      >
        {e.name}
      </div>
    );
  });

  return <div className="d-flex flex-row flex-wrap">{roomsListDisplay} </div>;
}
