import React, { Component } from "react";
import { Modal } from "antd";
import TextField from "@material-ui/core/TextField";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, visible, body } = this.props;
    return (
      <Modal title="Merk" onCancel={onCancel} onOk={onOk} visible={visible}>
        <TextField
          value={body.name}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Name"
          variant="outlined"
          type="text"
          name="name"
          onChange={onChange}
        />
      </Modal>
    );
  }
}
