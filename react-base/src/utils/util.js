// @flow

//
export function statPrint(number, type) {
  switch (type) {
    case "dollar" :
      return statPrintDollars(number);
    case "short" :
      return statPrintShortNumber(number);
    case "percent" :
      return statPrintPercent(number);
    default :
      console.log("Type of formatting not recognized. Try again.");
      break;
  }
}

function statPrintDollars(number) {
  let ret = "";
  let num = number;
  const suffix = ['', 'k', 'm', 'b', 't'];
  let index = 0;

  if (num < 0) {
    ret += "-";
    num *= -1;
  }

  ret += "$";

  while (num > 1000) {
    num /= 1000;
    index += 1;
  }

  ret += num.toFixed(1) + suffix[index];

  return ret;
}

function statPrintShortNumber(number) {
  let ret = "";
  let num = number;
  const suffix = ['', 'k', 'm', 'b', 't'];
  let index = 0;

  if (num < 0) {
    ret += "-";
    num *= -1;
  }

  while (num > 1000) {
    num /= 1000;
    index += 1;
  }

  ret += num.toFixed(1) + suffix[index];

  return ret;
}

function statPrintPercent(number) {
  let num = number;

  num *= 100;

  return `${num.toFixed(1)}%`;
}

export function prettyPrintDollars(number) {
  return number;
}

export function dateFormat(date) {
  const theDate = new Date(date);
  return `${theDate.getMonth() + 1}/${theDate.getDate()}/${theDate.getFullYear()}`;
}

export function sortByKey(array, key) {
  return array.sort((a, b) => {
      const x = a[key];
      const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

export const possibleSources = [
  "Personal Email",
  "Phone Call",
  "Personal Mail",
  "F2F Meeting",
  "Direct Mail Opened",
  "Direct Mail Received",
  "Direct Mail A Opened",
  "Direct Mail A Received",
  "Email Clicked",
  "Email Opened",
  "Email Received",
  "Organic Search",
  "Direct Visit",
  "Referral Visit",
  "Paid Search",
  "Social Media",
  "Display Ads",
  "Radiothon",
  "print ad",
  "signage",
  "tv ad",
  "event"
];

export const weights = {
  "Personal Email": .9,
  "Phone Call": 1,
  "Personal Mail": 1,
  "F2F Meeting": 1,
  "Direct Mail Opened": 0,
  "Direct Mail Received": 0,
  "Direct Mail A Opened": 0,
  "Direct Mail A Received": 0,
  "Email Clicked": 0.7,
  "Email Opened": 0.7,
  "Email Received": 0.7,
  "Organic Search": 0,
  "Direct Visit": 0,
  "Referral Visit": 0,
  "Paid Search": 0,
  "Social Media": 1,
  "Display Ads": 1,
  "Radiothon": 1,
  "print ad": 0,
  "signage": 0,
  "tv ad": 0,
  "event": 1
};

export function normalizeValue(value, max, min = 0, nMax = 1, nMin = -1) {
    let mRange = max - min;
    let mValue = value - min;
    let nRange = nMax - nMin;
    let nValue = mValue / mRange * nRange;
    nValue += nMin;
    return nValue;
}
