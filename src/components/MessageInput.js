import React, { useState, useRef, useEffect } from "react";

export default function MessageInput(props) {
  const [username, setUsername] = useState("");
  const [user_message, setUser_message] = useState("");

  return (
    <form
      onSubmit={(e) => {
        props._sendMessage(e, username, user_message);
      }}
    >
      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        className="form-control"
        placeholder="Your name"
      />
      <div className="d-flex">
        <input
          type="text"
          value={user_message}
          onChange={(event) => setUser_message(event.target.value)}
          className="form-control"
          placeholder="Your message"
        />
        <button
          type="submit"
          disabled={props.isLoading}
          className="btn btn-info"
        >
          send
        </button>
      </div>
    </form>
  );
}
