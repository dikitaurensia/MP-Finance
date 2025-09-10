// import { notification } from "antd";
import notification from "antd/lib/notification";
import moment from "moment";
import { FORMAT_DATE } from "../helper/constanta";

export function ErrorMessage(error) {
  if (error.status === 409 || error.status === 404) {
    notification.warning({
      message: "Mitran Pack",
      description: error.message,
    });
  } else {
    notification.error({
      message: "Mitran Pack",
      description: error.message,
    });
  }
}

export function SuccessMessage(tipe = null) {
  if (tipe !== null) {
    notification.success({
      message: "Mitran Pack",
      description: `Successfully ${tipe}`,
    });
  } else {
    notification.success({
      message: "Mitran Pack",
      description: "Successfully",
    });
  }
}

export function search(nameKey, valueKey, myArray) {
  for (let i = 0; i < myArray.length; i++) {
    if (myArray[i][nameKey] === valueKey) {
      return { ...myArray[i], urut: i };
    }
  }
}

export function makeid(length = 5) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getCoor(value, tipe) {
  let coor = value.split(",");
  if (tipe === "lat") {
    return Number(coor[0]);
  }
  return Number(coor[1]);
}

export function formatCurrency(value, format = null) {
  if (isNaN(value)) {
    return "";
  }
  let style = "decimal";
  let currency = "IDR";
  if (format !== null) {
    style = format.style;
    currency = format.currency;
  }
  return new Intl.NumberFormat("en-US", {
    style,
    currency,
  }).format(value);
}

export function getUmur(tglLahir) {
  const today = moment();
  const birthDate = moment(tglLahir, FORMAT_DATE);
  let tYear = moment().year();
  let bYear = moment(tglLahir, FORMAT_DATE).year();
  let tMonth = moment().month();
  let bMonth = moment(tglLahir, FORMAT_DATE).month();
  let age = tYear - bYear;
  let m = tMonth - bMonth;
  if (m < 0 || (m === 0 && today) < birthDate) {
    age--;
  }
  return age;
}

export function sumPerforma(obj) {
  let objx = obj
  delete objx.Nama
  delete objx.ID
  delete objx.Kode
  // return Object.keys(objx).reduce((sum, key) => sum + (objx[key] !== "" ? parseInt(objx[key] | 0) : 0), 0);
  return Object.keys(objx).reduce((sum, key) => sum + (parseInt(objx[key]) || 0), 0);
}

export function sumRit(obj) {
  let objx = obj
  delete objx.Nama
  delete objx.ID
  delete objx.Kode
  return Object.keys(objx).reduce((sum, key) => sum + (objx[key] !== "" ? 1 : 0), 0);
}

export function jmlKerja(obj) {
  let objx = obj
  delete objx.Nama
  delete objx.ID
  delete objx.Kode
  return Object.keys(objx).reduce((sum, key) => sum + (objx[key] !== '0' ? 1 : 0), 0);
}

export function jmlHariKerja(obj) {
  let objx = obj
  delete objx.Nama
  delete objx.ID
  delete objx.Kode
  return Object.keys(objx).length
}

export function jmlMasukTelat(obj, type) {
  let objx = obj
  delete objx.Nama
  delete objx.ID
  delete objx.Kode
  return Object.keys(objx).reduce((sum, key) => sum + ((objx[key]).includes(type) ? 1 : 0), 0);
}

export function getBonusPerforma(value) {
  if (value === "") return 0
  if (value === 100) {
    return 250000
  }
  if (value >= 96 && value < 100) {
    return 200000
  }
  if (value >= 85 && value < 96) {
    return 150000
  }
  if (value >= 76 && value < 85) {
    return 100000
  }
  if (value >= 60 && value < 76) {
    return 80000
  }
  return 0
}

export function getBonusPerformaSupir(value) {
  if (value === "") return 0
  if (value >= 165) {
    return 200000
  }
  if (value >= 155 && value < 165) {
    return 100000
  }
  if (value >= 145 && value < 155) {
    return 50000
  }
  return 0
}


export function getDistance(lat2, lon2) {

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.


  let lon1 = 106.827043 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  let lat1 = -6.131488 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  // let a = Math.sin(dlat / 2) ** 2
  //   + Math.cos(lat1) * Math.cos(lat2)
  //   * Math.sin(dlon / 2) ** 2;

  let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(lat1) * Math.cos(lat2)
    * Math.pow(Math.sin(dlon / 2), 2);


  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return (c * r);
}

export function getJudulTgl(tgl1, tgl2) {
  if (tgl1 === tgl2) {
    return tgl1
  }
  return `${tgl1} _ ${tgl2}`
}
