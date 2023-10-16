import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000/api";
export const BASE_URL_NEW = "http://127.0.0.1:8000"

const headers = (token) => ({
    Authorization: `Token ${token}`,
});

export const getCurrentUser = (token) => {
    return axios.get(`${BASE_URL}/users/me/`, { headers: headers(token) });
}

export const getAllUsers = (token, ordering = 'last_name,first_name') => {
    return axios.get(`${BASE_URL}/users/?ordering=${ordering}`, { headers: headers(token) });
}

export const getTeams = (token, ordering = 'team_name') => {
    return axios.get(`${BASE_URL}/teams/?ordering=${ordering}`, { headers: headers(token) });
}

export const getSubsystems = (token, ordering = 'subsystem_name') => {
    return axios.get(`${BASE_URL}/subsystems/?ordering=${ordering}`, { headers: headers(token) });
}

export const getCars = (token, ordering = '-car_year') => {
    return axios.get(`${BASE_URL}/cars/?ordering=${ordering}`, { headers: headers(token) });
}

export const updateRecord = (token, recordId, formData) => {
    return axios.put(`${BASE_URL}/records/${recordId}/`, formData, { headers: headers(token) });
}

export const createRecord = (token, formData) => {
    return axios.post(`${BASE_URL}/records/`, formData, { headers: headers(token) });
}

export const getRecords = (token) => {
    return axios.get(`${BASE_URL}/records/`, { headers: headers(token) });
}

export const searchRecords = (token, query, formData) => {
    let url = `${BASE_URL}/records/?search=${query}`;
    if (formData.team) url += `&team__team_name=${formData.team}`;
    if (formData.subsystem) url += `&subsystem__subsystem_name=${formData.subsystem}`;
    if (formData.carYear) url += `&car_year__car_year=${formData.carYear}`;

    return axios.get(url, { headers: headers(token) });
}

export const getPageByURL = (token, url) => {
    return axios.get(url, { headers: headers(token) });
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

export const logoutUser = async (token) => {
    try {
        const response = await axios.post(`${BASE_URL}/logout`, {}, { headers: headers(token) });
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
        const response = await axios.post(`${BASE_URL_NEW}/auth/users/reset_password/`, { email }, {
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
        if (response.status === 403) {
            throw new Error("Already activated.");
        }
        if (response.status !== 204) {
            throw new Error(`Request failed with status code ${response.status}`);
        }
        
        return response.data;
    } catch (error) {
        throw error;
    }
};
