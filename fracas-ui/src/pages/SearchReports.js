import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SearchReports.scss';
import { useNavigate } from 'react-router-dom';

const SearchReports = () => {
    const [formData, setFormData] = useState({ team: '' });
    const [teams, setTeams] = useState([]);
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
                </div>
                <div className='results'>
                    {results.map((result, index) => (
                        <button onClick={() => handleViewClick(result)}>
                        {result.failure_title}
                    </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchReports;
