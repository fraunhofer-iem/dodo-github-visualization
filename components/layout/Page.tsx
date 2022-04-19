import Head from "next/head"
import { useRouter } from "next/router"
import { Header } from "../../components/layout"
import { ApiRoutes, User } from "../../lib/api"
import { Crumb, IconNames, KpiIds } from "../../lib/frontend"
import { Button } from "../action"
import { Comparator } from "../kpis"
import { Icon } from "../rating"

interface Props {
  title: string
  crumbs?: Crumb[]
  sidebar?: React.ReactNode
  children?: React.ReactNode
  user?: User
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
            kpiId={KpiIds.ORGANIZATION_HEALTH}
            repoId={{ owner: props.user ? props.user.organization : "" }}
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
      {/* <Container>
        {props.crumbs && <Breadcrumbs crumbs={props.crumbs} />}
        {props.children}
      </Container> */}
    </>
  )
}
