import React from 'react';
import '../styles/SearchReports.scss'

const SearchReports = () => {
    return (
        <div className="searchmainbox searchw">
            <div className="top">
                <span>SearchReports</span>
            </div>
            <div className="searchmain">
                <span className="span1">Search for:</span>
                <div className="list">
                    {['Your Reports', 'Others Reports', 'All'].map((report, index) => (
                        <div key={index} style={{ width: '155px', height: '100%' }}>
                            <input type="radio" id={`radio${index}`} />
                            <label htmlFor={`radio${index}`} style={{ color: 'rgb(71, 71, 71)' }}>
                                &nbsp;&nbsp;{report}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="box">
                    <div className="left">
                        <span className="title">Search filters</span>
                        <div className="xuanze">
                            {Array(2).fill(null).map((_, index) => (
                                <div key={index}>
                                    <select name="" id="">
                                        <option value="123">Any field</option>
                                    </select>
                                    <select name="" id="">
                                        <option value="123">{index === 0 ? 'containsEnter' : 'contains'}</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="&nbsp;&nbsp;&nbsp;Enter a search term"
                                        style={index === 1 ? { width: '200px' } : {}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="right">
                        {['Tech Team', 'Car Year', 'Start Date:', 'End Date:'].map((label, index) => (
                            <React.Fragment key={index}>
                                <span className="s1">{label}</span>
                                {['All Teams', 'Any Year', 'Day', 'Month', 'Start Year'].map((option, idx) => (
                                    <select key={idx} className={index > 1 ? 'sel2' : ''}>
                                        <option value="">{option}</option>
                                    </select>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchReports;
