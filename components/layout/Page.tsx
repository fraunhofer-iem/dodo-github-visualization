import Head from "next/head"
import { useRouter } from "next/router"
import { Bar, Breadcrumbs, Container, Crumb } from "../../components/layout"
import { Button } from "../action"

interface Props {
  title: string
  crumbs?: Crumb[]
  sidebar?: React.ReactNode
  children?: React.ReactNode
}

export function Page(props: Props) {
  const router = useRouter()

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
        <Button action={() => router.push("/analytics")} context="neutral">
          KPI Analytics
        </Button>
        <Button action={() => router.push("/hierarchy")} context="neutral">
          KPI Hierarchy
        </Button>
      </Bar>
      {props.crumbs && <Breadcrumbs crumbs={props.crumbs} />}
      <Container>{props.children}</Container>
    </>
  )
}
