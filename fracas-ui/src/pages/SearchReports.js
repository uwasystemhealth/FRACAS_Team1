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
    const [pagination, setPagination] = useState({
        next: null, // URL for the next page
        previous: null, // URL for the previous page
    });
    const [hasSearched, setHasSearched] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleViewClick = (result) => {
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
                setTeams(teamResponse.data);
                const subsystemResponse = await axios.get("http://127.0.0.1:8000/api/subsystems/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setSubsystems(subsystemResponse.data);
                const carYearResponse = await axios.get("http://127.0.0.1:8000/api/cars/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setCarYears(carYearResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInitialData();
    }, [token]);

    useEffect(() => {
        const fetchInitialRecords = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/records/", {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setResults(response.data.results);
            } catch (error) {
                console.error("Error fetching initial records:", error);
            }
        };
    
        fetchInitialRecords();
    }, [token]);
    

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
            setPagination({
                next: response.data.next,
                previous: response.data.previous,
            });
        } catch (error) {
            console.error(error);
        }
        setHasSearched(true);
    };

    // Fetch results for previous page
    const handlePreviousPage = async () => {
        try {
            if (pagination.previous){
                let url = pagination.previous
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setResults(response.data.results);
                setPagination({
                    next: response.data.next,
                    previous: response.data.previous,
                });
            }
            
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch results for next page
    const handleNextPage = async () => {
        try {
            if (pagination.next){
                let url = pagination.next
                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setResults(response.data.results);
                setPagination({
                    next: response.data.next,
                    previous: response.data.previous,
                });
            }
            
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
        <div className='search-report'>
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
                            {teams?.map((team, index) => (
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
                            {subsystems?.map((subsystem, index) => (
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
                            {carYears?.map((year, index) => (
                                <option key={index} value={year.car_year}>
                                    {year.car_year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='results'>
                    {results?.map((result, index) => (
                        <button key={result.record_id} onClick={() => handleViewClick(result)}>
                        {result.failure_title || "[no_title]"}
                    </button>
                    ))}
                </div>
                {hasSearched && results.length === 0 && (
                    <div className='not-found'>
                        <p>No results found</p>
                    </div>
                )}

                <div className='pagination-container'>
                    <button onClick={handlePreviousPage}>&lt; Previous</button>
                    <button onClick={handleNextPage}>Next &gt;</button>
                </div>
            </div>
        </div>
    );
};

export default SearchReports;
