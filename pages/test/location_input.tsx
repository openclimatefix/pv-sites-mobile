import MapBoxInput from "~/components/mapbox_input";

export default function Home() {
  return (
    <div className="h-screen w-screen" id = "rootDiv">
      <div className="flex flex-col h-fit gap-1" id = "flexBox">
        <div className="w-full h-screen" id = "mapboxInputWrapper">
          <MapBoxInput/>
        </div>
      </div>
    </div>
  )
}
