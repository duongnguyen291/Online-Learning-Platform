fetch("http://localhost:5000/api/v1/login", {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        login: "alice.smith@email.com",
        password: "alice123"
    })
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
