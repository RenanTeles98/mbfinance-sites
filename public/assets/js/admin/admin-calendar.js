/**
 * Admin Dashboard - Editorial Calendar
 */

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('calendar-month-label');
    if (!grid || !label) return;
    const now = new Date();
    
    // Configura meses e dias
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    label.innerText = months[calDate.getMonth()] + ' de ' + calDate.getFullYear();
    
    grid.innerHTML = '';
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    dayNames.forEach(d => grid.innerHTML += `<div class="calendar-day-head">${d}</div>`);
    
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();
    
    // Dias do mês anterior para completar o grid
    for (let i = firstDay - 1; i >= 0; i--) {
        grid.innerHTML += `<div class="calendar-cell other-month"><div class="calendar-day-num">${prevDaysInMonth - i}</div></div>`;
    }
    
    // Dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayPosts = posts.filter(p => p.date === dateStr);
        const isToday = now.toDateString() === new Date(year, month, d).toDateString();
        
        let pillsHtml = dayPosts.map(p => {
            let statusClass = p.published !== false ? 'pub' : 'draft';
            if (p.published !== false) {
                const pubDate = new Date(`${p.date}T${p.time || '00:00'}:00`);
                if (pubDate > now) statusClass = 'sched';
            }
            return `<div class="cal-post-pill ${statusClass}" onclick="editPost('${p.id}')" title="${esc(p.title)}">
                <span class="cal-post-time">${p.time || '00:00'}</span> ${esc(p.title)}
            </div>`;
        }).join('');
        
        grid.innerHTML += `
            <div class="calendar-cell ${isToday ? 'today' : ''}" onclick="if(event.target===this) prepareNewPostFromDate('${dateStr}')">
                <div class="calendar-day-num">${d}</div>
                ${pillsHtml}
            </div>
        `;
    }
    
    // Completar o grid com dias do mês seguinte
    const totalCells = firstDay + daysInMonth;
    const extraCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= extraCells; i++) {
        grid.innerHTML += `<div class="calendar-cell other-month"><div class="calendar-day-num">${i}</div></div>`;
    }
}

function prevMonth() { 
    calDate.setMonth(calDate.getMonth() - 1); 
    renderCalendar(); 
}

function nextMonth() { 
    calDate.setMonth(calDate.getMonth() + 1); 
    renderCalendar(); 
}

function prepareNewPostFromDate(dateStr) {
    if (typeof newPost === 'function') {
        newPost();
        const dateInput = document.getElementById('f-date');
        if (dateInput) dateInput.value = dateStr;
    }
}

// Export to window
window.renderCalendar = renderCalendar;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.prepareNewPostFromDate = prepareNewPostFromDate;
