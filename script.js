// Navbar สีเข้มเมื่อเลื่อน + Back to Top
window.addEventListener("scroll", function() {
    const nav = document.querySelector("nav");
    if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    }
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    }
});

// Back to Top Function
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// Fade-in Sections + Gallery Items (Stagger Effect)
const targets = document.querySelectorAll("section, .gallery-item");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains("gallery-item")) {
                // Stagger effect: delay ตามลำดับ
                const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 200);
            } else {
                entry.target.classList.add("visible");
            }
            observer.unobserve(entry.target); // ทำงานครั้งเดียว
        }
    });
}, { threshold: 0.2 });
targets.forEach(el => observer.observe(el));

// Product Image Scroller
document.addEventListener("DOMContentLoaded", function() {
    const scrollImages = document.querySelector(".scroll-images");
    if (!scrollImages) return;

    const images = scrollImages.querySelectorAll("img");
    let imagesLoaded = 0;
    
    // รอให้รูปภาพโหลดเสร็จทั้งหมดก่อนเริ่ม animation
    images.forEach(img => {
        if (img.complete) {
            imagesLoaded++;
        } else {
            img.addEventListener("load", () => {
                imagesLoaded++;
                if (imagesLoaded === images.length) {
                    initProductScroller();
                }
            });
        }
    });

    if (imagesLoaded === images.length) {
        initProductScroller();
    }

    function initProductScroller() {
        // คำนวณความสูงรวมของชุดรูปภาพ 1 ชุด (สมมติว่าคุณทำซ้ำ 2 ชุด)
        let singleSetHeight = 0;
        const halfLength = Math.floor(images.length / 2);
        for (let i = 0; i < halfLength; i++) {
            singleSetHeight += images[i].offsetHeight + 10; // +10 คือ margin-bottom
        }

        // สร้าง @keyframes rule แบบ dynamic
        const styleSheet = document.styleSheets[0];
        const keyframesName = `scrollUpDynamic`;

        const keyframesRule = `@keyframes ${keyframesName} {
            0% { transform: translateY(0); }
            100% { transform: translateY(-${singleSetHeight}px); }
        }`;

        // ลบ animation rule เก่าเพื่อป้องกันการซ้ำ
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].name === keyframesName) {
                styleSheet.deleteRule(i);
                break;
            }
        }
        styleSheet.insertRule(keyframesRule, styleSheet.cssRules.length);

        // กำหนด animation ให้กับ element
        scrollImages.style.animation = `${keyframesName} 20s linear infinite`;
    }
});

// Lightbox Gallery
document.addEventListener("DOMContentLoaded", function() {
    // เลือก Element ที่จำเป็น
    const galleryItems = document.querySelectorAll('.gallery-item a');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.close-btn');

    if (!galleryItems.length || !lightbox || !lightboxImage || !closeBtn) return;

    // วนลูปเพื่อเพิ่ม Event Listener ให้กับรูปภาพทั้งหมดใน Gallery
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // ป้องกันการเปลี่ยนหน้า
            const imgSrc = item.getAttribute('href');
            lightboxImage.setAttribute('src', imgSrc);
            lightbox.classList.add('active');
        });
    });

    // Event Listener สำหรับปิด Lightbox เมื่อกดปุ่ม 'X'
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Event Listener สำหรับปิด Lightbox เมื่อคลิกที่พื้นที่ว่างๆ (overlay)
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
});