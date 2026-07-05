(function () {
    "use strict";

    const SAVE_KEY = "tapTitanSave";
    const SAVE_VERSION = 2;
    const BOSS_INTERVAL = 10;
    const BOSS_TIMER_SEC = 30;
    const PRESTIGE_MIN_STAGE = 50;
    const BASE_CRIT_CHANCE = 0.1;
    const CRIT_MULT = 5;

    const MONSTERS = [
        { name: "Gobelin des cavernes", type: 0 },
        { name: "Slime visqueux", type: 1 },
        { name: "Araignée géante", type: 2 },
        { name: "Squelette errant", type: 3 },
        { name: "Orc sauvage", type: 4 },
        { name: "Chauve-souris démoniaque", type: 5 },
        { name: "Golem de pierre", type: 6 },
        { name: "Spectre hurlant", type: 7 },
        { name: "Hydre des marais", type: 8 },
        { name: "Dragonnet", type: 9 }
    ];

    const HEROES = [
        { id: "warrior", name: "Guerrier", icon: "⚔️", baseDps: 1, baseCost: 15, costMult: 1.07 },
        { id: "archer", name: "Archer", icon: "🏹", baseDps: 4, baseCost: 100, costMult: 1.08 },
        { id: "mage", name: "Mage", icon: "🔮", baseDps: 15, baseCost: 500, costMult: 1.09 },
        { id: "knight", name: "Chevalier", icon: "🛡️", baseDps: 50, baseCost: 2500, costMult: 1.1 },
        { id: "assassin", name: "Assassin", icon: "🗡️", baseDps: 200, baseCost: 12000, costMult: 1.11 }
    ];

    const UPGRADES = [
        { id: "tap1", name: "Force du poing", icon: "👊", desc: "+2 dégâts par tap", baseCost: 50, tapBonus: 2 },
        { id: "tap2", name: "Gants renforcés", icon: "🥊", desc: "+5 dégâts par tap", baseCost: 250, tapBonus: 5 },
        { id: "tap3", name: "Art martial", icon: "🥋", desc: "+15 dégâts par tap", baseCost: 1000, tapBonus: 15 },
        { id: "tap4", name: "Frappe légendaire", icon: "💥", desc: "+50 dégâts par tap", baseCost: 5000, tapBonus: 50 }
    ];

    const SKILLS = [
        {
            id: "warCry", name: "Cri de guerre", icon: "📣",
            desc: "×2 dégâts de tap", duration: 30, cooldown: 120,
            effect: "tapMult", value: 2
        },
        {
            id: "midas", name: "Main de Midas", icon: "✋",
            desc: "×10 or des kills", duration: 30, cooldown: 180,
            effect: "goldMult", value: 10
        },
        {
            id: "lightning", name: "Foudre", icon: "⚡",
            desc: "−20% PV du monstre", duration: 0, cooldown: 60,
            effect: "instantDmg", value: 0.2
        },
        {
            id: "fury", name: "Furie héroïque", icon: "🔥",
            desc: "×5 DPS héros", duration: 30, cooldown: 150,
            effect: "dpsMult", value: 5
        }
    ];

    const ARTIFACTS = [
        { id: "sword", name: "Lame du titan", icon: "🗡️", unlockStage: 15, desc: "+3% dégâts de tap / niv.", perLevel: 0.03, type: "tap" },
        { id: "shield", name: "Bouclier ancien", icon: "🛡️", unlockStage: 25, desc: "+5% DPS héros / niv.", perLevel: 0.05, type: "dps" },
        { id: "coin", name: "Pièce maudite", icon: "🪙", unlockStage: 35, desc: "+8% or / niv.", perLevel: 0.08, type: "gold" },
        { id: "eye", name: "Œil du chasseur", icon: "👁️", unlockStage: 45, desc: "+2% chance crit / niv.", perLevel: 0.02, type: "crit" },
        { id: "hourglass", name: "Sablier du boss", icon: "⏳", unlockStage: 55, desc: "+3s timer boss / niv.", perLevel: 3, type: "bossTime" },
        { id: "book", name: "Grimoire oublié", icon: "📖", unlockStage: 70, desc: "−3% coût héros / niv.", perLevel: 0.03, type: "heroCost" }
    ];

    let state = createInitialState();
    let activeBuffs = {};
    let skillCooldowns = {};
    let bossTimer = null;
    let bossTimeLeft = BOSS_TIMER_SEC;
    let lastTick = performance.now();
    let saveTimer = null;
    let dpsAccumulator = 0;

    const els = {
        stage: document.getElementById("stage-display"),
        gold: document.getElementById("gold-display"),
        dps: document.getElementById("dps-display"),
        hpBar: document.getElementById("hp-bar"),
        hpText: document.getElementById("hp-text"),
        bossTimer: document.getElementById("boss-timer"),
        bossTimerText: document.getElementById("boss-timer-text"),
        activeBuffs: document.getElementById("active-buffs"),
        monsterZone: document.getElementById("monster-zone"),
        monster: document.getElementById("monster"),
        monsterBody: document.getElementById("monster-body"),
        monsterName: document.getElementById("monster-name"),
        damageFloats: document.getElementById("damage-floats"),
        particles: document.getElementById("particles"),
        skillsBar: document.getElementById("skills-bar"),
        heroList: document.getElementById("hero-list"),
        upgradeList: document.getElementById("upgrade-list"),
        artifactList: document.getElementById("artifact-list"),
        relics: document.getElementById("relics-display"),
        relicBonus: document.getElementById("relic-bonus"),
        relicsGain: document.getElementById("relics-gain"),
        prestigeBtn: document.getElementById("prestige-btn"),
        toast: document.getElementById("toast")
    };

    const ctx = els.particles.getContext("2d");
    let particles = [];

    function createInitialState() {
        return {
            saveVersion: SAVE_VERSION,
            gold: 0,
            stage: 1,
            maxStageReached: 1,
            monsterHp: 10,
            monsterMaxHp: 10,
            baseTapDamage: 1,
            tapUpgrades: {},
            heroes: HEROES.map(function (h) { return { id: h.id, level: 0 }; }),
            artifacts: {},
            relics: 0,
            totalStages: 0
        };
    }

    function loadSave() {
        try {
            var raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return;
            var saved = JSON.parse(raw);
            state = Object.assign(createInitialState(), saved);
            if (!state.artifacts) state.artifacts = {};
            if (!state.maxStageReached) state.maxStageReached = state.stage;
            migrateSave();
        } catch (e) {
            state = createInitialState();
        }
    }

    function migrateSave() {
        if (!state.saveVersion || state.saveVersion < SAVE_VERSION) {
            state.saveVersion = SAVE_VERSION;
        }
    }

    function saveGame() {
        state.saveVersion = SAVE_VERSION;
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }

    function formatNumber(n) {
        if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
        if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
        if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
        if (n >= 1e4) return (n / 1e3).toFixed(1) + "K";
        return Math.floor(n).toLocaleString("fr-FR");
    }

    function formatTime(sec) {
        sec = Math.ceil(sec);
        if (sec >= 60) return Math.floor(sec / 60) + "m " + (sec % 60) + "s";
        return sec + "s";
    }

    function isBossStage(stage) {
        return stage % BOSS_INTERVAL === 0;
    }

    function getArtifactLevel(id) {
        return state.artifacts[id] || 0;
    }

    function isArtifactUnlocked(id) {
        var def = ARTIFACTS.find(function (a) { return a.id === id; });
        return state.maxStageReached >= def.unlockStage;
    }

    function artifactBonus(id) {
        var def = ARTIFACTS.find(function (a) { return a.id === id; });
        var level = getArtifactLevel(id);
        if (!def || level === 0) return 0;
        return def.perLevel * level;
    }

    function relicMultiplier() {
        return 1 + state.relics * 0.05;
    }

    function getCritChance() {
        return Math.min(0.5, BASE_CRIT_CHANCE + artifactBonus("eye"));
    }

    function getTapMultiplier() {
        var mult = relicMultiplier() * (1 + artifactBonus("sword"));
        if (activeBuffs.tapMult) mult *= activeBuffs.tapMult.value;
        return mult;
    }

    function getDpsMultiplier() {
        var mult = relicMultiplier() * (1 + artifactBonus("shield"));
        if (activeBuffs.dpsMult) mult *= activeBuffs.dpsMult.value;
        return mult;
    }

    function getGoldMultiplier() {
        var mult = 1 + artifactBonus("coin");
        if (activeBuffs.goldMult) mult *= activeBuffs.goldMult.value;
        return mult;
    }

    function getBossTimerBonus() {
        return artifactBonus("hourglass");
    }

    function getHeroCostReduction() {
        return Math.min(0.5, artifactBonus("book"));
    }

    function getTapDamage() {
        var bonus = 0;
        UPGRADES.forEach(function (u) {
            if (state.tapUpgrades[u.id]) bonus += u.tapBonus;
        });
        return Math.floor((state.baseTapDamage + bonus) * getTapMultiplier());
    }

    function getHeroDps(heroId) {
        var def = HEROES.find(function (h) { return h.id === heroId; });
        var hero = state.heroes.find(function (h) { return h.id === heroId; });
        if (!def || !hero || hero.level === 0) return 0;
        return Math.floor(def.baseDps * hero.level * Math.pow(1.05, hero.level - 1) * getDpsMultiplier());
    }

    function getTotalDps() {
        return HEROES.reduce(function (sum, h) {
            return sum + getHeroDps(h.id);
        }, 0);
    }

    function heroCost(heroId) {
        var def = HEROES.find(function (h) { return h.id === heroId; });
        var hero = state.heroes.find(function (h) { return h.id === heroId; });
        var level = hero ? hero.level : 0;
        var cost = def.baseCost * Math.pow(def.costMult, level);
        return Math.floor(cost * (1 - getHeroCostReduction()));
    }

    function artifactUpgradeCost(id) {
        var level = getArtifactLevel(id);
        return Math.max(1, Math.floor(Math.pow(level + 1, 1.8)));
    }

    function monsterMaxHp(stage) {
        var base = 10 * Math.pow(1.55, stage - 1);
        if (isBossStage(stage)) base *= 8;
        return Math.floor(base);
    }

    function goldReward(stage) {
        var base = 3 * Math.pow(1.45, stage - 1);
        if (isBossStage(stage)) base *= 5;
        return Math.floor(base * getGoldMultiplier());
    }

    function getMonsterDef(stage) {
        return MONSTERS[(stage - 1) % MONSTERS.length];
    }

    function spawnMonster() {
        state.monsterMaxHp = monsterMaxHp(state.stage);
        state.monsterHp = state.monsterMaxHp;
        var def = getMonsterDef(state.stage);

        els.monsterName.textContent = isBossStage(state.stage)
            ? "BOSS — " + def.name
            : def.name;

        els.monsterBody.className = "monster-body type-" + def.type;
        if (isBossStage(state.stage)) {
            els.monsterBody.classList.add("boss");
            els.hpBar.classList.add("boss");
            startBossTimer();
        } else {
            els.monsterBody.classList.remove("boss");
            els.hpBar.classList.remove("boss");
            stopBossTimer();
        }

        els.monster.classList.remove("dead");
        updateHud();
    }

    function startBossTimer() {
        bossTimeLeft = BOSS_TIMER_SEC + getBossTimerBonus();
        els.bossTimer.classList.remove("hidden");
        els.bossTimerText.textContent = bossTimeLeft + "s";
        if (bossTimer) clearInterval(bossTimer);
        bossTimer = setInterval(function () {
            bossTimeLeft--;
            els.bossTimerText.textContent = bossTimeLeft + "s";
            if (bossTimeLeft <= 0) failBoss();
        }, 1000);
    }

    function stopBossTimer() {
        if (bossTimer) {
            clearInterval(bossTimer);
            bossTimer = null;
        }
        els.bossTimer.classList.add("hidden");
    }

    function failBoss() {
        stopBossTimer();
        state.stage = Math.max(1, state.stage - 5);
        showToast("Boss échappé ! Retour étape " + state.stage);
        spawnMonster();
    }

    function dealDamage(amount, isCrit, x, y, silent) {
        state.monsterHp = Math.max(0, state.monsterHp - amount);
        if (!silent) showDamageNumber(amount, isCrit, x, y);
        updateHud();
        if (state.monsterHp <= 0) killMonster();
    }

    function killMonster() {
        var reward = goldReward(state.stage);
        state.gold += reward;
        state.totalStages = Math.max(state.totalStages, state.stage);
        state.maxStageReached = Math.max(state.maxStageReached, state.stage);

        checkArtifactDiscoveries();
        els.monster.classList.add("dead");
        stopBossTimer();

        setTimeout(function () {
            state.stage++;
            spawnMonster();
            renderShop();
        }, 350);

        scheduleSave();
    }

    function checkArtifactDiscoveries() {
        ARTIFACTS.forEach(function (art) {
            if (state.maxStageReached >= art.unlockStage && getArtifactLevel(art.id) === 0) {
                state.artifacts[art.id] = 1;
                showToast("Artefact découvert : " + art.name + " !");
            }
        });
    }

    function onTap(e) {
        e.preventDefault();
        var rect = els.monsterZone.getBoundingClientRect();
        var x, y;

        if (e.type === "touchstart" || e.type === "touchmove") {
            var touch = e.touches[0] || e.changedTouches[0];
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        var isCrit = Math.random() < getCritChance();
        var damage = getTapDamage() * (isCrit ? CRIT_MULT : 1);

        els.monster.classList.add("hit");
        setTimeout(function () { els.monster.classList.remove("hit"); }, 80);

        spawnParticles(x, y, isCrit);
        dealDamage(damage, isCrit, x, y);
    }

    function activateSkill(skillId) {
        var skill = SKILLS.find(function (s) { return s.id === skillId; });
        if (!skill) return;

        var cdLeft = skillCooldowns[skillId] || 0;
        if (cdLeft > 0) return;

        if (skill.effect === "instantDmg") {
            var dmg = state.monsterHp * skill.value;
            dealDamage(dmg, false, 130, 100);
            spawnParticles(130, 130, true);
            showToast(skill.name + " !");
        } else {
            activeBuffs[skill.effect] = {
                value: skill.value,
                expires: performance.now() + skill.duration * 1000,
                label: skill.name
            };
            showToast(skill.name + " activé !");
        }

        skillCooldowns[skillId] = skill.cooldown;
        renderSkills();
        updateHud();
        scheduleSave();
    }

    function updateActiveBuffs() {
        var now = performance.now();
        var changed = false;

        Object.keys(activeBuffs).forEach(function (key) {
            if (activeBuffs[key].expires <= now) {
                delete activeBuffs[key];
                changed = true;
            }
        });

        Object.keys(skillCooldowns).forEach(function (key) {
            if (skillCooldowns[key] > 0) {
                skillCooldowns[key] -= 0.1;
                if (skillCooldowns[key] < 0) skillCooldowns[key] = 0;
            }
        });

        if (changed) updateHud();
        renderSkills();
        renderActiveBuffs();
    }

    function renderActiveBuffs() {
        els.activeBuffs.innerHTML = "";
        Object.keys(activeBuffs).forEach(function (key) {
            var buff = activeBuffs[key];
            var left = Math.ceil((buff.expires - performance.now()) / 1000);
            if (left <= 0) return;
            var el = document.createElement("span");
            el.className = "buff-tag";
            el.textContent = buff.label + " " + left + "s";
            els.activeBuffs.appendChild(el);
        });
    }

    function renderSkills() {
        els.skillsBar.innerHTML = "";
        SKILLS.forEach(function (skill) {
            var cd = skillCooldowns[skill.id] || 0;
            var btn = document.createElement("button");
            btn.className = "skill-btn" + (cd > 0 ? " on-cooldown" : "");
            btn.innerHTML =
                '<span class="skill-icon">' + skill.icon + '</span>' +
                '<span class="skill-name">' + skill.name + '</span>' +
                (cd > 0 ? '<span class="skill-cd">' + Math.ceil(cd) + "s</span>" : "");

            if (cd <= 0) {
                btn.addEventListener("click", function () { activateSkill(skill.id); });
            }
            els.skillsBar.appendChild(btn);
        });
    }

    function showDamageNumber(damage, isCrit, x, y) {
        var el = document.createElement("span");
        el.className = "damage-number" + (isCrit ? " crit" : "");
        el.textContent = (isCrit ? "CRIT! " : "") + formatNumber(damage);
        el.style.left = x + "px";
        el.style.top = y + "px";
        els.damageFloats.appendChild(el);
        setTimeout(function () { el.remove(); }, 800);
    }

    function spawnParticles(x, y, isCrit) {
        var count = isCrit ? 14 : 6;
        var color = isCrit ? "#ff006e" : "#ff9f1c";
        for (var i = 0; i < count; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 3,
                life: 1, color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    function animateParticles() {
        var w = els.particles.width = els.particles.offsetWidth;
        var h = els.particles.height = els.particles.offsetHeight;
        ctx.clearRect(0, 0, w, h);

        particles = particles.filter(function (p) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= 0.03;
            if (p.life <= 0) return false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            return true;
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }

    function updateHud() {
        els.stage.textContent = state.stage;
        els.gold.textContent = formatNumber(state.gold);
        els.dps.textContent = formatNumber(getTotalDps());

        var pct = state.monsterMaxHp > 0 ? (state.monsterHp / state.monsterMaxHp) * 100 : 0;
        els.hpBar.style.width = pct + "%";
        els.hpText.textContent = formatNumber(state.monsterHp) + " / " + formatNumber(state.monsterMaxHp);

        els.relics.textContent = state.relics;
        els.relicBonus.textContent = "+" + Math.round((relicMultiplier() - 1) * 100) + "%";
        var gain = calcRelicsGain();
        els.relicsGain.textContent = gain;
        els.prestigeBtn.disabled = state.stage < PRESTIGE_MIN_STAGE;
        els.prestigeBtn.textContent = state.stage >= PRESTIGE_MIN_STAGE
            ? "Prestige (+" + gain + " reliques)"
            : "Prestige (étape " + PRESTIGE_MIN_STAGE + "+)";
    }

    function calcRelicsGain() {
        return Math.floor(Math.sqrt(state.totalStages / 10));
    }

    function buyHero(heroId) {
        var cost = heroCost(heroId);
        if (state.gold < cost) return;
        state.gold -= cost;
        state.heroes.find(function (h) { return h.id === heroId; }).level++;
        updateHud();
        renderShop();
        scheduleSave();
    }

    function buyUpgrade(upgradeId) {
        if (state.tapUpgrades[upgradeId]) return;
        var upgrade = UPGRADES.find(function (u) { return u.id === upgradeId; });
        if (!upgrade || state.gold < upgrade.baseCost) return;
        state.gold -= upgrade.baseCost;
        state.tapUpgrades[upgradeId] = true;
        updateHud();
        renderShop();
        scheduleSave();
        showToast(upgrade.name + " acheté !");
    }

    function upgradeArtifact(id) {
        if (!isArtifactUnlocked(id) || getArtifactLevel(id) === 0) return;
        var cost = artifactUpgradeCost(id);
        if (state.relics < cost) return;
        state.relics -= cost;
        state.artifacts[id]++;
        updateHud();
        renderShop();
        scheduleSave();
        showToast("Artefact amélioré !");
    }

    function doPrestige() {
        if (state.stage < PRESTIGE_MIN_STAGE) return;
        var gain = calcRelicsGain();
        if (gain <= 0) return;

        var keptArtifacts = {};
        Object.keys(state.artifacts).forEach(function (id) {
            keptArtifacts[id] = state.artifacts[id];
        });

        state.relics += gain;
        var newState = createInitialState();
        newState.relics = state.relics;
        newState.artifacts = keptArtifacts;
        state = newState;
        activeBuffs = {};
        skillCooldowns = {};
        stopBossTimer();
        spawnMonster();
        renderShop();
        renderSkills();
        updateHud();
        scheduleSave();
        showToast("Prestige ! +" + gain + " reliques");
    }

    function renderShop() {
        els.heroList.innerHTML = "";
        HEROES.forEach(function (def) {
            var hero = state.heroes.find(function (h) { return h.id === def.id; });
            var cost = heroCost(def.id);
            var dps = getHeroDps(def.id);
            var canBuy = state.gold >= cost;

            var li = document.createElement("li");
            li.className = "item-card" + (canBuy ? "" : " disabled");
            li.innerHTML =
                '<div class="item-icon">' + def.icon + '</div>' +
                '<div class="item-info"><div class="item-name">' + def.name + '</div>' +
                '<div class="item-desc">' + (dps > 0 ? formatNumber(dps) + " DPS" : "Recruter") + '</div></div>' +
                '<div class="item-action"><div class="item-cost">🪙 ' + formatNumber(cost) + '</div>' +
                '<div class="item-level">Niv. ' + hero.level + '</div></div>';
            if (canBuy) li.addEventListener("click", function () { buyHero(def.id); });
            els.heroList.appendChild(li);
        });

        els.upgradeList.innerHTML = "";
        UPGRADES.forEach(function (upgrade) {
            var owned = !!state.tapUpgrades[upgrade.id];
            var canBuy = !owned && state.gold >= upgrade.baseCost;
            var li = document.createElement("li");
            li.className = "item-card" + (owned ? " disabled" : canBuy ? "" : " disabled");
            li.innerHTML =
                '<div class="item-icon">' + upgrade.icon + '</div>' +
                '<div class="item-info"><div class="item-name">' + upgrade.name + '</div>' +
                '<div class="item-desc">' + upgrade.desc + '</div></div>' +
                '<div class="item-action"><div class="item-cost">' +
                (owned ? "✓ Acheté" : "🪙 " + formatNumber(upgrade.baseCost)) + '</div></div>';
            if (canBuy) li.addEventListener("click", function () { buyUpgrade(upgrade.id); });
            els.upgradeList.appendChild(li);
        });

        els.artifactList.innerHTML = "";
        ARTIFACTS.forEach(function (art) {
            var level = getArtifactLevel(art.id);
            var unlocked = isArtifactUnlocked(art.id);
            var discovered = level > 0;
            var cost = artifactUpgradeCost(art.id);
            var canUpgrade = discovered && state.relics >= cost;

            var li = document.createElement("li");
            li.className = "item-card" + (canUpgrade ? "" : " disabled");

            if (!unlocked) {
                li.innerHTML =
                    '<div class="item-icon locked">❓</div>' +
                    '<div class="item-info"><div class="item-name">Artefact mystérieux</div>' +
                    '<div class="item-desc">Atteignez l\'étape ' + art.unlockStage + '</div></div>';
            } else if (!discovered) {
                li.innerHTML =
                    '<div class="item-icon locked">🔒</div>' +
                    '<div class="item-info"><div class="item-name">' + art.name + '</div>' +
                    '<div class="item-desc">Tuez un monstre à l\'étape ' + art.unlockStage + '+</div></div>';
            } else {
                li.innerHTML =
                    '<div class="item-icon">' + art.icon + '</div>' +
                    '<div class="item-info"><div class="item-name">' + art.name + '</div>' +
                    '<div class="item-desc">' + art.desc + ' (niv. ' + level + ')</div></div>' +
                    '<div class="item-action"><div class="item-cost">💎 ' + cost + '</div>' +
                    '<div class="item-level">Reliques</div></div>';
                if (canUpgrade) li.addEventListener("click", function () { upgradeArtifact(art.id); });
            }
            els.artifactList.appendChild(li);
        });
    }

    function showToast(msg) {
        els.toast.textContent = msg;
        els.toast.classList.remove("hidden");
        clearTimeout(els.toast._timer);
        els.toast._timer = setTimeout(function () { els.toast.classList.add("hidden"); }, 2000);
    }

    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveGame, 500);
    }

    function gameLoop(now) {
        var dt = (now - lastTick) / 1000;
        lastTick = now;

        if (dt > 0 && dt < 1) {
            var dps = getTotalDps();
            if (dps > 0 && state.monsterHp > 0) {
                dpsAccumulator += dps * dt;
                if (dpsAccumulator >= 1) {
                    var dmg = Math.floor(dpsAccumulator);
                    dpsAccumulator -= dmg;
                    dealDamage(dmg, false, 130, 130, true);
                }
            }
        }

        requestAnimationFrame(gameLoop);
    }

    function initTabs() {
        document.querySelectorAll(".tab").forEach(function (tab) {
            tab.addEventListener("click", function () {
                document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
                document.querySelectorAll(".panel-content").forEach(function (p) { p.classList.remove("active"); });
                tab.classList.add("active");
                document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
            });
        });
    }

    function init() {
        loadSave();
        checkArtifactDiscoveries();
        initTabs();
        spawnMonster();
        renderShop();
        renderSkills();
        updateHud();

        els.monsterZone.addEventListener("touchstart", onTap, { passive: false });
        els.monsterZone.addEventListener("mousedown", onTap);
        els.prestigeBtn.addEventListener("click", doPrestige);

        animateParticles();
        requestAnimationFrame(gameLoop);
        setInterval(updateActiveBuffs, 100);

        window.addEventListener("beforeunload", saveGame);

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("sw.js").catch(function () {});
        }
    }

    init();
})();
