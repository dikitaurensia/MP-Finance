import React, { Component } from "react";
import { Modal, Input } from "antd";
// import Modal from "antd/lib/Modal";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, body, visible } = this.props;
    return (
      <Modal title="Customer" onCancel={onCancel} onOk={onOk} visible={visible}>
        <TextField
          value={body.contact}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Contact"
          variant="outlined"
          type="text"
          name="contact"
          onChange={onChange}
        />
        <TextField
          value={body.company}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Company"
          variant="outlined"
          type="text"
          name="company"
          onChange={onChange}
        />
        <TextField
          value={body.phone}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Phone"
          variant="outlined"
          type="text"
          name="phone"
          onChange={onChange}
        />
        <TextField
          value={body.whatsapp}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Whatsapp"
          variant="outlined"
          type="text"
          name="whatsapp"
          onChange={onChange}
        />
        <TextField
          value={body.address}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Address"
          variant="outlined"
          type="text"
          name="address"
          onChange={onChange}
        />
        <div>
          <TextField
            value={body.coordinate}
            margin="dense"
            // autoFocus={true}
            fullWidth={true}
            size="small"
            label="Coordinate"
            variant="outlined"
            type="text"
            name="coordinate"
            onChange={onChange}
            style={{ width: "50%" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={body.canupdate === "1" ? true : false}
                onChange={(e) =>
                  onChange({
                    target: {
                      name: e.target.name,
                      value: e.target.checked === true ? "1" : "0",
                    },
                  })
                }
                name="canupdate"
                color="primary"
                style={{ width: "50%" }}
              />
            }
            label="Lock Update"
          />
        </div>
        <TextField
          value={body.address2}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Address 2"
          variant="outlined"
          type="text"
          name="address2"
          onChange={onChange}
        />
        <div>
          <TextField
            value={body.coordinate2}
            margin="dense"
            autoFocus={true}
            fullWidth={true}
            size="small"
            label="Coordinate 2"
            variant="outlined"
            type="text"
            name="coordinate2"
            onChange={onChange}
            style={{ width: "50%" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={body.canupdate2 === "1" ? true : false}
                onChange={(e) =>
                  onChange({
                    target: {
                      name: e.target.name,
                      value: e.target.checked === true ? "1" : "0",
                    },
                  })
                }
                name="canupdate2"
                color="primary"
                style={{ width: "50%" }}
              />
            }
            label="Lock Update"
          />
        </div>
      </Modal>
    );
  }
}
