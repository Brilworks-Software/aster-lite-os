const url = 'https://hwiefvqbyhxtnhflxiab.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWVmdnFieWh4dG5oZmx4aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTAyMDQsImV4cCI6MjA4ODA4NjIwNH0.JESvQY7vX5VwaOJd91YAFlehaADdOUMSlAJvY4fpVnA';

const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
    'Prefer': 'representation'
};

const leads = [
    { id: 1001, name: 'Amit Sharma', company: 'Sunrise Lighting', source: 'Website', req: '50x LED Panels', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { id: 1002, name: 'Priya Patel', company: 'Global Solutions', source: 'Referral', req: '100m Strip Lights', status: 'Contacted', assigned: 'Admin', date: '2026-03-02' },
    { id: 1003, name: 'Vikram Singh', company: 'Mega Mart', source: 'FB Ads', req: '20x Flood Lights', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { id: 1004, name: 'Sneha Reddy', company: 'Bright Homes', source: 'LinkedIn', req: '15x Smart Bulbs', status: 'Qualified', assigned: 'Admin', date: '2026-03-01' },
    { id: 1005, name: 'Rajesh Kumar', company: 'Indus Corp', source: 'Cold Email', req: '200x T5 Tubes', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { id: 1006, name: 'Anjali Gupta', company: 'City Lights', source: 'Website', req: '10x Chandeliers', status: 'Contacted', assigned: 'Admin', date: '2026-03-02' },
    { id: 1007, name: 'Suresh Raina', company: 'Sports Academy', source: 'Referral', req: 'High Mast Lighting', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { id: 1008, name: 'Kavita Iyer', company: 'Zlux Interiors', source: 'Instagram', req: 'Designer Pendants', status: 'Qualified', assigned: 'Admin', date: '2026-03-01' },
    { id: 1009, name: 'Manoj Bajpayee', company: 'The Theatre Co', source: 'Website', req: 'Stage Lighting Kit', status: 'New', assigned: 'OM', date: '2026-03-03' },
    { id: 1010, name: 'Rohan Mehra', company: 'Apartment Assoc', source: 'Direct Call', req: 'Security Lights', status: 'Contacted', assigned: 'Admin', date: '2026-03-02' }
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

const products = [
    { sku: 'SKU-1001', name: 'LED Panel 12W Square', available: 1250, reserved: 150, defective: 5, returned: 0 },
    { sku: 'SKU-1002', name: 'LED Panel 15W Round', available: 840, reserved: 60, defective: 12, returned: 2 },
    { sku: 'SKU-2005', name: 'Strip Light 5m RGB', available: 45, reserved: 30, defective: 0, returned: 10 },
    { sku: 'SKU-3012', name: 'COB Light 15W Focus', available: 400, reserved: 50, defective: 3, returned: 0 },
    { sku: 'SKU-4050', name: 'High Mast Flood Light', available: 120, reserved: 20, defective: 0, returned: 0 },
    { sku: 'SKU-5001', name: 'Smart WiFi Bulb 9W', available: 200, reserved: 45, defective: 2, returned: 1 }
];

async function refreshData() {
    console.log('Clearing old data...');
    // Delete all leads
    await fetch(`${url}/rest/v1/leads?name=neq.null`, { method: 'DELETE', headers });
    // Delete all orders
    await fetch(`${url}/rest/v1/orders?amount=gt.-1`, { method: 'DELETE', headers });
    // Delete all products
    await fetch(`${url}/rest/v1/products?sku=neq.null`, { method: 'DELETE', headers });

    console.log('Inserting 10 new leads...');
    const r1 = await fetch(`${url}/rest/v1/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify(leads)
    });
    console.log('Leads insert status:', r1.status);

    console.log('Inserting 10 new orders...');
    const r2 = await fetch(`${url}/rest/v1/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orders)
    });
    console.log('Orders insert status:', r2.status);

    console.log('Inserting products...');
    const r3 = await fetch(`${url}/rest/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(products)
    });
    console.log('Products insert status:', r3.status);

    console.log('Data refresh complete!');
}

refreshData();
