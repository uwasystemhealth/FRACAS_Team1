import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SearchReports.scss';
import { useNavigate } from 'react-router-dom';

const SearchReports = () => {
    const [formData, setFormData] = useState({ team: '', subsystem: '', carYear: '' });
    const [teams, setTeams] = useState([]);
    const [subsystems, setSubsystems] = useState([]);
    const [carYears, setCarYears] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleViewClick = (result) => {
        console.log("result--->", result)
        navigate('/view', { state: { result } });
      };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const teamResponse = await axios.get("http://127.0.0.1:8000/api/teams/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setTeams(teamResponse.data.results);
                const subsystemResponse = await axios.get("http://127.0.0.1:8000/api/subsystems/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setSubsystems(subsystemResponse.data.results);
                const carYearResponse = await axios.get("http://127.0.0.1:8000/api/cars/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setCarYears(carYearResponse.data.results);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async () => {
        try {
            let url = `http://127.0.0.1:8000/api/records/?search=${searchQuery}`;
            if (formData.team) url += `&team__team_name=${formData.team}`;
            if (formData.subsystem) url += `&subsystem__subsystem_name=${formData.subsystem}`;
            if (formData.carYear) url += `&car_year__car_year=${formData.carYear}`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            setResults(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e, field) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    return (
        <>
            <div className="usertopimg">
                <h1>SEARCH<br />REPORTS</h1>
            </div>
            <div className='searchmainbox searchw'>
                <div className='searchmain'>
                    <input 
                        className='searchfield'
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className='filters'>
                    <div className='filter'>
                        <span>Team:</span>
                        <select 
                            value={formData.team} 
                            onChange={(e) => handleInputChange(e, 'team')}>
                            <option value="">Select a team</option>
                            {teams.map((team, index) => (
                                <option key={index} value={team.team_name}>
                                    {team.team_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='filter'>
                        <span>Subsystem:</span>
                        <select 
                            value={formData.subsystem} 
                            onChange={(e) => handleInputChange(e, 'subsystem')}>
                            <option value="">Select a subsystem</option>
                            {subsystems.map((subsystem, index) => (
                                <option key={index} value={subsystem.subsystem_name}>
                                    {subsystem.subsystem_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='filter'>
                        <span>Car Year:</span>
                        <select 
                            value={formData.carYear} 
                            onChange={(e) => handleInputChange(e, 'carYear')}>
                            <option value="">Select a car year</option>
                            {carYears.map((year, index) => (
                                <option key={index} value={year.car_year}>
                                    {year.car_year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='results'>
                    {results.map((result, index) => (
                        <button onClick={() => handleViewClick(result)}>
                        {result.failure_title || "[no_title]"}
                    </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchReports;
