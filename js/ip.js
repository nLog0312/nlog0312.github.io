const requestOptions = {
    method: "GET",
    redirect: "follow"
  };
  
fetch("https://ipgeolocation.abstractapi.com/v1?api_key=722ce31c48d94c48b034237c4e32997e", requestOptions)
.then((response) => response.text())
.then((result) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Master-key", "$2a$10$AWN6RDRw6Rf0vv6Y6NzPJeMk.oSA/92LTzmor5kyum2xgicbHgG9e");

    const raw = JSON.stringify(JSON.parse(result));

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://api.jsonbin.io/v3/b", requestOptions)
    .then((response) => response.text())
    .catch((error) => console.error(error));
})
.catch((error) => console.error(error));