fetch("http://localhost:5000/api/v1/my-course", {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
    },
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
