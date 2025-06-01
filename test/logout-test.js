fetch("http://localhost:5000/api/v1/logout", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    // body: JSON.stringify({
    //     login: "nguyenvana",
    //     password: "123456"
    // })
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
