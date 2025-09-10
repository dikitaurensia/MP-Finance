import React, { Component } from "react";
import { Modal } from "antd";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, visible, body, database } = this.props;
    return (
      <Modal title="Customer" onCancel={onCancel} onOk={onOk} visible={visible}>
        <Select
          style={{ marginTop: "10px" }}
          margin="dense"
          label="Database"
          variant="outlined"
          autoFocus={true}
          fullWidth={true}
          labelId="Database"
          id="dbId"
          value={body.dbId}
          onChange={(e) => onChange(e, "dbId")}
        >
          {database.map((Item) => (
            <MenuItem value={Item.id} key={Item.id}>
              {Item.dbname}
            </MenuItem>
          ))}
        </Select>
      </Modal>
    );
  }
}
