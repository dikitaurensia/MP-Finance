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
      <Modal title="Courier" onCancel={onCancel} onOk={onOk} visible={visible}>
        <TextField
          value={body.kode}
          margin="dense"
          autoFocus={true}
          fullWidth={true}
          size="small"
          label="Kode"
          variant="outlined"
          type="text"
          name="kode"
          onChange={onChange}
        />
        <TextField
          value={body.name}
          margin="dense"
          // autoFocus={true}
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
          // autoFocus={true}
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
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Password -  leave blank if you don't want to change it"
          variant="outlined"
          type="password"
          name="password"
          onChange={onChange}
        />

        <TextField
          value={body.jammasuk}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Jam Masuk"
          variant="outlined"
          type="time"
          defaultValue="08:00"
          name="jammasuk"
          onChange={onChange}
        />

        <TextField
          value={body.telat}
          // type="Number"
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Potongan Telat"
          variant="outlined"
          type="text"
          name="telat"
          onChange={onChange}
          defaultValue="50000"
        />

        <TextField
          value={body.bpjsefektif}
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Tanggal Efektif BPJS"
          variant="outlined"
          type="date"
          name="bpjsefektif"
          onChange={onChange}
          format="YYYY-MM-DD"
          views={["year", "month", "day"]}
        />

        <TextField
          value={body.bpjspendapatan}
          // type="Number"
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Pendapatan BPJS"
          variant="outlined"
          type="text"
          name="bpjspendapatan"
          onChange={onChange}
          defaultValue="0"
        />

        <TextField
          value={body.ritpendapatan}
          // type="Number"
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Pendapatan 1 Rit"
          variant="outlined"
          type="text"
          name="ritpendapatan"
          onChange={onChange}
          defaultValue="0"
        />

        <TextField
          value={body.bpjspotongan}
          // type="Number"
          margin="dense"
          // autoFocus={true}
          fullWidth={true}
          size="small"
          label="Potongan BPJS"
          variant="outlined"
          type="text"
          name="bpjspotongan"
          onChange={onChange}
          defaultValue="0"
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
            id="status"
            value={body.status}
            defaultValue={body.status}
            onChange={(e) => onChange(e, "status")}
          >
            <MenuItem value={"active"} key="active">
              Active
            </MenuItem>
            <MenuItem value={"non-active"} key="non-active">
              Non-Active
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel
            id="Type"
            style={{ marginTop: "-5px", paddingLeft: "15px" }}
          >
            Type
          </InputLabel>
          <Select
            margin="dense"
            label="Type"
            variant="outlined"
            fullWidth={true}
            labelId="Type"
            id="type"
            value={body.type}
            defaultValue={body.type}
            onChange={(e) => onChange(e, "type")}
          >
            <MenuItem value="Kurir" key="Kurir">
              Kurir
            </MenuItem>
            <MenuItem value="Supir" key="Supir">
              Supir
            </MenuItem>
            <MenuItem value="Gudang" key="Gudang">
              Gudang
            </MenuItem>
            <MenuItem value="Kernet" key="Kernet">
              Kernet
            </MenuItem>
          </Select>
        </FormControl>

        {body.type === "Supir" ? (
          <FormControl fullWidth style={{ marginTop: "10px" }}>
            <InputLabel
              id="Kategori"
              style={{ marginTop: "-5px", paddingLeft: "15px" }}
            >
              Kategori
            </InputLabel>
            <Select
              margin="dense"
              label="Kategori"
              variant="outlined"
              fullWidth={true}
              labelId="Kategori"
              id="kategori"
              value={body.kategori}
              defaultValue={body.kategori}
              onChange={(e) => onChange(e, "kategori")}
            >
              <MenuItem value="1" key="1">
                Supir 1
              </MenuItem>
              <MenuItem value="2" key="2">
                Supir 2
              </MenuItem>
              <MenuItem value="3" key="3">
                Supir 3
              </MenuItem>
              <MenuItem value="4" key="4">
                Supir 4
              </MenuItem>
            </Select>
          </FormControl>
        ) : null}
      </Modal>
    );
  }
}
