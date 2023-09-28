import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    function getCurrentDate() {
        return new Date().toISOString().slice(0, 16);
    }

    const handleIconClick = (iconId) => {
        setShowDetails(true);
        setDetailInfo(detailsMapping[iconId]);
    };

    const [formData, setFormData] = useState({
        record_creator: '',
        record_owner: '',
        team: '',
        subsystem: '',
        car_year: '',
        failure_time: '',
        failure_title: '',
        failure_description: '',
        failure_impact: '',
        failure_cause: '',
        failure_mechanism: '',
        corrective_action_plan: '',
        team_lead: '',
        record_creation_time: getCurrentDate(),
        due_date: getCurrentDate(),
        resolve_date: getCurrentDate(),
        resolution_status: '',
        // review_date: '',
        is_resolved: false,
        is_record_validated: false,
        is_analysis_validated: false,
        is_correction_validated: false,
        is_reviewed: false
    });

    const [users, setUsers] = useState([]);

    const handleInputChange = (e, field) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: e.target.value
        }));
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/records/', formData);
            console.log(response.data);
            navigate('/userdashboard');
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/users/');
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      if(users.length !== 0) {
        formData.record_creator = users[0].username;
        formData.record_owner = users[0].username;
      }

      const [teams, setTeams] = useState([]);

      useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/teams/');
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    if(teams.length !== 0) {
        formData.team_lead = teams[0].team_lead;
    }

    const [subsystems, setSubsystems] = useState([]);

    useEffect(() => {
        const fetchSubsystems = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/subsystems/');
                setSubsystems(response.data);
            } catch (error) {
                console.error('Error fetching subsystems:', error);
            }
        };
    
        fetchSubsystems();
    }, []);

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
                    <input 
                        type="text" 
                        value={formData.record_creator}
                        onChange={(e) => handleInputChange(e, 'record_creator')}
                        placeholder="" 
                    />
                </div>
                <div>
                    <u>Record owner:</u>
                    <input 
                        type="text"
                        value={formData.record_owner}
                        onChange={(e) => handleInputChange(e, 'record_owner')} 
                        placeholder="" />
                </div>
                <div>
                    <u>Technical team:</u>
                    <select 
                        value={formData.team}
                        onChange={(e) => handleInputChange(e, 'team')}>
                        <option value="" disabled>Select a team</option>
                        {teams.map(team => (
                            <option key={team.team_name} value={team.team_name}>
                                {team.team_name}
                            </option>
                        ))}
            </select>
                </div>
                <div>
                    <u>Subsystem:</u>
                    <select 
                        value={formData.subsystem}
                        onChange={(e) => handleInputChange(e, 'subsystem')}>
                        <option value="" disabled>Select a subsystem</option>
                        {subsystems.map(subsystem => (
                            <option key={subsystem.subsystem_name} value={subsystem.subsystem_name}>
                                {subsystem.subsystem_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <u>Car year:</u>
                    <input 
                        type="text"
                        value={formData.car_year}
                        onChange={(e) => handleInputChange(e, 'car_year')} 
                        placeholder="" />
                </div>
                <div>
                    <u>Failure time:</u>
                    <input 
                        type="datetime-local"
                        value={formData.failure_time}
                        onChange={(e) => handleInputChange(e, 'failure_time')} 
                        placeholder="" />
                </div>
                <div>
                    <u>Failure description:</u>
                    <input 
                        type="text" 
                        placeholder=""
                        value={formData.failure_description}
                        onChange={(e) => handleInputChange(e, 'failure_description')} 
                        style={{ height: '60px' }} />
                </div>
                <div>
                    <u>Failure cause:</u>
                    <input 
                        type="text" 
                        value={formData.failure_cause}
                        onChange={(e) => handleInputChange(e, 'failure_cause')}
                        placeholder="" 
                    />
                </div>
                <div>
                    <u>Failure mechanism:</u>
                    <input 
                        type="text"
                        value={formData.failure_mechanism}
                        onChange={(e) => handleInputChange(e, 'failure_mechanism')} 
                        placeholder=""
                    />
                </div>
                <div>
                    <u>Corrective action plan:</u>
                    <input 
                        type="text" 
                        placeholder=""
                        value={formData.corrective_action_plan}
                        onChange={(e) => handleInputChange(e, 'corrective_action_plan')} 
                        style={{ height: '60px' }} 
                    />
                </div>
                <div>
                    <u>Comments:</u>
                    <input 
                        type="text" 
                        placeholder="" 
                        style={{ height: '80px' }} />
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
                        <input 
                            type="text" 
                            value={formData.record_creator}
                            onChange={(e) => handleInputChange(e, 'record_creator')}
                            placeholder="" />
                    </div>
                    <div>
                        <u>Record owner contact:</u>
                        <input 
                            type="text" 
                            value={formData.record_owner}
                            onChange={(e) => handleInputChange(e, 'record_owner')}
                            placeholder="" />
                    </div>
                    <div>
                        <u>Technical team lead:</u>
                        <input 
                            type="text"
                            value={formData.team_lead}
                            onChange={(e) => handleInputChange(e, 'team_lead')} 
                            placeholder="" />
                    </div>
                    <div>
                        <u>Report creation time:</u>
                        <input 
                            type="datetime-local"
                            value={formData.record_creation_time}
                            onChange={(e) => handleInputChange(e, 'record_creation_time')} 
                            placeholder="" />
                    </div>
                    <div>
                        <u>Review status:</u>
                        <input 
                            type="text" 
                            value={formData.is_resolved}
                            onChange={(e) => handleInputChange(e, 'is_resolved')}
                            placeholder="" />
                    </div>
                    <div>
                        <u>Due date:</u>
                        <input 
                            type="text"
                            value={formData.due_date}
                            onChange={(e) => handleInputChange(e, 'due_date')} 
                            placeholder="" />
                    </div>
                    <div>
                        <u>Time resolved:</u>
                        <input 
                            type="text" 
                            value={formData.resolve_date}
                            onChange={(e) => handleInputChange(e, 'resolve_date')} 
                            placeholder="unresolved" />
                    </div>
                </div>
            )}
            <div className="btnbox">
                <div className="botbtn">
                    <div className="left">Save draft</div>
                    <div className="right" onClick={handleSubmit}>Submit</div>
                </div>
            </div>
        </div>
    );
}

export default Report;
