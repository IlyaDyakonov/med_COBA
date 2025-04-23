import axios from 'axios';
// import Cookies from 'js-cookie';


export const BASE_URL = 'http://localhost:8000/api';
// export const BASE_URL = 'http://89.111.154.234:80/api';

const getCookie = (name: string): string | null => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};


export async function signUp(data: { email: string; password: string; username: string }) {
    try {
        const response = await axios.post(`${BASE_URL}/register/`, data, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken') || '', // Получаем CSRF-токен из cookie
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Включаем передачу кук
        });
        if (response.status === 201) {
            const token = await response.data;
            console.log('смотрим что в токене при регестрации:', token);


            if (token) {
                localStorage.setItem('token', token);
                console.log('Token saved:', token);
            } else {
                console.error('Token not found in response');
            }
            return response.data;
        }
    } catch (error) {
        console.error(error);
        console.log(data);

        throw error;
    }
}

export async function logIn(username: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/login/`, {
            method: 'POST',
            credentials: 'include', // Включаем передачу кук
            headers: {
                'X-CSRFToken': getCookie('csrftoken') || '', // Получаем CSRF-токен из cookie
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        if (!response.ok) {
            throw new Error('Ошибка авторизации');
        }
        const data = await response.json();
        console.log('Ответ при логине:', data); // Проверяем, что приходит в ответе
        if (data.token) {
            // Сохраняем токен в localStorage
            localStorage.setItem('token', data.token);
            console.log('Токен сохранен:', data.token);
        } else {
            console.error('Токен не найден в ответе');
        }
        // Сохраняем токен в localStorage после успешной авторизации
        // localStorage.setItem('token', data.token);
        // console.log('смотрим что в дата:', data.token);
        return data;
        // return response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function logOut(username: string) {
    try {
        console.log('логоут');
        const response = await fetch(`${BASE_URL}/logout/`, {
            method: 'POST',
            credentials: 'include', // Включаем передачу кук
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                // cookie: `sessionid=${getCookie('sessionid')}`,
            },
            body: JSON.stringify({ username: username }),
        });

        if (!response.ok) {
            throw new Error('Ошибка при выходе');
        }
        // const data = await response.json();
        // Сохраняем токен в localStorage после успешной авторизации
        localStorage.removeItem('token');
        return response
    } catch (error) {
        console.error('Logout request failed:', error);
        throw error;
    }
}

// ____________________________________________________________________________________________________
// АДМИН ПАНЕЛЬ!

export async function getUserList() {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/detail_users_list/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });
        console.log('смотрим что в ответе:', response.data);
        if (response.status !== 200) {
            throw new Error('Request failed');
        }
        return await response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export function deleteUser(id: number) {
    try {
        const token = localStorage.getItem("token");
        return axios.delete(`${BASE_URL}/delete_user/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                'Authorization': `Token ${token}`,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export async function patchUser(id: number, isStaff: boolean, isSuperuser: boolean) {
    try {
        const token = localStorage.getItem("token");
        console.log(`смотрим id ${id}`);
        console.log(`смотрим isStaff ${isStaff}`);
        console.log(`смотрим isSuperuser ${isSuperuser}`);
        
        if (isStaff !== isSuperuser) {
            console.log(`ВЫЗВАЛСЯ ЭТОТ УЧАСТОК`);
            console.log(`смотрим isStaff ${isStaff}`);
            console.log(`смотрим isSuperuser ${isSuperuser}`);
            isSuperuser = isStaff;
            console.log(`_______________________________+++`);
            console.log(`смотрим isStaff ${isStaff}`);
            console.log(`смотрим isSuperuser ${isSuperuser}`);
        }
        console.log(`__________________________________`);
        return await axios.patch(`${BASE_URL}/auth/${id}/`, {
            is_staff: isStaff,
            is_superuser: isSuperuser,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') || '',
                'Authorization': `Token ${token}`,
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
