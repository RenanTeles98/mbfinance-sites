/**
 * Admin Dashboard - Banners & Ads
 */

function loadBanners() {
    const b1 = localStorage.getItem('mb_banner_slot1') || '';
    const b2 = localStorage.getItem('mb_banner_slot2') || '';
    
    document.getElementById('banner-slot1').value = b1;
    document.getElementById('banner-slot2').value = b2;
    
    updateBannerPreview(1, b1);
    updateBannerPreview(2, b2);
}

function saveBanners() {
    const b1 = document.getElementById('banner-slot1').value;
    const b2 = document.getElementById('banner-slot2').value;
    
    localStorage.setItem('mb_banner_slot1', b1);
    localStorage.setItem('mb_banner_slot2', b2);
    
    updateBannerPreview(1, b1);
    updateBannerPreview(2, b2);
    
    if (typeof showToast === 'function') showToast('Banners salvos!');
}

function updateBannerPreview(slot, html) {
    const prev = document.getElementById('banner-prev' + slot);
    if (!prev) return;
    if (!html) {
        prev.innerHTML = '<div class="banner-empty">Vazio</div>';
        return;
    }
    prev.innerHTML = html;
}

// Export to window
window.loadBanners = loadBanners;
window.saveBanners = saveBanners;
window.updateBannerPreview = updateBannerPreview;
