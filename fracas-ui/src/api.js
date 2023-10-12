import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000/api";
export const BASE_URL_NEW = "http://127.0.0.1:8000"
const token = localStorage.getItem("token");

const headers = () => ({
    Authorization: `Token ${token}`,
});

export const getCurrentUser = (tokenOverride = null) => {
    return axios.get(`${BASE_URL}/users/me/`, { 
        headers: tokenOverride ? { Authorization: `Token ${tokenOverride}` } : headers() 
    });
}

export const getAllUsers = (ordering = 'last_name,first_name') => {
    return axios.get(`${BASE_URL}/users/?ordering=${ordering}`, { headers: headers() });
}

export const getTeams = (ordering = 'team_name') => {
    return axios.get(`${BASE_URL}/teams/?ordering=${ordering}`, { headers: headers() });
}

export const getSubsystems = (ordering = 'subsystem_name') => {
    return axios.get(`${BASE_URL}/subsystems/?ordering=${ordering}`, { headers: headers() });
}

export const getCars = (ordering = '-car_year') => {
    return axios.get(`${BASE_URL}/cars/?ordering=${ordering}`, { headers: headers() });
}

export const updateRecord = (recordId, formData) => {
    return axios.put(`${BASE_URL}/records/${recordId}/`, formData, { headers: headers() });
}

export const createRecord = (formData) => {
    return axios.post(`${BASE_URL}/records/`, formData, { headers: headers() });
}

export const getRecords = () => {
    return axios.get(`${BASE_URL}/records/`, { headers: headers() });
}

export const searchRecords = (query, formData) => {
    let url = `${BASE_URL}/records/?search=${query}`;
    if (formData.team) url += `&team__team_name=${formData.team}`;
    if (formData.subsystem) url += `&subsystem__subsystem_name=${formData.subsystem}`;
    if (formData.carYear) url += `&car_year__car_year=${formData.carYear}`;

    return axios.get(url, { headers: headers() });
}

export const getPageByURL = (url) => {
    return axios.get(url, { headers: headers() });
}

export const registerUser = async (userDetails) => {
    try {
        const response = await axios.post(`${BASE_URL_NEW}/auth/users/`, userDetails, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.status !== 201) {
            throw new Error(response.data);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.status !== 200) {
            throw new Error(response.data);
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async (tokenOverride = null) => {
    try {
        const response = await axios.post(`${BASE_URL}/logout`, {}, {
            headers: tokenOverride ? { Authorization: `Token ${tokenOverride}` } : headers()
        });
        if (response.status !== 200) {
            throw new Error(response.data);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPasswordEmail = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL_NEW}/auth/users/reset_email/`, { email }, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.status !== 204) {
            throw new Error("Failed to send reset email");
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const activateAccount = async (uid, token) => {
    try {
        const response = await axios.post(`${BASE_URL_NEW}/auth/users/activation/`, {
            uid,
            token,
        });
        
        if (response.status !== 200) {
            throw new Error(response.data);
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
};
