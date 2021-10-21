import { NextPage } from "next"
import Card from "../components/card/Card"
import Page from "../components/layout/Page"
import useUser from "../util/api/useUser"

const Hierarchy: NextPage = () => {
  const { user } = useUser({ redirectTo: "/" })

  return (
    <Page title="Hierarchy- KPI Dashboard">
      <Card width="99%">a</Card>
    </Page>
  )
}

export default Hierarchy
