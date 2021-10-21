import { ChartData } from "chart.js"
import { NextPage } from "next"
import { useRouter } from "next/dist/client/router"
import { useRef } from "react"
import Button from "../../../components/action/Button"
import Card from "../../../components/card/Card"
import CardBody from "../../../components/card/CardBody"
import CardSubTitle from "../../../components/card/CardSubTitle"
import CardTitle from "../../../components/card/CardTitle"
import LineChart from "../../../components/chart/LineChart"
import PieChart from "../../../components/chart/PieChart"
import Grid from "../../../components/layout/Grid"
import Page from "../../../components/layout/Page"
import Sidebar from "../../../components/layout/Sidebar"
import Icon from "../../../components/rating/Icon"
import { IconName } from "../../../components/rating/IconName"
import prData from "../../../util/data/pullRequestData.json"
import {
  Color,
  lime,
  purple,
  red,
  turquoise,
  yellow,
} from "../../../util/themes/Theme"

const timeline = (): ChartData<"line"> => {
  const labels: number[] = []
  prData.forEach((v, i) => labels.push(i))
  const chartData: ChartData<"line"> = {
    datasets: [
      {
        data: prData,
        backgroundColor: purple.rgba(),
        borderColor: purple.rgba(),
        borderWidth: 1,
        pointRadius: 1,
        label: "PR size over time",
        showLine: false,
      },
    ],
    labels: labels,
  }
  return chartData
}

const cluster = (): ChartData<"line"> => {
  const data: [number, number][] = []
  prData.forEach((v, i) => data.push([i, v]))
  data.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
  const values: number[] = []
  const labels: number[] = []
  data.forEach(([label, value]) => {
    values.push(value)
    labels.push(label)
  })
  return {
    datasets: [
      {
        data: values,
        backgroundColor: turquoise.rgba(),
        borderColor: turquoise.rgba(),
        pointRadius: 1,
        showLine: false,
        label: "Sorted PR size",
      },
    ],
    labels: labels,
  }
}

const count = (): ChartData<"pie"> => {
  const data = {
    10: 0,
    20: 0,
    30: 0,
    40: 0,
    50: 0,
  }
  const colors = {
    10: lime,
    20: yellow,
    30: red,
    40: new Color(220, 20, 60),
    50: purple,
  }
  prData.forEach((value) => {
    if (value < 10) {
      data[10] += 1
    } else if (value < 20) {
      data[20] += 1
    } else if (value < 30) {
      data[30] += 1
    } else if (value < 40) {
      data[40] += 1
    } else if (value < 50) {
      data[50] += 1
    }
  })
  const labels: string[] = ["0-9", "10-19", "20-29", "30-39", "40-49"]
  return {
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: Object.entries(colors).map(([range, color]) =>
          color.rgba(),
        ),
        borderColor: Object.entries(colors).map(([range, color]) =>
          color.darken(0.05).rgba(),
        ),
        label: "PR sizes contrasted",
      },
    ],
    labels: labels,
  }
}

const Detail: NextPage = () => {
  const router = useRouter()
  const { projectID } = router.query
  const toggleSidebar = useRef<() => void>(() => {})

  return (
    <Page
      title={`Project ${projectID}  - KPI Dashboard`}
      sidebar={
        <Button
          context="neutral"
          action={() => {
            toggleSidebar.current()
          }}
        >
          <Icon>{IconName.menu}</Icon>
        </Button>
      }
    >
      <Sidebar
        control={(control: () => void) => (toggleSidebar.current = control)}
      >
        Test
      </Sidebar>
      <Card width="99%">
        <CardTitle>{`Project ${projectID}`}</CardTitle>
        <CardSubTitle>{`<Project URL>`}</CardSubTitle>
        <CardBody>
          <Grid>
            <LineChart data={timeline()} width="500px" height="500px" />
            <LineChart data={cluster()} width="500px" height="500px" />
            <PieChart data={count()} width="500px" height="500px" />
          </Grid>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Detail
