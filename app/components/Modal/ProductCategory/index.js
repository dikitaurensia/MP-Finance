import React, { Component } from "react";
import { Modal } from "antd";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, visible, body } = this.props;
    return (
      <Modal
        title="Product Category"
        onCancel={onCancel}
        onOk={onOk}
        visible={visible}
      >
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
        <TextField
          value={body.image}
          margin="dense"
          fullWidth={true}
          size="small"
          label="Image"
          variant="outlined"
          type="text"
          name="image"
          onChange={onChange}
        />
      </Modal>
    );
  }
}
