import { useState } from "react"
import styles from "../../styles/components/Layout.module.scss"
import { useUIContext } from "../../util/uiContext"
import { useMediaQuery } from "../../util/uiHooks"

interface Props {
  control: (control: () => void) => void
  children?: React.ReactNode
}

export enum SidebarState {
  dependOnScreen,
  requestedByUser,
}

export default function Sidebar(props: Props) {
  const { theme } = useUIContext()
  const [state, setState] = useState(SidebarState.dependOnScreen)
  const wideScreen = useMediaQuery("(min-width: 1200px)", (matches) => {
    if (matches) {
      setState(SidebarState.dependOnScreen)
    }
  })

  const toggleSidebar = () => {
    switch (state) {
      case SidebarState.dependOnScreen:
        setState(SidebarState.requestedByUser)
        break
      default:
        setState(SidebarState.dependOnScreen)
        break
    }
  }

  props.control(toggleSidebar)

  const css = theme.layout.sidebar.css()
  if (wideScreen) {
    switch (state) {
      case SidebarState.requestedByUser:
        css.display = "none"
        break
      default:
        css.display = "block"
        break
    }
  } else {
    switch (state) {
      case SidebarState.requestedByUser:
        css.display = "block"
        css.position = "absolute"
        css.left = "0"
        css.top = "50px"
        break
      default:
        css.display = "none"
    }
  }

  return (
    <div className={styles.sidebar} style={css}>
      {props.children}
    </div>
  )
}
