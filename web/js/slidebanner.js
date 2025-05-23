let slideIndex = 0;
  const slideWidth = 1344; // 배너 하나의 너비
  const slides = document.getElementById('BannerList');
  const dots = document.querySelectorAll('#Banner_button .BB');

  function showSlide(n) {
    slides.style.left = `-${n * slideWidth}px`;
    dots.forEach(dot => dot.style.background = 'rgba(255, 255, 255, 0.3)');
    if (dots[n]) dots[n].style.background = 'white';
    slideIndex = n;
  }

  function bs(n) {
    showSlide(n);
  }

  function autoSlide() {
    slideIndex = (slideIndex + 1) % dots.length;
    showSlide(slideIndex);
  }

  // 초기 표시
  showSlide(slideIndex);
  // 4초마다 자동 전환
  setInterval(autoSlide, 4000);

