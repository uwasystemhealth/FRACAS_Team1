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
  let recordCreatorName, recordOwnerName;

  const detailsMapping = {
    img1: {
      name: "Review Status",
      statuses: ["Red for Not Reviewed, ", "Green for Reviwed"],
    },
    img2: {
      name: "Record Validation Status",
      statuses: ["Red for Unvalidated, ", "Green for Validated"],
    },
    img3: {
      name: "Analysis Validation Status",
      statuses: ["Red for Unvalidated, ", "Green for Validated"],
    },
    img4: {
      name: "Correction Validation",
      statuses: ["Red for Unvalidated, ", "Green for Validated"],
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

  const handleStatusClick = (iconId) => {
    setFormData((prevData) => ({
      ...prevData,
      is_resolved: iconId === 'img1' ? !prevData.is_resolved : prevData.is_resolved,
      is_record_validated: iconId === 'img2' ? !prevData.is_record_validated : prevData.is_record_validated,
      is_analysis_validated: iconId === 'img3' ? !prevData.is_analysis_validated : prevData.is_analysis_validated,
      is_correction_validated: iconId === 'img4' ? !prevData.is_correction_validated : prevData.is_correction_validated,
    }));
  };

  const formatDateTime = (dateTime) => {
    return dateTime ? dateTime.slice(0, 16) : "";
  };

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
    record_creation_time: formatDateTime(result.record_creation_time),
    due_date: formatDateTime(result.due_date) === "" ? null : formatDateTime(result.due_date),
    resolve_date: formatDateTime(result.resolve_date) === "" ? null : formatDateTime(result.resolve_date),
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
    allUsers?.map((data) => {
      if (data.user_id === result.record_creator) {
        recordCreatorName = data.first_name + " " + data.last_name;
        recordOwnerName = data.first_name + " " + data.last_name;
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

  const filteredSubsystems = formData.team ? subsystems?.filter((subsystem) => subsystem.parent_team === formData.team) : [];

  useEffect(() => {
    if (teams.length !== 0 && formData.team) {
      const selectedTeam = teams.find((team) => team.team_name === formData.team);
      if (selectedTeam && allUsers) {
        allUsers?.map((user) => {
          if (user.user_id === selectedTeam.team_lead) {
            setFormData((prevFormData) => ({
              ...prevFormData,
              team_lead: `${user.first_name} ${user.last_name}`,
            }));
          }
        });
      }
    }
  }, [teams, formData.team, allUsers, setFormData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/cars/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setCars(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  const isUserAllowedToEdit = users.first_name + " " + users.last_name === recordCreatorName;

  const handleSubmit = async () => {
    if (!isUserAllowedToEdit) {
      alert("You do not have permission to edit this record.");
      return;
    }
    try {
      const recordId = result.record_id; // Assume you have record id in the result object
      const payload = {
        ...formData
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
          {Object.keys(detailsMapping)?.map((iconId, index) => (
            <li key={index}>
              <span onClick={() => handleStatusClick(iconId)}>{["RS", "RVS", "AVS", "CVS"][index]}</span>
              <img src={`/images/info.png`} alt="" id={iconId}  onClick={() => handleIconClick(iconId)}/>
            </li>
          ))}
        </ul>
        {showDetails && (
        <div className="details">
          <h4>info</h4>
          <span className="x" onClick={() => setShowDetails(false)}>
            [x]
          </span>
          <div>
            <span>wholeName: </span>
            <span style={{ color: "rgb(0, 0, 0)" }}>{detailInfo.name}</span>
          </div>
          <div>
            <span>status: </span>
            {detailInfo.statuses?.map((status, index) => (
              <span key={index} style={{ color: "rgb(0, 0, 0)" }}>
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
            <input type="text" value={recordCreatorName} readOnly />
          </div>
          <div>
            <u>Record owner:</u>
            <input type="text" value={recordOwnerName} readOnly />
          </div>
          <div>
            <u>Technical team:</u>
            <select value={formData.team} onChange={(e) => handleInputChange(e, "team")}>
              <option value="" disabled>
                Select a team
              </option>
              {teams ? ( // Check if teams.results is defined
                teams?.map((team) => (
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
                filteredSubsystems?.map((subsystem) => (
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
              {cars?.map((car, index) => (
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
              <input type="text" value={formData.record_creator} readOnly />
            </div>
            <div>
              <u>Record owner contact:</u>
              <input type="text" value={formData.record_owner} readOnly />
            </div>
            <div>
              <u>Technical team lead:</u>
              <input type="text" value={formData.team_lead} readOnly />
            </div>
            <div>
              <u>Report creation time:</u>
              <input
                type="datetime-local"
                value={formData.record_creation_time}
                placeholder=""
                readOnly
              />
            </div>
            <div>
              <u>Review status:</u>
              <input type="text" value={formData.is_reviwed} onChange={(e) => handleInputChange(e, "is_reviwed")} placeholder="" />
            </div>
            <div>
              <u>Due date:</u>
              <input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => handleInputChange(e, "due_date")}
                placeholder=""
              />
            </div>
            <div>
              <u>Time resolved:</u>
              <input
                  type="datetime-local"
                  value={formData.resolve_date || ""}
                  onChange={(e) => handleInputChange(e, "resolve_date")}
                  placeholder=""
              />
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
