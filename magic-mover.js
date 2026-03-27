// magic-mover.js
(function() {
    // 1. LOAD MODE: Check if layout data already exists in the HTML
    if (window.LAYOUT_DATA) {
        for (const id in window.LAYOUT_DATA) {
            const el = document.getElementById(id);
            if (el) {
                el.style.position = 'absolute';
                el.style.top = window.LAYOUT_DATA[id].top;
                el.style.left = window.LAYOUT_DATA[id].left;
                el.style.transform = window.LAYOUT_DATA[id].transform || 'none';
            }
        }
        console.log("Magic Mover: Layout loaded successfully!");
        return; // Stop the script here, we don't need Edit Mode
    }

    // 2. EDIT MODE: If no data is found, let the user drag things around
    console.log("Magic Mover: Edit Mode Active.");
    let draggedEl = null;
    let offsetX = 0, offsetY = 0;
    const layoutConfig = {};

    const elements = document.querySelectorAll('[id]'); 
    
    elements.forEach(el => {
        if(el.id === 'export-btn') return; 

        el.style.cursor = 'grab';
        
        el.addEventListener('mousedown', (e) => {
            draggedEl = el;
            const rect = el.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            el.style.position = 'absolute';
            el.style.cursor = 'grabbing';
            el.style.zIndex = 1000; 
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (!draggedEl) return;
        
        const newLeft = (e.clientX - offsetX) + 'px';
        const newTop = (e.clientY - offsetY) + 'px';
        
        draggedEl.style.left = newLeft;
        draggedEl.style.top = newTop;
        
        layoutConfig[draggedEl.id] = { top: newTop, left: newLeft };
    });

    document.addEventListener('mouseup', () => {
        if (draggedEl) {
            draggedEl.style.cursor = 'grab';
            draggedEl.style.zIndex = '';
            draggedEl = null;
        }
    });

    // Create the Copy to Clipboard Button
    const btn = document.createElement('button');
    btn.id = 'export-btn';
    btn.innerText = "📋 Copy Layout Data";
    btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:9999; padding:15px; background:#0070F3; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3);";
    
    btn.onclick = () => {
        // Generate the exact script tag needed
        const scriptString = `<script>window.LAYOUT_DATA = ${JSON.stringify(layoutConfig)};</script>`;
        
        // Copy it directly to the clipboard
        navigator.clipboard.writeText(scriptString).then(() => {
            btn.innerText = "✅ Copied! Paste into HTML";
            btn.style.background = "#10B981";
            setTimeout(() => {
                btn.innerText = "📋 Copy Layout Data";
                btn.style.background = "#0070F3";
            }, 3000);
        });
    };
    document.body.appendChild(btn);
})();
