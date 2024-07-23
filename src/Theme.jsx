import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  "border-radius": "10px",
  "colors": {
    "#373F68": "#373F68",
    "#3A4374": "#3A4374",
    "#656EA3": "#656EA3",
    "#4661E6": "#4661E6",
    "#7C91F9": "#7C91F9",
    "#62BCFA": "#62BCFA",
    "#647196": "#647196",
    "#AD1FEA": "#AD1FEA",
    "#C75AF6": "#C75AF6",
    "#CFD7FF": "#CFD7FF",
    "#D73737": "#D73737",
    "#E98888": "#E98888",
    "#F2F4FE": "#F2F4FE",
    "#F2F4FF": "#F2F4FF",
    "#F7F8FD": "#F7F8FD",
    "#F49F85": "#F49F85",
    "#FFFFFF": "#FFFFFF",
    "transparent": "transparent",
  },

  "typography": {
    size13bold: {
      "font-weight": "700",
      "font-size": "13px",
      "line-height": "19px",
    },
    size13: {
      "font-weight": "600",
      "font-size": "13px",
      "line-height": "19px",
    },
    size13_500: {
      "font-weight": "500",
      "font-size": "13px",
      "line-height": "19px",
    },
    size13regular: {
      "font-weight": "400",
      "font-size": "13px",
      "line-height": "19px",
    },
    size14: {
      "font-weight": "700",
      "font-size": "14px",
      "line-height": "20.23px",
      "letter-spacing": "-0.25px",
    },
    size14semi: {
      "font-weight": "400",
      "font-size": "14px",
      "line-height": "20px",
      "letter-spacing": "-0.25px",
    },
    size15: {
      "font-weight": "400",
      "font-size": "15px",
      "line-height": "22px",
    },
    size15bold: {
      "font-weight": "700",
      "font-size": "15px",
      "line-height": "22px",
    },
    size15semi: {
      "font-weight": "500",
      "font-size": "15px",
      "line-height": "22px",
    },
    size16: {
      "font-weight": "400",
      "font-size": "16px",
      "line-height": "23px",
    },
    size16bold: {
      "font-weight": "700",
      "font-size": "16px",
      "line-height": "23px",
    },
    size18: {
      "font-weight": "700",
      "font-size": "18px",
      "line-height": "26px",
      "letter-spacing": "-0.25px",
    },
    size20: {
      "font-weight": "700",
      "font-size": "20px",
      "line-height": "29px",
      "letter-spacing": "-0.25px",
    },
    size24: {
      "font-weight": "700",
      "font-size": "24px",
      "line-height": "35px",
      "letter-spacing": "-0.333333px",
    },
  },

  "btns": {
    default: {
      "#AD1FEA": {
        "&:hover": { "cursor": "pointer", "background-color": "#C75AF6" },
      },
      "#4661E6": {
        "&:hover": { "cursor": "pointer", "background-color": "#7C91F9" },
      },
      "#3A4374": {
        "&:hover": { "cursor": "pointer", "background-color": "#656EA3" },
      },
      "#D73737": {
        "&:hover": { "cursor": "pointer", "background-color": "#E98888" },
      },
    },
    back: {
      "padding": "16px 41px",
      "#373F68": {
        "color": "#FFFFFF",
        "&:hover": { "cursor": "pointer", "text-decoration": "underline" },
      },
      "transparent": {
        "color": "#647196",
        "&:hover": { "cursor": "pointer", "text-decoration": "underline" },
      },
    },

    sort: {
      "padding": "26px 16.5px 26px 17.5px",
      "#373F68": {
        color: "#F2F4FE",
        display: "block",
      },
    },
    upvote: {
      "padding": "14px 8px 8px 8px",

      "min-width": "40px",
      "min-height": "53px",
      "color": "#3A4374",
      "background-color": "#F2F4FE",
      "&:hover": {
        "cursor": "pointer",
        "background-color": "#CFD7FF",
      },
      "&:active": {
        "color": "#FFFFFF",
        "background-color": "#4661E6",
      },
    },
    tag: {
      "padding": "6px 17px",
      "color": "#4661E6",
      "background-color": "#F2F4FE",
    },
  },
};

const Theme = (props) => <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;

export default Theme;
