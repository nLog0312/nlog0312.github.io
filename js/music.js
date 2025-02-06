var audio = document.getElementById('audioPlayer');
var button = document.getElementById('toggleButton');

window.addEventListener("load", () => {
    if (localStorage.getItem("isPlaying") === "true") {
        audio.play().catch(error => {
            console.log("Trình duyệt chặn autoplay, cần tương tác người dùng!");
            button.innerHTML = '<i class="fa-solid fa-play"></i>';
        });
    }
});

button.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        button.innerHTML = '<i class="fa-solid fa-pause"></i>';
        localStorage.setItem("isPlaying", "true");
    } else {
        audio.pause();
        button.innerHTML = '<i class="fa-solid fa-play"></i>';
        localStorage.setItem("isPlaying", "false");
    }
});

window.addEventListener("beforeunload", () => {
    localStorage.setItem("isPlaying", !audio.paused);
});

// ------------------------------------- Lyrics -------------------------------------
const lyricsDisplay = document.getElementById('lyricsDisplay');

// Danh sách lyrics với thời gian tương ứng
const lyrics = [
    { time: 0, text: "~~~🎶~~~" },
    { time: 16, text: "Ngày em đến" },
    { time: 19, text: "Một chút yêu thương nhỏ nhoi" },
    { time: 23.5, text: "Một chút cô đơn đang lớn lên dần" },
    { time: 28, text: "Chìm vào những ngày ngẩn ngơ" },
    
    { time: 33.5, text: "Ngày em đến" },
    { time: 36.5, text: "Từng phút trong anh là em" },
    { time: 41, text: "Từng chút yêu thương, ngày ấy bây giờ" },
    { time: 45, text: "Thành một bầu trời trong mơ" },
    
    { time: 51, text: "Từ khi ánh mắt của ngày ấy, luôn lượn lờ trong đêm" },
    { time: 56, text: "Chợt nghĩ đến bao nhiêu mộng ước, ở sau này" },
    { time: 60, text: "Được nắm đôi bàn tay, ôm lấy đôi bờ vai" },
    { time: 65, text: "Nhìn ngắm em ngày mai~~~" },
    
    { time: 69, text: "Là khi ánh mắt của ngày ấy, luôn lượn lờ trong đêm" },
    { time: 73, text: "Chợt nghĩ đến bao nhiêu mộng ước, ở sau này" },
    { time: 78, text: "Được nắm đôi bàn tay, ôm lấy đôi bờ vai" },
    { time: 82.5, text: "Nhìn ngắm em ngày mai~~~" },
    
    { time: 86, text: "Vẫn tương tư một người" },
    { time: 87.5, text: "Nhìn em, dẫu phía xa chân trời" },
    { time: 91, text: "Mùa xuân vốn không chờ đợi" },
    { time: 93, text: "Một thằng mộng mơ" },
    
    { time: 94.5, text: "Hay chỉ là đôi chút thần tượng" },
    { time: 98, text: "Vì trái tim đang cười" },
    { time: 99, text: "Dù là em bình yên với ai" },
    { time: 101, text: "Tình yêu này liệu có sai" },
    
    { time: 105, text: "Anh ôm lấy bao nhiêu chờ mong" },
    { time: 108, text: "Nhiều đến mức anh hi vọng" },
    { time: 110, text: "Mỗi buổi sáng sẽ được để tâm" },
    { time: 112, text: "Người ở phía sau em này" },
    { time: 114, text: "Nhưng bên em nào lại có hay" },
    { time: 116, text: "Vì một người chẳng còn có ai~~~" },
    
    { time: 120, text: "~~~🎶~~~" },
    
    { time: 177.5, text: "Từ khi ánh mắt của ngày ấy, luôn lượn lờ trong đêm" },
    { time: 182.7, text: "Chợt nghĩ đến bao nhiêu mộng ước, ở sau này" },
    { time: 186, text: "Được nắm đôi bàn tay, ôm lấy đôi bờ vai" },
    { time: 191.5, text: "Nhìn ngắm em ngày mai~~~" },
    
    { time: 195, text: "Từ khi ánh mắt của ngày ấy, luôn lượn lờ trong đêm" },
    { time: 200, text: "Chợt nghĩ đến bao nhiêu mộng ước, ở sau này" },
    { time: 204, text: "Được nắm đôi bàn tay, ôm lấy đôi bờ vai" },
    { time: 209.5, text: "Nhìn ngắm em ngày mai~~~" },
    
    { time: 215, text: "~~~🎶~~~" },
];

let currentIndex = -1;

audio.addEventListener('timeupdate', () => {
    let currentTime = audio.currentTime;
    
    if (currentIndex + 1 < lyrics.length && currentTime >= lyrics[currentIndex + 1].time) {
        currentIndex++;

        lyricsDisplay.classList.remove('active');
        setTimeout(() => {
            lyricsDisplay.textContent = lyrics[currentIndex].text;
            lyricsDisplay.classList.add('active');
        }, 200);
    }
});