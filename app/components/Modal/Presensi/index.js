import React, { Component } from "react";
import { Modal } from "antd";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, visible, body, dataCourier } = this.props;
    return (
      <Modal title="Presensi" onCancel={onCancel} onOk={onOk} visible={visible}>
        <Select
          style={{ marginTop: "10px" }}
          margin="dense"
          label="Kurir/Supir"
          variant="outlined"
          autoFocus={true}
          fullWidth={true}
          labelId="Status"
          id="courierid"
          value={body.courierid}
          onChange={(e) => onChange(e, "courierid")}
        >
          {dataCourier
            .filter((x) => x.status === "active")
            .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
            .map((Item) => (
              <MenuItem value={Item.id} key={Item.id}>
                {Item.name}
              </MenuItem>
            ))}
        </Select>

        <TextField
          value={body.tglabsen}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Tanggal Presensi"
          variant="outlined"
          type="date"
          name="tglabsen"
          onChange={onChange}
          format="YYYY-MM-DD"
          views={["year", "month", "day"]}
        />

        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel
            id="Status"
            style={{ marginTop: "-5px", paddingLeft: "15px" }}
          >
            Status
          </InputLabel>
          <Select
            margin="dense"
            label="Status"
            variant="outlined"
            fullWidth={true}
            labelId="Status"
            id="statusabsen"
            value={body.statusabsen}
            defaultValue={body.statusabsen}
            onChange={(e) => onChange(e, "statusabsen")}
          >
            <MenuItem value={"Masuk"} key="Masuk">
              Masuk
            </MenuItem>
            <MenuItem value={"Izin"} key="Izin">
              Izin
            </MenuItem>
            <MenuItem value={"Sakit"} key="Sakit">
              Sakit
            </MenuItem>
            <MenuItem value={"Pulang"} key="Pulang">
              Pulang
            </MenuItem>
          </Select>
        </FormControl>
      </Modal>
    );
  }
}
