(function() {
    if (window.LAYOUT_DATA) {
        Object.keys(window.LAYOUT_DATA).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.position = 'fixed';
                el.style.top = window.LAYOUT_DATA[id].top;
                el.style.left = window.LAYOUT_DATA[id].left;
                el.style.margin = "0";
            }
        });
        return;
    }

    let activeEl = null;
    let clickTimer = null;
    const layoutConfig = {};

    document.addEventListener('click', (e) => {
        // --- THE "AUTO-DROP" OVERRIDE ---
        // If we are already moving something, the NEXT click ALWAYS drops it.
        if (activeEl) {
            console.log("🛬 Landing: " + activeEl.id);
            activeEl.style.outline = "none";
            activeEl.style.boxShadow = "none";
            activeEl.style.opacity = "1";
            
            layoutConfig[activeEl.id] = { 
                top: activeEl.style.top, 
                left: activeEl.style.left 
            };
            
            activeEl = null;
            return; // Exit early so we don't immediately pick it up again
        }

        // --- MULTI-CLICK LOGIC ---
        const clickCount = e.detail; // Browser tracks 1, 2, or 3 clicks automatically

        if (clickCount === 1) {
            // SINGLE CLICK: Target the main container (like <main> or a <div>)
            const container = e.target.closest('main[id], div[id]');
            if (container) startMove(container);
        } 
        else if (clickCount === 2) {
            // DOUBLE CLICK: Target the <article>
            const article = e.target.closest('article[id]');
            if (article) startMove(article);
        }
        else if (clickCount === 3) {
            // TRIPLE CLICK: Do nothing (let the browser select the text)
            console.log("📖 Text Selection Mode");
        }
    });

    function startMove(el) {
        if (el.id === 'export-btn') return;
        activeEl = el;
        activeEl.style.position = 'fixed';
        activeEl.style.zIndex = "9999";
        activeEl.style.outline = "4px solid #0070F3";
        activeEl.style.opacity = "0.7";
        console.log("🛫 Taking off: " + activeEl.id);
    }

    document.addEventListener('mousemove', (e) => {
        if (!activeEl) return;
        activeEl.style.left = (e.clientX - 20) + 'px';
        activeEl.style.top = (e.clientY - 20) + 'px';
    });

    // Copy Button
    const btn = document.createElement('button');
    btn.id = 'export-btn';
    btn.innerText = "💾 Save Layout";
    btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:10000; padding:12px; background:#0070F3; color:white; border:none; border-radius:8px; cursor:pointer;";
    btn.onclick = (e) => {
        e.stopPropagation();
        const code = `<script>window.LAYOUT_DATA = ${JSON.stringify(layoutConfig)};</script>`;
        navigator.clipboard.writeText(code);
        alert("Copied! Paste above your script tag.");
    };
    document.body.appendChild(btn);
})();
