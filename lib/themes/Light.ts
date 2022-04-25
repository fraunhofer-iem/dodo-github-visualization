import { Color, Colors, CSSProperties, IconNames } from "../frontend"
import { Theme } from "./Theme"

const {
  white,
  black,
  gray,
  fraunhoferGreen,
  transparent,
  blue,
  navy,
  maroon,
  gold,
  green,
  red,
} = Colors

const LightTheme: Theme = {
  name: "light",
  layout: {
    overlay: {
      opaque: new CSSProperties({ backgroundColor: white.darken(0.05) }),
      translucent: new CSSProperties({ backgroundColor: black.alph(0.8) }),
    },
    header: new CSSProperties({
      background: `linear-gradient(90deg, ${black.brighten(0.1).rgba()}, ${white
        .darken(0.1)
        .rgba()})`,
      color: white,
      borderBottom: `4px solid ${black.rgba()}`,
    }),
    title: new CSSProperties({
      color: white,
      textShadow: `-1px 3px ${black.alph(0.7).rgba()}`,
    }),
    sidebar: new CSSProperties({
      backgroundColor: white.darken(0.05),
    }),
    container: new CSSProperties({ backgroundColor: white.darken(0.05) }),
  },
  card: {
    card: new CSSProperties({
      background: white.darken(0.01),
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
    toggle: {
      frame: new CSSProperties({
        backgroundColor: white.darken(0.5),
        borderColor: gray,
      }),
      "frame:active": new CSSProperties({
        backgroundColor: blue.darken(0.2),
      }),
      slider: new CSSProperties({
        backgroundColor: white,
        borderColor: black,
      }),
    },
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
    light: new CSSProperties({
      backgroundColor: white.darken(0.1),
      color: black,
    }),
    "light:hover": new CSSProperties({
      backgroundColor: white.darken(0.05),
      color: black,
    }),
  },
  alert: {
    error: new CSSProperties({
      backgroundColor: red.brighten(0.75),
      borderColor: red.brighten(0.7),
      color: red.darken(0.6),
    }),
    success: new CSSProperties({
      backgroundColor: new Color(210, 240, 220),
      borderColor: new Color(195, 230, 200),
      color: new Color(20, 90, 35),
    }),
  },
  browser: {
    activeElement: Colors.navy,
    browser: new CSSProperties({
      background: Colors.black.brighten(0.9),
    }),
  },
  content: {
    trend: {
      icon: new CSSProperties({
        backgroundColor: transparent,
      }),
    },
    section: new CSSProperties({
      borderColor: gray,
    }),
    spinner: new CSSProperties({
      borderColor: black.brighten(0.25),
      borderTopColor: transparent,
    }),
  },
  trends: {
    down: {
      color: maroon,
      icon: IconNames.keyboardArrowDown,
    },
    neutral: {
      color: gold.darken(0.2),
      icon: IconNames.remove,
    },
    up: {
      color: green.darken(0.2),
      icon: IconNames.keyboardArrowUp,
    },
  },
}

export default LightTheme
