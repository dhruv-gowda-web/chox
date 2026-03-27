// magic-mover.js
(async function() {
  try {
    const response = await fetch('layout.txt');
    const text = await response.text();
    const lines = text.split('\n');

    lines.forEach(line => {
      if (!line.trim() || !line.includes('=')) return;

      // Split the format: id=pos;smart
      const [id, rest] = line.split('=');
      const [pos, smartStatus] = rest.split(';');
      
      const el = document.getElementById(id.trim());
      if (!el) return;

      el.style.position = 'absolute';
      el.style.margin = '0';

      // 1. Handle Position (center, top-right, or x,y)
      const cleanPos = pos.trim();
      if (cleanPos === 'center') {
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transform = 'translate(-50%, -50%)';
      } else if (cleanPos === 'top-right') {
        el.style.top = '20px';
        el.style.right = '20px';
        el.style.left = 'auto';
      } else if (cleanPos.includes(',')) {
        const [top, left] = cleanPos.split(',');
        el.style.top = top.trim();
        el.style.left = left.trim();
      }

      // 2. Smart Detection (Default is TRUE unless "false" is written)
      const isSmart = smartStatus ? smartStatus.trim() !== 'false' : true;

      if (isSmart) {
        setTimeout(() => {
          let attempts = 0;
          while (isOverlapping(el) && attempts < 50) {
            const currentTop = parseInt(window.getComputedStyle(el).top) || 0;
            el.style.top = (currentTop + 20) + "px"; // Nudge down
            attempts++;
          }
        }, 150);
      }
    });
  } catch (e) {
    console.error("Flight Error: Could not find layout.txt", e);
  }

  function isOverlapping(element) {
    const rect1 = element.getBoundingClientRect();
    const others = document.querySelectorAll('article[id], div[id], fieldset[id]');
    for (let other of others) {
      if (other === element || other.contains(element)) continue;
      const rect2 = other.getBoundingClientRect();
      if (!(rect1.right < rect2.left || rect1.left > rect2.right || 
            rect1.bottom < rect2.top || rect1.top > rect2.bottom)) return true;
    }
    return false;
  }
})();
