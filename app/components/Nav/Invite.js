import React from "react";
import Add from "@material-ui/icons/Add"
class Invite extends React.Component {
  render() {
    return (
      <div className="kanban__nav-avs-add">
        <div className="kanban__nav-avs-invite">
          <form>
            <input
              type="email"
              placeholder="invite email"
              className="invite-email"
            />
            <button className="invite-btn">Send</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Invite;
