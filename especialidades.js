const photoButton = document.querySelector('.sector-photo-button');

if (photoButton) {
  const photo = document.querySelector('.sector-photo');
  let current = 1;
  photoButton.hidden = false;

  photoButton.addEventListener('click', () => {
    current = current === 1 ? 2 : 1;
    const next = 3 - current;
    const asset = `/assets/especialidades/${photoButton.dataset.photo}-${current}`;
    photo.srcset = `${asset}-800.webp 800w, ${asset}-1536.webp 1536w`;
    photo.src = `${asset}-1536.webp`;
    photoButton.firstChild.textContent = `${current} / 2 `;
    photoButton.setAttribute('aria-label', `Mostrar foto ${next} de 2`);
  });
}
