import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import "../styles/Report.scss";

const Report = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
  const [showAdditionalData, setShowAdditionalData] = useState(false);
  const [cars, setCars] = useState([]);
  const token = localStorage.getItem('token')

  const detailsMapping = {
    img1: {
      name: "Record Resolved Status",
      statuses: ["Red for Not Resolved, ", "Green for Resolved"],
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
      name: "Correction Validation Status",
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

  const [formData, setFormData] = useState({
    record_creator: "",
    record_owner: "",
    team: "",
    subsystem: "",
    car_year: "",
    failure_time: "",
    failure_title: "",
    failure_description: "",
    failure_impact: "",
    failure_cause: "",
    failure_mechanism: "",
    corrective_action_plan: "",
    team_lead: "",
    // record_creation_time: getCurrentDate(),
    due_date: null,
    resolve_date: null,
    resolution_status: "",
    // review_date: '',
    is_resolved: false,
    is_record_validated: false,
    is_analysis_validated: false,
    is_correction_validated: false,
    is_reviewed: false,
    record_editors: [],
  });

  const [users, setUsers] = useState([]);

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.createRecord(token, formData);
      navigate("/userdashboard");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getCurrentUser(token);
        setUsers(response.data);
        if (response.data.team) {
          setFormData(prevState => ({
            ...prevState,
            team: response.data.team
          }));
        }
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
        const response = await api.getAllUsers(token);
        setAllusers(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (users.first_name && users.last_name) {
      setFormData(prevState => ({
          ...prevState,
          record_creator: users.user_id, // store the user_id
          record_owner: users.user_id // store the user_id
      }));
    }
}, [users]);

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.getTeams(token);
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
        const response = await api.getSubsystems(token);
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
      const selectedTeam = teams?.find((team) => team.team_name === formData.team);
      if (selectedTeam) {
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
        const response = await api.getCars(token);
        setCars(response.data);
        if (response.data.length > 0) {
          setFormData(prevState => ({
            ...prevState,
            car_year: response.data[0].car_year
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  const getUserNameById = (userId) => {
    const user = allUsers.find(u => u.user_id === parseInt(userId));
    return user ? `${user.first_name} ${user.last_name}` : '';
  }
  
  // Selected editors
  const [selectedUsers, setSelectedUsers] = useState([]); // to store selected users from the dropdown
  // Synchronise selected editors with formData
  useEffect(() => {
    const existedEditors = allUsers.filter(user => formData.record_editors.includes(user.user_id));
    setSelectedUsers(existedEditors);
  }, [allUsers, formData.record_editors]);
  const addUserToEditors = (user) => {
    if (!formData.record_editors.includes(user.user_id)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        record_editors: [...prevFormData.record_editors, user.user_id],
      }));
    }
  };
  const removeUserFromEditors = (user) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      record_editors: prevFormData.record_editors.filter((id) => id !== user.user_id),
    }));
  };


  return (
    <div className="report-container">
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
            <li key={index}
            style={{
              backgroundColor: formData.is_resolved && iconId === 'img1'
                ? 'rgb(153, 248, 150)'
                : formData.is_record_validated && iconId === 'img2'
                ? 'rgb(153, 248, 150)'
                : formData.is_analysis_validated && iconId === 'img3'
                ? 'rgb(153, 248, 150)'
                : formData.is_correction_validated && iconId === 'img4'
                ? 'rgb(153, 248, 150)'
                : 'rgb(253, 125, 125)',
            }}>
              <span onClick={() => handleStatusClick(iconId)}>{["RRS", "RVS", "AVS", "CVS"][index]}</span>
              <img src={`/images/info.png`} alt="" id={iconId}  onClick={() => handleIconClick(iconId)}/>
            </li>
          ))}
        </ul>
        {showDetails && (
        <div className="details">
          <h4>INFO</h4>
          <span className="x" onClick={() => setShowDetails(false)}>
            [x]
          </span>
          <div>
            <span>Full Name: </span>
            <span style={{ color: "rgb(0, 0, 0)" }}>{detailInfo.name}</span>
          </div>
          <div>
            <span>Status: </span>
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
            <select value={formData.record_creator} onChange={(e) => handleInputChange(e, "record_creator")}>
              {allUsers?.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
              <u>Record owner:</u>
              <select value={formData.record_owner} onChange={(e) => handleInputChange(e, "record_owner")}>
                {allUsers.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
          </div>
          <div>
            <u>Technical team:</u>
            <select value={formData.team} onChange={(e) => handleInputChange(e, "team")}>
              <option value="" disabled>
                Select a team
              </option>
              {teams ? (
                teams?.map((team) => (
                  <option key={team.team_name} value={team.team_name}>
                    {team.team_name}
                  </option>
                ))
              ) : (
                <></> 
              )}
            </select>
          </div>
          <div>
            <u>Subsystem:</u>
            <select value={formData.subsystem} onChange={(e) => handleInputChange(e, "subsystem")}>
              <option value="" disabled>
                Select a subsystem
              </option>
              {filteredSubsystems.length > 0 ? (
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

            <input type="datetime-local" value={formData.failure_time} onChange={(e) => handleInputChange(e, "failure_time")} />

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
            <input type="text" placeholder="Add comments after you've submitted a report" readOnly/>
          </div>
        </div>
        <div className="shoubox">
          <h4>Additional Data Folder</h4>
          <span onClick={() => setShowAdditionalData(!showAdditionalData)}></span>
        </div>
        {showAdditionalData && (
          <div className="inpbox">
            <div>
              <u>Record creator:</u>
              <input type="text" value={getUserNameById(formData.record_creator)} readOnly />
            </div>
            <div>
              <u>Record owner contact:</u>
              <input type="text" value={getUserNameById(formData.record_owner)} readOnly />
            </div>
            <div>
              <u>Technical team lead:</u>
              <input type="text" value={formData.team_lead} readOnly />
            </div>
            <div>
              <u>Review status:</u>
              <input type="text" value={formData.is_reviewed} onChange={(e) => handleInputChange(e, "is_reviewed")} placeholder="" />
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
            <div>
              <u>Record editors:</u>
              <select onChange={(e) => {
                const selectedUserId = parseInt(e.target.value);
                if (selectedUserId) {
                  const selectedUser = allUsers.find((user) => user.user_id === selectedUserId);
                  if (selectedUser) {
                    addUserToEditors(selectedUser);
                  }
                }
              }}>
                <option value="" disabled>
                  Select a user
                </option>
                {allUsers.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
            {selectedUsers.map((user) => (
            <div key={user.user_id}>
              <u>Selected Editor: </u>
              <input type="text" value={`${user.first_name} ${user.last_name}`} placeholder="" />
              <button className="editorDelete" onClick={() => removeUserFromEditors(user)}>[X]</button>
            </div>
            ))}
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

export default Report;
