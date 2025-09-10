import React from "react";
import { Modal, Form, Input, Button, DatePicker } from "antd";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "al-styles/components/modal-delivery.scss";
import {
  create,
  getPengiriman,
  getTokenChecker,
  sendNotif,
  update,
  updateJarak,
} from "../../../service/endPoint";
import {
  ErrorMessage,
  getCoor,
  search,
  SuccessMessage,
  getDistance,
} from "../../../helper/publicFunction";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as turf from "@turf/turf";
import moment from "moment";
import {
  COORDINATE_MP_ARR,
  COORDINATE_MP_ARR2,
  FORMAT_DATE,
  MAPTOKEN,
} from "../../../helper/constanta";
import { FormControl, FormLabel, Radio, RadioGroup } from "@material-ui/core";

const tableName = "transaction";
const DynamicFieldSet = ({
  address,
  add,
  remove,
  fields,
  bodyModal,
  body,
  dataSource,
  delivery,
  onChange,
  handleBlur,
  loading,
  removeDelivery,
  clearState,
  handleChangeModal,
}) => {
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };

  let dataSourceNew = dataSource.filter(
    (v, i, a) => a.findIndex((t) => t.custname === v.custname) === i
  );
  let deliveryNew = delivery.filter(
    (v, i, a) => a.findIndex((t) => t.invoiceno === v.invoiceno) === i
  );

  return (
    <Form name="dynamic_form_item">
      <TextField
        value={body.name}
        margin="dense"
        fullWidth={true}
        size="small"
        label="Name Courier"
        variant="outlined"
        type="text"
        name="name_courier"
      />

      <div className="field-horizontal ">
        <FormLabel className="label-field">Tgl. Kirim</FormLabel>
        <DatePicker
          clearIcon
          showToday
          value={moment(bodyModal.tgltransaksi, FORMAT_DATE)}
          format={FORMAT_DATE}
          defaultValue={moment(bodyModal.tgltransaksi, FORMAT_DATE)}
          onChange={(date, dateString) =>
            handleChangeModal({
              target: { name: "tgltransaksi", value: dateString },
            })
          }
        />
      </div>

      <div className="field-horizontal">
        <FormLabel className="label-field">Urgent</FormLabel>
        <RadioGroup
          aria-label="tipe-rit"
          name="urgent"
          className="flex"
          value={bodyModal.urgent}
          onChange={handleChangeModal}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Ya" />
          <FormControlLabel value="no" control={<Radio />} label="Tidak" />
        </RadioGroup>
      </div>

      <div className="field-horizontal">
        <FormLabel className="label-field">Tipe Rit</FormLabel>
        <RadioGroup
          aria-label="tipe-rit"
          name="typerit"
          className="flex"
          value={bodyModal.typerit}
          onChange={handleChangeModal}
        >
          <FormControlLabel value="biasa" control={<Radio />} label="Biasa" />
          <FormControlLabel value="ekstra" control={<Radio />} label="Ekstra" />
        </RadioGroup>
      </div>

      <div className="field-horizontal">
        <FormLabel className="label-field">Nomor Rit</FormLabel>
        <Input
          value={bodyModal.rit}
          name="rit"
          type="number"
          onChange={handleChangeModal}
        />
      </div>

      <div className="field-horizontal">
        <FormLabel className="label-field">Memo Rit</FormLabel>
        <Input
          value={bodyModal.memo}
          name="memo"
          onChange={handleChangeModal}
        />
      </div>

      <div className="field-horizontal">
        <FormLabel className="label-field">Estimasi Jarak</FormLabel>
        <Select
          value={bodyModal.jarakestimasi}
          onChange={handleChangeModal}
          name="jarakestimasi"
        >
          {bodyModal.estimasi.map((item) => (
            <MenuItem value={item.value}>{item.value}</MenuItem>
          ))}
        </Select>
      </div>

      <div className="field-horizontal mb-2">
        <FormLabel className="label-field">Poin</FormLabel>
        <Select value={bodyModal.poin} onChange={handleChangeModal} name="poin">
          {bodyModal.poins.map((item) => (
            <MenuItem value={item.value}>{item.value}</MenuItem>
          ))}
        </Select>
      </div>

      {fields.map((field, index) => {
        let find = address.find((x) => x.name === field.name);

        let alamat1, alamat2, id1, id2, coordinate, coordinate2;

        let estimasi = bodyModal.address[index]
          ? bodyModal.address[index].estimasi
          : 0;
        if (find) {
          alamat1 = find.address.address;
          alamat2 = find.address2.address;
          id1 = find.address.id.toString();
          id2 = find.address2.id.toString();
          coordinate = find.address.coordinate;
          coordinate2 = find.address2.coordinate;
        }

        let dataarinvoiceid = search(
          "name",
          field.name,
          bodyModal["arinvoiceid"]
        );
        let dataaddress = search("name", field.name, bodyModal.address);

        return (
          <div className="form-control" key={field.key}>
            <div className="header-form">
              <label className="title-form">Pengiriman {index + 1}</label>
              <MinusCircleOutlined
                className="dynamic-delete-button"
                style={{ margin: "0 8px" }}
                onClick={() => {
                  remove(field.name);
                  removeDelivery(field.name);
                }}
              />
            </div>
            <Autocomplete
              loading={loading}
              autoFocus={true}
              size="small"
              disableClearable
              getOptionLabel={(option) => option.custname}
              options={dataSourceNew}
              onChange={(e, value) =>
                onChange(e, {
                  name: field.name,
                  value: value.customerid,
                  parent: "company",
                  coordinate: value.coordinate,
                  label: value.custname,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name Customer"
                  margin="normal"
                  variant="outlined"
                  size="small"
                  InputProps={{ ...params.InputProps, type: "search" }}
                />
              )}
            />
            <Autocomplete
              autoFocus={true}
              size="small"
              disableClearable
              getOptionLabel={(option) => option.invoiceno}
              options={deliveryNew}
              disabled={alamat1 === undefined && alamat2 === undefined}
              onChange={(e, value) =>
                onChange(e, {
                  name: field.name,
                  value: value.arinvoiceid,
                  invoiceno: value.invoiceno,
                  parent: "arinvoiceid",
                  coordinate: value.coordinate,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nomor Pengiriman"
                  margin="normal"
                  variant="outlined"
                  size="small"
                  disableClearable
                  InputProps={{ ...params.InputProps, type: "search" }}
                />
              )}
              value={dataarinvoiceid ? dataarinvoiceid.value : ""}
              inputValue={dataarinvoiceid ? dataarinvoiceid.invoiceno : ""}
            />
            <RadioGroup
              value={dataaddress ? dataaddress.value : null}
              onChange={(e, value) =>
                onChange(e, {
                  name: field.name,
                  value,
                  parent: "address",
                  coordinate: value === "1" ? coordinate : coordinate2,
                })
              }
            >
              <FormControlLabel
                value={id1}
                control={<Radio />}
                label={alamat1 ? alamat1 : "Alamat 1"}
                disabled={alamat1 ? false : true}
              />
              <FormControlLabel
                value={id2}
                control={<Radio disabled={alamat2 ? false : true} />}
                label={alamat2 ? alamat2 : "Alamat 2"}
                disabled={alamat2 ? false : true}
              />
            </RadioGroup>

            <div className="field-horizontal">
              <FormLabel className="label-field">
                Estimasi Jarak{" "}
                {index == 0
                  ? " dari MitranPack"
                  : ` dari Pengiriman ke-${index}`}
              </FormLabel>
              <Input
                value={estimasi}
                name="estimasiJarak"
                type="number"
                disabled
              />
            </div>
          </div>
        );
      })}
      <div className="footer-btn">
        <Button type="dashed" onClick={add} className="btn add-field">
          <PlusOutlined /> Tambah Tujuan
        </Button>
      </div>
    </Form>
  );
};
class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInsert: true,
      data_customer: [],
      no_delivery: [],
      address: [],
      address2: "Alamat 2",
      loading: false,
      fields: [],
      body: {
        kuririd: "",
        company: [],
        arinvoiceid: [],
        address: [],
        rit: 10,
        typerit: "biasa",
        urgent: "no",
        tgltransaksi: moment().format(FORMAT_DATE),
        memo: "-",
        jarakestimasi: 0,
        estimasi: [],
        poin: 0,
        poins: [],
      },
    };
    this.handleSave = this.handleSave.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChangeModal = this.handleChangeModal.bind(this);
    this.getEstimate = this.getEstimate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.calculateDistance = this.calculateDistance.bind(this);
  }

  handleBlur = (event, args) => {
    event.preventDefault();
    const { value, name } = args;
    const { data_customer, body, address } = this.state;

    let arinvoiceidDipilih = body.arinvoiceid.map((x) => x.value);
    const delivery = data_customer
      .filter((data) => data.custname === value)
      .filter((x) => !arinvoiceidDipilih.includes(x.arinvoiceid));

    let updated = {};

    if (delivery.length > 0) {
      updated = {
        name,
        address: {
          id: 1,
          address: delivery[0].address ? delivery[0].address : null,
          coordinate: delivery[0].coordinate ? delivery[0].coordinate : null,
        },
        address2: {
          id: 2,
          address: delivery[0].address2 ? delivery[0].address2 : null,
          coordinate: delivery[0].coordinate2 ? delivery[0].coordinate2 : null,
        },
      };
    }

    let addressData = address;
    let index = addressData.findIndex((x) => x.name === name);

    if (index === -1) {
      addressData = [...addressData, updated];
    } else {
      addressData[index] = updated;
    }

    let arinvoiceid = this.state.body.arinvoiceid.filter(
      (x) => x.name !== name
    );

    this.setState({
      no_delivery: delivery,
      address: addressData,
      body: {
        ...this.state.body,
        arinvoiceid,
      },
    });
  };

  getEstimate = async (point, name) => {
    let allData = this.state.body["estimasi"].filter((x) => x.name !== name);
    let allPoins = this.state.body["poins"].filter((x) => x.name !== name);
    // let address = this.state.body.address.filter((x) => x.name == name);

    let address = this.state.body.address;

    let addressIndex = this.state.body.address.findIndex((x) => x.name == name);

    let asal = COORDINATE_MP_ARR2.join();
    if (addressIndex > 0) {
      const coor = address[addressIndex - 1].coordinate.split(",");
      asal = [coor[1], coor[0]].join();
    }

    await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${asal}%3B${point.join()}?alternatives=true&geometries=geojson&steps=true&access_token=${MAPTOKEN}`
    )
      .then((res) => res.json())
      .then((json) => {
        let est = (json.routes[0].distance / 1000).toFixed(1);
        let arrEstimasi = [...allData, { name, value: est }];

        let poin = (getDistance(point[1], point[0]) + 2.32).toFixed(1) / 1;
        let arrPoins = [...allPoins, { name, value: poin }];

        address[addressIndex].estimasi = est;
        this.setState({
          body: {
            ...this.state.body,
            jarakestimasi: Math.max(...arrEstimasi.map((x) => x.value)),
            estimasi: arrEstimasi,
            poin: Math.max(...arrPoins.map((x) => x.value)),
            poins: arrPoins,
            address,
          },
        });
      });
  };

  handleChange = (event, args) => {
    event.preventDefault();
    const { name, value, parent, coordinate, label, invoiceno } = args;
    let updated = {
      name,
      value,
      coordinate,
      invoiceno,
    };
    let allData = this.state.body[parent];
    let prevData = search("name", name, allData);
    let a_index = prevData !== undefined ? prevData.urut : -1;

    if (a_index === -1) {
      allData = [...allData, updated];
    } else {
      allData[a_index] = updated;
    }

    let updateTambahan = {};
    if (parent === "company") {
      let allDataAddress = this.state.body.address.filter(
        (x) => x.name !== name
      );
      let allDataArinvoiceid = this.state.body["arinvoiceid"].filter(
        (x) => x.name !== name
      );

      updateTambahan = {
        address: allDataAddress,
        arinvoiceid: allDataArinvoiceid,
      };
    }

    this.setState(
      {
        body: {
          ...this.state.body,
          [parent]: allData,
          ...updateTambahan,
        },
      },
      () => {
        if (parent === "company") {
          this.handleBlur(event, {
            name,
            value: label,
          });
        }

        if (parent === "address") {
          let coorArray = coordinate.split(",");
          this.getEstimate([coorArray[1], coorArray[0]], name);
        }
      }
    );
  };

  componentDidUpdate(prevProps) {
    const { visible, dataSource, body } = this.props;
    if (prevProps.visible !== visible && visible) {
      this.getDataCustomer();
      this.setState({
        fields: [],
        body: {
          ...this.state.body,
          kuririd: body.courierid,
          rit: body.rit,
          typerit: "biasa",
          urgent: "no",
          company: [],
          arinvoiceid: [],
          address: [],
          memo: "-",
          jarakestimasi: 0,
          estimasi: [],
          poin: 0,
          poins: [],
          disabled: true,
        },
      });
    }
  }

  getTokenChecker() {
    let getData = getTokenChecker();
    getData
      .then((response) => {
        let token = response.data;
        let body = {
          to: "/topics/checker",
          collapse_key: "type_a",
          notification: {
            body: "Pengiriman Baru",
            title: "Mitran Pack",
            click_action: "MAIN_ACTIVITY",
          },
          data: {
            body: "Pengiriman Baru",
            title: "Mitran Pack",
          },
        };
        let pushNotif = sendNotif(body);
        pushNotif
          .then((response) => {
            console.log("Berhasil notif checker");
            // SuccessMessage("sukses");
          })
          .catch((error) => {
            console.log("Berhasil notif checker");
            // ErrorMessage("gagal");
          });
      })
      .catch((error) => ErrorMessage(error));
  }

  getDataCustomer() {
    const { startDate } = this.props;
    this.setState({
      loading: true,
    });
    let getData = getPengiriman(startDate);
    getData
      .then((response) => {
        this.setState({ data_customer: response.data });
      })
      .catch((error) => {
        ErrorMessage(error);
      })
      .finally(() => this.setState({ loading: false }));
  }

  remove = (e) => {
    let { arinvoiceid, company, address, estimasi, poins } = this.state.body;
    let inv = arinvoiceid.filter((obj) => obj.name !== e);
    let com = company.filter((obj) => obj.name !== e);
    let add = address.filter((obj) => obj.name !== e);

    let est = estimasi.filter((obj) => obj.name !== e);

    let poin = poins.filter((obj) => obj.name !== e);

    this.setState(
      {
        body: {
          ...this.state.body,
          arinvoiceid: inv,
          company: com,
          address: add,
          estimasi: est,
          jarakestimasi: est[0] !== undefined ? est[0].value : 0,
          poins: poin,
          poin: poin[0] !== undefined ? poin[0].value : 0,
        },
      },
      () => {
        add.forEach((x) => {
          let coorArray = x.coordinate.split(",");
          this.getEstimate([coorArray[1], coorArray[0]], x.name);
        });
      }
    );
  };

  calculateDistance = (e) => {
    let { address } = this.state.body;

    address.forEach((x) => {
      let coorArray = x.coordinate.split(",");
      this.getEstimate([coorArray[1], coorArray[0]], x.name);
    });
  };

  handleSave = (e) => {
    e.preventDefault();
    let { body } = this.state;

    if (body.arinvoiceid.length === 0) {
      ErrorMessage({ status: 409, message: "No. Pengiriman Kosong" });
      return;
    }

    if (body.address.length === 0) {
      ErrorMessage({ status: 409, message: "Alamat Kosong" });
      return;
    }

    let arinvoiceid = body.arinvoiceid.map((x) => x.value);

    let address = body.address.map((x) => x.value);

    if (arinvoiceid.length === 0) {
      ErrorMessage({ status: 409, message: "No. Pengiriman Kosong" });
      return;
    }

    if (address.length !== arinvoiceid.length) {
      ErrorMessage({ status: 409, message: "Alamat tidak sesuai" });
      return;
    }

    const jarakchain = body.estimasi.map((x) => x.value);

    body = {
      ...body,
      arinvoiceid,
      address,
      jarakchain,
    };

    let getData =
      this.state.isInsert === true
        ? create(tableName, body)
        : update(tableName, body);
    getData
      .then((response) => {
        arinvoiceid.map((x, index) => {
          let poin = body.poins[index];
          let bodyReq = { arinvoiceid: x, jarak: poin.value };
          let xx = updateJarak(bodyReq);
          xx.then((ress) => {
            console.log(ress);
          }).catch((e) => {
            console.log(e);
          });
        });
        SuccessMessage(response.status);
        this.props.getData();
        this.props.onCancel();
      })
      .then(() => this.getTokenChecker())
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  clearState = () => {
    this.setState({
      no_delivery: [],
      address: "Alamat 1",
      address2: "Alamat 2",
    });
  };

  addField = (e) => {
    e.preventDefault();
    const { fields } = this.state;
    let idUnique = new Date().getMilliseconds();
    let addFields = {
      name: idUnique,
      key: idUnique,
    };
    this.setState({
      fields: [...this.state.fields, addFields],
    });
  };

  removeField = (index) => {
    const { fields } = this.state;
    const findIndex = fields.findIndex((x) => x.name === index);
    fields.splice(findIndex, 1);
    this.setState(
      {
        fields,
      },
      () => {
        this.remove(index);
      }
    );
  };

  handleChangeModal = (e) => {
    let { name, value } = e.target;
    this.setState({
      body: {
        ...this.state.body,
        [name]: value,
      },
    });
  };

  render() {
    let { onCancel, body, visible } = this.props;
    const { data_customer, no_delivery, address, address2 } = this.state;
    return (
      <Modal
        title="Delivery"
        onCancel={onCancel}
        onOk={this.handleSave}
        visible={visible}
        destroyOnClose
        footer={[
          <Button key="back" onClick={onCancel}>
            Kembali
          </Button>,
          <Button
            color="danger"
            variant="solid"
            onClick={this.calculateDistance}
          >
            Kalkulasi Jarak
          </Button>,

          <Button key="submit" type="primary" onClick={this.handleSave}>
            Simpan
          </Button>,
        ]}
      >
        <DynamicFieldSet
          fields={this.state.fields}
          handleChangeModal={this.handleChangeModal}
          onChange={this.handleChange}
          body={body}
          bodyModal={this.state.body}
          dataSource={data_customer}
          delivery={no_delivery}
          handleBlur={this.handleBlur}
          loading={this.state.loading}
          removeDelivery={this.remove}
          clearState={this.clearState}
          add={this.addField}
          remove={this.removeField}
          address={address}
        />
      </Modal>
    );
  }
}
export default index;
