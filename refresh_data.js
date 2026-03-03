const url = 'https://hwiefvqbyhxtnhflxiab.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWVmdnFieWh4dG5oZmx4aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTAyMDQsImV4cCI6MjA4ODA4NjIwNH0.JESvQY7vX5VwaOJd91YAFlehaADdOUMSlAJvY4fpVnA';

const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'representation'
};

const leads = [
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

const orders = [
    { id: 'ORD-5001', title: 'Sunrise Lighting - LED Order', amount: 45000, priority: 'high', status: 'order', assigned: 'OM' },
    { id: 'ORD-5002', title: 'Global Solutions - Strip Lights', amount: 28000, priority: 'medium', status: 'quote', assigned: 'IM' },
    { id: 'ORD-5003', title: 'Mega Mart - Flood Lighting', amount: 62000, priority: 'high', status: 'dispatch', assigned: 'OM' },
    { id: 'ORD-5004', title: 'Bright Homes - Smart Setup', amount: 15000, priority: 'low', status: 'invoice', assigned: 'IM' },
    { id: 'ORD-5005', title: 'Indus Corp - Industrial T5', amount: 95000, priority: 'medium', status: 'payment', assigned: 'SM' },
    { id: 'ORD-5006', title: 'City Lights - Decorative', amount: 34000, priority: 'low', status: 'quote', assigned: 'IM' },
    { id: 'ORD-5007', title: 'Sports Academy - High Mast', amount: 125000, priority: 'high', status: 'order', assigned: 'OM' },
    { id: 'ORD-5008', title: 'Zlux Interiors - Pendants', amount: 18000, priority: 'low', status: 'dispatch', assigned: 'IM' },
    { id: 'ORD-5009', title: 'The Theatre Co - Stage Lights', amount: 75000, priority: 'medium', status: 'invoice', assigned: 'SM' },
    { id: 'ORD-5010', title: 'Apartment Assoc - Security', amount: 22000, priority: 'low', status: 'payment', assigned: 'SM' }
];

async function refreshData() {
    console.log('Clearing old data...');
    // Delete all leads
    await fetch(`${url}/rest/v1/leads?id=gt.0`, { method: 'DELETE', headers });
    // Delete all orders
    await fetch(`${url}/rest/v1/orders?amount=gt.-1`, { method: 'DELETE', headers });

    console.log('Inserting 10 new leads...');
    await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leads)
    });

    console.log('Inserting 10 new orders...');
    await fetch(`${url}/rest/v1/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orders)
    });

    console.log('Data refresh complete!');
}

refreshData();
