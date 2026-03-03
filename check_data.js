const url = 'https://hwiefvqbyhxtnhflxiab.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWVmdnFieWh4dG5oZmx4aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTAyMDQsImV4cCI6MjA4ODA4NjIwNH0.JESvQY7vX5VwaOJd91YAFlehaADdOUMSlAJvY4fpVnA';

const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`
};

async function checkData() {
    const leadsRes = await fetch(`${url}/rest/v1/leads?select=count`, { headers });
    const leadsCount = await leadsRes.json();
    console.log('Leads count:', leadsCount);

    const ordersRes = await fetch(`${url}/rest/v1/orders?select=count`, { headers });
    const ordersCount = await ordersRes.json();
    console.log('Orders count:', ordersCount);
}

checkData();
