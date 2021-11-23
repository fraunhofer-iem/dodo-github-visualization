import { useState } from "react"
import { useUIContext } from "../../lib/hooks"
import styles from "../../styles/components/Button.module.scss"

interface Props {
  /**
   * The button's appearance, defined in the themes
   */
  context: "primary" | "neutral" | "anchor"
  /**
   * Action to perform on left-click
   */
  action?: () => void
  /**
   * Action to perform on right-click
   */
  cxtAction?: () => void
  /**
   * Components that serve as the buttons label
   *
   * Please refrain from nesting buttons
   */
  children: React.ReactNode
  /**
   * The button's type
   *
   * See [MDN](https://www.w3schools.com/tags/att_button_type.asp)
   */
  type?: "button" | "submit"
  /**
   * The button's status
   *
   * See [MDN](https://www.w3schools.com/tags/att_button_disabled.asp)
   */
  disabled?: boolean
  /**
   * If specified, the Button is rendered as an <a> tag.
   *
   * In this case, the 'action', 'type' and 'disabled' props are ignored.
   */
  href?: string
  /**
   * Selection of CSS properties to fine-tune the button to its specific use-case.
   */
  width?: string
  display?: string
  align?: "left" | "right" | "center"
  padding?: string
}

/**
 * Helper methods, that construct the current context name in dependence of the hover state.
 *
 * Mainly used in order to appease the compiler when string indexing the theme object.
 */
const contexts = {
  primary: (hovered: boolean) => (hovered ? "primary:hover" : "primary"),
  neutral: (hovered: boolean) => (hovered ? "neutral:hover" : "neutral"),
  anchor: (hovered: boolean) => (hovered ? "anchor:hover" : "anchor"),
}

export function Button(props: Props) {
  const { theme } = useUIContext()
  const [hovered, setHovered] = useState(false)
  const context = contexts[props.context](hovered)
  const action = props.action ?? (() => {})
  const cxtAction = props.cxtAction ?? (() => {})

  const css = theme.button[context].css()
  if (props.width) {
    css["width"] = props.width
  }
  if (props.display) {
    css["display"] = props.display
  }
  if (props.align) {
    css["textAlign"] = props.align
  }
  if (props.padding) {
    css["padding"] = props.padding
  }

  return props.href ? (
    <a
      className={styles.btn}
      style={css}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={(e) => {
        cxtAction()
        e.preventDefault()
      }}
      href={props.href}
    >
      {props.children}
    </a>
  ) : (
    <button
      className={styles.btn}
      style={css}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={action}
      onContextMenu={(e) => {
        cxtAction()
        e.preventDefault()
      }}
      type={props.type}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}
