let slideIndex = 0;
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');

function showSlide(n) {
  slides.style.transform = `translateX(-${n * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[n].classList.add('active');
  slideIndex = n;
}

function currentSlide(n) {
  showSlide(n);
}

function autoSlide() {
  slideIndex = (slideIndex + 1) % dots.length;
  showSlide(slideIndex);
}

showSlide(0); // 초기화
setInterval(autoSlide, 4000); // 4초마다 전환