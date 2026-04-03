fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
    .then(res => res.json().then(data => ({ status: res.status, data })))
    .then(obj => console.log('RESPONSE:', obj))
    .catch(err => console.error('ERROR:', err));
