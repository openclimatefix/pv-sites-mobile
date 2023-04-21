import { FC } from "react";

interface InverterViewProps {
    siteUUID: string;
}

const InverterView : FC<InverterViewProps> = ({ siteUUID}) => {
    return (
        <div>
            <h1>Inverter View</h1>
            <h1>Site UUID: {siteUUID}</h1>
        </div>
    )
}

export default InverterView