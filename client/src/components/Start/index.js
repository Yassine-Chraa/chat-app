import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./join.css";

export default function SignIn() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="joinOuterContainer row">
      <div className="col-md-4 col-sm-6 p-0">
        <div className="card p-4" style={{boxShadow: '1px 3px 9px #00000047'}}>
          <h1 className="heading">Join</h1>
          <form>
            <div class="form-group mb-4">
              <input
                placeholder="Name"
                className="form-control"
                type="text"
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div class="form-group mb-2">
              <input
                placeholder="Room"
                className="form-control"
                type="text"
                onChange={(event) => setRoom(event.target.value)}
              />
            </div>
            <Link
              onClick={(e) => (!name || !room ? e.preventDefault() : null)}
              to={`/chat?name=${name}&room=${room}`}
            >
              <button className="btn btn-primary" type="submit">
                Sign In
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
