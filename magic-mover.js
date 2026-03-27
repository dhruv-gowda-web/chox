// magic-mover.js
(function() {
    if (window.LAYOUT_DATA) {
        for (const id in window.LAYOUT_DATA) {
            const el = document.getElementById(id);
            if (el) {
                el.style.position = 'absolute';
                el.style.top = window.LAYOUT_DATA[id].top;
                el.style.left = window.LAYOUT_DATA[id].left;
            }
        }
        return;
    }

    console.log("Magic Mover: Click-to-Move Mode Active.");
    let activeEl = null;
    const layoutConfig = {};

    const elements = document.querySelectorAll('[id]'); 
    
    elements.forEach(el => {
        if(el.id === 'export-btn') return; 

        el.style.cursor = 'pointer';
        el.style.transition = 'outline 0.2s'; // Visual feedback
        
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents clicking the background by accident

            if (!activeEl) {
                // --- ATTACH MODE ---
                activeEl = el;
                el.style.outline = "3px solid #0070F3"; // Highlight the box
                el.style.position = 'absolute';
                el.style.zIndex = 1000;
                console.log(`Attached to: ${el.id}`);
            } else if (activeEl === el) {
                // --- DETACH MODE ---
                activeEl.style.outline = "none";
                layoutConfig[activeEl.id] = { 
                    top: activeEl.style.top, 
                    left: activeEl.style.left 
                };
                activeEl = null;
                console.log("Dropped!");
            }
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeEl) return;
        
        // The box now follows your mouse without holding click!
        // We center it on your cursor (-50px is half of a standard box)
        activeEl.style.left = (e.clientX - 50) + 'px';
        activeEl.style.top = (e.clientY - 20) + 'px';
    });

    // The Export Button
    const btn = document.createElement('button');
    btn.id = 'export-btn';
    btn.innerText = "📋 Copy Layout Data";
    btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:9999; padding:15px; background:#0070F3; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold;";
    
    btn.onclick = () => {
        const scriptString = `<script>window.LAYOUT_DATA = ${JSON.stringify(layoutConfig)};</script>`;
        navigator.clipboard.writeText(scriptString).then(() => {
            btn.innerText = "✅ Copied!";
            setTimeout(() => btn.innerText = "📋 Copy Layout Data", 2000);
        });
    };
    document.body.appendChild(btn);
})();
