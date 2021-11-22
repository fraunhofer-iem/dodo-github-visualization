import Head from "next/head"
import { useRouter } from "next/router"
import { Bar, Container } from "../../components/layout"
import { Crumb } from "../../lib/frontend"
import { Button } from "../action"
import { Breadcrumbs } from "../content"

interface Props {
  title: string
  crumbs?: Crumb[]
  sidebar?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Skeleton page layout
 */
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
      <Container>
        {props.crumbs && <Breadcrumbs crumbs={props.crumbs} />}
        {props.children}
      </Container>
    </>
  )
}
