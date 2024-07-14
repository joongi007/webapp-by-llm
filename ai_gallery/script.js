// 이미지 정보 배열 (실제 프로젝트에서는 서버에서 가져올 수 있습니다)
const imageInfos = [
    { url: './images/코즈믹 호러 고양이.png', name: '코즈믹 호러 고양이' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/우주대돌격.png', name: '우주대돌격' },
    { url: './images/코즈믹 호러 고양이.png', name: '이미지 3' },
    // ... 더 많은 이미지 정보 추가
];

const galleryContainer = document.querySelector('.gallery-container');
const totalImages = imageInfos.length;
let loadedImages = 0;
let isLoading = false;

// 모달 요소
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const captionText = document.getElementById('imageCaption');
const closeBtn = document.querySelector('.close');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            const src = img.getAttribute('data-src');
            img.setAttribute('src', src);
            img.classList.remove('lazy');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function createGalleryItem(imageInfo) {
    const item = document.createElement('div');
    item.classList.add('gallery-item', 'loading');

    const img = document.createElement('img');
    img.classList.add('lazy');
    img.setAttribute('data-src', imageInfo.url);
    img.setAttribute('alt', imageInfo.name);

    const nameOverlay = document.createElement('div');
    nameOverlay.classList.add('image-name');
    nameOverlay.textContent = imageInfo.name;

    item.appendChild(img);
    item.appendChild(nameOverlay);
    galleryContainer.appendChild(item);

    observer.observe(item);
    loadedImages++;

    // 이미지 로드 완료 후 비율 계산 및 클래스 적용
    img.onload = function() {
        const ratio = this.naturalHeight / this.naturalWidth;
        if (ratio > 1.2) {
            item.classList.add('portrait');
        } else if (ratio < 0.8) {
            item.classList.add('landscape');
        }
        item.classList.remove('loading');
    };

    // 클릭 이벤트 추가
    item.addEventListener('click', () => openModal(imageInfo));
}

function initGallery() {
    const initialLoad = Math.min(totalImages, 10); // 처음에 10개 이미지만 로드
    for (let i = 0; i < initialLoad; i++) {
        createGalleryItem(imageInfos[i]);
    }
}

function loadMoreImages() {
    if (isLoading || loadedImages >= totalImages) return;

    isLoading = true;
    const nextBatch = Math.min(totalImages - loadedImages, 5); // 한 번에 5개씩 추가 로드
    
    for (let i = 0; i < nextBatch; i++) {
        createGalleryItem(imageInfos[loadedImages]);
    }

    isLoading = false;

    if (loadedImages >= totalImages) {
        window.removeEventListener('scroll', scrollHandler);
        console.log('모든 이미지가 로드되었습니다.');
    }
}

function scrollHandler() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreImages();
    }
}

// 모달 열기 함수
function openModal(imageInfo) {
    modal.style.display = "block";
    modalImg.src = imageInfo.url;
    captionText.innerHTML = imageInfo.name;
    setTimeout(() => modal.classList.add('show'), 10);
}

// 모달 닫기 함수
function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
        modalImg.src = '';
    }, 300);
}

// 이벤트 리스너 설정
window.addEventListener('load', initGallery);
window.addEventListener('scroll', scrollHandler);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});