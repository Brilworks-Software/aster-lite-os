const url = 'https://hwiefvqbyhxtnhflxiab.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWVmdnFieWh4dG5oZmx4aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTAyMDQsImV4cCI6MjA4ODA4NjIwNH0.JESvQY7vX5VwaOJd91YAFlehaADdOUMSlAJvY4fpVnA';

const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'representation'
};

const leadsData = [
    { name: 'Amit Sharma', company: 'Sunrise Lighting', source: 'Website', req: '50x LED Panels', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { name: 'Priya Patel', company: 'Global Solutions', source: 'Referral', req: '100m Strip Lights', status: 'Contacted', assigned: 'Admin', date: '2026-03-02' },
    { name: 'Vikram Singh', company: 'Mega Mart', source: 'FB Ads', req: '20x Flood Lights', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { name: 'Sneha Reddy', company: 'Bright Homes', source: 'LinkedIn', req: '15x Smart Bulbs', status: 'Qualified', assigned: 'Admin', date: '2026-03-01' },
    { name: 'Rajesh Kumar', company: 'Indus Corp', source: 'Cold Email', req: '200x T5 Tubes', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { name: 'Anjali Gupta', company: 'City Lights', source: 'Website', req: '10x Chandeliers', status: 'Contacted', assigned: 'Admin', date: '2026-03-02' },
    { name: 'Suresh Raina', company: 'Sports Academy', source: 'Referral', req: 'High Mast Lighting', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { name: 'Kavita Iyer', company: 'Zlux Interiors', source: 'Instagram', req: 'Designer Pendants', status: 'Qualified', assigned: 'Admin', date: '2026-03-01' },
    { name: 'Manoj Bajpayee', company: 'The Theatre Co', source: 'Website', req: 'Stage Lighting Kit', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { name: 'Rohan Mehra', company: 'Apartment Assoc', source: 'Direct Call', req: 'Security Lights', status: 'Contacted', assigned: 'Admin', date: '2026-03-02' }
];

async function run() {
    console.log('Inserting leads...');
    const r = await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leadsData)
    });
    const text = await r.text();
    console.log('Response:', r.status, text);
}

run();
