import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "al-styles/form-applicant.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendar,
  faMapMarker,
  faPhone,
  faIdCard,
  faHandshake,
  faGraduationCap,
  faTextWidth,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  getLamaranById,
  getLamaranPengalamanById,
} from "../../service/endPoint";
import baseImage from "./ic_image.png";
import { WEB_ROOT } from "../../helper/constanta";
function index(props) {
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
  });

  const berkas = ["suratlamaran", "fotoktp", "fotosim", "ijazah", "skck"];
  const sim = ["sima", "simb", "simc", "simlain"];

  const [dataPengalaman, setPengalaman] = useState([]);

  const getData = (id) => {
    let getData = [getLamaranById(id), getLamaranPengalamanById(id)];

    Promise.all(getData)
      .then((values) => {
        setData(values[0].data);
        setPengalaman(values[1].data);
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

  return (
    <div className="App">
      <div id="form-content">
        <div className="form-title">
          <h1>Job Application Form</h1>
        </div>
        <div className="form-app">
          <form>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">1.</span>
                <label>Foto Terbaru/ Foto Selfie (harus jelas)</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="fotoPreview"
                    className="image-upload"
                    src={
                      data.fotoselfi
                        ? `${WEB_ROOT}${data.fotoselfi}`
                        : baseImage
                    }
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">2.</span>
                <label>Nama Lengkap</label>
              </div>
              <div className="field-input grid gap-20 layout-template-1">
                <div className="input-1">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Nama Depan"
                    className="no-outline"
                    name="namadepan"
                    value={data.namadepan}
                  />
                </div>
                <div className="input-1">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Nama Belakang"
                    className="no-outline"
                    name="namabelakang"
                    value={data.namabelakang}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">3.</span>
                <label>Posisi Lamaran</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Posisi Lamaran"
                    type="text"
                    list="optionlamaran"
                    id="posisilamaran"
                    name="posisilamaran"
                    className="full-width parentbg"
                    value={data.posisilamaran}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">4.</span>
                <label>Tanggal Lahir</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faCalendar} />
                  <input
                    placeholder="Tanggal Lahir"
                    className="no-outline"
                    name="tgllahir"
                    type="text"
                    onfocus="(this.type='date')"
                    value={data.tgllahir}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">5.</span>
                <label>Tempat Lahir</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faMapMarker} />
                  <input
                    placeholder="Tempat Lahir"
                    className="no-outline"
                    name="tempatlahir"
                    value={data.tempatlahir}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">6.</span>
                <label>Nomor WA/Kontak yang dapat dihubungi</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faPhone} />
                  <input
                    placeholder="Nomor yang dapat dihubungi"
                    className="no-outline"
                    name="notelp"
                    type="number"
                    value={data.notelp}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">7.</span>
                <label>Alamat sesuai KTP</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faMapMarker} />
                  <input
                    placeholder="Nama Jalan dan Nomor Rumah"
                    className="no-outline"
                    name="alamatktp"
                    value={data.alamatktp}
                  />
                </div>
              </div>
              <div className="child-field grid layout-template-3 gap-5">
                <div className="field-input flex gap-20">
                  <div className="input-1 full-width-mobile">
                    <FontAwesomeIcon icon={faMapMarker} />
                    <input
                      placeholder="Kelurahan"
                      className="no-outline"
                      name="keluarahanktp"
                      value={data.keluarahanktp}
                    />
                  </div>
                </div>
                <div className="field-input flex gap-20">
                  <div className="input-1 full-width-mobile">
                    <FontAwesomeIcon icon={faMapMarker} />
                    <input
                      placeholder="Kecamatan"
                      className="no-outline"
                      name="kecamatanktp"
                      value={data.kecamatanktp}
                    />
                  </div>
                </div>
                <div className="field-input flex gap-20">
                  <div className="input-1 full-width-mobile">
                    <FontAwesomeIcon icon={faMapMarker} />
                    <input
                      placeholder="Kota"
                      className="no-outline"
                      name="kotaktp"
                      value={data.kotaktp}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">8.</span>
                <label>
                  Alamat Tinggal Sekarang (abaikan jika sama dengan Alamat KTP
                  no.6)
                </label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faMapMarker} />
                  <input
                    placeholder="Nama Jalan dan Nomor Rumah"
                    className="no-outline"
                    name="alamatdomisili"
                    value={data.alamatdomisili}
                  />
                </div>
              </div>
              <div className="child-field grid layout-template-3 gap-5">
                <div className="field-input flex gap-20">
                  <div className="input-1 full-width-mobile">
                    <FontAwesomeIcon icon={faMapMarker} />
                    <input
                      placeholder="Kelurahan"
                      className="no-outline"
                      name="kelurahandomisili"
                      value={data.kelurahandomisili}
                    />
                  </div>
                </div>
                <div className="field-input flex gap-20">
                  <div className="input-1 full-width-mobile">
                    <FontAwesomeIcon icon={faMapMarker} />
                    <input
                      placeholder="Kecamatan"
                      className="no-outline"
                      name="kecamatandomisili"
                      value={data.kecamatandomisili}
                    />
                  </div>
                </div>
                <div className="field-input flex gap-20">
                  <div className="input-1 full-width-mobile">
                    <FontAwesomeIcon icon={faMapMarker} />
                    <input
                      placeholder="Kota"
                      className="no-outline"
                      name="kotadomisili"
                      value={data.kotadomisili}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">9.</span>
                <label>Agama</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Agama"
                    type="text"
                    list="optionagama"
                    id="agama"
                    name="agama"
                    className="full-width parentbg"
                    value={data.agama}
                  />
                </div>
              </div>
              <datalist id="optionagama">
                <option>Islam</option>
                <option>Kristen Protestan</option>
                <option>Katolik</option>
                <option>Buddha</option>
                <option>Hindu</option>
              </datalist>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">10.</span>
                <label>No. KTP</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faIdCard} />
                  <input
                    placeholder="Nomor KTP yang berlaku"
                    className="no-outline"
                    name="ktp"
                    type="number"
                    value={data.ktp}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">11.</span>
                <label>SIM yang dimiliki</label>
              </div>
              <div className="field-input">
                <div className="input-2 mt-5 input-sim">
                  <div>
                    <input
                      className="no-outline"
                      type="checkbox"
                      name="sima"
                      value={data.sima}
                    />
                    <label>SIM A</label>
                  </div>
                  <div className="input-date-sim ml-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <input
                      placeholder="Berlaku SIM"
                      className="no-outline"
                      name="simaberlaku"
                      type="text"
                      onfocus="(this.type='date')"
                      value={data.simaberlaku}
                    />
                  </div>
                </div>
                <div className="input-2 mt-5 input-sim">
                  <div>
                    <input
                      className="no-outline"
                      type="checkbox"
                      name="simb"
                      value={data.simb}
                    />
                    <label>SIM B</label>
                  </div>
                  <div className="input-date-sim ml-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <input
                      placeholder="Berlaku SIM"
                      className="no-outline"
                      name="simbberlaku"
                      type="text"
                      onfocus="(this.type='date')"
                      value={data.simbberlaku}
                    />
                  </div>
                </div>
                <div className="input-2 mt-5 input-sim">
                  <div>
                    <input
                      className="no-outline"
                      type="checkbox"
                      name="simc"
                      value={data.simc}
                    />
                    <label>SIM C</label>
                  </div>
                  <div className="input-date-sim ml-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <input
                      placeholder="Berlaku SIM"
                      className="no-outline"
                      name="simbcerlaku"
                      type="text"
                      onfocus="(this.type='date')"
                      value={data.simbcerlaku}
                    />
                  </div>
                </div>
                <div className="input-2 mt-5 input-sim">
                  <div className="ai-center">
                    <input
                      className="no-outline"
                      type="checkbox"
                      name="simlain"
                      value={data.simlain}
                    />
                    <input placeholder="Other" className="sim-other" />
                  </div>
                  <div className="input-date-sim ml-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <input
                      placeholder="Berlaku SIM"
                      className="no-outline"
                      name="simlainberlaku"
                      type="text"
                      onfocus="(this.type='date')"
                      value={data.simlainberlaku}
                    />
                  </div>
                </div>
                <div className="input-2 mt-5">
                  <div>
                    <input
                      className="no-outline"
                      type="checkbox"
                      name="tdkpunyasim"
                      value={data.tdkpunyasim}
                    />
                    <label>Tidak punya</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">12.</span>
                <label>No. NPWP</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faIdCard} />
                  <input
                    placeholder="Nomor NPWP"
                    className="no-outline"
                    name="npwm"
                    type="number"
                    value={data.npwm}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">13.</span>
                <label>Status Pernikahan</label>
              </div>
              <div className="field-input">
                <div className="input-2 mt-5">
                  <input
                    className="no-outline"
                    type="radio"
                    name="statuspernikahan"
                    value="Lajang"
                    checked
                    value={data.statuspernikahan}
                  />
                  <label>Lajang</label>
                </div>
                <div className="input-2 mt-5">
                  <input
                    className="no-outline"
                    type="radio"
                    name="statuspernikahan"
                    value="Menikah"
                    value={data.statuspernikahan}
                  />
                  <label>Menikah</label>
                </div>
                <div className="input-2 mt-5">
                  <input
                    className="no-outline"
                    type="radio"
                    name="statuspernikahan"
                    value="Janda/Duda"
                    value={data.statuspernikahan}
                  />
                  <label>Janda/Duda</label>
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">14.</span>
                <label>Nama Suami/Istri (Bagi yang sudah menikah)</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Nama"
                    className="no-outline"
                    name="namapasangan"
                    value={data.namapasangan}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">15.</span>
                <label>Jumlah Anak (Bagi yang sudah menikah)</label>
              </div>
              <div className="field-input flex gap-20">
                <div className="input-1 full-width">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Jumlah anak"
                    className="no-outline"
                    name="jmlanak"
                    type="number"
                    value={data.jmlanak}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">16.</span>
                <label>
                  Anggota keluarga yang dapat dihubungi dalam keadaan darurat
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Nama Lengkap"
                    className="no-outline"
                    name="namadarurat"
                    value={data.namadarurat}
                  />
                </div>
                <div className="input-1 mt-5">
                  <FontAwesomeIcon icon={faHandshake} />
                  <input
                    placeholder="Hubungan dengan anda ? Orang tua / Saudara"
                    className="no-outline"
                    name="statusdarurat"
                    value={data.statusdarurat}
                  />
                </div>
                <div className="input-1 mt-5">
                  <FontAwesomeIcon icon={faPhone} />
                  <input
                    placeholder="Nomor HP"
                    className="no-outline"
                    name="notelpdarurat"
                    type="number"
                    value={data.notelpdarurat}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">17.</span>
                <label>Susunan silsilah keluarga</label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Nama Ayah"
                    className="no-outline"
                    name="ayah"
                    value={data.ayah}
                  />
                </div>
                <div className="input-1 mt-5">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Nama Ibu"
                    className="no-outline"
                    name="ibu"
                    value={data.ibu}
                  />
                </div>
                <div className="input-1 mt-5">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Saudara 1"
                    className="no-outline"
                    name="saudara1"
                    value={data.saudara1}
                  />
                </div>
                <div className="input-1 mt-5">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Saudara 2"
                    className="no-outline"
                    name="saudara2"
                    value={data.saudara2}
                  />
                </div>
                <div className="input-1 mt-5">
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    placeholder="Saudara 3"
                    className="no-outline"
                    name="saudara3"
                    value={data.saudara3}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">18.</span>
                <label>Pendidikan terakhir</label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <input
                    placeholder="SD/SMP/SMA/Universitas"
                    className="no-outline"
                    name="pendidikanterakhir"
                    value={data.pendidikanterakhir}
                  />
                </div>
              </div>
              <div className="field-input mt-5">
                <div className="input-1">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <input
                    placeholder="Nama sekolah"
                    className="no-outline"
                    name="tempatpendidikan"
                    value={data.tempatpendidikan}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">19.</span>
                <label>Nilai IP/Ranking terakhir</label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <input
                    placeholder="Contoh: Saya ranking 1 dengan nilai A pada saat SMA"
                    className="no-outline"
                    name="nilaipendidikan"
                    value={data.nilaipendidikan}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">20.</span>
                <label>Bahasa yang anda kuasai</label>
              </div>
              <table className="field-input-table">
                <thead>
                  <tr>
                    <th>Bahasa</th>
                    <th>Membaca</th>
                    <th>Berbicara</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Inggris</td>
                    <td className="center">
                      <input
                        type="checkbox"
                        value="true"
                        name="inggrisbaca"
                        value={data.inggrisbaca}
                      />
                    </td>
                    <td className="center">
                      <input
                        type="checkbox"
                        value="true"
                        name="inggrisbicara"
                        value={data.inggrisbicara}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Mandarin</td>
                    <td className="center">
                      <input
                        type="checkbox"
                        value="true"
                        name="mandarinbaca"
                        value={data.mandarinbaca}
                      />
                    </td>
                    <td className="center">
                      <input
                        type="checkbox"
                        value="true"
                        name="mandarinbicara"
                        value={data.mandarinbicara}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">21.</span>
                <label>
                  Pengalaman Kerja (diisi dari perusahaan yang paling terakhir)
                </label>
              </div>
              <div id="dynamic_field">
                <div className="field-input card">
                  <div className="field-input grid gap-20 layout-template-1">
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Nama Perusahaan"
                        className="no-outline"
                        name="namaperusahaan[]"
                        required
                      />
                    </div>
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Periode Kerja"
                        className="no-outline"
                        name="periodekerja[]"
                        required
                      />
                    </div>
                  </div>
                  <div className="field-input grid gap-20 layout-template-1">
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Alamat Perusahaan"
                        className="no-outline"
                        name="alamatperusahaan[]"
                      />
                    </div>
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="No Telepon Atasan"
                        className="no-outline"
                        name="notelpperusahaan[]"
                      />
                    </div>
                  </div>
                  <div className="field-input grid gap-20 layout-template-1">
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Jabatan Awal"
                        className="no-outline"
                        name="jabatanawal[]"
                      />
                    </div>
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Jabatan Terakhir"
                        className="no-outline"
                        name="jabatanakhir[]"
                      />
                    </div>
                  </div>
                  <div className="field-input grid gap-20 layout-template-1">
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Nama Atasan Langsung"
                        className="no-outline"
                        name="namaatasan[]"
                      />
                    </div>
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Alasan Berhenti"
                        className="no-outline"
                        name="alasanberhenti[]"
                      />
                    </div>
                  </div>
                  <div className="field-input grid gap-20 layout-template-1">
                    <div className="input-1 mt-5">
                      <FontAwesomeIcon icon={faUser} />
                      <input
                        placeholder="Gaji Terakhir"
                        className="no-outline"
                        name="gajiterakhir[]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-table-add">
                <button
                  className="btn-add-experience"
                  id="add"
                  name="add"
                  type="button"
                  name="add"
                >
                  <FontAwesomeIcon icon={faPlus} /> Tambah Pengalaman
                </button>
              </div>
            </div>

            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">22.</span>
                <label>
                  Jelaskan jenis pekerjaan dan job desk yang Anda lakukan di
                  perusahaan terakhir?
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <textarea
                    className="no-outline full-width"
                    id="jenispekerjaanterakhir"
                    name="jenispekerjaanterakhir"
                    rows="4"
                    cols="50"
                    value={data.jenispekerjaanterakhir}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">23.</span>
                <label>
                  Jelaskan jenis pekerjaan dan job desk yang pernah Anda lakukan
                  di perusahaan lainnya?
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <textarea
                    className="no-outline full-width"
                    id="jobdeskterakhir"
                    name="jobdeskterakhir"
                    rows="4"
                    cols="50"
                    value={data.jobdeskterakhir}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">24.</span>
                <label>
                  Apakah ada teman / Saudara yang bekerja di perusahaan ini?
                  Jika ya, sebutkan.
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <input
                    className="no-outline"
                    name="temanbekerja"
                    value={data.temanbekerja}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">25.</span>
                <label>
                  Apakah Anda pernah melamar di perusahaan ini sebelumnya? Jika
                  ya, sebutkan sebagai apa?
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <input
                    className="no-outline"
                    name="pernahlamar"
                    value={data.pernahlamar}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">26.</span>
                <label>
                  Apakah Anda memiliki pekerjaan part time? Jika ya, Sebutkan.
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <input
                    className="no-outline"
                    name="parttime"
                    value={data.parttime}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">27.</span>
                <label>
                  Apakah Anda keberatan jika kami meminta referensi dari
                  perusahaan Anda sebelumnya?
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <input
                    className="no-outline"
                    name="referensikerja"
                    value={data.referensikerja}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">28.</span>
                <label>
                  Macam pekerjaan atau jabatan apakah yang sesuai dengan
                  cita-cita Anda?
                </label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <textarea
                    className="no-outline full-width"
                    id="citacita"
                    name="citacita"
                    rows="4"
                    cols="50"
                    value={data.citacita}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">29.</span>
                <label>Besar minimal Gaji yang diharapkan?</label>
              </div>
              <div className="field-input">
                <div className="input-1">
                  <FontAwesomeIcon icon={faTextWidth} />
                  <input
                    className="no-outline"
                    name="minimalgaji"
                    type="number"
                    value={data.minimalgaji}
                  />
                </div>
              </div>
            </div>
            {/* <div className="flex gap-5 mb-5 label">
              <span className="order">29.</span>
              <label>Foto Terbaru/ Foto Selfie (harus jelas)</label>
            </div>
            <div className="field-input">
              <div className="input-3">
                <img
                  id="fotoPreview"
                  className="image-upload"
                  src={baseImage}
                />
                <input
                  id="uploadFoto"
                  className="no-outline upload-file"
                  type="file"
                  name="fotoselfi"
                  accept="image/*"
                  onchange="change('fotoPreview','uploadFoto');"
                />
                <label
                  for="uploadFoto"
                  className="label-upload-foto btn-add-experience"
                >
                  Pilih Foto
                </label>
              </div>
            </div> */}
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">30.</span>
                <label>Foto Surat Lamaran</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="lamaranPreview"
                    className="image-upload"
                    src={`${WEB_ROOT}${data.suratlamaran}`}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">31.</span>
                <label>Foto KTP</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="ktpPreview"
                    className="image-upload"
                    src={
                      data.uploadKtp
                        ? `${WEB_ROOT}${data.uploadKtp}`
                        : baseImage
                    }
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">32.</span>
                <label>Foto SIM A/B/C (Abaikan jika tidak ada)</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="simPreview"
                    className="image-upload"
                    src={
                      data.fotosim ? `${WEB_ROOT}${data.fotosim}` : baseImage
                    }
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">33.</span>
                <label>Upload Ijazah Terakhir</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="ijazahPreview"
                    className="image-upload"
                    src={data.ijazah ? `${WEB_ROOT}${data.ijazah}` : baseImage}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">34.</span>
                <label>Upload SKCK</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="skckPreview"
                    className="image-upload"
                    src={data.skck ? `${WEB_ROOT}${data.skck}` : baseImage}
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">35.</span>
                <label>Upload Kartu Keluarga</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="kkPreview"
                    className="image-upload"
                    src={
                      data.kartukeluarga
                        ? `${WEB_ROOT}${data.kartukeluarga}`
                        : baseImage
                    }
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">36.</span>
                <label>Upload Sertifikat</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="sertifikatPreview"
                    className="image-upload"
                    src={
                      data.sertifikat
                        ? `${WEB_ROOT}${data.sertifikat}`
                        : baseImage
                    }
                  />
                </div>
              </div>
            </div>
            <div className="field-wrapper">
              <div className="flex gap-5 mb-5 label">
                <span className="order">37.</span>
                <label>Upload Sertifikat</label>
              </div>
              <div className="field-input">
                <div className="input-3">
                  <img
                    id="kerjaPreview"
                    className="image-upload"
                    src={
                      data.keterangankerja
                        ? `${WEB_ROOT}${data.keterangankerja}`
                        : baseImage
                    }
                  />
                </div>
              </div>
            </div>
            <div className="footer-btn-submit">
              <button className="btn-submit" type="submit" name="upload">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

index.propTypes = {};

export default index;
