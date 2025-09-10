import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { connect } from "react-redux";
import "al-styles/portfolio.scss";
import "al-styles/base-portfolio.scss";
import "al-styles/bootstrap.min.scss";
import Man from "al-styles/img/man.png";
import ModalUploads from "../../components/Modal/Uploads";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Select, Popconfirm, Checkbox, DatePicker } from "antd";
import { MODE_LOGIN } from "../../helper/constanta";
import "antd/dist/antd.css";
import {
  faPhone,
  faBirthdayCake,
  faMapMarked,
  faPray,
  faIdCard,
  faUsers,
  faHome,
  faUser,
  faChild,
  faHandHoldingHeart,
  faAnchor,
  faSchool,
  faAlignJustify,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import {
  ErrorMessage,
  formatCurrency,
  getUmur,
  SuccessMessage,
} from "../../helper/publicFunction";
import {
  getLamaranById,
  getLamaranPengalamanById,
  update,
  create,
  deleted,
  changeImageLamaran,
  deleteImageLamaran,
} from "../../service/endPoint";
import { FORMAT_DATE, WEB_ROOT } from "../../helper/constanta";
import Viewer from "react-viewer";
import Currency from "../../helper/currency";
import ImgKosong from "../../assets/img/ic_image.png";
import src from "react-map-gl";

export const index = (props) => {
  const [posisi, setPosisi] = useState([
    "Kurir",
    "Supir",
    "Kernet",
    "Staff Gudang",
    "Admin Finance",
    "Admin Accounting",
    "Admin Marketing",
    "Admin Gudang",
    "Supervisor",
    "Manager",
  ]);

  const listAgama = [
    "Islam",
    "Kristen Protestan",
    "Katolik",
    "Buddha",
    "Hindu",
  ];

  const listStatus = ["Lajang", "Menikah", "Janda/Duda"];

  const [optStatus, setOptStatus] = useState(["Baru", "Diterima", "Ditolak"]);

  const tableName = "lamaran";
  const tableNamePengalaman = "lamaran_pengalaman";

  const [modal, setModal] = useState({
    images: false,
    upload: false,
    index: 0,
  });

  const [data, setData] = useState({
    idlamaran: "",
    tgllamaran: "",
    posisilamaran: "",
    fotoselfi: "",
    namadepan: "",
    namabelakang: "",
    tempatlahir: "",
    tgllahir: "",
    notelp: "",
    alamatktp: "",
    keluarahanktp: "",
    kecamatanktp: "",
    kotaktp: "",
    alamatdomisili: "",
    kelurahandomisili: "",
    kecamatandomisili: "",
    kotadomisili: "",
    agama: "",
    ktp: "",
    sima: "",
    simaberlaku: "",
    simb: "",
    simbberlaku: "",
    simc: "",
    simcberlaku: "",
    simlain: "",
    simlainberlaku: "",
    npwm: "",
    statuspernikahan: "",
    namapasangan: "",
    jmlanak: "",
    namadarurat: "",
    statusdarurat: "",
    notelpdarurat: "",
    ayah: "",
    ibu: "",
    saudara1: "",
    saudara2: "",
    saudara3: "",
    pendidikanterakhir: "",
    tempatpendidikan: "",
    nilaipendidikan: "",
    inggrisbaca: "",
    inggrisbicara: "",
    mandarinbaca: "",
    mandarinbicara: "",
    jenispekerjaanterakhir: "",
    jobdeskterakhir: "",
    temanbekerja: "",
    pernahlamar: "",
    parttime: "",
    referensikerja: "",
    citacita: "",
    minimalgaji: "",
    suratlamaran: "",
    fotoktp: "",
    fotosim: "",
    ijazah: "",
    skck: "",
    statuslamaran: "",
    tdkpunyasim: "",
    tandatangan: "",
    catatan: "",
    kontribusi: "",
    showInput: false,
    tglmasuk: "0000-00-00",
    umur: 0,
  });

  const berkas = [
    "fotoselfi",
    "tandatangan",
    "suratlamaran",
    "fotoktp",
    "fotosim",
    "ijazah",
    "skck",
    "kartukeluarga",
    "sertifikat",
    "keterangankerja",
  ];
  // const sim = ["sima", "simb", "simc", "simlain"];

  const [dataPengalaman, setPengalaman] = useState({ index: 0, data: [] });

  let mode = localStorage.getItem(MODE_LOGIN);

  const getData = (id) => {
    let getDataX = [getLamaranById(id), getLamaranPengalamanById(id)];

    Promise.all(getDataX)
      .then((values) => {
        setData({
          ...values[0].data,
          umur: getUmur(values[0].data.tgllahir),
          posisilamaran: values[0].data.posisilamaran.split(","),
          showInput:
            values[0].data.simlain !== "SIM Lain" &&
            values[0].data.simlain !== "",
        });
        if (values[1].data.length === 0) {
          setPengalaman({
            index: 0,
            data: [
              {
                idpengalaman: "",
                idlamaran: props.match.params.id_employer,
                namaperusahaan: "",
                periodekerja: "",
                alamatperusahaan: "",
                namaatasan: "",
                notelp: "",
                jabatanawal: "",
                jabatanakhir: "",
                alasanberhenti: "",
                gajiterakhir: "",
              },
            ],
          });
        } else {
          setPengalaman({
            index: 0,
            data: values[1].data,
          });
        }
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  useEffect(() => {
    getData(props.match.params.id_employer);
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePengalaman = (e, index) => {
    let { name, value } = e.target;
    let xx = dataPengalaman.data;
    xx[index] = { ...xx[index], [name]: value };
    setPengalaman({ index, data: xx });
  };

  const deleteExp = (indexX) => {
    let xx = [];
    dataPengalaman.data.map((x, index) => {
      if (indexX !== index) {
        xx.push(x);
      }
    });

    setPengalaman({ index, data: xx });
  };

  const addExp = () => {
    let xx = dataPengalaman.data;
    xx.push({
      idpengalaman: "",
      idlamaran: props.match.params.id_employer,
      namaperusahaan: "",
      periodekerja: "",
      alamatperusahaan: "",
      namaatasan: "",
      notelp: "",
      jabatanawal: "",
      jabatanakhir: "",
      alasanberhenti: "",
      gajiterakhir: "",
    });
    setPengalaman({ index, data: xx });
  };

  const showCloseModal = (e) => {
    setModal((prevState) => ({
      ...prevState,
      [e.modal]: !modal[e.modal],
      src: e.src,
      alt: e.alt,
      canDelete: e.canDelete,
    }));
  };

  const handleOK = (file, fieldname) => {
    let update = changeImageLamaran(
      file,
      fieldname,
      props.match.params.id_employer
    );
    update
      .then((ress) => {
        getData(props.match.params.id_employer);
        showCloseModal({ modal: "upload", alt: "", src: "" });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  const deleteImage = (src, fieldname) => {
    let update = deleteImageLamaran({
      namaField: fieldname,
      valueField: src,
      idlamaran: props.match.params.id_employer,
    });
    update
      .then((ress) => {
        getData(props.match.params.id_employer);
        showCloseModal({ modal: "upload", alt: "", src: "" });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  const handleSave = () => {
    const pengalaman = dataPengalaman.data.filter((obj) => obj.namaperusahaan !== "");

    let deletePengalaman = deleted(
      tableNamePengalaman,
      props.match.params.id_employer
    );
    deletePengalaman
      .then(() => {
        let save = [
          update(tableName, {
            ...data,
            posisilamaran: data.posisilamaran.toString(),
          }),
        ];
        if (pengalaman.length > 0) {
          save.push(create(tableNamePengalaman, pengalaman));
        }
        Promise.all(save)
          .then((response) => {
            SuccessMessage(response[0].status);
            getData(props.match.params.id_employer);
          })
          .catch((error) => {
            ErrorMessage(error);
          });
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  return (
    <div id="portfolio">
      <div className="container profile-box">
        <div className="row">
          <div className="col-md-4 left-co">
            <div className="left-side">
              <div className="profile-info">
                <img src={`${WEB_ROOT}${data.fotoselfi}`} alt="fotoselfi" />
              </div>
              <h4 className="ltitle">Kontak Personal</h4>
              <div className="contact-box pb0">
                <div className="icon">
                  <FontAwesomeIcon icon={faBirthdayCake} />
                </div>
                <div className=" detail pad-4 grid half">
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.tempatlahir}
                    name="tempatlahir"
                    onChange={handleChange}
                  />
                  <DatePicker
                    disabled={mode !== "manager"}
                    size="small"
                    showToday
                    value={moment(data.tgllahir, FORMAT_DATE)}
                    format={FORMAT_DATE}
                    onChange={(date, dateString) =>
                      handleChange({
                        target: { name: "tgllahir", value: dateString },
                      })
                    }
                  />
                </div>
              </div>
              <div className="contact-box pb0">
                <div className="icon">
                  <FontAwesomeIcon icon={faMapMarked} />
                </div>
                <div className="detail full-width">
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.alamatktp}
                    name="alamatktp"
                    onChange={handleChange}
                  />
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.keluarahanktp}
                    name="keluarahanktp"
                    onChange={handleChange}
                  />
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.kecamatanktp}
                    name="kecamatanktp"
                    onChange={handleChange}
                  />
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.kotaktp}
                    name="kotaktp"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="contact-box pb0">
                <div className="icon">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                <div className="detail full-width">
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.ktp}
                    name="ktp"
                    onChange={handleChange}
                    minLength={16}
                    maxLength={16}
                    type="number"
                  />
                </div>
              </div>
              <div className="contact-box pb0">
                <div className="icon">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="detail full-width">
                  <Input
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.notelp}
                    name="notelp"
                    onChange={handleChange}
                    type="number"
                    maxLength={13}
                  />
                </div>
              </div>
              <div className="contact-box pb0">
                <div className="icon">
                  <FontAwesomeIcon icon={faPray} />
                </div>
                <div className="detail full-width">
                  <Select
                    value={data.agama}
                    name="agama"
                    onChange={(e) =>
                      handleChange({
                        target: { name: "agama", value: e },
                      })
                    }
                    disabled={mode !== "manager"}
                    style={{ width: "100%", marginLeft: "2px" }}
                    size="small"
                  >
                    {listAgama.map((Item) => (
                      <Select.Option value={Item} key={Item}>
                        {Item}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              <h4 className="ltitle">Informasi Lainnya</h4>
              <div className="detail pad-4">
                <Checkbox
                  name="tdkpunyasim"
                  checked={data.tdkpunyasim === 'true'}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked,
                      },
                    })
                  }
                  disabled={mode !== "manager"}
                >
                  Tidak Punya SIM
                </Checkbox>
              </div>
              <div style={{ display: data.tdkpunyasim === 'true' ? "none" : "block" }}>
                <div className="detail pad-4 grid half">
                  <Checkbox
                    name="sima"
                    checked={data.sima === "SIM A"}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked === true ? "SIM A" : "",
                        },
                      })
                    }
                    disabled={mode !== "manager"}
                  >
                    SIM A
                  </Checkbox>
                  <DatePicker
                    size="small"
                    disabled={data.sima !== "SIM A"}
                    showToday
                    value={
                      data.simaberlaku !== "0000-00-00"
                        ? moment(data.simaberlaku, FORMAT_DATE)
                        : null
                    }
                    format={FORMAT_DATE}
                    onChange={(date, dateString) =>
                      handleChange({
                        target: { name: "simaberlaku", value: dateString },
                      })
                    }
                  />
                </div>

                <div className=" detail pad-4 grid half">
                  <Checkbox
                    name="simb"
                    checked={data.simb === "SIM B"}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked === true ? "SIM B" : "",
                        },
                      })
                    }
                    disabled={mode !== "manager"}
                  >
                    SIM B
                  </Checkbox>
                  <DatePicker
                    size="small"
                    disabled={data.simb !== "SIM B"}
                    showToday
                    value={
                      data.simbberlaku !== "0000-00-00"
                        ? moment(data.simbberlaku, FORMAT_DATE)
                        : null
                    }
                    format={FORMAT_DATE}
                    onChange={(date, dateString) =>
                      handleChange({
                        target: { name: "simbberlaku", value: dateString },
                      })
                    }
                  />
                </div>

                <div className="detail pad-4 grid half">
                  <Checkbox
                    name="simc"
                    checked={data.simc === "SIM C"}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked === true ? "SIM C" : "",
                        },
                      })
                    }
                    disabled={mode !== "manager"}
                  >
                    SIM C
                  </Checkbox>
                  <DatePicker
                    size="small"
                    disabled={data.simc !== "SIM C"}
                    showToday
                    value={
                      data.simcberlaku !== "0000-00-00"
                        ? moment(data.simcberlaku, FORMAT_DATE)
                        : null
                    }
                    format={FORMAT_DATE}
                    onChange={(date, dateString) =>
                      handleChange({
                        target: { name: "simcberlaku", value: dateString },
                      })
                    }
                  />
                </div>

                <div className="detail pad-4 grid half">
                  <Checkbox
                    name="showInput"
                    checked={data.showInput}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked,
                        },
                      })
                    }
                    disabled={mode !== "manager"}
                  >
                    Lainnya
                  </Checkbox>
                  <div className="detail flex gap-4 column">
                    {data.showInput ? (
                      <Input
                        size="small"
                        name="simlain"
                        value={data.simlain}
                        onChange={handleChange}
                        readOnly={mode !== "manager"}
                      />
                    ) : null}
                    <DatePicker
                      size="small"
                      disabled={!data.showInput}
                      showToday
                      value={
                        data.simlainberlaku !== "0000-00-00"
                          ? moment(data.simlainberlaku, FORMAT_DATE)
                          : null
                      }
                      format={FORMAT_DATE}
                      onChange={(date, dateString) =>
                        handleChange({
                          target: { name: "simlainberlaku", value: dateString },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="contact-box pb0">
                <div className="icon">
                  <FontAwesomeIcon icon={faIdCard} />
                </div>
                {/* <div className="detail">{`NPWP: ${data.npwm}`}</div> */}

                <div className="detail full-width">
                  <Input
                    placeholder="No. NPWP"
                    readOnly={mode !== "manager"}
                    size="small"
                    value={data.npwm}
                    name="npwm"
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 rt-div">
            <div className="rit-cover">
              <div className="hotkey">
                {/* <h1 className="">{`${capitalizeFirstLetter(
                  data.namadepan
                )} ${capitalizeFirstLetter(data.namabelakang)}`}</h1> */}

                <div className=" detail pad-4 grid half">
                  <Input
                    readOnly={mode !== "manager"}
                    size="large"
                    value={data.namadepan}
                    name="namadepan"
                    onChange={handleChange}
                  />
                  <Input
                    readOnly={mode !== "manager"}
                    size="large"
                    value={data.namabelakang}
                    name="namabelakang"
                    onChange={handleChange}
                  />
                </div>

                <Select
                  mode="tags"
                  value={data.posisilamaran}
                  name="posisilamaran"
                  onChange={(e) =>
                    handleChange({
                      target: { name: "posisilamaran", value: e },
                    })
                  }
                  style={{ width: "100%" }}
                  disabled={mode !== "manager" && mode !== "supervisor"}
                >
                  {posisi.map((Item) => (
                    <Select.Option value={Item} key={Item}>
                      {Item}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <h2 className="rit-titl">
                <i className="far fa-user" /> Profil
              </h2>
              <div className="emergency-contact">
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faHome} />
                    </div>
                    <div className="detail">Alamat Saat Ini</div>
                  </div>
                  <p>
                    {/* <span>:</span> */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={
                          data.alamatdomisili
                            ? data.alamatdomisili
                            : data.alamatktp
                        }
                        name="alamatdomisili"
                        onChange={handleChange}
                      />
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={
                          data.kelurahandomisili
                            ? data.kelurahandomisili
                            : data.keluarahanktp
                        }
                        name="kelurahandomisili"
                        onChange={handleChange}
                      />
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={
                          data.kecamatandomisili
                            ? data.kecamatandomisili
                            : data.kecamatanktp
                        }
                        name="kecamatandomisili"
                        onChange={handleChange}
                      />
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={
                          data.kotadomisili ? data.kotadomisili : data.kotaktp
                        }
                        name="kotadomisili"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>

                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Umur</div>
                  </div>
                  <p>
                    <span>:</span>
                    {`${data.umur} tahun`}
                  </p>
                </div>

                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Status Pernikahan</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.statuspernikahan} */}
                    <div className="full-width">
                      <Select
                        value={data.statuspernikahan}
                        name="statuspernikahan"
                        onChange={(e) =>
                          handleChange({
                            target: { name: "statuspernikahan", value: e },
                          })
                        }
                        readOnly={mode !== "manager"}
                        style={{ width: "100%" }}
                        size="small"
                      >
                        {listStatus.map((Item) => (
                          <Select.Option value={Item} key={Item}>
                            {Item}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </p>
                </div>

                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Nama Suami/Istri</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.namapasangan} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.namapasangan}
                        name="namapasangan"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>

                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faChild} />
                    </div>
                    <div className="detail">Jumlah anak</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.jmlanak} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.jmlanak}
                        name="jmlanak"
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                  </p>
                </div>
              </div>
              <h2 className="rit-titl">
                <i className="far fa-user" /> Kontak Darurat
              </h2>
              <div className="emergency-contact">
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Nama</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.namadarurat} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.namadarurat}
                        name="namadarurat"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faHandHoldingHeart} />
                    </div>
                    <div className="detail">Hubungan</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.statusdarurat} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.statusdarurat}
                        name="statusdarurat"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className="detail">Nomor HP</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.notelpdarurat} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.notelpdarurat}
                        name="notelpdarurat"
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                  </p>
                </div>
              </div>
              <h2 className="rit-titl">
                <i className="far fa-user" /> Silsilah Keluarga
              </h2>
              <div className="family-tree">
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Nama Ayah</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.ayah} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.ayah}
                        name="ayah"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Nama Ibu</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.ibu} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.ibu}
                        name="ibu"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Saudara 1</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.saudara1} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.saudara1}
                        name="saudara1"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Saudara 2</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.saudara2} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.saudara2}
                        name="saudara2"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="detail">Saudara 3</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.saudara3} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.saudara3}
                        name="saudara3"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
              </div>
              <h2 className="rit-titl">
                <i className="far fa-user" /> Pendidikan
              </h2>
              <div className="family-tree">
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faSchool} />
                    </div>
                    <div className="detail">Pendidikan Terakhir</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.pendidikanterakhir} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.pendidikanterakhir}
                        name="pendidikanterakhir"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faSchool} />
                    </div>
                    <div className="detail">Tempat Pendidikan</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.tempatpendidikan} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.tempatpendidikan}
                        name="tempatpendidikan"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
                <div className="about-box">
                  <div className="contact-box pb0">
                    <div className="icon">
                      <FontAwesomeIcon icon={faSchool} />
                    </div>
                    <div className="detail">Ranking/IP</div>
                  </div>
                  <p>
                    {/* <span>:</span>
                    {data.nilaipendidikan} */}
                    <div className=" full-width">
                      <Input
                        readOnly={mode !== "manager"}
                        size="small"
                        value={data.nilaipendidikan}
                        name="nilaipendidikan"
                        onChange={handleChange}
                      />
                    </div>
                  </p>
                </div>
              </div>
              <h2 className="rit-titl">
                <i className="fas fa-briefcase" /> Bahasa
              </h2>
              <div className="work-exp" style={{ overflowX: "auto" }}>
                <table className="field-input-table mb-5">
                  <thead>
                    <tr className="header-table">
                      <th>Bahasa</th>
                      <th>Membaca</th>
                      <th>Berbicara</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="row-table">
                      <td>Inggris</td>
                      <td class="center">
                        <Checkbox
                          name="inggrisbaca"
                          checked={data.inggrisbaca === "true"}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: e.target.name,
                                value: e.target.checked ? "true" : "false",
                              },
                            })
                          }
                          disabled={mode !== "manager"}
                        />
                      </td>
                      <td class="center">
                        <Checkbox
                          name="inggrisbicara"
                          checked={data.inggrisbicara === "true"}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: e.target.name,
                                value: e.target.checked ? "true" : "false",
                              },
                            })
                          }
                          disabled={mode !== "manager"}
                        />
                      </td>
                    </tr>
                    <tr className="row-table">
                      <td>Mandarin</td>
                      <td class="center">
                        <Checkbox
                          name="mandarinbaca"
                          checked={data.mandarinbaca === "true"}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: e.target.name,
                                value: e.target.checked ? "true" : "false",
                              },
                            })
                          }
                          disabled={mode !== "manager"}
                        />
                      </td>
                      <td class="center">
                        <Checkbox
                          name="mandarinbicara"
                          checked={data.mandarinbicara === "true"}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: e.target.name,
                                value: e.target.checked ? "true" : "false",
                              },
                            })
                          }
                          disabled={mode !== "manager"}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h2 className="rit-titl">
                  <i className="fas fa-briefcase" /> Pengalaman Pekerjaan
                </h2>
                <div className="experience">
                  {dataPengalaman.data.map((x, index) => (
                    <div>
                      <h2 className="rit-titl relative">
                        <i className="fas fa-briefcase" />{" "}
                        {`Pengalaman Kerja ${index + 1}`}
                        {index !== 0 ? (
                          <Popconfirm
                            placement="top"
                            title={`Anda yakin menghapus Pengalaman Kerja ${index +
                              1} ?`}
                            onConfirm={() => deleteExp(index)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              shape="round"
                              className="btn-action absolute right-10 btn-danger"
                              size="small"
                              disabled={mode !== "manager"}
                            >
                              Hapus
                            </Button>
                          </Popconfirm>
                        ) : (
                          <Button
                            shape="round"
                            onClick={addExp}
                            className="btn-action absolute right-10 btn-add"
                            size="small"
                            disabled={mode !== "manager"}
                          >
                            Tambah
                          </Button>
                        )}
                      </h2>
                      <div className="card mb-2">
                        <div className="field-experience">
                          <label>Nama Perusahaan</label>
                          <Input
                            value={x.namaperusahaan}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="namaperusahaan"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Periode Kerja</label>
                          <Input
                            value={x.periodekerja}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="periodekerja"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Alamat Perusahaan</label>
                          <Input
                            value={x.alamatperusahaan}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="alamatperusahaan"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Nama Atasan Langsung</label>
                          <Input
                            value={x.namaatasan}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="namaatasan"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>No Telp Atasan</label>
                          <Input
                            value={x.notelp}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="notelp"
                            type="number"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Jabatan Awal</label>
                          <Input
                            value={x.jabatanawal}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="jabatanawal"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Jabatan Terakhir</label>
                          <Input
                            value={x.jabatanakhir}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="jabatanakhir"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Alasan Berhenti</label>
                          <Input
                            value={x.alasanberhenti}
                            onChange={(e) => handleChangePengalaman(e, index)}
                            name="alasanberhenti"
                            readOnly={mode !== "manager"}
                          />
                        </div>
                        <div className="field-experience">
                          <label>Gaji Terakhir</label>
                          <Currency
                            value={x.gajiterakhir}
                            name="gajiterakhir"
                            onChange={(e) => handleChangePengalaman(e, index)}
                            readOnly={mode !== "manager"}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="rit-titl ">
                  <i className="fas fa-briefcase" /> Pertanyaan Umum
                </h2>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Jelaskan jenis pekerjaan dan job desk yang Anda lakukan di
                    perusahaan terakhir?
                  </h6>
                </div>
                <p>
                  {/* {data.jenispekerjaanterakhir} */}
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.jenispekerjaanterakhir}
                      name="jenispekerjaanterakhir"
                      onChange={handleChange}
                    />
                  </div>
                </p>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Jelaskan jenis pekerjaan dan job desk yang pernah Anda
                    lakukan di perusahaan lainnya?
                  </h6>
                </div>
                {/* <p className="description">{data.jobdeskterakhir}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.jobdeskterakhir}
                      name="jobdeskterakhir"
                      onChange={handleChange}
                    />
                  </div>
                </p>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Apakah ada teman / Saudara yang bekerja di perusahaan ini?
                    Jika ya, sebutkan.
                  </h6>
                </div>
                {/* <p className="description">{data.temanbekerja}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.temanbekerja}
                      name="temanbekerja"
                      onChange={handleChange}
                    />
                  </div>
                </p>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Apakah Anda pernah melamar di perusahaan ini sebelumnya?
                    Jika ya, sebutkan sebagai apa?
                  </h6>
                </div>
                {/* <p className="description">{data.pernahlamar}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.pernahlamar}
                      name="pernahlamar"
                      onChange={handleChange}
                    />
                  </div>
                </p>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Apakah Anda memiliki pekerjaan part time? Jika ya, Sebutkan.
                  </h6>
                </div>
                {/* <p className="description">{data.parttime}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.parttime}
                      name="parttime"
                      onChange={handleChange}
                    />
                  </div>
                </p>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Apakah Anda keberatan jika kami meminta referensi dari
                    perusahaan Anda sebelumnya?
                  </h6>
                </div>
                {/* <p className="description">{data.referensikerja}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.referensikerja}
                      name="referensikerja"
                      onChange={handleChange}
                    />
                  </div>
                </p>
                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Macam pekerjaan atau jabatan apakah yang sesuai dengan
                    cita-cita Anda?
                  </h6>
                </div>
                {/* <p className="description">{data.citacita}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.citacita}
                      name="citacita"
                      onChange={handleChange}
                    />
                  </div>
                </p>

                <div className="contact-box pb0">
                  <div className="icon">
                    <FontAwesomeIcon icon={faBook} />
                  </div>
                  <h6 className="detail">
                    Apa yang akan Anda berikan kepada perusahaan jika Anda
                    diterima di perusahaan ini?
                  </h6>
                </div>
                {/* <p className="description">{data.kontribusi}</p> */}
                <p>
                  <div className=" full-width">
                    <Input.TextArea
                      readOnly={mode !== "manager"}
                      size="small"
                      value={data.kontribusi}
                      name="kontribusi"
                      onChange={handleChange}
                    />
                  </div>
                </p>
              </div>

              <h2 className="rit-titl">
                <i className="fas fa-graduation-cap" /> Berkas
              </h2>
              <div className="education">
                <ul className="wrap-card-file">
                  {berkas.map((x) => {
                    return (
                      <li>
                        <div
                          className="card"
                          onClick={() =>
                            showCloseModal({
                              modal: "upload",
                              src:
                                data[x] !== ""
                                  ? `${WEB_ROOT}${data[x]}`
                                  : ImgKosong,

                              alt: x,
                              canDelete: data[x] !== "" ? true : false,
                            })
                          }
                        >
                          <img
                            src={
                              data[x] !== ""
                                ? `${WEB_ROOT}${data[x]}`
                                : ImgKosong
                            }
                            alt={x}
                            style={{ height: "100%", width: "auto" }}
                          />
                        </div>
                        <span>{x}</span>
                      </li>
                    );
                  })}
                </ul>

                <ModalUploads
                  deleteImage={deleteImage}
                  onOK={handleOK}
                  alt={modal.alt}
                  src={modal.src}
                  canDelete={modal.canDelete}
                  onCancel={() => {
                    showCloseModal({
                      modal: "upload",
                      alt: "",
                      src: "",
                      canDelete: false,
                    });
                  }}
                  visible={modal.upload}
                  mode={mode}
                />
              </div>
              <h2 className="rit-titl">
                <i className="fas fa-graduation-cap" /> Catatan Penilaian oleh
                Reviewer
              </h2>
              <div className="note-applicant">
                <div className="about-box full-width">
                  <div className="detail">Gaji yang Diharapkan:</div>
                  <Currency
                    value={data.minimalgaji}
                    className="full-width description"
                    name="minimalgaji"
                    onChange={handleChange}
                    readOnly={mode !== "manager"}
                  />
                </div>

                <div className="about-box full-width">
                  <div className="detail">Tgl. Masuk Kerja:</div>
                  <DatePicker
                    size="small"
                    showToday
                    value={
                      data.tglmasuk !== "0000-00-00"
                        ? moment(data.tglmasuk, FORMAT_DATE)
                        : null
                    }
                    format={FORMAT_DATE}
                    onChange={(date, dateString) =>
                      handleChange({
                        target: { name: "tglmasuk", value: dateString },
                      })
                    }
                    disabled={mode !== "manager" && mode !== "supervisor"}
                  />
                </div>

                <div className="about-box full-width">
                  <div className="detail">Status Lamaran:</div>
                  <Select
                    value={data.statuslamaran}
                    name="statuslamaran"
                    onChange={(e) =>
                      handleChange({
                        target: { name: "statuslamaran", value: e },
                      })
                    }
                    disabled={mode !== "manager" && mode !== "supervisor"}
                  >
                    {optStatus.map((Item) => (
                      <Select.Option value={Item} key={Item}>
                        {Item}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label>Note</label>
                  <Input.TextArea
                    rows={4}
                    value={data.catatan}
                    name="catatan"
                    onChange={handleChange}
                    className="full-width description"
                    readOnly={mode !== "manager" && mode !== "supervisor"}
                  />
                </div>
              </div>
              <div className="footer-btn">
                <Button
                  disabled={mode !== "manager" && mode !== "supervisor"}
                  type="primary"
                  onClick={handleSave}
                  shape="round"
                  className="padd-right-30 padd-left-30"
                >
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
