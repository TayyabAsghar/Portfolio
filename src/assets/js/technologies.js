(function () {
  function initTechnologies() {
    const wrapEl = document.getElementById("os-wrap");
    if (!wrapEl) return;

    const hubSub = document.getElementById("hub-sub");
    const hubName = document.getElementById("hub-name");
    const hubEl = document.getElementById("os-hub");
    const hubCore = document.getElementById("os-hub-core");
    const hubGlow = document.getElementById("os-hub-glow");
    const hubDefaultPath = document.getElementById("hub-default-path");
    const hubDefaultExtra = document.getElementById("hub-default-extra");
    const hubDynamicIconShape = document.getElementById("hub-dynamic-icon");

    const groupsData = wrapEl.dataset.groups;
    if (!groupsData) return;

    const GROUPS = JSON.parse(groupsData);
    const DRILL_RX = [150, 240, 320, 390];
    const DRILL_RY = [60, 95, 130, 160];
    const DRILL_SPD = [14, 20, 27, 34];
    const TILT_X = 25;
    const TP = 44;

    let solarLis = null;
    let isDrillDown = false;

    function getEllipsePathStr(rx, ry) {
      return `M -${rx} 0 A ${rx} ${ry} 0 1 1 ${rx} 0 A ${rx} ${ry} 0 1 1 -${rx} 0`;
    }

    function attachSolarClicks() {
      wrapEl.querySelectorAll(".os-gplanet").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const g = GROUPS.find((x) => x.id === btn.dataset.gid);
          if (g) enterGroup(g);
        };
      });
    }

    function enterGroup(group) {
      isDrillDown = true;
      if (!solarLis) solarLis = [...wrapEl.querySelectorAll(".sol-ring-li")];
      solarLis.forEach((li) => li.classList.add("hidden"));
      wrapEl.querySelectorAll(".drill-ring-li").forEach((li) => li.remove());

      const skills = group.skills;
      const numRings = Math.min(4, Math.ceil(skills.length / 5));
      const rings = Array.from({ length: numRings }, () => []);
      skills.forEach((s, i) => rings[i % numRings].push(s));

      const hubLi = wrapEl.querySelector(".os-hub-li");

      rings.forEach((ring, ri) => {
        const rx = DRILL_RX[ri],
          ry = DRILL_RY[ri];
        const speed = DRILL_SPD[ri];
        const pathStr = getEllipsePathStr(rx, ry);

        const li = document.createElement("li");
        li.classList.add(
          "drill-ring-li",
          "absolute",
          "w-0",
          "h-0",
          "top-1/2",
          "left-1/2",
          "[transform-style:preserve-3d]",
          "pointer-events-none",
        );
        li.style.zIndex = (20 - ri).toString();
        li.style.transform = `translate(-50%, -50%) rotateX(${TILT_X}deg)`;

        const pathDiv = document.createElement("div");
        pathDiv.classList.add(
          "absolute",
          "top-1/2",
          "left-1/2",
          "-translate-x-1/2",
          "-translate-y-1/2",
          "border",
          "border-dashed",
          "rounded-[50%]",
          "pointer-events-none",
        );
        pathDiv.style.width = `${rx * 2}px`;
        pathDiv.style.height = `${ry * 2}px`;
        pathDiv.style.borderColor = `${group.color}60`;
        li.appendChild(pathDiv);

        ring.forEach((skill, j) => {
          const delay = -(j / ring.length) * speed;
          const item = document.createElement("div");
          item.classList.add(
            "os-item",
            "w-0",
            "h-0",
            "[transform-style:preserve-3d]",
            "pointer-events-auto",
          );
          item.style.offsetPath = `path('${pathStr}')`;
          item.style.animationDuration = `${speed}s`;
          item.style.animationDelay = `${delay}s`;

          const counter = document.createElement("div");
          counter.classList.add(
            "[transform-style:preserve-3d]",
            "pointer-events-none",
          );
          counter.style.transform = `translate(-50%, -50%) rotateX(-${TILT_X}deg)`;

          const a = document.createElement("a");
          a.classList.add("os-tplanet", "pointer-events-auto");
          a.href = skill.website;
          a.target = "_blank";
          a.rel = "noreferrer";
          a.style.width = `${TP}px`;
          a.style.height = `${TP}px`;
          a.style.setProperty("--pc", group.color);
          a.innerHTML = `<img src="/assets/images/stack/${skill.name}.svg" alt="${skill.title}" class="tp-icon"/><span class="tp-tip">${skill.title}</span>`;

          counter.appendChild(a);
          item.appendChild(counter);
          li.appendChild(item);
        });

        wrapEl.insertBefore(li, hubLi);
      });

      // Update Hub to category view
      hubDefaultPath.classList.add("hidden");
      hubDefaultExtra.classList.add("hidden");
      hubDynamicIconShape.classList.remove("hidden");
      hubDynamicIconShape.innerHTML = group.icon;
      hubDynamicIconShape.setAttribute("stroke", group.color);

      hubName.textContent = group.heading;
      hubName.style.color = group.color;
      hubSub.textContent = group.description;
      hubCore.style.borderColor = group.color + "50";
      hubGlow.style.background = `radial-gradient(circle,${group.color}18 0%,transparent 70%)`;

      hubEl.classList.add("cursor-pointer");
      hubEl.classList.remove("cursor-default");
      hubEl.title = "Click to go back";
    }

    function showSolar() {
      if (!isDrillDown) return;
      isDrillDown = false;
      wrapEl.querySelectorAll(".drill-ring-li").forEach((li) => li.remove());
      if (solarLis) solarLis.forEach((li) => li.classList.remove("hidden"));

      // Reset Hub
      hubDefaultPath.classList.remove("hidden");
      hubDefaultExtra.classList.remove("hidden");
      hubDynamicIconShape.classList.add("hidden");

      hubName.textContent = "Fullstack";
      hubName.style.color = "#6366f1";
      hubSub.textContent = "Engineering";
      hubCore.style.borderColor = "rgba(99,102,241,0.28)";
      hubGlow.style.background =
        "radial-gradient(circle,rgba(99,102,241,0.12)0%,transparent 70%)";

      hubEl.classList.remove("cursor-pointer");
      hubEl.classList.add("cursor-default");
      hubEl.title = "";
    }

    hubEl.onclick = (e) => {
      e.stopPropagation();
      showSolar();
    };
    attachSolarClicks();
  }

  initTechnologies();
  document.addEventListener("astro:page-load", initTechnologies);
})();
