   const wrapper = document.querySelector('.skill-galaxy-wrapper');
    const galaxy = document.getElementById('skill-galaxy');

    let scale = 1.2;      // starting zoom
    let maxScale = 3.0;   // max zoom allowed

    let isDragging = false;
    let startX, startY;
    let scrollLeft = 0;
    let scrollTop = 0;

    // Center galaxy on load
    wrapper.scrollLeft = galaxy.offsetWidth / 2 - wrapper.offsetWidth / 2;
    wrapper.scrollTop = galaxy.offsetHeight / 2 - wrapper.offsetHeight / 2;

    // Drag to pan
    wrapper.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startY = e.pageY;
        scrollLeft = wrapper.scrollLeft;
        scrollTop = wrapper.scrollTop;
    });

    wrapper.addEventListener('mouseup', () => isDragging = false);
    wrapper.addEventListener('mouseleave', () => isDragging = false);

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.pageX - startX;
        const dy = e.pageY - startY;
        wrapper.scrollLeft = scrollLeft - dx;
        wrapper.scrollTop = scrollTop - dy;
    });

    //Core lines
    function drawCoreLines() {
        const svg = document.getElementById("galaxy-lines");
        svg.innerHTML = ""; // clear old lines

        const svgRect = svg.getBoundingClientRect(); // SVG position on page

        const core = document.querySelector(".core-star");
        const nodes = document.querySelectorAll(".orbit-node");

        const coreRect = core.getBoundingClientRect();

        // Convert page coords → SVG coords
        const coreX = coreRect.left + coreRect.width / 2 - svgRect.left;
        const coreY = coreRect.top + coreRect.height / 2 - svgRect.top;

        nodes.forEach(node => {
            const rect = node.getBoundingClientRect();

            const nodeX = rect.left + rect.width / 2 - svgRect.left;
            const nodeY = rect.top + rect.height / 2 - svgRect.top;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

            line.setAttribute("x1", coreX);
            line.setAttribute("y1", coreY);
            line.setAttribute("x2", nodeX);
            line.setAttribute("y2", nodeY);

            line.setAttribute("stroke", "var(--azb)");
            line.setAttribute("stroke-width", "2");

            svg.appendChild(line);
        });
    }

    window.addEventListener("load", drawCoreLines);
    window.addEventListener("resize", drawCoreLines);

    // Sub-node lines
        function drawSubNodeLines() {
        const nodes = document.querySelectorAll(".orbit-node");

        nodes.forEach(node => {
            const svg = node.querySelector(".sub-lines");
            if (!svg) return;

            svg.innerHTML = ""; // clear old lines

            const svgRect = svg.getBoundingClientRect();
            const nodeRect = node.getBoundingClientRect();

            // main node center in SVG coords
            const nodeX = nodeRect.left + nodeRect.width / 2 - svgRect.left;
            const nodeY = nodeRect.top + nodeRect.height / 2 - svgRect.top;

            const subs = node.querySelectorAll("[class^='sub-node']");

            subs.forEach(sub => {
                const subRect = sub.getBoundingClientRect();

                // sub-node center in SVG coords
                const subX = subRect.left + subRect.width / 2 - svgRect.left;
                const subY = subRect.top + subRect.height / 2 - svgRect.top;

                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

                line.setAttribute("x1", nodeX);
                line.setAttribute("y1", nodeY);
                line.setAttribute("x2", subX);
                line.setAttribute("y2", subY);

                line.setAttribute("stroke", "var(--azb)");
                line.setAttribute("stroke-width", "1.5");

                svg.appendChild(line);
            });
        });
    }

    window.addEventListener("load", drawSubNodeLines);
    window.addEventListener("resize", drawSubNodeLines);
    animate();