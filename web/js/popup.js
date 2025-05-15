window.addEventListener("load", function () {
    window.open(
        "Teachable/teachable.html", // Teachable Machine 실행 페이지
        "popupWindow",
        "width=500,height=600"
    );
});

// popup 창으로부터 메시지 수신
window.addEventListener("message", function (event) {
    if (event.data && event.data.emotion) {
        const emotion = event.data.emotion;
        console.log("감정 결과 수신:", emotion);
        showRecommendation(emotion);
    }
});
