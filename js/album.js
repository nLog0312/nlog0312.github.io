// Upload
let imageUrl = '';

function uploadImage() {
    const fileInput = document.getElementById("inputImage");

    if (fileInput.files.length === 0) {
        alert("Vui lòng chọn một file!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const myHeaders = new Headers();
    myHeaders.append("accept", "text/plain");

    fetch("https://wedding-nlog0312.runasp.net/api/images/upload-image", {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow"
    })
        .then((response) => response.text())
        .then((result) => {
            const data = JSON.parse(result).data;
            imageUrl = data.linkImage;
            alert("Tải lên thành công!");
        })
        .catch((error) => {
            console.error("Lỗi khi tải lên:", error);
            alert("Tải lên thất bại!");
        });
}

function uploadStory() {
    const descriptionInput = document.getElementById("inputDescription");
    const APIKeyInput = document.getElementById("inputAPIKey");

    if (!imageUrl || !descriptionInput.value || !APIKeyInput.value) {
        alert("Nhập đầy đủ đi!");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("accept", "text/plain");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "imageUrl": imageUrl,
        "description": descriptionInput.value,
        "apiKey": APIKeyInput.value
    });
    
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://wedding-nlog0312.runasp.net/api/admin/insert-admin-story", requestOptions)
    .then((response) => response.text())
    .then((result) => alert("Tải lên thành công!"))
    .catch((error) => {
        console.error("Lỗi khi tải lên:", error);
        alert("Tải lên thất bại!");
    });
}

// Get images
function getStory() {
    const myHeaders = new Headers();
    myHeaders.append("accept", "text/plain");

    const requestOptions = {
    method: "GET",
    headers: myHeaders,
    mode: "cors",
    credentials: "include", // 🔹 Bắt buộc để gửi cookie/token
    redirect: "follow"
    };

    fetch("https://wedding-nlog0312.runasp.net/api/admin/get-admin-stories", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        const data = JSON.parse(result).data;
        const gallery = document.getElementById('gallery')
        data.forEach(element => {
            const imgTemplate = `
                <div class="mt-2 col-sm-12 col-lg-4 item-img">
                    <img src="${element.image}" class="img-thumbnail" alt="...">
                    <p>
                        ${element.description}
                    </p>
                </div>
            `;
            gallery.insertAdjacentHTML("beforeend", imgTemplate);
        });
    })
    .catch((error) => console.error(error));
}