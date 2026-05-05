/**
 * Admin Dashboard - Global State & Constants
 */

const STORAGE_KEY = 'mb_blog_posts';
const SESSION_KEY = 'mb_admin_auth';
const API_BASE_KEY = 'mb_blog_api_base';
const API_TOKEN_KEY = 'mb_blog_api_token';
// Note: Password hash is kept here for session logic in admin-core.js
const PASSWORD_HASH = '06eb7d8563729c3c373f97f16875d98f99e457b9b28d56eecceeb04be61b3e4c';

const CAT_LABELS = {
    'credito':     'Crédito Empresarial',
    'gestao':      'Gestão Financeira',
    'conta-pj':    'Conta PJ',
    'mercado':     'Mercado',
    'antecipacao': 'Antecipação',
    'noticias':    'Notícias'
};

let posts = [];
let currentId = null;
let analyticsData = null;
let calDate = new Date(); // Mês visualizado no calendário

// Newsletter State
let nlSubscribers = [];
let nlCampaigns = [];
let nlBlocks = []; // Used by nlRenderBlocks

// Export to window for global access
window.STORAGE_KEY = STORAGE_KEY;
window.SESSION_KEY = SESSION_KEY;
window.API_BASE_KEY = API_BASE_KEY;
window.API_TOKEN_KEY = API_TOKEN_KEY;
window.PASSWORD_HASH = PASSWORD_HASH;
window.CAT_LABELS = CAT_LABELS;
window.posts = posts;
