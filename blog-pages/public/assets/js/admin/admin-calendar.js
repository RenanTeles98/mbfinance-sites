/**
 * Admin Dashboard - Calendário Editorial
 */

var CAL_EVENTS_KEY = 'mb_cal_events_v1';

var CAL_TYPE_LABELS = {
    post: 'Post', video: 'Vídeo', story: 'Story',
    email: 'E-mail', whatsapp: 'WhatsApp', reuniao: 'Reunião', outro: 'Outro'
};

var MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
              'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

// ── Storage ────────────────────────────────────────────────────────────────

function loadCalEvents() {
    try { return JSON.parse(localStorage.getItem(CAL_EVENTS_KEY) || '[]'); } catch(e) { return []; }
}
function saveCalEvents(list) { localStorage.setItem(CAL_EVENTS_KEY, JSON.stringify(list)); }

// ── Render ─────────────────────────────────────────────────────────────────

function renderCalendar() {
    var grid  = document.getElementById('calendar-grid');
    var label = document.getElementById('calendar-month-label');
    if (!grid || !label) return;

    var now   = new Date();
    var year  = calDate.getFullYear();
    var month = calDate.getMonth();

    label.textContent = MONTHS[month] + ' de ' + year;
    grid.innerHTML = '';

    // cabeçalho dias
    ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(function(d) {
        var el = document.createElement('div');
        el.className = 'calendar-day-head';
        el.textContent = d;
        grid.appendChild(el);
    });

    var firstDay     = new Date(year, month, 1).getDay();
    var daysInMonth  = new Date(year, month + 1, 0).getDate();
    var prevDays     = new Date(year, month, 0).getDate();

    // carregar posts e eventos do mês
    var posts  = typeof window.getAllPosts === 'function' ? window.getAllPosts() : [];
    var events = loadCalEvents();

    function byDate(list, key) {
        var map = {};
        list.forEach(function(item) {
            var d = item[key] || '';
            if (!map[d]) map[d] = [];
            map[d].push(item);
        });
        return map;
    }
    var postsByDate  = byDate(posts,  'date');
    var eventsByDate = byDate(events, 'date');

    // dias do mês anterior
    for (var i = firstDay - 1; i >= 0; i--) {
        var cell = document.createElement('div');
        cell.className = 'calendar-cell other-month';
        cell.innerHTML = '<div class="calendar-day-num">' + (prevDays - i) + '</div>';
        grid.appendChild(cell);
    }

    // dias do mês atual
    for (var d = 1; d <= daysInMonth; d++) {
        var dateStr = year + '-' + pad(month + 1) + '-' + pad(d);
        var isToday = now.toDateString() === new Date(year, month, d).toDateString();

        var cell = document.createElement('div');
        cell.className = 'calendar-cell' + (isToday ? ' today' : '');
        cell.setAttribute('data-date', dateStr);
        cell.innerHTML = '<div class="calendar-day-num">' + d + '</div>';

        // pills de posts do blog
        (postsByDate[dateStr] || []).forEach(function(p) {
            var statusClass = p.published !== false ? 'pub' : 'draft';
            if (p.published !== false) {
                var pubDate = new Date(p.date + 'T' + (p.time || '00:00') + ':00');
                if (pubDate > now) statusClass = 'sched';
            }
            var pill = document.createElement('div');
            pill.className = 'cal-post-pill ' + statusClass;
            pill.title = p.title || '';
            pill.innerHTML = '<span class="cal-post-time">' + (p.time || '') + '</span> ' + esc(p.title || '');
            pill.onclick = function(e) { e.stopPropagation(); if (typeof editPost === 'function') editPost(p.id); };
            cell.appendChild(pill);
        });

        // pills de eventos customizados
        (eventsByDate[dateStr] || []).forEach(function(ev) {
            var pill = document.createElement('div');
            pill.className = 'cal-event-pill';
            pill.setAttribute('data-type', ev.type || 'outro');
            pill.title = ev.title + (ev.notes ? '\n' + ev.notes : '');
            pill.innerHTML = (ev.time ? '<span class="cal-post-time">' + ev.time + '</span> ' : '') + esc(ev.title);
            pill.onclick = function(e) { e.stopPropagation(); openCalEventModal(ev.id); };
            cell.appendChild(pill);
        });

        // clicar no fundo do dia abre modal com data preenchida
        cell.onclick = function(e) {
            if (e.target === this || e.target.classList.contains('calendar-day-num')) {
                openCalEventModal(null, this.getAttribute('data-date'));
            }
        };

        grid.appendChild(cell);
    }

    // completar grid
    var total = firstDay + daysInMonth;
    var extra = (7 - (total % 7)) % 7;
    for (var j = 1; j <= extra; j++) {
        var cell = document.createElement('div');
        cell.className = 'calendar-cell other-month';
        cell.innerHTML = '<div class="calendar-day-num">' + j + '</div>';
        grid.appendChild(cell);
    }
}

