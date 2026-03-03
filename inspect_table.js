const url = 'https://hwiefvqbyhxtnhflxiab.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWVmdnFieWh4dG5oZmx4aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTAyMDQsImV4cCI6MjA4ODA4NjIwNH0.JESvQY7vX5VwaOJd91YAFlehaADdOUMSlAJvY4fpVnA';

const headers = {
    'apikey': key,
    'Authorization': `Bearer ${key}`
};

async function inspect() {
    const r = await fetch(`${url}/rest/v1/leads?limit=1`, { headers });
    console.log('Columns:', Object.keys((await r.json())[0] || {}));
}

inspect();
