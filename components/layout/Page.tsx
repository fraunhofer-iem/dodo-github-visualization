import Head from "next/head"
import { useRouter } from "next/router"
import Bar from "../../components/layout/Bar"
import Container from "../../components/layout/Container"
import Button from "../action/Button"

interface Props {
  title: string
  sidebar?: React.ReactNode
  children?: React.ReactNode
}

export default function Page(props: Props) {
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
      <Container>{props.children}</Container>
    </>
  )
}
