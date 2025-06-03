fetch("http://localhost:5000/api/v1/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        userCode: "U10099",
        name: "Nguyen Van A",
        login: "nguyenvana",
        dob: "1995-06-25",
        role: "Student",
        password: "123456"
    })
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
