/**
 * Admin Dashboard - Utilities
 */

const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const today = () => new Date().toISOString().split('T')[0];
const fmtDate = (d) => {
    if (!d) return '--/--/----';
    return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const calcReadTime = (c) => {
    const w = (c || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.ceil(w / 200) + ' min';
};

const formatAnalyticsDate = (value) => {
    if (!value) return 'Sem data';
    const date = new Date(value + 'T12:00:00');
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('pt-BR');
};

const parseReadTime = (value) => {
    if (!value) return 0;
    const match = String(value).match(/\d+/);
    return match ? Number(match[0]) : 0;
};

const formatInteger = (value) => Number(value || 0).toLocaleString('pt-BR');

const formatDuration = (seconds) => {
    const total = Math.round(Number(seconds || 0));
    const minutes = Math.floor(total / 60);
    const remainder = total % 60;
    if (!minutes) return remainder + 's';
    if (!remainder) return minutes + 'min';
    return minutes + 'min ' + remainder + 's';
};

// Export to window for global access
window.uid = uid;
window.today = today;
window.fmtDate = fmtDate;
window.esc = esc;
window.slugify = slugify;
window.calcReadTime = calcReadTime;
window.formatAnalyticsDate = formatAnalyticsDate;
window.parseReadTime = parseReadTime;
window.formatInteger = formatInteger;
window.formatDuration = formatDuration;
