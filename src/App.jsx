import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import IframeComponent from "./components/IframeComponent"

function App() {
  return (
    <>
      <SpeedInsights />
      <Analytics />
      <IframeComponent />
    </>
  )
}

export default App
