import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from 'axios';

const ActivateAccount = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('http://127.0.0.1:8000/auth/users/activation/', { uid: uid, token: token })
            .then(() => {
                navigate('/login');
                alert('Activation successful!');
            })
            .catch(err => {
                if (err.response) {
                    alert('Failed to activate account: ' + err.response.data);
                } else {
                    alert('Failed to activate account: ' + err.message);
                }
            });
    }, [navigate, token, uid]);

    return null;
};

export default ActivateAccount;