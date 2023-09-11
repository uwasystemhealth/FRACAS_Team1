import React, { useState } from 'react';
import '../styles/Report.scss'

const Report = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [detailInfo, setDetailInfo] = useState({});
    const [showAdditionalData, setShowAdditionalData] = useState(false);

    const detailsMapping = {
        'img1': {
            name: "Review Status",
            statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"]
        },
        'img2': {
            name: "Record Validation Status",
            statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"]
        },
        'img3': {
            name: "Analysis Validation Status",
            statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"]
        },
        'img4': {
            name: "Correction Validation",
            statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"]
        },
    };

    const handleIconClick = (iconId) => {
        setShowDetails(true);
        setDetailInfo(detailsMapping[iconId]);
    };

    return (
        <div className="mainbox w">
            <div className="topimg">
                <h1>FRACAS<br />REPORT SUBMIT</h1>
            </div>
            <h4>UWA MOTORSPORT FRACAS REPORT</h4>
            <ul className="list w">
                {Object.keys(detailsMapping).map((iconId, index) => (
                    <li key={index} onClick={() => handleIconClick(iconId)}>
                        <span>{['RS', 'RVS', 'AVS', 'CVS'][index]}</span>
                        <img src={`/images/info.png`} alt="" id={iconId} />
                    </li>
                ))}
            </ul>
            {showDetails && (
                <div className="details">
                    <h4 style={{ textAlign: 'center', height: '30px', marginTop: '-10px' }}>info</h4>
                    <span className="x" onClick={() => setShowDetails(false)}>x</span>
                    <div>
                        <span>wholeName: </span>
                        <span style={{ color: 'rgb(255, 255, 255)' }}>{detailInfo.name}</span>
                    </div>
                    <div>
                        <span>status: </span>
                        {detailInfo.statuses.map((status, index) => (
                            <span key={index} style={{ color: 'rgb(255, 255, 255)' }}>{status}</span>
                        ))}
                    </div>
                </div>
            )}
            <div className="inpbox">
                <div>
                    <u>Record creator:</u>
                    <input type="text" placeholder="Erwin Bauernschmitt" />
                </div>
                <div>
                    <u>Record owner:</u>
                    <input type="text" placeholder="Erwin Bauernschmitt" />
                </div>
                <div>
                    <u>Technical team:</u>
                    <input type="text" placeholder="Electrical" />
                </div>
                <div>
                    <u>Subsystem:</u>
                    <input type="text" placeholder="PDM" />
                </div>
                <div>
                    <u>Car year:</u>
                    <input type="text" placeholder="2022 (flo)" />
                </div>
                <div>
                    <u>Failure time:</u>
                    <input type="text" placeholder="14:30  08/09/2023" />
                </div>
                <div>
                    <u>Failure description:</u>
                    <input type="text" placeholder="The LV PDM buck converter on ‘22 (Flo) failed whilst driving." style={{ height: '80px' }} />
                </div>
                <div>
                    <u>Failure cause:</u>
                    <input type="text" placeholder="Overheating of the inductor due to high current." />
                </div>
                <div>
                    <u>Failure mechanism:</u>
                    <input type="text" placeholder="Dielectric breakdown." />
                </div>
                <div>
                    <u>Corrective action plan:</u>
                    <input type="text" placeholder="Replace broken inductor with a new lower-resistance inductor and validate reduced operating temperature with bench testing under expected load." style={{ height: '60px' }} />
                </div>
                <div>
                    <u>Comments:</u>
                    <input type="text" placeholder="" style={{ height: '80px' }} />
                </div>
            </div>
            <div className="shoubox">
                <h4>Addtional Data Folder</h4>
                <span onClick={() => setShowAdditionalData(!showAdditionalData)}></span>
            </div>
            {showAdditionalData && (
                <div className="inpbox">
                    <div>
                        <u>Record creator:</u>
                        <input type="text" placeholder="22964301@student.uwa.edu.au" />
                    </div>
                    <div>
                        <u>Record owner contact:</u>
                        <input type="text" placeholder="22964301@student.uwa.edu.au" />
                    </div>
                    <div>
                        <u>Technical team lead:</u>
                        <input type="text" placeholder="Nathan Mayhew" />
                    </div>
                    <div>
                        <u>Report creation time:</u>
                        <input type="text" placeholder="2023/09/08" />
                    </div>
                    <div>
                        <u>Review status:</u>
                        <input type="text" placeholder="unreviewed" />
                    </div>
                    <div>
                        <u>Due date:</u>
                        <input type="text" placeholder="none" />
                    </div>
                    <div>
                        <u>Time resolved:</u>
                        <input type="text" placeholder="unresolved" />
                    </div>
                </div>
            )}
            <div className="btnbox">
                <div className="botbtn">
                    <div className="left">Save draft</div>
                    <div className="right">Submit</div>
                </div>
            </div>
        </div>
    );
}

export default Report;
