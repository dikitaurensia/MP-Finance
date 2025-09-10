// export const API_ROOT = "http://192.168.1.44/tracking/api";
// export const API_ROOT = "https://api.demo.indotekprimasukses.com/api";
export const API_ROOT = "http://api.mitranpack.com/api";
// export const API_ROOT = "https://api.mitranpack.com/api";

// export const API_ROOT = "http://api-acc.mitranpack.com/api";
export const WEB_ROOT = "http://mitranpack.com/";
export const IMAGE_ROOT = `${API_ROOT}/uploads/`;

export const ACCESS_TOKEN = "accessToken";
export const MODE_LOGIN = "modeLogin";
export const NAME_LOGIN = "nameLogin";
export const SELECT = "SELECT";
export const FORMAT_DATE = "YYYY-MM-DD";
export const ADD_TASK = "ADD_TASK";
export const WHO_OPEN = "WHO_OPEN";
export const BOARD_OPEN = "BOARD_OPEN";
export const DELETE_TASK = "DELETE_TASK";
export const DRAG_AND_DROP = "DRAG_AND_DROP";
export const MAPSTYLE = "mapbox://styles/mapbox/streets-v11";
// export const MAPTOKEN ="pk.eyJ1Ijoid3lzd3lnIiwiYSI6ImNrY2VhM2RxZzA2OXgzN281ZTE2dDMzbXoifQ.ewzsZhJ1P36Vmy0sAM7MTg";
export const MAPTOKEN =
  "pk.eyJ1IjoibWl0cmFucGFjayIsImEiOiJja3J1bWJ2bDUxZGMwMnVxY3JzcTcxdmdzIn0.Vn13zOqi0d8FqXPGLmLr5w";

export const COORDINATE_MP = "-6.131488, 106.827043";
export const COORDINATE_MP_ARR = [-6.131488, 106.827043];
export const COORDINATE_MP_ARR2 = [106.827043, -6.131488];

export const JAKARTA = "-6.21462, 106.84513";
export const TOKEN_FCM =
  "AAAAleLbJfs:APA91bE73pq4sQDhxjNfpl9gH-m1pbfs7zvjk46PP8tHgdKjIQ2CIehcBXkwJiUyIqJAro16iHICmJ9EmrWNdbGcefcooivGkhc2E6xyv8hgm2lE73urve-YpGWPe0yulKg9ZqJcRqJ3";
export const TOKEN_FCM_CHECKER =
  "AAAAleLbJfs:APA91bE73pq4sQDhxjNfpl9gH-m1pbfs7zvjk46PP8tHgdKjIQ2CIehcBXkwJiUyIqJAro16iHICmJ9EmrWNdbGcefcooivGkhc2E6xyv8hgm2lE73urve-YpGWPe0yulKg9ZqJcRqJ3";

export const REGEX_CURRENCY = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/;

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
