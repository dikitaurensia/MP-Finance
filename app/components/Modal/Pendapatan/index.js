import React, { Component } from "react";
import { Modal, TimePicker } from "antd";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export default class index extends Component {
  render() {
    const { onOk, onCancel, onChange, visible, body, dataCourier } = this.props;
    return (
      <Modal title="Pendapatan/Potongan" onCancel={onCancel} onOk={onOk} visible={visible}>
        <TextField
          value={body.tgl}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Tanggal"
          variant="outlined"
          type="date"
          name="tgl"
          onChange={onChange}
          format="YYYY-MM-DD"
          views={["year", "month", "day"]}
        />

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
          {
            dataCourier
              .filter((x) => x.status === "active")
              .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
              .map((Item) => (
                <MenuItem value={Item.id} key={Item.id}>
                  {Item.name}
                </MenuItem>
              ))}
        </Select>

        <Select
          style={{ marginTop: "10px" }}
          margin="dense"
          label="Jenis"
          variant="outlined"
          autoFocus={true}
          fullWidth={true}
          labelId="Jenis"
          id="jenis"
          value={body.jenis}
          onChange={(e) => onChange(e, "jenis")}
        >
          <MenuItem value={"Pendapatan"} key="Pendapatan">
            Pendapatan
          </MenuItem>
          <MenuItem value={"Potongan"} key="Potongan">
            Potongan
          </MenuItem>
        </Select>

        <TextField
          value={body.keterangan}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Keterangan"
          variant="outlined"
          type="text"
          name="keterangan"
          onChange={onChange}
        />
        <TextField
          value={body.nilai}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Jumlah"
          variant="outlined"
          type="number"
          name="nilai"
          onChange={onChange}
        />
      </Modal>
    );
  }
}
