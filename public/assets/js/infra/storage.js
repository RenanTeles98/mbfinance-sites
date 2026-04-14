// Infrastructure: Local storage persistence for leads
const LeadStorage = {
    save(lead) {
        const leads = JSON.parse(localStorage.getItem('mb_leads') || '[]');
        leads.push(lead);
        localStorage.setItem('mb_leads', JSON.stringify(leads));
    }
};
