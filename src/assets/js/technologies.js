(function () {
  const initTechnologies = () => {
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
    const TILT_X = 25;
    const TP = 44;

    let solarLis = null;
    let isDrillDown = false;

    let currentRx = 350;
    let currentRy = 140;

    const getEllipsePathStr = (rx, ry) => {
      return `M -${rx} 0 A ${rx} ${ry} 0 1 1 ${rx} 0 A ${rx} ${ry} 0 1 1 -${rx} 0`;
    };

    const updateRings = () => {
      const w = window.innerWidth;
      if (w < 768) {
        currentRx = 175;
        currentRy = 70;
      } else {
        currentRx = 350;
        currentRy = 140;
      }

      const pathStr = getEllipsePathStr(currentRx, currentRy);

      wrapEl.querySelectorAll(".sol-ring-li .os-path-svg").forEach((svg) => {
        svg.setAttribute(
          "viewBox",
          `-${currentRx} -${currentRy} ${currentRx * 2} ${currentRy * 2}`,
        );
        svg.style.setProperty("--rx-val", currentRx.toString());
        svg.style.setProperty("--ry-val", currentRy.toString());
        const path = svg.querySelector("path");
        if (path) path.setAttribute("d", pathStr);
      });

      wrapEl.querySelectorAll(".os-item").forEach((item) => {
        item.style.setProperty("--path", `path('${pathStr}')`);
      });
    };

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateRings, 100);
    });

    updateRings();

    const attachSolarClicks = () => {
      wrapEl.querySelectorAll(".os-gplanet").forEach((btn) => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const g = GROUPS.find((x) => x.id === btn.dataset.gid);
          if (g) enterGroup(g);
        };
      });
    };

    const enterGroup = (group) => {
      isDrillDown = true;
      if (!solarLis) solarLis = [...wrapEl.querySelectorAll(".sol-ring-li")];
      solarLis.forEach((li) => li.classList.add("hidden"));
      wrapEl.querySelectorAll(".drill-ring-li").forEach((li) => li.remove());

      const skills = group.skills;
      const numRings = Math.min(4, Math.ceil(skills.length / 5));
      const rings = Array.from({ length: numRings }, () => []);

      if (numRings > 1) {
        rings[0].push(skills[0], skills[1]);
        const rest = skills.slice(2);
        const outerRings = numRings - 1;
        rest.forEach((s, i) => {
          rings[1 + (i % outerRings)].push(s);
        });
      } else skills.forEach((s) => rings[0].push(s));

      const hubLi = wrapEl.querySelector(".os-hub-li");
      const baseRx = currentRx;
      const baseRy = currentRy;
      const isMobile = window.innerWidth < 768;
      const drillRx = isMobile
        ? [baseRx * 0.35, baseRx * 0.6, baseRx * 0.8, baseRx * 1.0]
        : [baseRx * 0.4, baseRx * 0.7, baseRx * 0.9, baseRx * 1.1];
      const drillRy = isMobile
        ? [baseRy * 0.5, baseRy * 0.8, baseRy * 1.1, baseRy * 1.4]
        : [baseRy * 0.7, baseRy * 1.0, baseRy * 1.3, baseRy * 1.6];
      const speedArr = [14, 20, 27, 34];

      rings.forEach((ring, ri) => {
        const rx = drillRx[ri],
          ry = drillRy[ri];
        const speed = speedArr[ri];
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
        li.style.setProperty("--rx", `${TILT_X}deg`);
        li.style.setProperty("--rz", `0deg`);
        li.style.setProperty("--rx-neg", `-${TILT_X}deg`);
        li.style.setProperty("--rz-neg", `0deg`);

        const pathDiv = document.createElement("div");
        pathDiv.classList.add(
          "os-path-svg",
          "border",
          "border-dashed",
          "rounded-[50%]",
        );
        pathDiv.style.setProperty("--rx-val", rx.toString());
        pathDiv.style.setProperty("--ry-val", ry.toString());
        pathDiv.style.borderColor = `${group.color}60`;
        li.appendChild(pathDiv);

        ring.forEach((skill, j) => {
          const delay = -(j / ring.length) * speed;
          const item = document.createElement("div");
          item.classList.add("os-item", "pointer-events-auto");
          item.style.setProperty("--path", `path('${pathStr}')`);
          item.style.setProperty("--rx", `${TILT_X}deg`);
          item.style.setProperty("--spd", `${speed}s`);
          item.style.setProperty("--dly", `${delay}s`);

          const counter = document.createElement("div");
          counter.classList.add("os-counter");
          counter.style.setProperty("--rx-neg", `-${TILT_X}deg`);
          counter.style.setProperty("--rz-neg", `0deg`);

          const a = document.createElement("a");
          a.classList.add("os-tplanet", "pointer-events-auto");
          a.href = skill.website;
          a.target = "_blank";
          a.rel = "noreferrer";
          a.style.setProperty("--pc", group.color);
          a.innerHTML = `<img src="/assets/images/stack/${skill.name}.svg" alt="${skill.title}" class="tp-icon"/><span class="tp-tip">${skill.title}</span>`;

          counter.appendChild(a);
          item.appendChild(counter);
          li.appendChild(item);
        });

        wrapEl.insertBefore(li, hubLi);
      });

      hubDefaultPath.classList.add("hidden");
      hubDefaultExtra.classList.add("hidden");
      hubDynamicIconShape.classList.remove("hidden");
      hubDynamicIconShape.innerHTML = group.icon;
      const innerSvg = hubDynamicIconShape.querySelector("svg");

      if (innerSvg) {
        innerSvg.setAttribute("width", "24");
        innerSvg.setAttribute("height", "24");
      }

      hubName.textContent = group.heading;
      hubName.style.color = group.color;
      const hubSvg = document.getElementById("hub-svg");
      if (hubSvg) hubSvg.style.color = group.color;

      if (hubSub) hubSub.textContent = group.description;
      hubCore.style.borderColor = group.color + "50";
      hubGlow.style.background = `radial-gradient(circle,${group.color}18 0%,transparent 70%)`;

      hubEl.classList.add("cursor-pointer");
      hubEl.classList.remove("cursor-default");
      hubEl.title = "Click to go back";
    };

    const showSolar = () => {
      if (!isDrillDown) return;
      isDrillDown = false;
      wrapEl.querySelectorAll(".drill-ring-li").forEach((li) => li.remove());
      if (solarLis) solarLis.forEach((li) => li.classList.remove("hidden"));

      hubDefaultPath.classList.remove("hidden");
      hubDefaultExtra.classList.remove("hidden");
      hubDynamicIconShape.classList.add("hidden");

      hubName.textContent = "Fullstack";
      hubName.style.color = "#6366f1";
      const hubSvg = document.getElementById("hub-svg");
      if (hubSvg) hubSvg.style.color = "#6366f1";

      if (hubSub) hubSub.textContent = "Engineering";
      hubCore.style.borderColor = "rgba(99,102,241,0.28)";
      hubGlow.style.background =
        "radial-gradient(circle,rgba(99,102,241,0.12)0%,transparent 70%)";

      hubEl.classList.remove("cursor-pointer");
      hubEl.classList.add("cursor-default");
      hubEl.title = "";
    };

    hubEl.onclick = (e) => {
      e.stopPropagation();
      showSolar();
    };
    attachSolarClicks();
  };

  initTechnologies();

  document.addEventListener("astro:page-load", initTechnologies);
})();
