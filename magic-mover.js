(function() {
    // 1. LOAD MODE: If layout exists, lock it in
    if (window.LAYOUT_DATA) {
        Object.keys(window.LAYOUT_DATA).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.position = 'fixed';
                el.style.top = window.LAYOUT_DATA[id].top;
                el.style.left = window.LAYOUT_DATA[id].left;
                el.style.margin = "0"; 
                el.style.width = window.LAYOUT_DATA[id].width || 'auto';
            }
        });
        return;
    }

    // 2. EDIT MODE: Click-to-Move
    console.log("🚀 Airplane Mode: Click an article to move it!");
    let activeEl = null;
    let zIndexCounter = 1000;
    const layoutConfig = {};

    document.addEventListener('click', (e) => {
        // Find the article with an ID
        const target = e.target.closest('article[id]');
        
        if (!target || target.id === 'export-btn') return;

        if (!activeEl) {
            // PICK UP
            activeEl = target;
            activeEl.style.position = 'fixed';
            activeEl.style.zIndex = ++zIndexCounter;
            activeEl.style.outline = "4px solid #0070F3";
            activeEl.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
            activeEl.style.cursor = "move";
            console.log("✈️ Carrying: " + activeEl.id);
        } else {
            // DROP
            activeEl.style.outline = "none";
            activeEl.style.boxShadow = "none";
            layoutConfig[activeEl.id] = { 
                top: activeEl.style.top, 
                left: activeEl.style.left,
                width: activeEl.offsetWidth + 'px'
            };
            console.log("🛬 Dropped: " + activeEl.id);
            activeEl = null;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeEl) return;
        // Move the article so the top-left corner follows the mouse
        activeEl.style.left = (e.clientX - 20) + 'px';
        activeEl.style.top = (e.clientY - 20) + 'px';
    });

    // Copy Button
    const btn = document.createElement('button');
    btn.id = 'export-btn';
    btn.innerText = "💾 Save Airplane Layout";
    btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:10000; padding:15px; background:#0070F3; color:white; border:none; border-radius:10px; cursor:pointer; font-weight:bold;";
    btn.onclick = (e) => {
        e.stopPropagation();
        const code = `<script>window.LAYOUT_DATA = ${JSON.stringify(layoutConfig)};</script>`;
        navigator.clipboard.writeText(code);
        alert("Layout Data Copied! Paste it into your HTML file above the script tag.");
    };
    document.body.appendChild(btn);
})();
