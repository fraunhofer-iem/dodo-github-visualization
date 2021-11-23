import { useState } from "react"
import { SidebarStates } from "../../lib/frontend"
import { useMediaQuery, useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Layout.module.scss"

interface Props {
  control: (control: () => void) => void
  children?: React.ReactNode
}

/**
 * Sidebar that is hidden responsively if the user's screen size is too small
 * but also can be toggled by the user.
 *
 * Might be removed in a future redesign of the detail pages.
 */
export function Sidebar(props: Props) {
  const { theme } = useUIContext()
  const [state, setState] = useState(SidebarStates.DEPEND_ON_SCREEN)
  const wideScreen = useMediaQuery("(min-width: 1200px)", () => {
    setState(SidebarStates.DEPEND_ON_SCREEN)
  })

  const toggleSidebar = () => {
    switch (state) {
      case SidebarStates.DEPEND_ON_SCREEN:
        setState(SidebarStates.REQUESTED_BY_USER)
        break
      default:
        setState(SidebarStates.DEPEND_ON_SCREEN)
        break
    }
  }

  props.control(toggleSidebar)

  const css = theme.layout.sidebar.css()
  if (wideScreen) {
    switch (state) {
      case SidebarStates.REQUESTED_BY_USER:
        css.display = "none"
        break
      default:
        css.display = "block"
        break
    }
  } else {
    switch (state) {
      case SidebarStates.REQUESTED_BY_USER:
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
