import React, { Component } from "react";
import { Modal } from "antd";
import TextField from "@material-ui/core/TextField";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, visible, body } = this.props;
    return (
      <Modal title="Checker" onCancel={onCancel} onOk={onOk} visible={visible}>
        <TextField
          value={body.name}
          margin="dense"
          fullWidth={true}
          size="small"
          label="Name"
          variant="outlined"
          type="text"
          name="name"
          onChange={onChange}
        />
        <TextField
          autoComplete="false"
          value={body.username}
          margin="dense"
          fullWidth={true}
          size="small"
          label="Username"
          variant="outlined"
          type="text"
          name="username"
          onChange={onChange}
        />
        <TextField
          autoComplete="off"
          value={body.password}
          margin="dense"
          fullWidth={true}
          size="small"
          label="Password -  leave blank if you don't want to change it"
          variant="outlined"
          type="password"
          name="password"
          onChange={onChange}
        />
      </Modal>
    );
  }
}
