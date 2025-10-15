import {
  request,
  requestFCM,
  request2,
  requestAccurate,
  requestAccurate2,
} from "./api";
import { API_ROOT } from "../helper/constanta";
import axios from "axios";

export function login(body) {
  return request({
    url: `${API_ROOT}/login_finance`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function get(form, tgl = null, tgl2 = null) {
  return request({
    url:
      tgl === null
        ? `${API_ROOT}/${form}`
        : tgl2 === null
        ? `${API_ROOT}/${form}?tgl=${tgl}`
        : `${API_ROOT}/${form}?tgl=${tgl}&tgl2=${tgl2}`,
    method: "GET",
  });
}

export function getDataCallHistories(form, ids) {
  return request({
    url: `${API_ROOT}/${form}?ids=${ids}`,
    method: "GET",
  });
}

export function copyDataKaryawan(body) {
  return request({
    url: `${API_ROOT}/copykaryawan`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updatePortopolio(form, body) {
  const formData = new FormData();
  formData.append("files", files);
  formData.append("folder", "test2");
  return request({
    url: `${API_ROOT}/${form}`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function createAcountKurir(body) {
  return request({
    url: `${API_ROOT}/createakun`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getExportData(tgl, tgl2) {
  return request({
    url: `${API_ROOT}/exportdata?tgl=${tgl}&tgl2=${tgl2}`,
    method: "GET",
  });
}

export function setDelivery(body) {
  return request({
    url: `${API_ROOT}/updatedelivery`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function setEstimasi(body) {
  return request({
    url: `${API_ROOT}/updateestimasi`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function setUrgent(body) {
  return request({
    url: `${API_ROOT}/updateurgent`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function setcustEstimasi(body) {
  return request({
    url: `${API_ROOT}/setcustestimasi`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function getById(form, id) {
  return request({
    url: `${API_ROOT}/${form}?id=${id}`,
    method: "GET",
  });
}

export function getLamaranById(id) {
  return request({
    url: `${API_ROOT}/lamaran?idlamaran=${id}`,
    method: "GET",
  });
}

export function getLamaranPengalamanById(id) {
  return request({
    url: `${API_ROOT}/lamaran_pengalaman?idlamaran=${id}`,
    method: "GET",
  });
}

export function deleted(form, id, invoiceno) {
  return request({
    url: invoiceno
      ? `${API_ROOT}/${form}?id=${id}&invoiceno=${invoiceno}`
      : `${API_ROOT}/${form}?id=${id}`,
    method: "DELETE",
  });
}

export function deletedAccurate(form, dbname) {
  return request({
    url: `${API_ROOT}/${form}?dbname=${dbname}`,
    method: "DELETE",
  });
}

export function create(form, body) {
  return request({
    url: `${API_ROOT}/${form}`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function update(form, body) {
  return request({
    url: `${API_ROOT}/${form}`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function updateJarak(body) {
  return request({
    url: `${API_ROOT}/update_jarak`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function sendNotif(body) {
  return requestFCM({
    url: "https://fcm.googleapis.com/fcm/send",
    method: "POST",
    body: JSON.stringify(body),
  });
}
export function getMaster(date) {
  return request({
    url: `${API_ROOT}/master?tgl=${date}`,
    method: "GET",
  });
}

export function getPresensi(date) {
  return request({
    url: `${API_ROOT}/presensi?tglabsen=${date}`,
    method: "GET",
  });
}

export function getPengiriman(date) {
  return request({
    url: `${API_ROOT}/doavailable?tgl=${date}`,
    method: "GET",
  });
}

export function getAbsensi(date) {
  return request({
    url: `${API_ROOT}/presensi?tglabsen=${date}`,
    method: "GET",
  });
}

export function getDataTolak(arinvoiceid, invoiceno) {
  return request({
    url: `${API_ROOT}/tolak?arinvoiceid=${arinvoiceid}&invoiceno=${invoiceno}`,
    method: "GET",
  });
}

export function putAbsensi(body) {
  return request({
    url: `${API_ROOT}/absensi`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function getTokenChecker() {
  return request({
    url: `${API_ROOT}/token_checker`,
    method: "GET",
  });
}

export function updatePassword(body) {
  return request({
    url: `${API_ROOT}/password`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function me() {
  return request({
    url: `${API_ROOT}/me`,
    method: "GET",
  });
}

export function reportpengiriman(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/pengiriman?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reportJarak(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/jarak?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reportCallHistory(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/history-call?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reportRecall() {
  return request({
    url: `${API_ROOT}/report/recall`,
    method: "GET",
  });
}
export function reportDebtDrama(body) {
  let { startDate, endDate } = body;

  return request({
    url: `${API_ROOT}/report/debt_drama?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reportpoin(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/poin?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reporttolak(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/tolak?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reportperforma(body) {
  let { startDate, endDate, diterima, pendapatan, tipe } = body;
  return request({
    url: `${API_ROOT}/report/performa?startdate=${startDate}&enddate=${endDate}&diterima=${diterima}&pendapatan=${pendapatan}&tipe=${tipe}`,
    method: "GET",
  });
}

export function reportperformaSupir(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/performa_supir?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function reportpendapatanpotongan(body) {
  let { startDate, endDate, tipe } = body;
  return request({
    url: `${API_ROOT}/report/pendapatanpotongan?startdate=${startDate}&enddate=${endDate}&tipe=${tipe}`,
    method: "GET",
  });
}

export function reportSJGudang(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/gudang?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function changeImageLamaran(file, fieldname, idlamaran) {
  const formData = new FormData();
  formData.append("upfile", file);
  formData.append("fieldname", fieldname);
  formData.append("idlamaran", idlamaran);

  return fetch(`${API_ROOT}/changeimage`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  }).then((response) => {
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    });
  });
}

export function deleteImageLamaran(body) {
  return request({
    url: `${API_ROOT}/deleteimage`,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function reportPresensi(body) {
  let { startDate, endDate } = body;
  return request({
    url: `${API_ROOT}/report/kehadiran?startdate=${startDate}&enddate=${endDate}`,
    method: "GET",
  });
}

export function deletedDelivery(id, invoiceno) {
  return request({
    url: `${API_ROOT}/deletedelivery?arinvoiceid=${id}&invoiceno=${invoiceno}`,
    method: "DELETE",
  });
}

export function getItem() {
  return requestAccurate({
    url: `https://zeus.accurate.id/accurate/api/item/list.do?sp.pageSize=100&sp.page=1`,
    method: "GET",
    token: "9dc1bef0-9653-4fbc-aa97-074cf5a35382",
    session: "02c90103-1773-468a-979a-bae1c9e881b1",
  });
}

export function postData(data) {
  return requestAccurate({
    url: data.api_url,
    method: "POST",
    token: data.token,
    session: data.session,
    body: JSON.stringify(data.body),
  });
}

export function listDBAccurate(bearer) {
  return request({
    url: `${API_ROOT}/accurate-listdb?token=${bearer}`,
    method: "GET",
  });
}

export function openDBAccurate(bearer, db) {
  return request({
    url: `${API_ROOT}/accurate-opendb?token=${bearer}&db=${db}`,
    method: "GET",
  });
}

export function getDataFromAccurate(body) {
  return request({
    url: `${API_ROOT}/accurate-data`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function postDataToAccurate(body) {
  return request({
    url: `${API_ROOT}/accurate-post`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function postDataToAccurate2(body) {
  return request({
    url: `${API_ROOT}/accurate-post2`,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getSOAccurate(payload) {
  const { api_url, token, session } = payload;
  return requestAccurate2({
    url: api_url,
    method: "GET",
    token,
    session,
  });
}

export const makeAccurateRequest = (payload) => {
  const { api_url, token, session, method = "GET" } = payload;

  const headers = new Headers({ "Content-Type": "application/json" });
  // Add authorization and session headers
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("X-Session-ID", `${session}`);

  const options = {
    method,
    headers,
  };

  return fetch(api_url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export const makeAccurateRequest2 = (payload) => {
  const { api_url, token, session, method = "GET" } = payload;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Session-ID": `${session}`,
  };

  const options = {
    method,
    headers,
    url: api_url,
  };

  return axios(options)
    .then((response) => response.data)
    .catch((error) => Promise.reject(error.response.data));
};
