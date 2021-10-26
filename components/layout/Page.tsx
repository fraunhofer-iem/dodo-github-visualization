import Head from "next/head"
import Bar from "../../components/layout/Bar"
import Container from "../../components/layout/Container"
import Anchor from "../action/Anchor"

interface Props {
  title: string
  sidebar?: React.ReactNode
  children?: React.ReactNode
}

export default function Page(props: Props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Bar
        title={
          <>
            {props.sidebar}
            KPI Dashboard
          </>
        }
      >
        <Anchor href="/analytics" context="neutral">
          KPI Analytics
        </Anchor>
        <Anchor href="/hierarchy" context="neutral">
          KPI Hierarchy
        </Anchor>
      </Bar>
      <Container>{props.children}</Container>
    </>
  )
}