function pad(n) { return String(n).padStart(2, '0'); }
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function prevMonth() { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); }
function nextMonth() { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); }

// ── Modal ─────────────────────────────────────────────────────────────────

function openCalEventModal(id, prefillDate) {
    var modal     = document.getElementById('cal-event-modal');
    var titleEl   = document.getElementById('cal-modal-title');
    var inputId   = document.getElementById('cal-ev-id');
    var inputTitle = document.getElementById('cal-ev-title');
    var inputType  = document.getElementById('cal-ev-type');
    var inputDate  = document.getElementById('cal-ev-date');
    var inputTime  = document.getElementById('cal-ev-time');
    var inputNotes = document.getElementById('cal-ev-notes');
    var deleteBtn  = document.getElementById('cal-ev-delete-btn');
    if (!modal) return;

    if (id) {
        var ev = loadCalEvents().find(function(e) { return e.id === id; });
        if (!ev) return;
        titleEl.textContent     = 'Editar evento';
        inputId.value           = id;
        inputTitle.value        = ev.title  || '';
        inputType.value         = ev.type   || 'outro';
        inputDate.value         = ev.date   || '';
        inputTime.value         = ev.time   || '';
        inputNotes.value        = ev.notes  || '';
        deleteBtn.style.display = 'inline-flex';
    } else {
        titleEl.textContent     = 'Novo evento';
        inputId.value           = '';
        inputTitle.value        = '';
        inputType.value         = 'post';
        inputDate.value         = prefillDate || '';
        inputTime.value         = '';
        inputNotes.value        = '';
        deleteBtn.style.display = 'none';
    }

    modal.style.display = 'flex';
    setTimeout(function() { inputTitle.focus(); }, 50);
}

function closeCalEventModal() {
    var modal = document.getElementById('cal-event-modal');
    if (modal) modal.style.display = 'none';
}

function saveCalEvent() {
    var id     = document.getElementById('cal-ev-id').value;
    var title  = (document.getElementById('cal-ev-title').value  || '').trim();
    var type   = document.getElementById('cal-ev-type').value   || 'outro';
    var date   = document.getElementById('cal-ev-date').value   || '';
    var time   = document.getElementById('cal-ev-time').value   || '';
    var notes  = (document.getElementById('cal-ev-notes').value || '').trim();

    if (!title) { document.getElementById('cal-ev-title').focus(); return; }
    if (!date)  { document.getElementById('cal-ev-date').focus();  return; }

    var list = loadCalEvents();
    if (id) {
        var idx = list.findIndex(function(e) { return e.id === Number(id); });
        if (idx !== -1) list[idx] = { id: Number(id), title: title, type: type, date: date, time: time, notes: notes };
    } else {
        list.push({ id: Date.now(), title: title, type: type, date: date, time: time, notes: notes });
    }
    saveCalEvents(list);
    closeCalEventModal();
    renderCalendar();
}

function deleteCalEvent() {
    var id = Number(document.getElementById('cal-ev-id').value);
    if (!id) return;
    saveCalEvents(loadCalEvents().filter(function(e) { return e.id !== id; }));
    closeCalEventModal();
    renderCalendar();
}

// fechar modal clicando no backdrop
document.addEventListener('click', function(e) {
    var modal = document.getElementById('cal-event-modal');
    if (modal && e.target === modal) closeCalEventModal();
});

// ── Expor globais ──────────────────────────────────────────────────────────

window.renderCalendar      = renderCalendar;
window.prevMonth           = prevMonth;
window.nextMonth           = nextMonth;
window.openCalEventModal   = openCalEventModal;
window.closeCalEventModal  = closeCalEventModal;
window.saveCalEvent        = saveCalEvent;
window.deleteCalEvent      = deleteCalEvent;
