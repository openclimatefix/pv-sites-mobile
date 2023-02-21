import MapBoxInput from "~/components/mapbox_input";

export default function Home() {
  return (
    <div className="h-screen p-4" id = "rootDiv">
      <div className="flex h-fit " id = "flexBox">
        <div className="w-full h-96" id = "mapboxInputWrapper">
          <MapBoxInput/>
        </div>
      </div>
    </div>
  )
}
