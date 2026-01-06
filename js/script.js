const modal = document.getElementById('mediaModal');
const video = document.getElementById('modalVideo');
const audio = document.getElementById('modalAudio');

document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modal.style.display = 'flex';
    if (btn.dataset.type === 'video') {
      video.src = btn.dataset.src;
      video.style.display = 'block';
      audio.style.display = 'none';
      video.play();
    } else {
      audio.src = btn.dataset.src;
      audio.style.display = 'block';
      video.style.display = 'none';
      audio.play();
    }
  });
});

document.querySelector('.close').onclick = () => {
  modal.style.display = 'none';
  video.pause();
  audio.pause();
};
