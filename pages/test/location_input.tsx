import MapBoxInput from "~/components/mapbox_input";

export default function Home() {
  return (
    <div className="h-screen p-4" id = "rootDiv">
      <div className="flex flex-col h-fit gap-1" id = "flexBox">
        <h1 className="text-xl">Mapbox Input Test</h1>
        <div className="w-full h-96" id = "mapboxInputWrapper">
          <MapBoxInput/>
        </div>
      </div>
    </div>
  )
}
