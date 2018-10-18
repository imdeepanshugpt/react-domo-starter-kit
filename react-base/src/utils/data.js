import * as d3 from "d3";
import * as stat from "simple-statistics";
//import Papa from 'papaparse';
import * as util from "./util";
import areasWithZipCodes from './zips';
// import * as queue from 'd3-queue';

let donors = [];
let donorIndex = [];

export let donorStats = {
  reactivated: 0,
  lapsed: 0,
  first: 0,
  multi: 0,
  total: 0
};

let gifts = [];
let giftIndex = [];

export let giftStats = {
  countFY17: 0,
  countFY18: 0,
  revenueFY17: 0,
  revenueFY18: 0,
  length: 0
};

let touches = [];

export const possibleTouches = [
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
export const possibleTypes = [
  "First-Time",
  "Multi-Year",
  "Reactivated",
  "Lapsed"
];

const possibleColors = [
  "#5687d1",
  "#7b615c",
  "#de783b",
  "#6ab975",
  "#a173d1",
  "#bbbbbb",
  "#cccf6c",
  "#4C0000",
  "#0C4C07",
  "#61035D",
  "#3493A0",
  "#245604",
  "#560419",
  "#7ba5e4",
  "#df61be",
  "#6165df",
  "#dc8850",
  "#61df88",
  "#976ae1",
  "#e16a9a",
  "#b3e16a",
  "#000000"
];

let donorFilters = {};
let giftFilters = {};
let touchFilters = {};

function reset() {
  donors = [];
  donorIndex = [];

  donorStats = {
    reactivated: 0,
    lapsed: 0,
    first: 0,
    multi: 0,
    total: 0
  };

  gifts = [];
  giftIndex = [];

  giftStats = {
    countFY17: 0,
    countFY18: 0,
    revenueFY17: 0,
    revenueFY18: 0,
    length: 0
  };

  touches = [];
}

export function firstLoad(data) {
  reset();
  data.forEach((data, index) => {
    let gIndex = giftIndex[+data.gift_id];

    // Process the gift data.
    if (gIndex) {
      // Gift already counted.
      gifts[gIndex].touches.push(index);
    } else {
      // New gift we have never seen before.
      giftIndex[+data.gift_id] = gifts.length;
      gIndex = gifts.length;

      gifts.push({
        touches: [index],
        giftDate: Date.parse(data.gift_date),
        giftRevenue: +data.gift_revenue,
        consID: data.ConsID
      });

      if (+data.year === 16) {
        giftStats.countFY17 += 1;
        giftStats.revenueFY17 += +data.gift_revenue;
      } else {
        giftStats.countFY18 += 1;
        giftStats.revenueFY18 += +data.gift_revenue;
      }

      giftStats.length += 1;

      // Process the donor data.
      const dIndex = donorIndex[data.cons_id];

      if (dIndex) {
        // Donor already exists so just add this gift.
        donors[dIndex].gifts.push(gIndex);
        //donors[dIndex].fyGiven.push(gIndex);
      } else {
        // Make a new donor.
        donorIndex[data.cons_id] = donors.length;

        // let donorType = "";
        // const lastGiftFY = +data.last_gift_fy;
        // const lastFullFY = Date.now().getMonth() > 5 ? Date.now().getYear() : Date.now().getYear() - 1;

        // console.log(lastFullFY);

        // if (lastGiftFY === lastFullFY) {
        //   donorType = ""
        // }

        donors.push({
          gifts: [gIndex],
          fyGiven: +data.last_gift_fy,
          zipCode: data.AddrZIP.split("-")[0]
        });

        switch (data.donortype) {
          case "Multi-Year":
            donorStats.multi += 1;
            break;
          case "Lapsed":
            donorStats.lapsed += 1;
            break;
          case "First-Time":
            donorStats.first += 1;
            break;
          case "Reactivated":
            donorStats.reactivated += 1;
            break;
          default:
            // Do nothing.
            break;
        }

        donorStats.total += 1;
      }
    }

    // Finally push the touch object.
    touches.push(data);
  });

  console.log(donors);
  console.log(gifts);
  console.log(touches);

  let tryGifts = [];
  gifts.forEach(element => {
    let shouldAddGift = true;
    element.touches.forEach(elem => {
      if (touches[elem].date_diff < 365) {
        shouldAddGift = false;
      }
    });

    if (shouldAddGift) {
      let newTouches = [];
      element.touches.forEach(elem => {
        newTouches.push(touches[elem]);
      });

      tryGifts.push({
        element,
        actualTouches: newTouches
      });
    }
  });

  console.log(tryGifts);
}

// ----- CALCUATIONS FOR COMPARISONS ------------------------------------------

export function getComparisonsData() {
  const ret = calculateComparisonsData();
  //console.log(ret);
  return ret;
}

function calculateComparisonsData() {
  const filteredDonors = applyDonorFilters(donors);
  const unfilteredGifts = [];

  filteredDonors.forEach(element => {
    element.gifts.forEach(elem => {
      unfilteredGifts.push(gifts[elem]);
    });
  });

  const filteredGifts = applyGiftFilters(unfilteredGifts);
  const sequences = [];

  filteredGifts.forEach(element => {
    const giftTouches = [];
    element.touches.forEach(elem => {
      giftTouches.push(touches[elem]);
    });
    sequences.push(giftTouches);
  });

  return sequences;
}

// ----- END FUNCTIONS --------------------------------------------------------

// ----- FILTER FUNCTIONS -----------------------------------------------------

export function setGiftFilters(filters) {}

export function setTouchFilters(filters) {}

export function setDonorFilters(filters) {
  donorFilters = filters;
}

export function clearFilters(...filters) {
  if (filters.indexOf("donor") >= 0) {
    donorFilters = {};
  }
}

function applyGiftFilters(data) {
  return data;
}

function applyTouchFilters(data) {
  return data;
}

function applyDonorFilters(data) {
  let filtDonors = [];

  // if (donorFilters.onlyType) {
  //   donors.forEach(element => {
  //     if (donorFilters.onlyType === element.type) {
  //       filtDonors.push(element);
  //     }
  //   });
  // } else if (donorFilters.filter) {
  //   return data;
  // }

  if (donorFilters.onlyArea) {
    donors.forEach(element => {
      //console.log("attempting to filter: " + element.zipCode);
      switch (donorFilters.onlyArea) {
        case 'VA':
          if (areasWithZipCodes.VA.indexOf(parseInt(element.zipCode)) >= 0) {
            filtDonors.push(element);
          }
        break;
        case 'MD':
          if (areasWithZipCodes.MD.indexOf(parseInt(element.zipCode)) >= 0) {
            filtDonors.push(element);
          }
        break;
        case 'DC':
          if (areasWithZipCodes.DC.indexOf(parseInt(element.zipCode)) >= 0) {
            filtDonors.push(element);
          }
        break;
        case 'OTHER':
          if (areasWithZipCodes.VA.indexOf(parseInt(element.zipCode)) < 0 && areasWithZipCodes.MD.indexOf(parseInt(element.zipCode)) < 0 && areasWithZipCodes.DC.indexOf(parseInt(element.zipCode)) < 0) {
            filtDonors.push(element);
          }
        break;
        default:
          // Do nothing.
        break; 
      }
    });
  }

  if (filtDonors.length === 0) {
    // console.log("filtDonors has no elements...")
    filtDonors = donors;
  }

  return filtDonors;
}

// ----- END FILTER FUNCTIONS -------------------------------------------------

// ----- HELPER FUNCTIONS -----------------------------------------------------

function getDateFromDayOfYear2017(day) {
  return Date.parse("2017-01-01") + day * 1000 * 3600 * 24;
}

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}
