import React, { useState, useEffect } from 'react';
import '../styles/SearchReports.scss';
import * as api from "../api";
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
    const navigate = useNavigate();

    const handleViewClick = (result) => {
        navigate('/view', { state: { result } });
      };

      useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const teamResponse = await api.getTeams();
                setTeams(teamResponse.data);

                const subsystemResponse = await api.getSubsystems();
                setSubsystems(subsystemResponse.data);

                const carYearResponse = await api.getCars();
                setCarYears(carYearResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchInitialRecords = async () => {
            try {
                const response = await api.getRecords();
                setResults(response.data.results);
            } catch (error) {
                console.error("Error fetching initial records:", error);
            }
        };
        fetchInitialRecords();
    }, []);
    

    const handleSearch = async () => {
        try {
            const response = await api.searchRecords(searchQuery, formData);
            setResults(response.data.results);
            setPagination({
                next: response.next,
                previous: response.previous,
            });
        } catch (error) {
            console.error("Error searching records:", error);
        }
        setHasSearched(true);
    };

    const handlePreviousPage = async () => {
        if (!pagination.previous) return;
        try {
            const response = await api.getPageByURL(pagination.previous);
            setResults(response.results);
            setPagination({
                next: response.next,
                previous: response.previous,
            });
        } catch (error) {
            console.error("Error fetching previous page:", error);
        }
    };
    
    const handleNextPage = async () => {
        if (!pagination.next) return;
        try {
            const response = await api.getPageByURL(pagination.next);
            setResults(response.results);
            setPagination({
                next: response.next,
                previous: response.previous,
            });
        } catch (error) {
            console.error("Error fetching next page:", error);
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
                {hasSearched && (results?.length || 0) === 0 && (
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
