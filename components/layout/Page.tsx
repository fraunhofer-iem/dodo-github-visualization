import Head from "next/head"
import { useRouter } from "next/router"
import { Header } from "../../components/layout"
import { ApiRoutes, User } from "../../lib/api"
import { Crumb, IconNames, KpiIds } from "../../lib/frontend"
import { Button } from "../action"
import { Comparator } from "../kpis"
import { Icon } from "../rating"
import { Container } from "./Container"

interface Props {
  title: string
  crumbs?: Crumb[]
  sidebar?: React.ReactNode
  children?: React.ReactNode
  user?: User
  atA?: Date
  atB?: Date
  setAtA?: (at: Date) => void
  setAtB?: (at: Date) => void
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
      <Header title={"KPI Dashboard"}>
        <>
          <Comparator
            kpiId={`${KpiIds.ORGANIZATION_HEALTH}@${props.user?.organization}`}
            repoId={{ owner: props.user ? props.user.organization : "" }}
            atA={props.atA}
            setAtA={props.setAtA}
            atB={props.atB}
            setAtB={props.setAtB}
          />
          <div
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
              color: "black",
            }}
          >
            {props.user?.name}@{props.user?.organization}
            <Button
              context={"neutral"}
              action={() => {
                fetch(ApiRoutes.LOGOUT).then(() => {
                  router.push("/")
                })
              }}
              padding={"0px"}
            >
              <Icon>{IconNames.logout}</Icon>
            </Button>
          </div>
        </>
      </Header>
      <Container>
        {/* {props.crumbs && <Breadcrumbs crumbs={props.crumbs} />} */}
        {props.children}
      </Container>
    </>
  )
}
