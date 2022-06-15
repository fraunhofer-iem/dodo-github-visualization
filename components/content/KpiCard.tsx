import { useRouter } from "next/router"
import { Kpi } from "../../lib/api"
import { getKpiForRepoRoute } from "../../lib/frontend"
import { useUIContext } from "../../lib/hooks"
import { Button } from "../action"
import { Card } from "../card"

interface Props {
  kpi: Kpi
  width: string
  margin?: string
  height?: string
  iconSize?: string
  background?: string
  backgroundHover?: string
}

export function KpiCard(props: Props) {
  const { theme } = useUIContext()
  const { kpi, width, margin, height, background, backgroundHover, iconSize } =
    props
  const router = useRouter()

  return (
    <Card
      key={`${kpi.owner}/${kpi.repo}/${kpi.id}`}
      margin={margin}
      width={width}
      height={height}
      background={background}
      backgroundHover={backgroundHover}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          context={"neutral"}
          type={"button"}
          action={() => {
            router.push({
              pathname: getKpiForRepoRoute(
                {
                  owner: kpi.owner,
                  name: kpi.repo as string,
                },
                kpi.id,
              ),
              query: { ...router.query },
            })
          }}
          padding={"0"}
        >
          <strong>{kpi.name}</strong>
          <br />
          <span style={{ fontSize: iconSize ?? "10pt" }}>
            {kpi.owner}/{kpi.repo}
          </span>
        </Button>
      </div>
    </Card>
  )
}
