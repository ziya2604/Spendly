const BASE_URL = 'http://localhost:8000';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const api = {
    get: (url) => fetch(`${BASE_URL}${url}`, {
        headers: getHeaders()
    }).then(res => res.json()),

    post: (url, data) => fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(res => res.json()),

    patch: (url, data) => fetch(`${BASE_URL}${url}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    }).then(res => res.json()),

    delete: (url) => fetch(`${BASE_URL}${url}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(res => res.json()),
};