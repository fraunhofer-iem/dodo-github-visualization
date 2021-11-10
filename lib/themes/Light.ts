import { IconName } from "../../components/rating/IconName"
import {
  black,
  blue,
  CSSProperties,
  fraunhoferGreen,
  gold,
  gray,
  green,
  maroon,
  navy,
  Theme,
  transparent,
  white,
} from "./Theme"

const LightTheme: Theme = {
  name: "light",
  layout: {
    overlay: {
      opaque: new CSSProperties({ backgroundColor: white.darken(0.05) }),
      translucent: new CSSProperties({ backgroundColor: black.alph(0.8) }),
    },
    bar: new CSSProperties({
      backgroundColor: black.brighten(0.1),
      color: white,
    }),
    sidebar: new CSSProperties({
      backgroundColor: white.darken(0.05),
    }),
    container: new CSSProperties({ backgroundColor: white.darken(0.05) }),
    breadcrumbs: new CSSProperties({ backgroundColor: white.darken(0.05) }),
  },
  card: {
    card: new CSSProperties({
      backgroundColor: white.darken(0.01),
      borderColor: gray,
    }),
    title: new CSSProperties({ color: black }),
    subTitle: new CSSProperties({ color: white.darken(0.65) }),
    dismissal: new CSSProperties({ color: black }),
  },
  list: {
    list: new CSSProperties({
      backgroundColor: white,
    }),
    listItem: new CSSProperties({
      borderColor: white.darken(0.1),
    }),
    listTitle: new CSSProperties({
      backgroundColor: fraunhoferGreen,
      color: white,
      borderColor: fraunhoferGreen.darken(0.1),
      fontWeight: "600",
    }),
  },
  table: {
    neutral: {
      table: new CSSProperties({
        backgroundColor: transparent,
      }),
      row: new CSSProperties({
        backgroundColor: transparent,
      }),
      headCell: new CSSProperties({
        borderColor: gray,
      }),
      dataCell: new CSSProperties({
        borderColor: gray,
      }),
    },
    striped: {
      table: new CSSProperties({
        backgroundColor: transparent,
      }),
      row: new CSSProperties({
        backgroundColor: white.darken(0.1),
      }),
      headCell: new CSSProperties({
        borderColor: gray,
      }),
      dataCell: new CSSProperties({
        borderColor: gray,
      }),
    },
  },
  form: {
    label: new CSSProperties({ color: black }),
    input: new CSSProperties({
      backgroundColor: white,
      borderColor: white.darken(0.1),
    }),
    select: new CSSProperties({}),
  },
  button: {
    primary: new CSSProperties({
      backgroundColor: blue.darken(0.2),
      borderColor: navy,
      color: white,
    }),
    "primary:hover": new CSSProperties({
      backgroundColor: blue.darken(0.1),
      borderColor: navy,
      color: white,
    }),
    neutral: new CSSProperties({
      backgroundColor: transparent,
      color: "inherit",
    }),
    "neutral:hover": new CSSProperties({
      backgroundColor: transparent,
      color: "inherit",
    }),
    anchor: new CSSProperties({
      backgroundColor: transparent,
      color: "inherit",
      textDecoration: "none",
    }),
    "anchor:hover": new CSSProperties({
      backgroundColor: transparent,
      textDecoration: "underline",
    }),
  },
  content: {
    trend: {
      icon: new CSSProperties({
        backgroundColor: transparent,
      }),
    },
    spinner: new CSSProperties({
      borderColor: black.brighten(0.25),
      borderTopColor: transparent,
    }),
  },
  trends: {
    down: {
      color: maroon,
      icon: IconName.keyboardArrowDown,
    },
    neutral: {
      color: gold,
      icon: IconName.remove,
    },
    up: {
      color: green.darken(0.2),
      icon: IconName.keyboardArrowUp,
    },
  },
  cytoscape: {
    canvas: [
      {
        selector: "node[label]",
        style: {
          label: "data(label)",
          "text-valign": "bottom",
        },
      },
      {
        selector: "node[?hover]",
        style: {
          backgroundColor: black.rgba(),
        },
      },
      {
        selector: "node[!hover]",
        style: {
          backgroundColor: gray.rgba(),
        },
      },
      {
        selector: "edge",
        style: {
          width: 2,
          "line-color": white.darken(0.2).rgba(),
          "target-arrow-color": white.darken(0.2).rgba(),
          "target-arrow-shape": "triangle",
          "curve-style": "taxi",
        },
      },
    ],
  },
}

export default LightTheme
