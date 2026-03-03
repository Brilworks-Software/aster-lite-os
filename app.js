document.addEventListener('DOMContentLoaded', () => {
    // Top-Level Application State
    const AppState = {
        currentView: 'dashboard',
        products: []
    };

    // --- Navigation Logic (Hash Routing) ---
    const navItems = document.querySelectorAll('.sidebar .nav-item');
    const views = document.querySelectorAll('.view');

    function switchView(targetView) {
        if(!targetView) return;

        // Update state
        AppState.currentView = targetView;

        // Update Route
        window.location.hash = targetView;

        // Update UI Tabs
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.sidebar .nav-item[data-view="${targetView}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Switch View Containers
        const targetViewId = `view-${targetView}`;
        views.forEach(view => {
            view.classList.remove('active');
            if(view.id === targetViewId) {
                view.classList.add('active');
            }
        });

        // Trigger Render for the target view
        if (targetView === 'leads') renderLeads();
        if (targetView === 'orders') renderOrders();
        if (targetView === 'dashboard') renderDashboard();
        if (targetView === 'inventory') renderInventory();

        // Close sidebar on mobile after selection
        document.querySelector('.sidebar').classList.remove('mobile-active');
        document.getElementById('sidebarOverlay').classList.remove('active');
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = item.dataset.view;
            switchView(targetView);
        });
    });

    // Handle initial load / refresh
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.querySelector(`.sidebar .nav-item[data-view="${initialHash}"]`)) {
        switchView(initialHash);
    } else {
        switchView('dashboard');
    }

    // Handle back/forward browser buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && hash !== AppState.currentView) {
            switchView(hash);
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-active');
            overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-active');
            overlay.classList.remove('active');
        });
    }

    // --- Global Search Shortcut Logic ---
    const searchInput = document.getElementById('globalSearch');
    
    // Press '/' to focus search
    document.addEventListener('keydown', (e) => {
        // Prevent default if active element isn't an input/textarea
        const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if (e.key === '/' && !isInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Handle Search interaction visuals
    searchInput.addEventListener('focus', () => {
        document.querySelector('.search-shortcut').style.opacity = '0';
    });
    searchInput.addEventListener('blur', () => {
        if (!searchInput.value) {
            document.querySelector('.search-shortcut').style.opacity = '1';
        }
    });

    // --- Header Actions ---
    const btnNewQuote = document.getElementById('btnNewQuote');
    if (btnNewQuote) {
        btnNewQuote.addEventListener('click', () => {
            const quoteNav = document.querySelector('.sidebar-nav .nav-item[data-view="quotes-invoices"]');
            if(quoteNav) quoteNav.click();
            setTimeout(() => {
                const clientInput = document.querySelector('.client-grid input[placeholder="Enter B2B client name..."]');
                if (clientInput) clientInput.focus();
            }, 100);
        });
    }

    const btnNotif = document.getElementById('btnNotifications');
    const notifDropdown = document.getElementById('notificationDropdown');
    if (btnNotif && notifDropdown) {
        btnNotif.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !btnNotif.contains(e.target)) {
                notifDropdown.classList.remove('show');
            }
        });
    }

    // --- Global Search Logic (Mocked visual feedback) ---
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const viewsContainer = document.querySelector('.views-container');
        
        // Remove existing overlay if any
        let overlay = document.getElementById('searchOverlay');
        
        if (query.length > 0) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'searchOverlay';
                overlay.style.cssText = `
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: var(--bg-main); z-index: 50; padding: 32px;
                    overflow-y: auto;
                    animation: fadeIn 0.15s ease-out;
                `;
                viewsContainer.appendChild(overlay);
            }
            
            // Mock Search Results Based on string
            overlay.innerHTML = `
                <div style="max-width: 900px; margin: 0 auto;">
                    <h2 style="margin-bottom: 24px; font-size: 18px; color: var(--text-primary);">Search Results for "${query}"</h2>
                    <div class="inventory-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>ID / Name</th>
                                    <th>Details</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="stock-pill stock-available">Order</span></td>
                                    <td><strong>#ORD-011</strong></td>
                                    <td>Client matched - Contains: ${query}</td>
                                    <td><button class="secondary-btn" style="height: 32px; font-size: 12px; padding: 0 12px;">View</button></td>
                                </tr>
                                <tr>
                                    <td><span class="stock-pill stock-reserved">Lead</span></td>
                                    <td><strong>${query} Traders</strong></td>
                                    <td>New inquiry from website</td>
                                    <td><button class="secondary-btn" style="height: 32px; font-size: 12px; padding: 0 12px;">View</button></td>
                                </tr>
                                <tr>
                                    <td><span class="stock-pill stock-warning">Product</span></td>
                                    <td><strong>SKU-500</strong></td>
                                    <td>Matching item details</td>
                                    <td><button class="secondary-btn" style="height: 32px; font-size: 12px; padding: 0 12px;">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (overlay) {
            overlay.remove();
        }
    });

    // --- Document Engine Logic ---
    const calculateTotals = () => {
        const rows = document.querySelectorAll('#lineItemsBody tr');
        let subtotal = 0;
        let totalCgst = 0;
        let totalSgst = 0;

        rows.forEach(row => {
            const qty = parseFloat(row.querySelector('.qty-input').value) || 0;
            const rate = parseFloat(row.querySelector('.rate-input').value) || 0;
            const taxPerc = parseFloat(row.querySelector('.tax-input').value) || 0;
            
            const amount = qty * rate;
            
            // Assuming intrastate (CGST + SGST). Split tax 50-50.
            const taxAmount = amount * (taxPerc / 100);
            const cgst = taxAmount / 2;
            const sgst = taxAmount / 2;
            
            subtotal += amount;
            totalCgst += cgst;
            totalSgst += sgst;

            row.querySelector('.amount-cell').innerText = amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        });

        const grandTotal = subtotal + totalCgst + totalSgst;

        document.getElementById('calcSubtotal').innerText = '₹' + subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        document.getElementById('calcCgst').innerText = '₹' + totalCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        document.getElementById('calcSgst').innerText = '₹' + totalSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 });
        document.getElementById('calcTotal').innerText = '₹' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    };

    // Make calculateTotals available globally for inline onclick handlers
    window.calculateTotals = calculateTotals;

    // Attach listeners to initial row
    document.getElementById('lineItemsBody').addEventListener('input', (e) => {
        if (e.target.classList.contains('qty-input') || 
            e.target.classList.contains('rate-input') || 
            e.target.classList.contains('tax-input')) {
            calculateTotals();
        }
    });

    document.getElementById('btnAddRow').addEventListener('click', () => {
        const tbody = document.getElementById('lineItemsBody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="clean-input desc-input" placeholder="Item Description"></td>
            <td><input type="text" class="clean-input hsn-input" value=""></td>
            <td><input type="number" class="clean-input qty-input" value="1"></td>
            <td><input type="number" class="clean-input rate-input" value="0"></td>
            <td>
                <select class="clean-input tax-input">
                    <option value="18" selected>18%</option>
                    <option value="12">12%</option>
                    <option value="5">5%</option>
                    <option value="0">0%</option>
                </select>
            </td>
            <td class="amount-cell">0.00</td>
            <td><button class="icon-btn-small delete-row-btn" onclick="this.closest('tr').remove(); window.calculateTotals();"><i class='bx bx-trash'></i></button></td>
        `;
        tbody.appendChild(tr);
        calculateTotals();
    });

    // Handle Title change
    const docTypeSelect = document.getElementById('docType');
    if(docTypeSelect) {
        docTypeSelect.addEventListener('change', (e) => {
            document.getElementById('displayDocTitle').innerText = e.target.value;
        });
    }

    // Set today's date
    const dateInput = document.getElementById('docDate');
    if(dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // --- Database Initialization ---
    // Try to attach Supabase 
    const SUPABASE_URL = 'https://hwiefvqbyhxtnhflxiab.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3aWVmdnFieWh4dG5oZmx4aWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MTAyMDQsImV4cCI6MjA4ODA4NjIwNH0.JESvQY7vX5VwaOJd91YAFlehaADdOUMSlAJvY4fpVnA';
    let dbClient = null;
    
    if (window.supabase) {
        dbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // Populate Product Dropdowns
    const populateProductSelects = (container = document) => {
        const selects = container.querySelectorAll('.product-select-target, #stockProductSelect');
        const products = AppState.products || [];
        console.log(`Populating ${selects.length} product selects with ${products.length} products.`);

        selects.forEach(el => {
            const currentVal = el.value;
            if (products.length === 0) {
                el.innerHTML = '<option value="">(Loading products...)</option>';
                return;
            }
            el.innerHTML = products.map(p => {
                const label = `${p.sku} - ${p.name}`;
                return `<option value="${label}">${label}</option>`;
            }).join('');
            if (currentVal) el.value = currentVal;
        });
    };
    
    // Fallback Local Storage Database
    const DB_KEY = 'asterLiteDB_v2';
    
    const initLocalDB = () => {
        let rawData = localStorage.getItem(DB_KEY);
        let parsed;
        
        if (!rawData) {
            parsed = {
                leads: [
                    { id: 'LD-101', date: 'Mar 03, 2026', name: 'Amit Sharma', company: 'Sharma Electricals', source: 'Google', req: '50x 15W COB Lights', status: 'New', assigned: 'OM' },
                    { id: 'LD-102', date: 'Mar 02, 2026', name: 'Sneha Gupta', company: 'Gupta Interiors', source: 'Website', req: 'Wholesale pricing for LED Strips', status: 'Contacted', assigned: 'RJ' },
                    { id: 'LD-103', date: 'Mar 02, 2026', name: 'Vikram Singh', company: 'Singh Builders', source: 'Referral', req: 'Bulk order for New Project', status: 'New', assigned: 'OM' },
                    { id: 'LD-104', date: 'Mar 01, 2026', name: 'Kavita Rao', company: 'Rao Lighting', source: 'Facebook', req: '200x 7W Spotlights', status: 'Contacted', assigned: 'RJ' },
                    { id: 'LD-105', date: 'Mar 01, 2026', name: 'Rajesh Patel', company: 'Patel Agencies', source: 'IndiaMART', req: 'Dealership Inquiry', status: 'New', assigned: 'OM' },
                    { id: 'LD-106', date: 'Feb 28, 2026', name: 'Meena Kumari', company: 'Kumari Decors', source: 'Instagram', req: '30x Chandelier Bulbs', status: 'Contacted', assigned: 'RJ' },
                    { id: 'LD-107', date: 'Feb 28, 2026', name: 'Anil Joshi', company: 'Joshi Smart Homes', source: 'Web', req: 'Smart Lighting Solutions', status: 'New', assigned: 'OM' },
                    { id: 'LD-108', date: 'Feb 27, 2026', name: 'Sunita Deshmukh', company: 'Deshmukh Textiles', source: 'Google', req: 'Factory Highbay Lighting', status: 'Contacted', assigned: 'RJ' },
                    { id: 'LD-109', date: 'Feb 27, 2026', name: 'Sanjay Gupta', company: 'Gupta Hardware', source: 'Website', req: '500x Batten Lights', status: 'New', assigned: 'OM' },
                    { id: 'LD-110', date: 'Feb 26, 2026', name: 'Pooja Mehta', company: 'Mehta Architects', source: 'Referral', req: 'Modern Office Lighting', status: 'Contacted', assigned: 'RJ' }
                ],
                orders: [
                    { id: 'ORD-101', title: 'Mumbai Metro - Tunnel Lighting', amount: 450000, priority: 'high', status: 'lead', assigned: 'OM' },
                    { id: 'ORD-102', title: 'Tech Park Bangalore - Office Lights', amount: 275000, priority: 'medium', status: 'quote', assigned: 'RJ' },
                    { id: 'ORD-103', title: 'Green Valley Resort - Garden LED', amount: 120000, priority: 'low', status: 'order', assigned: 'OM' },
                    { id: 'ORD-104', title: 'Sunrise Mall - Facade Lighting', amount: 850000, priority: 'high', status: 'dispatch', assigned: 'RJ' },
                    { id: 'ORD-105', title: 'Hotel Royal - Indoor Panels', amount: 95000, priority: 'medium', status: 'invoice', assigned: 'OM' },
                    { id: 'ORD-106', title: 'City Hospital - Emergency Lighting', amount: 320000, priority: 'high', status: 'payment', assigned: 'RJ' },
                    { id: 'ORD-107', title: 'Apex Industries - Highbay Installation', amount: 180000, priority: 'medium', status: 'quote', assigned: 'OM' },
                    { id: 'ORD-108', title: 'Cozy Homes Apartment - Smart Switches', amount: 55000, priority: 'low', status: 'lead', assigned: 'RJ' },
                    { id: 'ORD-109', title: 'Global Schools - Classroom Battens', amount: 140000, priority: 'medium', status: 'order', assigned: 'OM' },
                    { id: 'ORD-110', title: 'PVR Cinemas - Step Lighting', amount: 210000, priority: 'low', status: 'quote', assigned: 'RJ' }
                ],
                products: [
                    { sku: 'SKU-1001', name: 'LED Panel 12W Square', available: 1250, reserved: 150, defective: 5, returned: 0 },
                    { sku: 'SKU-1002', name: 'LED Panel 15W Round', available: 840, reserved: 60, defective: 12, returned: 2 },
                    { sku: 'SKU-2005', name: 'Strip Light 5m RGB', available: 45, reserved: 30, defective: 0, returned: 10 },
                    { sku: 'SKU-3012', name: 'COB Light 15W Focus', available: 400, reserved: 50, defective: 3, returned: 0 }
                ]
            };
            localStorage.setItem(DB_KEY, JSON.stringify(parsed));
        } else {
            parsed = JSON.parse(rawData);
        }
        
        if (!parsed.products) {
            parsed.products = [
                { sku: 'SKU-1001', name: 'LED Panel 12W Square', available: 1250, reserved: 150, defective: 5, returned: 0 },
                { sku: 'SKU-1002', name: 'LED Panel 15W Round', available: 840, reserved: 60, defective: 12, returned: 2 }
            ];
            localStorage.setItem(DB_KEY, JSON.stringify(parsed));
        }
        return parsed;
    };

    const saveLocalDB = (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    };

    async function getLeads() {
        if (dbClient) {
            const { data, error } = await dbClient.from('leads').select('*').order('id', { ascending: false });
            if (!error) return data;
        }
        return initLocalDB().leads;
    };

    async function getOrders() {
        if (dbClient) {
            const { data, error } = await dbClient.from('orders').select('*').order('id', { ascending: false });
            if (!error) return data;
        }
        return initLocalDB().orders;
    };

    async function getProducts() {
        console.log('Fetching products from DB...');
        if (dbClient) {
            const { data, error } = await dbClient.from('products').select('*').order('sku', { ascending: true });
            if (!error) {
                console.log('Products fetched successfully:', data.length);
                AppState.products = data;
                populateProductSelects();
                return data;
            }
            console.error('Supabase error fetching products:', error);
        }
        console.log('Falling back to local products...');
        const localProducts = initLocalDB().products;
        AppState.products = localProducts;
        populateProductSelects();
        return localProducts;
    };
    
    const insertLead = async (lead) => {
        if (dbClient) {
            await dbClient.from('leads').insert([lead]);
        }
        const db = initLocalDB();
        db.leads.unshift(lead);
        saveLocalDB(db);
    };
    
    const insertOrder = async (order) => {
        if (dbClient) {
            await dbClient.from('orders').insert([order]);
        }
        const db = initLocalDB();
        db.orders.push(order);
        saveLocalDB(db);
    };

    const insertProduct = async (product) => {
        if (dbClient) {
            await dbClient.from('products').insert([product]);
        }
        const db = initLocalDB();
        db.products.push(product);
        saveLocalDB(db);
        await getProducts(); // Refresh local list
    };
    
    const updateOrderStatus = async (orderId, newStatus) => {
        if (dbClient) {
            const { error } = await dbClient.from('orders').update({ status: newStatus }).eq('id', orderId);
            if (!error) return;
        }
        const db = initLocalDB();
        const order = db.orders.find(o => o.id === orderId);
        if (order) { order.status = newStatus; saveLocalDB(db); }
    };

    async function renderLeads() {
        const leads = await getLeads();
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        leads.forEach(lead => {
            let statusPill = 'stock-available';
            if (lead.status === 'Contacted') statusPill = 'stock-warning';
            
            let avatarColor = lead.assigned === 'OM' ? '' : 'style="background: var(--warning)"';
            
            tbody.innerHTML += `
                <tr>
                    <td>${lead.date}</td>
                    <td>
                        <strong>${lead.name}</strong><br>
                        <span style="font-size: 12px; color: var(--text-tertiary);">${lead.company}</span>
                    </td>
                    <td>${lead.source}</td>
                    <td>${lead.req}</td>
                    <td><span class="stock-pill ${statusPill}">${lead.status}</span></td>
                    <td><div class="avatar-sm" ${avatarColor}>${lead.assigned}</div></td>
                    <td>
                        <button class="icon-btn-small" title="Convert to Quote"><i class='bx bx-file'></i></button>
                        <button class="icon-btn-small" title="Call"><i class='bx bx-phone'></i></button>
                    </td>
                </tr>
            `;
        });
        renderDashboard();
    };

    async function renderInventory() {
        const products = await getProducts();
        const tbody = document.querySelector('#view-inventory tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        products.forEach(p => {
            const total = (p.available || 0) + (p.reserved || 0) + (p.defective || 0) + (p.returned || 0);
            const stockLevelClass = p.available < 50 ? 'stock-warning' : 'stock-available';

            tbody.innerHTML += `
                <tr>
                    <td><strong>${p.sku}</strong></td>
                    <td>${p.name}</td>
                    <td><span class="stock-pill ${stockLevelClass}">${(p.available || 0).toLocaleString()}</span></td>
                    <td><span class="stock-pill stock-reserved">${(p.reserved || 0).toLocaleString()}</span></td>
                    <td><span class="stock-pill stock-defective">${(p.defective || 0).toLocaleString()}</span></td>
                    <td><span class="stock-pill stock-return">${(p.returned || 0).toLocaleString()}</span></td>
                    <td>${total.toLocaleString()}</td>
                    <td><button class="icon-btn-small" title="Audit Log"><i class='bx bx-history'></i></button></td>
                </tr>
            `;
        });
    };

    async function renderOrders() {
        const orders = await getOrders();
        const kanbanWrapper = document.getElementById('kanbanBoardWrapper');
        if (!kanbanWrapper) return;
        
        const cols = ['lead', 'quote', 'order', 'dispatch', 'invoice', 'payment'];
        const colNames = { lead: 'Lead', quote: 'Quote', order: 'Order', 'dispatch': 'Dispatch', invoice: 'Invoice', payment: 'Payment' };
        
        // Group orders by status
        const grouped = cols.reduce((acc, col) => ({ ...acc, [col]: [] }), {});
        orders.forEach(order => {
            if (grouped[order.status]) {
                grouped[order.status].push(order);
            }
        });

        let html = '';
        cols.forEach(col => {
            const orders = grouped[col] || [];
            html += `
                <div class="kanban-col">
                    <div class="col-header"><h3>${colNames[col]}</h3><span class="count">${orders.length}</span></div>
                    <div class="col-body" data-status="${col}">
            `;
            
            orders.forEach(ord => {
                let priorityHtml = '';
                if (ord.priority === 'high') priorityHtml = '<span class="badge priority-high">High</span>';
                else if (ord.priority === 'medium') priorityHtml = '<span class="badge priority-medium">Med</span>';
                
                let avatarColor = ord.assigned === 'OM' ? '' : 'style="background: var(--warning)"';

                // Use dataset for dragged items
                html += `
                        <div class="kanban-card" draggable="true" data-id="${ord.id}">
                            <div class="card-header">
                                <span class="card-id">#${ord.id}</span>
                                ${priorityHtml}
                            </div>
                            <div class="card-title">${ord.title}</div>
                            <div class="card-footer">
                                <span class="amount">₹${ord.amount.toLocaleString('en-IN')}</span>
                                <div class="avatar-sm" ${avatarColor}>${ord.assigned}</div>
                            </div>
                        </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        kanbanWrapper.innerHTML = html;
        attachDragEvents();
        renderDashboard();
    };

    async function renderDashboard() {
        const leads = await getLeads();
        const orders = await getOrders();

        const statNewLeads = document.getElementById('stat-new-leads');
        const statPendingQuotes = document.getElementById('stat-pending-quotes');
        const statOrdersDispatch = document.getElementById('stat-orders-dispatch');
        const statDefectiveStock = document.getElementById('stat-defective-stock');

        if (statNewLeads) {
            const newLeadsCount = leads.filter(l => l.status === 'New').length;
            statNewLeads.innerText = newLeadsCount;
        }

        if (statPendingQuotes) {
            const pendingQuotesCount = orders.filter(o => o.status === 'quote').length;
            statPendingQuotes.innerText = pendingQuotesCount;
        }

        if (statOrdersDispatch) {
            const ordersToDispatchCount = orders.filter(o => o.status === 'order' || o.status === 'dispatch').length;
            statOrdersDispatch.innerText = ordersToDispatchCount;
        }

        if (statDefectiveStock) {
            // Count defective items from the static table or mock for now
            // For a better experience, we sum up the defective pills in the inventory table
            const defectivePills = document.querySelectorAll('.stock-defective');
            let totalDefective = 0;
            defectivePills.forEach(pill => {
                const val = parseInt(pill.innerText.replace(/,/g, '')) || 0;
                totalDefective += val;
            });
            statDefectiveStock.innerText = totalDefective + ' Items';
        }
    };

    // --- Kanban Logic ---
    let draggedCard = null;

    const attachDragEvents = () => {
        const cards = document.querySelectorAll('.kanban-card');
        const colsBody = document.querySelectorAll('.col-body');

        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedCard = card;
                setTimeout(() => card.style.opacity = '0.4', 0);
            });
            
            card.addEventListener('dragend', (e) => {
                draggedCard = null;
                setTimeout(() => card.style.opacity = '1', 0);
            });
        });

        colsBody.forEach(col => {
            col.addEventListener('dragover', (e) => {
                e.preventDefault();
                col.classList.add('drag-over');
            });

            col.addEventListener('dragleave', () => {
                col.classList.remove('drag-over');
            });

            col.addEventListener('drop', async (e) => {
                e.preventDefault();
                col.classList.remove('drag-over');

                if (draggedCard) {
                    col.appendChild(draggedCard);

                    // Save new status to DB
                    const newStatus = col.dataset.status;
                    const orderId = draggedCard.dataset.id;
                    
                    await updateOrderStatus(orderId, newStatus);
                    
                    // Update counts instantly
                    renderOrders();
                }
            });
        });
    };

    // --- Form Submissions (Modals) ---
    // --- Multi-Item Lead Handling ---
    const addLeadItemRow = () => {
        const container = document.getElementById('leadItemsContainer');
        if (!container) {
            console.error('Lead items container not found!');
            return;
        }

        const div = document.createElement('div');
        div.className = 'lead-item-row';
        div.style.display = 'grid';
        div.style.gridTemplateColumns = '1fr 120px 44px';
        div.style.gap = '12px';
        div.style.alignItems = 'end';
        div.style.marginBottom = '12px';
        div.style.padding = '8px';
        div.style.background = 'white';
        div.style.borderRadius = '8px';
        div.style.border = '1px solid var(--border-light)';

        div.innerHTML = `
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Select Product</label>
                <select class="form-control product-select-target" style="width: 100%;"></select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px; display: block;">Quantity</label>
                <input type="text" class="form-control qty-input" placeholder="e.g. 50x" style="width: 100%;">
            </div>
            <button type="button" class="icon-btn-small remove-item" style="height: 42px; width: 44px; border: 1px solid var(--border-light); border-radius: 6px; display: flex; align-items: center; justify-content: center; background: #fff5f5; color: var(--danger);"><i class='bx bx-trash'></i></button>
        `;

        container.appendChild(div);
        populateProductSelects(div);

        // Remove row logic
        div.querySelector('.remove-item').addEventListener('click', () => {
            if (container.children.length > 1) {
                div.remove();
            } else {
                alert('At least one item is required.');
            }
        });
    };

    // Re-bind Add Item button just in case
    const btnAddLeadItemRef = document.getElementById('btnAddLeadItem');
    btnAddLeadItemRef?.addEventListener('click', (e) => {
        e.preventDefault();
        addLeadItemRow();
    });

    document.getElementById('btnSaveLead')?.addEventListener('click', async () => {
        const name = document.getElementById('newLeadName').value;
        const company = document.getElementById('newLeadCompany').value;
        const source = document.getElementById('newLeadSource').value;
        const assigned = document.getElementById('newLeadAssigned').value;
        const notes = document.getElementById('newLeadNotes').value;

        if (!name) return alert('Lead name is required');
        
        // Collect Items
        const rows = document.querySelectorAll('.lead-item-row');
        let req = '';
        rows.forEach((row, index) => {
            const product = row.querySelector('.product-select-target').value;
            const qty = row.querySelector('.qty-input').value;
            req += `${qty ? qty + ' ' : ''}${product}${index < rows.length - 1 ? '\n' : ''}`;
        });

        if (notes) req += `\nNotes: ${notes}`;
        
        const newLead = {
            id: Math.floor(Math.random() * 10000) + 5000, 
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            name, company, source, assigned, req: req.trim(), status: 'New'
        };
        await insertLead(newLead);
        
        document.getElementById('leadModal').classList.remove('show');
        renderLeads();
    });

    document.getElementById('btnSaveOrder')?.addEventListener('click', async () => {
        const client = document.getElementById('newOrderClient').value;
        const amount = parseFloat(document.getElementById('newOrderAmount').value) || 0;
        const priority = document.getElementById('newOrderPriority').value;
        const status = document.getElementById('newOrderStatus').value;
        const desc = document.getElementById('newOrderDesc').value;
        
        if (!client) return alert('Client name is required');
        
        const newOrder = {
            id: 'ORD-' + Math.floor(Math.random() * 10000),
            title: client + (desc ? ' - ' + desc : ''),
            amount, priority, status, assigned: 'OM'
        };
        await insertOrder(newOrder);
        
        document.getElementById('orderModal').classList.remove('show');
        renderOrders();
    });

    // --- New Product Modal Handlers ---
    const productModal = document.getElementById('productModal');
    const btnNewProduct = document.getElementById('btnNewProduct');
    const btnSaveProduct = document.getElementById('btnSaveProduct');
    const closeProductModal = document.getElementById('closeProductModal');
    const cancelProductBtn = document.getElementById('cancelProductBtn');

    btnNewProduct?.addEventListener('click', () => {
        productModal.classList.add('show');
    });

    const hideProductModal = () => productModal.classList.remove('show');
    closeProductModal?.addEventListener('click', hideProductModal);
    cancelProductBtn?.addEventListener('click', hideProductModal);

    btnSaveProduct?.addEventListener('click', async () => {
        const sku = document.getElementById('newProductSKU').value;
        const name = document.getElementById('newProductName').value;
        const stock = parseInt(document.getElementById('newProductStock').value) || 0;

        if (!sku || !name) return alert('SKU and Product Name are required');

        await insertProduct({
            sku, name, available: stock, reserved: 0, defective: 0, returned: 0
        });

        hideProductModal();
        renderInventory();
    });

    // --- Lead Modal Open/Close ---
    const btnAddLead = document.getElementById('btnAddLead');
    btnAddLead?.addEventListener('click', () => {
        const modal = document.getElementById('leadModal');
        const container = document.getElementById('leadItemsContainer');
        if (modal && container) {
            modal.classList.add('show');
            // Reset and add first item row
            container.innerHTML = '';
            addLeadItemRow();
            
            // Clear other fields
            document.getElementById('newLeadName').value = '';
            document.getElementById('newLeadCompany').value = '';
            document.getElementById('newLeadNotes').value = '';
        }
    });

    const closeLeadModal = document.querySelector('#leadModal .bx-x')?.parentElement;
    closeLeadModal?.addEventListener('click', () => document.getElementById('leadModal').classList.remove('show'));
    document.querySelector('#leadModal .secondary-btn')?.addEventListener('click', () => document.getElementById('leadModal').classList.remove('show'));


    // Create App User
    const btnCreateUser = document.getElementById('btnCreateUser');
    if (btnCreateUser) {
        btnCreateUser.addEventListener('click', async () => {
            const email = document.getElementById('newUserEmail').value;
            const password = document.getElementById('newUserPassword').value;
            const role = document.getElementById('newUserRole').value;
            
            if (!email || !password) return alert('Email and Password are required');
            
            // Set Loading state
            btnCreateUser.disabled = true;
            btnCreateUser.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Creating...";

            // Attempt Supabase Auth creation if connected
            if (dbClient) {
                const { data, error } = await dbClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: role
                        }
                    }
                });
                if (error) {
                    console.warn('Supabase Auth error (could be expected for anon keys if signup is restricted):', error);
                    alert(`Supabase Error: ${error.message}`);
                    // Reset Loading state
                    btnCreateUser.disabled = false;
                    btnCreateUser.innerHTML = "Create User";
                    return;
                }
            }
            
            // Mock Success representation for visual feedback
            alert(`Successfully created new ${role}: ${email}`);
            document.getElementById('newUserEmail').value = '';
            document.getElementById('newUserPassword').value = '';
            
            // Reset Loading state
            btnCreateUser.disabled = false;
            btnCreateUser.innerHTML = "Create User";
        
        // You would typically re-fetch users from dbClient.auth.admin.listUsers() if holding Service Key.
        // For UI feedback, we can just append a mock element
        const headers = Array.from(document.querySelectorAll('#view-settings h4'));
        const teamListMock = headers.find(h => h.textContent.includes('Current Members'))?.parentElement;
        if(teamListMock) {
            const initial = email.substring(0,2).toUpperCase();
            teamListMock.innerHTML += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--border-light); border-radius: 8px; margin-top: 8px;">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <div class="avatar-sm" style="background: var(--primary)">${initial}</div>
                        <div><strong>New User (${role})</strong><br><span style="font-size: 12px; color: var(--text-tertiary);">${email}</span></div>
                    </div>
                    <span class="stock-pill stock-available">Active</span>
                </div>
            `;
        }
    });
    }

    // Save Quote as Draft -> Creates an Order with Quote status
    const btnSaveDraft = document.querySelector('.doc-actions-bar .secondary-btn');
    if (btnSaveDraft) {
        btnSaveDraft.addEventListener('click', async () => {
            const clientNameInput = document.querySelector('.client-grid input[placeholder="Enter B2B client name..."]');
            const clientName = clientNameInput ? clientNameInput.value : 'Unknown Client';
            
            const totalText = document.getElementById('calcTotal').innerText.replace(/[^0-9.]/g, '');
            const amount = parseFloat(totalText) || 0;
            
            if (!clientName || clientName === 'Unknown Client') return alert('Please enter client details first.');

            await insertOrder({
                id: 'ORD-' + Math.floor(Math.random() * 10000),
                title: clientName + ' - Quote Document',
                amount, priority: 'medium', status: 'quote', assigned: 'OM'
            });
            alert('Quote Data Saved as an Order Inquiry!');
            renderOrders();
        });
    }

    // Initialize the DB & Views
    initLocalDB();
    getProducts(); // Initial product load
    renderLeads();
    renderOrders();

    // --- Login & Logout Logic ---
    const loginScreen = document.getElementById('login-screen');
    const appContent = document.getElementById('app-content');
    const loginForm = document.getElementById('loginForm');
    const btnLoginSubmit = document.getElementById('btnLoginSubmit');
    const btnLogout = document.getElementById('btnLogout');

    // Check auth on load
    const userRole = localStorage.getItem('aster_user_role');
    if (userRole) {
        loginScreen.style.display = 'none';
        appContent.style.display = 'flex';
    } else {
        loginScreen.style.display = 'flex';
        appContent.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            btnLoginSubmit.disabled = true;
            btnLoginSubmit.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Logging in...";

            // Hardcoded dummy accounts bypass
            const dummyAccounts = {
                'admin@gmail.com': 'Admin',
                'manager@gmail.com': 'Manager',
                'sales@gmail.com': 'Sales',
                'inventory@gmail.com': 'Inventory'
            };

            let roleToAssign = 'Admin'; // default

            if (dummyAccounts[email] && password === 'Abcd@1234') {
                // Successfully log in as dummy account
                roleToAssign = dummyAccounts[email];
            } else if (dbClient) {
                // Real Supabase Account
                const { data, error } = await dbClient.auth.signInWithPassword({
                    email,
                    password,
                });
                
                if (error) {
                    alert(`Login Failed: ${error.message}`);
                    btnLoginSubmit.disabled = false;
                    btnLoginSubmit.innerHTML = "Log In";
                    return;
                }
                if (data.user?.user_metadata?.role) {
                    roleToAssign = data.user.user_metadata.role;
                }
            } else {
                 alert(`Invalid dummy account or no DB connected.`);
                 btnLoginSubmit.disabled = false;
                 btnLoginSubmit.innerHTML = "Log In";
                 return;
            }

            // Simulate slight delay for dramatic effect if DB is fast
            setTimeout(() => {
                localStorage.setItem('aster_user_role', roleToAssign);
                loginScreen.style.display = 'none';
                appContent.style.display = 'flex';
                btnLoginSubmit.disabled = false;
                btnLoginSubmit.innerHTML = "Log In";
                
                // Update UI Avatar based on email
                const avatar = document.querySelector('.user-profile .avatar');
                const nameSpan = document.querySelector('.user-profile .info .name');
                const roleSpan = document.querySelector('.user-profile .info .role');
                if(avatar) avatar.innerText = email.substring(0,2).toUpperCase();
                if(nameSpan) nameSpan.innerText = email.split('@')[0].toUpperCase();
                if(roleSpan) roleSpan.innerText = roleToAssign;

            }, 500);
        });
    }

    // --- Profile Dropdown Logic ---
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    
    if (userProfileBtn && userProfileDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (userProfileDropdown.style.display === 'none') {
                userProfileDropdown.style.display = 'block';
            } else {
                userProfileDropdown.style.display = 'none';
            }
        });
        document.addEventListener('click', (e) => {
            if (!userProfileDropdown.contains(e.target) && !userProfileBtn.contains(e.target)) {
                userProfileDropdown.style.display = 'none';
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if (dbClient) {
                await dbClient.auth.signOut();
            }
            localStorage.removeItem('aster_user_role');
            loginScreen.style.display = 'flex';
            appContent.style.display = 'none';
            userProfileDropdown.style.display = 'none';
            // Also reset URL
            window.location.hash = '';
            switchView('dashboard');
        });
    }

    // --- Modal Management (Open/Close Handlers) ---
    // Add Lead
    const viewLeadsHeaderBtn = document.querySelector('#view-leads .primary-btn');
    const leadModal = document.getElementById('leadModal');
    if (viewLeadsHeaderBtn && leadModal) {
        viewLeadsHeaderBtn.addEventListener('click', () => {
            leadModal.classList.add('show');
            setTimeout(() => document.getElementById('newLeadName')?.focus(), 50);
        });
    }
    
    // New Order
    const btnNewOrder = document.getElementById('btnNewOrder');
    const orderModal = document.getElementById('orderModal');
    if (btnNewOrder && orderModal) {
        btnNewOrder.addEventListener('click', () => {
            orderModal.classList.add('show');
            setTimeout(() => document.getElementById('newOrderClient')?.focus(), 50);
        });
    }

    // Adjust Stock
    const btnAdjustStock = document.getElementById('btnAdjustStock');
    const stockModal = document.getElementById('stockModal');
    if (btnAdjustStock && stockModal) {
        btnAdjustStock.addEventListener('click', () => {
            stockModal.classList.add('show');
            setTimeout(() => document.getElementById('stockProductSelect')?.focus(), 50);
        });
    }

    // Global Modal Closers (X icon & Cancel buttons)
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        const closeBtn = modal.querySelector('.icon-btn-small');
        const cancelBtn = modal.querySelector('.secondary-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // --- Settings Tabs Logic ---
    const settingNavItems = document.querySelectorAll('.setting-nav-item');
    const settingPanels = document.querySelectorAll('.setting-panel');

    settingNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = `setting-${item.dataset.setting}`;
            
            // Toggle active classes on nav
            settingNavItems.forEach(nav => {
                nav.classList.remove('active');
                nav.style.background = 'transparent';
                nav.style.color = 'var(--text-secondary)';
                nav.style.fontWeight = 'normal';
            });
            item.classList.add('active');
            item.style.background = 'var(--bg-main)';
            item.style.color = 'var(--text-primary)';
            item.style.fontWeight = '500';

            // Toggle active panels
            settingPanels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
        });
    });

});
