import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/ViewEdit.scss';

const ViewEdit = () => {
  const location = useLocation();
  const result = location.state?.result || {};
  const [showDetails, setShowDetails] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
  const [showAdditionalData, setShowAdditionalData] = useState(false);
  const [cars, setCars] = useState([]);
  const token = localStorage.getItem("token");

  const detailsMapping = {
    img1: {
      name: "Review Status",
      statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"],
    },
    img2: {
      name: "Record Validation Status",
      statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"],
    },
    img3: {
      name: "Analysis Validation Status",
      statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"],
    },
    img4: {
      name: "Correction Validation",
      statuses: ["Red for Unvalidated", "Green for Validated", "Grey for None"],
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

  const formatDateTime = (dateTime) => {
    return dateTime ? dateTime.slice(0, 16) : "";
  };

  const record_creator_id = result.record_creator;

  const [formData, setFormData] = useState({
    record_creator: result.record_creator,
    record_owner: result.record_owner,
    team: result.team,
    subsystem: result.subsystem,
    car_year: result.car_year,
    failure_time: formatDateTime(result.failure_time),
    failure_title: result.failure_title,
    failure_description: result.failure_description,
    failure_impact: result.failure_impact,
    failure_cause: result.failure_cause,
    failure_mechanism: result.failure_mechanism,
    corrective_action_plan: result.corrective_action_plan,
    team_lead: result.team_lead,
    record_creation_time: getCurrentDate(),
    due_date: getCurrentDate(),
    resolve_date: getCurrentDate(),
    resolution_status: result.resolution_status,
    // review_date: '',
    is_resolved: result.is_resolved,
    is_record_validated: result.is_record_validated,
    is_analysis_validated: result.is_analysis_validated,
    is_correction_validated: result.is_correction_validated,
    is_reviewed: result.is_reviewed,
  });

  const [users, setUsers] = useState([]);

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const [allUsers, setAllusers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setAllusers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  if (allUsers.length !== 0) {
    allUsers.results.map((data) => {
      if (data.user_id === result.record_creator) {
        formData.record_creator = data.first_name + " " + data.last_name;
        formData.record_owner = data.first_name + " " + data.last_name;
      }
    });
  }

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/teams/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [token]);

  const [subsystems, setSubsystems] = useState([]);

  useEffect(() => {
    const fetchSubsystems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/subsystems/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setSubsystems(response.data);
      } catch (error) {
        console.error("Error fetching subsystems:", error);
      }
    };

    fetchSubsystems();
  }, [token]);

  const filteredSubsystems = formData.team ? subsystems?.results?.filter((subsystem) => subsystem.parent_team === formData.team) : [];

  useEffect(() => {
    if (teams.length !== 0 && formData.team) {
      const selectedTeam = teams.results.find((team) => team.team_name === formData.team);
      if (selectedTeam && allUsers.results) {
        allUsers.results.map((user) => {
          if (user.user_id === selectedTeam.team_lead) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              team_lead: `${user.first_name} ${user.last_name}`,
            }));
          }
        });
      }
    }
  }, [teams, formData.team, allUsers.results, setFormData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cars/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCars(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  const isUserAllowedToEdit = users.first_name + " " + users.last_name === formData.record_owner;

  const handleSubmit = async () => {
    if (!isUserAllowedToEdit) {
      alert("You do not have permission to edit this record.");
      return;
    }
    try {
      const recordId = result.record_id; // Assume you have record id in the result object
      const payload = {
        ...formData,
        record_creator: record_creator_id,
        record_owner: record_creator_id,
      };
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const response = await axios.put(
        `http://127.0.0.1:8000/api/records/${recordId}/`, // Template string used to insert recordId into URL
        payload,
        config
      );
      if (response.status === 200) {
        navigate("/userdashboard");
      } else {
        throw new Error("Failed to update the record");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Field value error:", error.response.data);
      } else if (error.response && error.response.status === 403) {
        console.error("Permission denied:", error.response.data.detail);
      } else {
        console.error("Error submitting data:", error);
      }
    }
  };

  return (
    <div className="view-container">
      <div className="mainbox w">
        <div className="topimg">
          <h1>
            FRACAS
            <br />
            REPORT SUBMIT
          </h1>
        </div>
        <h4>UWA MOTORSPORT FRACAS REPORT</h4>
        <ul className="list w">
          {Object.keys(detailsMapping).map((iconId, index) => (
            <li key={index} onClick={() => handleIconClick(iconId)}>
              <span>{["RS", "RVS", "AVS", "CVS"][index]}</span>
              <img src={`/images/info.png`} alt="" id={iconId} />
            </li>
          ))}
        </ul>
        {showDetails && (
          <div className="details">
            <h4 style={{ textAlign: "center", height: "30px", marginTop: "-10px" }}>info</h4>
            <span className="x" onClick={() => setShowDetails(false)}>
              x
            </span>
            <div>
              <span>wholeName: </span>
              <span style={{ color: "rgb(255, 255, 255)" }}>{detailInfo.name}</span>
            </div>
            <div>
              <span>status: </span>
              {detailInfo.statuses.map((status, index) => (
                <span key={index} style={{ color: "rgb(255, 255, 255)" }}>
                  {status}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="inpbox">
          <div>
            <u>Failure Title:</u>
            <input type="text" value={formData.failure_title} onChange={(e) => handleInputChange(e, "failure_title")} placeholder="" />
          </div>
          <div>
            <u>Record creator:</u>
            <input type="text" value={formData.record_creator} onChange={(e) => handleInputChange(e, "record_creator")} placeholder="" />
          </div>
          <div>
            <u>Record owner:</u>
            <input type="text" value={formData.record_owner} onChange={(e) => handleInputChange(e, "record_owner")} placeholder="" />
          </div>
          <div>
            <u>Technical team:</u>
            <select value={formData.team} onChange={(e) => handleInputChange(e, "team")}>
              <option value="" disabled>
                Select a team
              </option>
              {teams.results ? ( // Check if teams.results is defined
                teams.results.map((team) => (
                  <option key={team.team_name} value={team.team_name}>
                    {team.team_name}
                  </option>
                ))
              ) : (
                <></> // Render nothing if teams.results is not defined
              )}
            </select>
          </div>
          <div>
            <u>Subsystem:</u>
            <select value={formData.subsystem} onChange={(e) => handleInputChange(e, "subsystem")}>
              <option value="" disabled>
                Select a subsystem
              </option>
              {filteredSubsystems?.length > 0 ? (
                filteredSubsystems.map((subsystem) => (
                  <option key={subsystem.subsystem_name} value={subsystem.subsystem_name}>
                    {subsystem.subsystem_name}
                  </option>
                ))
              ) : (
                <></>
              )}
            </select>
          </div>
          <div>
            <u>Car year:</u>
            <select value={formData.car_year} onChange={(e) => handleInputChange(e, "car_year")}>
              <option value="">Select a car year</option>
              {cars.map((car, index) => (
                <option key={index} value={car.car_year}>
                  {car.car_nickname ? `${car.car_year} - ${car.car_nickname}` : car.car_year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <u>Failure time:</u>
            <input type="datetime-local" value={formData.failure_time} onChange={(e) => handleInputChange(e, "failure_time")} placeholder="" />
          </div>
          <div>
            <u>Failure description:</u>
            <input
              type="text"
              placeholder=""
              value={formData.failure_description}
              onChange={(e) => handleInputChange(e, "failure_description")}
              style={{ height: "60px" }}
            />
          </div>
          <div>
            <u>Failure cause:</u>
            <input type="text" value={formData.failure_cause} onChange={(e) => handleInputChange(e, "failure_cause")} placeholder="" />
          </div>
          <div>
            <u>Failure mechanism:</u>
            <input type="text" value={formData.failure_mechanism} onChange={(e) => handleInputChange(e, "failure_mechanism")} placeholder="" />
          </div>
          <div>
            <u>Corrective action plan:</u>
            <input
              type="text"
              placeholder=""
              value={formData.corrective_action_plan}
              onChange={(e) => handleInputChange(e, "corrective_action_plan")}
              style={{ height: "60px" }}
            />
          </div>
          <div>
            <u>Comments:</u>
            <input type="text" placeholder="" style={{ height: "80px" }} />
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
              <input type="text" value={formData.record_creator} onChange={(e) => handleInputChange(e, "record_creator")} placeholder="" />
            </div>
            <div>
              <u>Record owner contact:</u>
              <input type="text" value={formData.record_owner} onChange={(e) => handleInputChange(e, "record_owner")} placeholder="" />
            </div>
            <div>
              <u>Technical team lead:</u>
              <input type="text" value={formData.team_lead} onChange={(e) => handleInputChange(e, "team_lead")} placeholder="" />
            </div>
            <div>
              <u>Report creation time:</u>
              <input
                type="datetime-local"
                value={formData.record_creation_time}
                onChange={(e) => handleInputChange(e, "record_creation_time")}
                placeholder=""
              />
            </div>
            <div>
              <u>Review status:</u>
              <input type="text" value={formData.is_resolved} onChange={(e) => handleInputChange(e, "is_resolved")} placeholder="" />
            </div>
            <div>
              <u>Due date:</u>
              <input type="text" value={formData.due_date} onChange={(e) => handleInputChange(e, "due_date")} placeholder="" />
            </div>
            <div>
              <u>Time resolved:</u>
              <input type="text" value={formData.resolve_date} onChange={(e) => handleInputChange(e, "resolve_date")} placeholder="unresolved" />
            </div>
          </div>
        )}
        <div className="btnbox">
          <div className="botbtn">
            <div className="right" onClick={handleSubmit}>
              Submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEdit;
