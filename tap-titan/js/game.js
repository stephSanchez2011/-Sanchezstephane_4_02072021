(function () {
    "use strict";

    const SAVE_KEY = "tapTitanSave";
    const SAVE_VERSION = 4;
    const BOSS_INTERVAL = 10;
    const BOSS_TIMER_SEC = 30;
    const PRESTIGE_MIN_STAGE = 50;
    const INFINITE_UNLOCK = 100;
    const BASE_CRIT_CHANCE = 0.1;
    const CRIT_MULT = 5;
    const COMBO_TIMEOUT = 1200;
    const MAX_COMBO = 30;

    const WORLDS = [
        { id: 1, name: "Forêt sombre", minStage: 1, hpMult: 1, goldMult: 1, gemChance: 0.01, bg: "radial-gradient(ellipse at 50% 30%, #2a1450 0%, #0d0618 70%)" },
        { id: 2, name: "Ruines englouties", minStage: 75, hpMult: 2.2, goldMult: 1.6, gemChance: 0.015, bg: "radial-gradient(ellipse at 50% 30%, #1a3040 0%, #081018 70%)" },
        { id: 3, name: "Pics gelés", minStage: 200, hpMult: 5, goldMult: 2.5, gemChance: 0.02, bg: "radial-gradient(ellipse at 50% 30%, #1a3555 0%, #081220 70%)" },
        { id: 4, name: "Volcan infernal", minStage: 500, hpMult: 12, goldMult: 4, gemChance: 0.025, bg: "radial-gradient(ellipse at 50% 30%, #4a1510 0%, #180808 70%)" },
        { id: 5, name: "Cité des titans", minStage: 1000, hpMult: 30, goldMult: 8, gemChance: 0.03, bg: "radial-gradient(ellipse at 50% 30%, #3a2060 0%, #100818 70%)" },
        { id: 6, name: "Néant cosmique", minStage: 2500, hpMult: 80, goldMult: 18, gemChance: 0.04, bg: "radial-gradient(ellipse at 50% 30%, #150820 0%, #050210 70%)" }
    ];

    const MONSTERS = [
        { name: "Gobelin des cavernes", type: 0 }, { name: "Slime visqueux", type: 1 },
        { name: "Araignée géante", type: 2 }, { name: "Squelette errant", type: 3 },
        { name: "Orc sauvage", type: 4 }, { name: "Chauve-souris démoniaque", type: 5 },
        { name: "Golem de pierre", type: 6 }, { name: "Spectre hurlant", type: 7 },
        { name: "Hydre des marais", type: 8 }, { name: "Dragonnet", type: 9 },
        { name: "Liche maudite", type: 3 }, { name: "Démon mineur", type: 5 },
        { name: "Colosse de lave", type: 6 }, { name: "Wyrm ancien", type: 9 }
    ];

    const HEROES = [
        { id: "warrior", name: "Guerrier", icon: "⚔️", baseDps: 1, baseCost: 15, costMult: 1.07 },
        { id: "archer", name: "Archer", icon: "🏹", baseDps: 4, baseCost: 100, costMult: 1.08 },
        { id: "mage", name: "Mage", icon: "🔮", baseDps: 15, baseCost: 500, costMult: 1.09 },
        { id: "knight", name: "Chevalier", icon: "🛡️", baseDps: 50, baseCost: 2500, costMult: 1.1 },
        { id: "assassin", name: "Assassin", icon: "🗡️", baseDps: 200, baseCost: 12000, costMult: 1.11 },
        { id: "paladin", name: "Paladin", icon: "✨", baseDps: 800, baseCost: 60000, costMult: 1.12 },
        { id: "necro", name: "Nécromancien", icon: "💀", baseDps: 3500, baseCost: 300000, costMult: 1.13 },
        { id: "dragonslayer", name: "Tueur de dragons", icon: "🐉", baseDps: 15000, baseCost: 1500000, costMult: 1.14 }
    ];

    const UPGRADES = [
        { id: "tap1", name: "Force du poing", icon: "👊", desc: "+2 dégâts par tap", baseCost: 50, tapBonus: 2 },
        { id: "tap2", name: "Gants renforcés", icon: "🥊", desc: "+5 dégâts par tap", baseCost: 250, tapBonus: 5 },
        { id: "tap3", name: "Art martial", icon: "🥋", desc: "+15 dégâts par tap", baseCost: 1000, tapBonus: 15 },
        { id: "tap4", name: "Frappe légendaire", icon: "💥", desc: "+50 dégâts par tap", baseCost: 5000, tapBonus: 50 },
        { id: "tap5", name: "Poing divin", icon: "✊", desc: "+200 dégâts par tap", baseCost: 25000, tapBonus: 200 },
        { id: "tap6", name: "Frappe titanesque", icon: "🌟", desc: "+1000 dégâts par tap", baseCost: 150000, tapBonus: 1000 }
    ];

    const SKILLS = [
        { id: "warCry", name: "Cri de guerre", icon: "📣", desc: "×2 tap", duration: 30, cooldown: 120, effect: "tapMult", value: 2 },
        { id: "midas", name: "Main de Midas", icon: "✋", desc: "×10 or", duration: 30, cooldown: 180, effect: "goldMult", value: 10 },
        { id: "lightning", name: "Foudre", icon: "⚡", desc: "−20% PV", duration: 0, cooldown: 60, effect: "instantDmg", value: 0.2 },
        { id: "fury", name: "Furie héroïque", icon: "🔥", desc: "×5 DPS", duration: 30, cooldown: 150, effect: "dpsMult", value: 5 }
    ];

    const ARTIFACTS = [
        { id: "sword", name: "Lame du titan", icon: "🗡️", unlockStage: 15, desc: "+3% tap / niv.", perLevel: 0.03 },
        { id: "shield", name: "Bouclier ancien", icon: "🛡️", unlockStage: 25, desc: "+5% DPS / niv.", perLevel: 0.05 },
        { id: "coin", name: "Pièce maudite", icon: "🪙", unlockStage: 35, desc: "+8% or / niv.", perLevel: 0.08 },
        { id: "eye", name: "Œil du chasseur", icon: "👁️", unlockStage: 45, desc: "+2% crit / niv.", perLevel: 0.02 },
        { id: "hourglass", name: "Sablier du boss", icon: "⏳", unlockStage: 55, desc: "+3s boss / niv.", perLevel: 3 },
        { id: "book", name: "Grimoire oublié", icon: "📖", unlockStage: 70, desc: "−3% coût / niv.", perLevel: 0.03 },
        { id: "heart", name: "Cœur de cristal", icon: "💎", unlockStage: 120, desc: "+1% loot / niv.", perLevel: 0.01 },
        { id: "clover", name: "Trèfle doré", icon: "🍀", unlockStage: 200, desc: "+1% gems / niv.", perLevel: 0.01 }
    ];

    const RARITY = {
        common: { label: "Commun", color: "#adb5bd", mult: 1, weight: 55 },
        rare: { label: "Rare", color: "#4cc9f0", mult: 2.5, weight: 28 },
        epic: { label: "Épique", color: "#b5179e", mult: 6, weight: 13 },
        legendary: { label: "Légendaire", color: "#ffbe0b", mult: 15, weight: 4 }
    };

    const LOOT_NAMES = {
        weapon: ["Dague", "Épée", "Hache", "Marteau titan"],
        armor: ["Cuirasse", "Plastron", "Robe magique", "Armure runique"],
        ring: ["Anneau de force", "Bague d'or", "Sceau du crit", "Anneau du titan"]
    };

    const DAILY_REWARDS = [
        { gold: 200 }, { gold: 800 }, { gems: 2 }, { gold: 3000 },
        { gems: 5 }, { chest: "bronze" }, { gems: 12, gold: 10000, chest: "gold" }
    ];

    const ACHIEVEMENTS = [
        { id: "kills10", name: "Chasseur novice", desc: "Tuer 10 monstres", icon: "🎯", target: 10, stat: "totalKills", reward: { gems: 1 } },
        { id: "kills100", name: "Exterminateur", desc: "Tuer 100 monstres", icon: "💀", target: 100, stat: "totalKills", reward: { gems: 3 } },
        { id: "kills1000", name: "Génocide", desc: "Tuer 1000 monstres", icon: "☠️", target: 1000, stat: "totalKills", reward: { gems: 10 } },
        { id: "stage50", name: "Halfway hero", desc: "Atteindre l'étape 50", icon: "🏔️", target: 50, stat: "maxStageReached", reward: { gems: 5 } },
        { id: "stage200", name: "Explorateur", desc: "Atteindre l'étape 200", icon: "🗺️", target: 200, stat: "maxStageReached", reward: { gems: 15 } },
        { id: "stage500", name: "Conquérant", desc: "Atteindre l'étape 500", icon: "👑", target: 500, stat: "maxStageReached", reward: { gems: 30 } },
        { id: "boss10", name: "Tueur de boss", desc: "Vaincre 10 boss", icon: "👹", target: 10, stat: "totalBossKills", reward: { gems: 5 } },
        { id: "combo20", name: "Doigts de feu", desc: "Combo ×30", icon: "🔥", target: 30, stat: "maxComboReached", reward: { gems: 3 } },
        { id: "legendary", name: "Fortune", desc: "Obtenir un loot légendaire", icon: "🌟", target: 1, stat: "legendaryLoot", reward: { gems: 20 } },
        { id: "prestige1", name: "Renaissance", desc: "Faire 1 prestige", icon: "♻️", target: 1, stat: "prestigeCount", reward: { gems: 10 } },
        { id: "streak7", name: "Fidèle", desc: "7 jours de connexion", icon: "📅", target: 7, stat: "dailyStreak", reward: { gems: 15 } },
        { id: "infinite20", name: "Vague sans fin", desc: "Vague 20 en mode infini", icon: "♾️", target: 20, stat: "infiniteBest", reward: { gems: 8 } },
        { id: "infinite50", name: "Éternel", desc: "Vague 50 en mode infini", icon: "🌀", target: 50, stat: "infiniteBest", reward: { gems: 25 } }
    ];

    const WEEKLY_EVENTS = [
        { id: "goldRush", name: "Ruée vers l'or", icon: "🪙", desc: "×2 or", goldMult: 2 },
        { id: "gemHunt", name: "Chasse aux gemmes", icon: "💎", desc: "×3 gemmes", gemMult: 3 },
        { id: "comboFest", name: "Festival combo", icon: "🔥", desc: "×2 combo max", comboMult: 2 },
        { id: "bossHunt", name: "Chasse au boss", icon: "👹", desc: "×3 or boss", bossGoldMult: 3 },
        { id: "lootRain", name: "Pluie de loot", icon: "📦", desc: "×2 loot", lootMult: 2 },
        { id: "heroFury", name: "Furie des héros", icon: "⚔️", desc: "×1.5 DPS", dpsMult: 1.5 }
    ];

    let state, activeBuffs = {}, skillCooldowns = {}, bossTimer = null;
    let bossTimeLeft = BOSS_TIMER_SEC, lastTick = performance.now(), saveTimer = null;
    let dpsAccumulator = 0, combo = 0, lastTapTime = 0, currentSpecial = null;
    let lootIdCounter = 0, spriteEngine = null;

    const els = {
        gameApp: document.getElementById("game-app"),
        battleArea: document.getElementById("battle-area"),
        worldName: document.getElementById("world-name"),
        worldStage: document.getElementById("world-stage"),
        stage: document.getElementById("stage-display"),
        gold: document.getElementById("gold-display"),
        gems: document.getElementById("gems-display"),
        dps: document.getElementById("dps-display"),
        combo: document.getElementById("combo-display"),
        dailyBtn: document.getElementById("daily-btn"),
        hpBar: document.getElementById("hp-bar"),
        hpText: document.getElementById("hp-text"),
        specialTag: document.getElementById("special-tag"),
        bossTimer: document.getElementById("boss-timer"),
        bossTimerText: document.getElementById("boss-timer-text"),
        activeBuffs: document.getElementById("active-buffs"),
        monsterZone: document.getElementById("monster-zone"),
        monster: document.getElementById("monster"),
        eventBanner: document.getElementById("event-banner"),
        monsterSprite: document.getElementById("monster-sprite"),
        heroSprites: document.getElementById("hero-sprites"),
        modeCampaign: document.getElementById("mode-campaign"),
        modeInfinite: document.getElementById("mode-infinite"),
        modeDesc: document.getElementById("mode-desc"),
        infiniteStats: document.getElementById("infinite-stats"),
        infiniteWave: document.getElementById("infinite-wave"),
        infiniteBest: document.getElementById("infinite-best"),
        monsterName: document.getElementById("monster-name"),
        damageFloats: document.getElementById("damage-floats"),
        particles: document.getElementById("particles"),
        skillsBar: document.getElementById("skills-bar"),
        heroList: document.getElementById("hero-list"),
        upgradeList: document.getElementById("upgrade-list"),
        artifactList: document.getElementById("artifact-list"),
        slotWeapon: document.getElementById("slot-weapon"),
        slotArmor: document.getElementById("slot-armor"),
        slotRing: document.getElementById("slot-ring"),
        inventoryList: document.getElementById("inventory-list"),
        chestBronze: document.getElementById("chest-bronze"),
        chestGold: document.getElementById("chest-gold"),
        chestLegend: document.getElementById("chest-legend"),
        questList: document.getElementById("quest-list"),
        achievementList: document.getElementById("achievement-list"),
        relics: document.getElementById("relics-display"),
        relicBonus: document.getElementById("relic-bonus"),
        relicsGain: document.getElementById("relics-gain"),
        prestigeBtn: document.getElementById("prestige-btn"),
        modalOverlay: document.getElementById("modal-overlay"),
        modalTitle: document.getElementById("modal-title"),
        modalBody: document.getElementById("modal-body"),
        modalClose: document.getElementById("modal-close"),
        toast: document.getElementById("toast")
    };

    const ctx = els.particles.getContext("2d");
    let particles = [];

    function createInitialState() {
        return {
            saveVersion: SAVE_VERSION,
            gold: 0, gems: 0, stage: 1, maxStageReached: 1,
            mode: "campaign", infiniteWave: 1, infiniteBest: 0, campaignStage: 1,
            monsterHp: 10, monsterMaxHp: 10, baseTapDamage: 1,
            tapUpgrades: {},
            heroes: HEROES.map(function (h) { return { id: h.id, level: 0 }; }),
            artifacts: {}, relics: 0, totalStages: 0,
            equipment: { weapon: null, armor: null, ring: null },
            inventory: [],
            stats: {
                totalKills: 0, totalTaps: 0, totalBossKills: 0,
                maxComboReached: 0, legendaryLoot: 0, prestigeCount: 0,
                chestsOpened: 0, skillsUsed: 0, infiniteBest: 0
            },
            achievements: {},
            daily: { streak: 0, lastClaim: "", dayIndex: 0 },
            quests: { date: "", items: [], progress: {} },
            maxComboReached: 0
        };
    }

    function todayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    function loadSave() {
        try {
            var raw = localStorage.getItem(SAVE_KEY);
            if (!raw) { state = createInitialState(); return; }
            var saved = JSON.parse(raw);
            state = Object.assign(createInitialState(), saved);
            if (!state.artifacts) state.artifacts = {};
            if (!state.equipment) state.equipment = { weapon: null, armor: null, ring: null };
            if (!state.inventory) state.inventory = [];
            if (!state.stats) state.stats = createInitialState().stats;
            if (!state.achievements) state.achievements = {};
            if (!state.daily) state.daily = { streak: 0, lastClaim: "", dayIndex: 0 };
            if (!state.quests) state.quests = { date: "", items: [], progress: {} };
            if (!state.maxStageReached) state.maxStageReached = state.stage;
            if (!state.mode) state.mode = "campaign";
            if (!state.infiniteWave) state.infiniteWave = 1;
            if (!state.infiniteBest) state.infiniteBest = 0;
            if (!state.campaignStage) state.campaignStage = state.stage;
            migrateSave();
        } catch (e) {
            state = createInitialState();
        }
    }

    function migrateSave() {
        HEROES.forEach(function (h) {
            if (!state.heroes.find(function (x) { return x.id === h.id; })) {
                state.heroes.push({ id: h.id, level: 0 });
            }
        });
        state.saveVersion = SAVE_VERSION;
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

    function getCurrentEvent() {
        var week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
        return WEEKLY_EVENTS[week % WEEKLY_EVENTS.length];
    }

    function isInfiniteMode() {
        return state.mode === "infinite";
    }

    function getEffectiveStage() {
        if (isInfiniteMode()) {
            return state.infiniteWave + Math.floor(state.infiniteWave / 5) * 10;
        }
        return state.stage;
    }

    function getWorld(stage) {
        var world = WORLDS[0];
        WORLDS.forEach(function (w) {
            if (stage >= w.minStage) world = w;
        });
        return world;
    }

    function isBossStage(stage) { return stage % BOSS_INTERVAL === 0; }

    function getArtifactLevel(id) { return state.artifacts[id] || 0; }

    function isArtifactUnlocked(id) {
        return state.maxStageReached >= ARTIFACTS.find(function (a) { return a.id === id; }).unlockStage;
    }

    function artifactBonus(id) {
        var def = ARTIFACTS.find(function (a) { return a.id === id; });
        var level = getArtifactLevel(id);
        return def && level > 0 ? def.perLevel * level : 0;
    }

    function getEquipmentBonus(type) {
        var total = 0;
        ["weapon", "armor", "ring"].forEach(function (slot) {
            var item = state.equipment[slot];
            if (item && item.bonus && item.bonus[type]) total += item.bonus[type];
        });
        return total;
    }

    function relicMultiplier() { return 1 + state.relics * 0.05; }

    function getCritChance() {
        return Math.min(0.6, BASE_CRIT_CHANCE + artifactBonus("eye") + getEquipmentBonus("crit"));
    }

    function getComboMultiplier() {
        var max = MAX_COMBO * (getCurrentEvent().comboMult || 1);
        return 1 + (combo / max);
    }

    function getTapMultiplier() {
        var mult = relicMultiplier() * (1 + artifactBonus("sword") + getEquipmentBonus("tap"));
        if (activeBuffs.tapMult) mult *= activeBuffs.tapMult.value;
        return mult * getComboMultiplier();
    }

    function getDpsMultiplier() {
        var mult = relicMultiplier() * (1 + artifactBonus("shield") + getEquipmentBonus("dps"));
        if (activeBuffs.dpsMult) mult *= activeBuffs.dpsMult.value;
        mult *= getCurrentEvent().dpsMult || 1;
        return mult;
    }

    function getGoldMultiplier() {
        var mult = 1 + artifactBonus("coin") + getEquipmentBonus("gold");
        if (activeBuffs.goldMult) mult *= activeBuffs.goldMult.value;
        if (currentSpecial === "golden") mult *= 15;
        if (currentSpecial === "elite") mult *= 2;
        mult *= getCurrentEvent().goldMult || 1;
        if (isInfiniteMode()) mult *= 1 + state.infiniteWave * 0.02;
        return mult;
    }

    function getBossTimerBonus() { return artifactBonus("hourglass"); }

    function getHeroCostReduction() { return Math.min(0.6, artifactBonus("book")); }

    function getTapDamage() {
        var bonus = 0;
        UPGRADES.forEach(function (u) {
            if (state.tapUpgrades[u.id]) bonus += u.tapBonus;
        });
        return Math.floor((state.baseTapDamage + bonus) * getTapMultiplier());
    }

    function getHeroDps(heroId) {
        var hero = state.heroes.find(function (h) { return h.id === heroId; });
        var level = hero ? hero.level : 0;
        return getHeroDpsAtLevel(heroId, level);
    }

    function getHeroDpsAtLevel(heroId, level) {
        var def = HEROES.find(function (h) { return h.id === heroId; });
        if (!def || level === 0) return 0;
        return Math.floor(def.baseDps * level * Math.pow(1.05, level - 1) * getDpsMultiplier());
    }

    function getTotalDps() {
        return HEROES.reduce(function (s, h) { return s + getHeroDps(h.id); }, 0);
    }

    function heroCost(heroId) {
        var def = HEROES.find(function (h) { return h.id === heroId; });
        var hero = state.heroes.find(function (h) { return h.id === heroId; });
        var level = hero ? hero.level : 0;
        return Math.floor(def.baseCost * Math.pow(def.costMult, level) * (1 - getHeroCostReduction()));
    }

    function artifactUpgradeCost(id) {
        return Math.max(1, Math.floor(Math.pow(getArtifactLevel(id) + 1, 1.8)));
    }

    function monsterMaxHp(stage) {
        var world = getWorld(stage);
        var base = 10 * Math.pow(1.52, stage - 1) * world.hpMult;
        if (isInfiniteMode()) base *= Math.pow(1.18, state.infiniteWave);
        if (isBossStage(stage)) base *= 10;
        if (currentSpecial === "elite") base *= 3;
        if (currentSpecial === "golden") base *= 0.6;
        if (currentSpecial === "treasure") base *= 2;
        return Math.floor(base);
    }

    function goldReward(stage) {
        var world = getWorld(stage);
        var base = 4 * Math.pow(1.42, stage - 1) * world.goldMult;
        if (isBossStage(stage)) {
            base *= 6 * (getCurrentEvent().bossGoldMult || 1);
        }
        if (isInfiniteMode()) base *= 1 + state.infiniteWave * 0.05;
        return Math.floor(base * getGoldMultiplier());
    }

    function rollSpecialType(stage) {
        if (isBossStage(stage)) return null;
        if (stage % 5 === 0) return "elite";
        var r = Math.random();
        if (r < 0.015) return "treasure";
        if (r < 0.055) return "golden";
        return null;
    }

    function getMonsterDef(stage) {
        return MONSTERS[(stage - 1) % MONSTERS.length];
    }

    function spawnMonster() {
        if (isInfiniteMode()) {
            state.stage = state.infiniteWave;
        }
        currentSpecial = rollSpecialType(state.stage);
        state.monsterMaxHp = monsterMaxHp(getEffectiveStage());
        state.monsterHp = state.monsterMaxHp;
        var def = getMonsterDef(state.stage);
        var world = getWorld(getEffectiveStage());

        var prefix = "";
        if (isInfiniteMode()) prefix = "♾️ Vague " + state.infiniteWave + " — ";
        else if (currentSpecial === "golden") prefix = "✨ DORÉ — ";
        else if (currentSpecial === "elite") prefix = "⚔️ ÉLITE — ";
        else if (currentSpecial === "treasure") prefix = "📦 TRÉSOR — ";
        else if (isBossStage(state.stage)) prefix = "👹 BOSS — ";

        els.monsterName.textContent = prefix + def.name;

        if (spriteEngine) {
            spriteEngine.setMonster(def.type, currentSpecial, isBossStage(state.stage) || currentSpecial === "elite");
        }

        if (currentSpecial) {
            els.specialTag.textContent = currentSpecial === "golden" ? "×15 OR + 💎" :
                currentSpecial === "elite" ? "×2 OR — 3× PV" :
                currentSpecial === "treasure" ? "Loot garanti !" : "";
            els.specialTag.className = "special-tag special-" + currentSpecial;
        } else {
            els.specialTag.className = "special-tag hidden";
        }

        if (isBossStage(state.stage)) {
            els.hpBar.classList.add("boss");
            startBossTimer();
        } else {
            els.hpBar.classList.remove("boss");
            stopBossTimer();
        }

        els.gameApp.style.background = world.bg;
        els.worldName.textContent = isInfiniteMode() ? "Mode Infini" : world.name;
        els.worldStage.textContent = isInfiniteMode() ? "Record: " + state.infiniteBest : "Monde " + world.id;
        els.monster.classList.remove("dead");
        updateHeroSprites();
        updateHud();
        renderModeUI();
    }

    function updateHeroSprites() {
        if (!spriteEngine) return;
        var active = [];
        HEROES.forEach(function (def) {
            var hero = state.heroes.find(function (h) { return h.id === def.id; });
            if (hero && hero.level > 0) {
                active.push({ icon: def.icon, level: hero.level });
            }
        });
        spriteEngine.setHeroes(active);
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
        if (bossTimer) { clearInterval(bossTimer); bossTimer = null; }
        els.bossTimer.classList.add("hidden");
    }

    function failBoss() {
        stopBossTimer();
        if (isInfiniteMode()) {
            state.infiniteWave = Math.max(1, state.infiniteWave - 3);
            showToast("Boss échappé ! Vague " + state.infiniteWave);
        } else {
            state.stage = Math.max(1, state.stage - 5);
            showToast("Boss échappé ! Retour étape " + state.stage);
        }
        spawnMonster();
    }

    function dealDamage(amount, isCrit, x, y, silent) {
        state.monsterHp = Math.max(0, state.monsterHp - amount);
        if (!silent) showDamageNumber(amount, isCrit, x, y);
        updateHud();
        if (state.monsterHp <= 0) killMonster();
    }

    function rollRarity(chestType) {
        var pool = chestType === "legend"
            ? { epic: 50, legendary: 50 }
            : chestType === "gold"
                ? { rare: 40, epic: 45, legendary: 15 }
                : { common: 60, rare: 30, epic: 10 };
        var total = 0, keys = Object.keys(pool);
        keys.forEach(function (k) { total += pool[k]; });
        var roll = Math.random() * total, acc = 0;
        for (var i = 0; i < keys.length; i++) {
            acc += pool[keys[i]];
            if (roll <= acc) return keys[i];
        }
        return "common";
    }

    function generateLoot(forcedRarity) {
        var slots = ["weapon", "armor", "ring"];
        var slot = slots[Math.floor(Math.random() * slots.length)];
        var rarity = forcedRarity || rollRarity("bronze");
        var rDef = RARITY[rarity];
        var nameIdx = Math.min(LOOT_NAMES[slot].length - 1, Math.floor(rDef.mult / 4));
        var bonus = {};
        if (slot === "weapon") bonus.tap = 0.03 * rDef.mult;
        if (slot === "armor") bonus.dps = 0.04 * rDef.mult;
        if (slot === "ring") {
            bonus.gold = 0.05 * rDef.mult;
            if (rarity === "epic" || rarity === "legendary") bonus.crit = 0.01 * rDef.mult;
        }
        lootIdCounter++;
        return {
            uid: "loot_" + Date.now() + "_" + lootIdCounter,
            name: LOOT_NAMES[slot][nameIdx],
            slot: slot, rarity: rarity,
            bonus: bonus,
            icon: slot === "weapon" ? "⚔️" : slot === "armor" ? "🛡️" : "💍"
        };
    }

    function addLootToInventory(item) {
        state.inventory.push(item);
        if (item.rarity === "legendary") {
            state.stats.legendaryLoot++;
            checkAchievements();
        }
        renderLoot();
    }

    function equipItem(uid) {
        var idx = state.inventory.findIndex(function (i) { return i.uid === uid; });
        if (idx < 0) return;
        var item = state.inventory[idx];
        var old = state.equipment[item.slot];
        state.equipment[item.slot] = item;
        state.inventory.splice(idx, 1);
        if (old) state.inventory.push(old);
        renderLoot();
        updateHud();
        scheduleSave();
        showToast(item.name + " équipé !");
    }

    function sellItem(uid) {
        var idx = state.inventory.findIndex(function (i) { return i.uid === uid; });
        if (idx < 0) return;
        var item = state.inventory[idx];
        var sellValue = Math.floor(50 * RARITY[item.rarity].mult * Math.pow(1.2, state.stage / 20));
        state.gold += sellValue;
        state.inventory.splice(idx, 1);
        renderLoot();
        updateHud();
        scheduleSave();
    }

    function openChest(type) {
        var cost = type === "bronze" ? { gold: 500 } : type === "gold" ? { gems: 5 } : { gems: 25 };
        if (cost.gold && state.gold < cost.gold) return showToast("Pas assez d'or !");
        if (cost.gems && state.gems < cost.gems) return showToast("Pas assez de gemmes !");
        if (cost.gold) state.gold -= cost.gold;
        if (cost.gems) state.gems -= cost.gems;

        var item = generateLoot(type === "bronze" ? null : type);
        addLootToInventory(item);
        state.stats.chestsOpened++;
        trackQuest("chest", 1);
        updateHud();
        scheduleSave();
        showLootModal(item);
    }

    function showLootModal(item) {
        var r = RARITY[item.rarity];
        els.modalTitle.textContent = "Butin obtenu !";
        els.modalBody.innerHTML =
            '<div class="loot-reveal rarity-' + item.rarity + '">' +
            '<span class="loot-big-icon">' + item.icon + '</span>' +
            '<div class="loot-name" style="color:' + r.color + '">' + item.name + '</div>' +
            '<div class="loot-rarity">' + r.label + '</div>' +
            '<div class="loot-stats">' + formatLootBonus(item) + '</div></div>';
        els.modalOverlay.classList.remove("hidden");
    }

    function formatLootBonus(item) {
        var parts = [];
        if (item.bonus.tap) parts.push("+" + Math.round(item.bonus.tap * 100) + "% tap");
        if (item.bonus.dps) parts.push("+" + Math.round(item.bonus.dps * 100) + "% DPS");
        if (item.bonus.gold) parts.push("+" + Math.round(item.bonus.gold * 100) + "% or");
        if (item.bonus.crit) parts.push("+" + Math.round(item.bonus.crit * 100) + "% crit");
        return parts.join(" · ");
    }

    function killMonster() {
        var reward = goldReward(state.stage);
        state.gold += reward;
        state.stats.totalKills++;
        if (isBossStage(state.stage)) {
            state.stats.totalBossKills++;
            trackQuest("boss", 1);
        }
        trackQuest("kill", 1);
        if (!isInfiniteMode()) {
            state.totalStages = Math.max(state.totalStages, state.stage);
            state.maxStageReached = Math.max(state.maxStageReached, state.stage);
        }

        var world = getWorld(getEffectiveStage());
        var gemChance = (world.gemChance + artifactBonus("clover")) * (getCurrentEvent().gemMult || 1);
        if (Math.random() < gemChance) {
            var gems = currentSpecial === "golden" ? 1 + Math.floor(Math.random() * 3) : 1;
            state.gems += gems;
            showToast("+" + gems + " 💎 gemmes !");
        }

        var lootChance = (0.04 + artifactBonus("heart")) * (getCurrentEvent().lootMult || 1);
        if (currentSpecial === "treasure" || Math.random() < lootChance) {
            var drop = generateLoot(Math.random() < 0.05 ? "gold" : "bronze");
            addLootToInventory(drop);
            showToast("Loot : " + drop.name + " !");
        }

        checkArtifactDiscoveries();
        checkAchievements();
        if (spriteEngine) spriteEngine.triggerDie();
        stopBossTimer();

        setTimeout(function () {
            if (isInfiniteMode()) {
                state.infiniteWave++;
                if (state.infiniteWave > state.infiniteBest) {
                    state.infiniteBest = state.infiniteWave;
                    state.stats.infiniteBest = state.infiniteBest;
                    checkAchievements();
                }
            } else {
                state.stage++;
                state.campaignStage = state.stage;
            }
            spawnMonster();
            renderShop();
        }, 450);

        scheduleSave();
    }

    function checkArtifactDiscoveries() {
        ARTIFACTS.forEach(function (art) {
            if (state.maxStageReached >= art.unlockStage && getArtifactLevel(art.id) === 0) {
                state.artifacts[art.id] = 1;
                showToast("Artefact : " + art.name + " !");
            }
        });
    }

    function updateCombo() {
        var now = performance.now();
        if (now - lastTapTime < COMBO_TIMEOUT) combo = Math.min(MAX_COMBO, combo + 1);
        else combo = 1;
        lastTapTime = now;
        if (combo > state.stats.maxComboReached) {
            state.stats.maxComboReached = combo;
            checkAchievements();
        }
        els.combo.textContent = "×" + getComboMultiplier().toFixed(1);
        els.combo.classList.toggle("combo-hot", combo >= 10);
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

        updateCombo();
        state.stats.totalTaps++;
        trackQuest("tap", 1);

        var isCrit = Math.random() < getCritChance();
        var damage = getTapDamage() * (isCrit ? CRIT_MULT : 1);
        trackQuest("damage", damage);

        els.monster.classList.add("hit");
        setTimeout(function () { els.monster.classList.remove("hit"); }, 80);
        if (spriteEngine) spriteEngine.triggerHit();
        spawnParticles(x, y, isCrit);
        dealDamage(damage, isCrit, x, y);
    }

    function activateSkill(skillId) {
        var skill = SKILLS.find(function (s) { return s.id === skillId; });
        if (!skill || (skillCooldowns[skillId] || 0) > 0) return;

        if (skill.effect === "instantDmg") {
            dealDamage(state.monsterHp * skill.value, false, 130, 100);
            spawnParticles(130, 130, true);
        } else {
            activeBuffs[skill.effect] = {
                value: skill.value,
                expires: performance.now() + skill.duration * 1000,
                label: skill.name
            };
        }

        state.stats.skillsUsed++;
        trackQuest("skill", 1);
        skillCooldowns[skillId] = skill.cooldown;
        showToast(skill.name + " !");
        renderSkills();
        updateHud();
        scheduleSave();
    }

    function updateActiveBuffs() {
        var now = performance.now(), changed = false;
        Object.keys(activeBuffs).forEach(function (key) {
            if (activeBuffs[key].expires <= now) { delete activeBuffs[key]; changed = true; }
        });
        Object.keys(skillCooldowns).forEach(function (key) {
            if (skillCooldowns[key] > 0) {
                skillCooldowns[key] = Math.max(0, skillCooldowns[key] - 0.1);
            }
        });
        if (performance.now() - lastTapTime > COMBO_TIMEOUT && combo > 0) {
            combo = 0;
            els.combo.textContent = "×1";
            els.combo.classList.remove("combo-hot");
        }
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
            btn.innerHTML = '<span class="skill-icon">' + skill.icon + '</span>' +
                '<span class="skill-name">' + skill.name + '</span>' +
                (cd > 0 ? '<span class="skill-cd">' + Math.ceil(cd) + "s</span>" : "");
            if (cd <= 0) btn.addEventListener("click", function () { activateSkill(skill.id); });
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
        var color = isCrit ? "#ff006e" : currentSpecial === "golden" ? "#ffd166" : "#ff9f1c";
        for (var i = 0; i < count; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 3,
                life: 1, color: color, size: Math.random() * 4 + 2
            });
        }
    }

    function animateParticles() {
        var w = els.particles.width = els.particles.offsetWidth;
        var h = els.particles.height = els.particles.offsetHeight;
        ctx.clearRect(0, 0, w, h);
        particles = particles.filter(function (p) {
            p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.03;
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

    function initQuests() {
        if (state.quests.date === todayKey()) return;
        var targetStage = Math.max(state.stage + 10, state.maxStageReached + 5);
        state.quests = {
            date: todayKey(),
            progress: { kill: 0, boss: 0, tap: 0, damage: 0, chest: 0, skill: 0 },
            items: [
                { id: "q_kill", desc: "Tuer 30 monstres", type: "kill", target: 30, reward: { gold: 500 }, claimed: false },
                { id: "q_boss", desc: "Vaincre 2 boss", type: "boss", target: 2, reward: { gems: 2 }, claimed: false },
                { id: "q_stage", desc: "Atteindre l'étape " + targetStage, type: "stage", target: targetStage, reward: { gems: 3, gold: 2000 }, claimed: false }
            ]
        };
    }

    function trackQuest(type, amount) {
        if (state.quests.date !== todayKey()) initQuests();
        if (type === "stage") return;
        state.quests.progress[type] = (state.quests.progress[type] || 0) + amount;
        renderQuests();
    }

    function claimQuest(questId) {
        var quest = state.quests.items.find(function (q) { return q.id === questId; });
        if (!quest || quest.claimed) return;
        var prog = quest.type === "stage" ? state.maxStageReached : (state.quests.progress[quest.type] || 0);
        if (prog < quest.target) return;
        quest.claimed = true;
        if (quest.reward.gold) state.gold += quest.reward.gold;
        if (quest.reward.gems) state.gems += quest.reward.gems;
        showToast("Quête terminée !");
        renderQuests();
        updateHud();
        scheduleSave();
    }

    function checkAchievements() {
        ACHIEVEMENTS.forEach(function (ach) {
            if (state.achievements[ach.id]) return;
            var val = ach.stat === "dailyStreak" ? state.daily.streak :
                ach.stat === "maxComboReached" ? state.stats.maxComboReached :
                ach.stat === "infiniteBest" ? state.infiniteBest :
                state.stats[ach.stat] || state[ach.stat] || 0;
            if (val >= ach.target) {
                state.achievements[ach.id] = true;
                if (ach.reward.gems) state.gems += ach.reward.gems;
                if (ach.reward.gold) state.gold += ach.reward.gold;
                showToast("Succès : " + ach.name + " !");
                renderQuests();
                updateHud();
            }
        });
    }

    function claimDailyReward() {
        var today = todayKey();
        if (state.daily.lastClaim === today) return showToast("Récompense déjà réclamée !");

        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var yKey = yesterday.toISOString().slice(0, 10);

        if (state.daily.lastClaim === yKey) {
            state.daily.dayIndex = Math.min(6, state.daily.dayIndex + 1);
        } else {
            state.daily.dayIndex = 0;
        }
        state.daily.streak = state.daily.dayIndex + 1;
        state.daily.lastClaim = today;

        var reward = DAILY_REWARDS[state.daily.dayIndex];
        var bodyParts = [];
        if (reward.gold) {
            state.gold += reward.gold;
            bodyParts.push("<p>🪙 " + formatNumber(reward.gold) + " or</p>");
        }
        if (reward.gems) {
            state.gems += reward.gems;
            bodyParts.push("<p>💎 " + reward.gems + " gemmes</p>");
        }
        if (reward.chest) {
            var chestItem = generateLoot(reward.chest === "gold" ? "gold" : "bronze");
            addLootToInventory(chestItem);
            bodyParts.push("<p>📦 " + chestItem.icon + " " + chestItem.name + " (" + RARITY[chestItem.rarity].label + ")</p>");
        }

        els.modalTitle.textContent = "Récompense quotidienne — Jour " + state.daily.streak;
        els.modalBody.innerHTML = '<div class="daily-reward">' + bodyParts.join("") +
            "<p class='streak-info'>Série : " + state.daily.streak + " / 7 jours</p></div>";
        els.modalOverlay.classList.remove("hidden");

        checkAchievements();
        updateHud();
        updateDailyBtn();
        scheduleSave();
    }

    function updateDailyBtn() {
        var available = state.daily.lastClaim !== todayKey();
        els.dailyBtn.classList.toggle("daily-ready", available);
        els.dailyBtn.textContent = available ? "🎁 Daily !" : "🎁 Daily";
    }

    function updateEventBanner() {
        var ev = getCurrentEvent();
        els.eventBanner.textContent = ev.icon + " " + ev.name + " — " + ev.desc;
        els.eventBanner.classList.remove("hidden");
    }

    function renderModeUI() {
        var infiniteUnlocked = state.maxStageReached >= INFINITE_UNLOCK;
        els.modeInfinite.disabled = !infiniteUnlocked;
        els.modeCampaign.classList.toggle("active", !isInfiniteMode());
        els.modeInfinite.classList.toggle("active", isInfiniteMode());
        els.infiniteStats.classList.toggle("hidden", !isInfiniteMode());
        els.infiniteWave.textContent = state.infiniteWave;
        els.infiniteBest.textContent = state.infiniteBest;
        if (!infiniteUnlocked) {
            els.modeDesc.textContent = "Mode infini débloqué à l'étape " + INFINITE_UNLOCK + ".";
        } else if (isInfiniteMode()) {
            els.modeDesc.textContent = "Difficulté infinie — battez votre record de vagues !";
        } else {
            els.modeDesc.textContent = "Progression classique avec mondes et boss.";
        }
        els.prestigeBtn.style.display = isInfiniteMode() ? "none" : "";
    }

    function switchMode(mode) {
        if (mode === "infinite" && state.maxStageReached < INFINITE_UNLOCK) {
            return showToast("Débloquez le mode infini à l'étape " + INFINITE_UNLOCK + " !");
        }
        if (mode === state.mode) return;

        if (mode === "infinite") {
            state.campaignStage = state.stage;
            state.mode = "infinite";
            state.infiniteWave = Math.max(1, state.infiniteWave);
        } else {
            state.mode = "campaign";
            state.stage = state.campaignStage || 1;
        }

        combo = 0;
        stopBossTimer();
        spawnMonster();
        renderModeUI();
        updateHud();
        scheduleSave();
        showToast(mode === "infinite" ? "Mode Infini activé !" : "Retour en Campagne");
    }

    function updateHud() {
        els.stage.textContent = isInfiniteMode() ? state.infiniteWave : state.stage;
        els.gold.textContent = formatNumber(state.gold);
        els.gems.textContent = formatNumber(state.gems);
        els.dps.textContent = formatNumber(getTotalDps());
        var pct = state.monsterMaxHp > 0 ? (state.monsterHp / state.monsterMaxHp) * 100 : 0;
        els.hpBar.style.width = pct + "%";
        els.hpText.textContent = formatNumber(state.monsterHp) + " / " + formatNumber(state.monsterMaxHp);
        els.relics.textContent = state.relics;
        els.relicBonus.textContent = "+" + Math.round((relicMultiplier() - 1) * 100) + "%";
        var gain = calcRelicsGain();
        els.relicsGain.textContent = gain;
        els.prestigeBtn.disabled = isInfiniteMode() || state.stage < PRESTIGE_MIN_STAGE;
        els.prestigeBtn.textContent = state.stage >= PRESTIGE_MIN_STAGE
            ? "Prestige (+" + gain + " reliques)" : "Prestige (étape " + PRESTIGE_MIN_STAGE + "+)";
        trackQuest("stage", 0);
        renderModeUI();
    }

    function calcRelicsGain() {
        return Math.floor(Math.sqrt(state.totalStages / 10)) + Math.floor(state.maxStageReached / 200);
    }

    function buyHero(heroId) {
        var cost = heroCost(heroId);
        if (state.gold < cost) return;
        state.gold -= cost;
        state.heroes.find(function (h) { return h.id === heroId; }).level++;
        updateHeroSprites();
        updateHud(); renderShop(); scheduleSave();
    }

    function buyUpgrade(upgradeId) {
        if (state.tapUpgrades[upgradeId]) return;
        var upgrade = UPGRADES.find(function (u) { return u.id === upgradeId; });
        if (!upgrade || state.gold < upgrade.baseCost) return;
        state.gold -= upgrade.baseCost;
        state.tapUpgrades[upgradeId] = true;
        updateHud(); renderShop(); scheduleSave();
        showToast(upgrade.name + " acheté !");
    }

    function upgradeArtifact(id) {
        if (!isArtifactUnlocked(id) || getArtifactLevel(id) === 0) return;
        var cost = artifactUpgradeCost(id);
        if (state.relics < cost) return;
        state.relics -= cost;
        state.artifacts[id]++;
        updateHud(); renderShop(); scheduleSave();
        showToast("Artefact amélioré !");
    }

    function doPrestige() {
        if (state.stage < PRESTIGE_MIN_STAGE) return;
        var gain = calcRelicsGain();
        if (gain <= 0) return;

        var kept = {
            relics: state.relics + gain,
            artifacts: Object.assign({}, state.artifacts),
            equipment: Object.assign({}, state.equipment),
            inventory: state.inventory.slice(),
            achievements: Object.assign({}, state.achievements),
            stats: Object.assign({}, state.stats),
            daily: Object.assign({}, state.daily),
            gems: state.gems,
            infiniteBest: state.infiniteBest,
            mode: state.mode,
            campaignStage: 1
        };
        kept.stats.prestigeCount = (kept.stats.prestigeCount || 0) + 1;

        state = createInitialState();
        state.relics = kept.relics;
        state.artifacts = kept.artifacts;
        state.equipment = kept.equipment;
        state.inventory = kept.inventory;
        state.achievements = kept.achievements;
        state.stats = kept.stats;
        state.daily = kept.daily;
        state.gems = kept.gems;
        state.infiniteBest = kept.infiniteBest;
        state.stats.infiniteBest = kept.infiniteBest;
        state.mode = kept.mode === "infinite" ? "campaign" : kept.mode;
        state.campaignStage = 1;

        activeBuffs = {};
        skillCooldowns = {};
        combo = 0;
        stopBossTimer();
        spawnMonster();
        renderShop();
        renderLoot();
        renderSkills();
        updateHud();
        checkAchievements();
        scheduleSave();
        showToast("Prestige ! +" + gain + " reliques");
    }

    function renderShop() {
        els.heroList.innerHTML = "";
        HEROES.forEach(function (def) {
            var hero = state.heroes.find(function (h) { return h.id === def.id; });
            var cost = heroCost(def.id);
            var dps = getHeroDps(def.id);
            var nextDps = getHeroDpsAtLevel(def.id, hero.level + 1);
            var dpsGain = nextDps - dps;
            var canBuy = state.gold >= cost;
            var li = document.createElement("li");
            li.className = "item-card hero-card" + (canBuy ? "" : " disabled");

            var dpsLine = hero.level === 0
                ? '<span class="hero-dps-current inactive">⚡ ' + formatNumber(nextDps) + ' DPS/s une fois recruté</span>'
                : '<span class="hero-dps-current">⚡ ' + formatNumber(dps) + ' DPS/s</span>' +
                  '<span class="hero-dps-next">+' + formatNumber(dpsGain) + ' DPS au prochain niv.</span>';

            li.innerHTML =
                '<div class="item-icon">' + def.icon + '</div>' +
                '<div class="item-info">' +
                    '<div class="hero-header">' +
                        '<div class="item-name">' + def.name + '</div>' +
                        '<span class="hero-level-badge">Niv. ' + hero.level + '</span>' +
                    '</div>' +
                    '<div class="hero-dps-block">' + dpsLine + '</div>' +
                '</div>' +
                '<div class="hero-cost-block">' +
                    '<span class="hero-buy-label">' + (hero.level === 0 ? 'Recruter' : 'Améliorer') + '</span>' +
                    '<div class="item-cost">🪙 ' + formatNumber(cost) + '</div>' +
                '</div>';

            if (canBuy) li.addEventListener("click", function () { buyHero(def.id); });
            els.heroList.appendChild(li);
        });

        els.upgradeList.innerHTML = "";
        UPGRADES.forEach(function (upgrade) {
            var owned = !!state.tapUpgrades[upgrade.id];
            var canBuy = !owned && state.gold >= upgrade.baseCost;
            var li = document.createElement("li");
            li.className = "item-card" + (owned ? " disabled" : canBuy ? "" : " disabled");
            li.innerHTML = '<div class="item-icon">' + upgrade.icon + '</div>' +
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
                li.innerHTML = '<div class="item-icon locked">❓</div><div class="item-info">' +
                    '<div class="item-name">Artefact mystérieux</div><div class="item-desc">Étape ' + art.unlockStage + "+</div></div>";
            } else if (!discovered) {
                li.innerHTML = '<div class="item-icon locked">🔒</div><div class="item-info">' +
                    '<div class="item-name">' + art.name + '</div><div class="item-desc">Tuez un monstre étape ' + art.unlockStage + "+</div></div>";
            } else {
                li.innerHTML = '<div class="item-icon">' + art.icon + '</div><div class="item-info">' +
                    '<div class="item-name">' + art.name + '</div><div class="item-desc">' + art.desc + " (niv. " + level + ')</div></div>' +
                    '<div class="item-action"><div class="item-cost">💎 ' + cost + '</div><div class="item-level">Reliques</div></div>';
                if (canUpgrade) li.addEventListener("click", function () { upgradeArtifact(art.id); });
            }
            els.artifactList.appendChild(li);
        });
    }

    function renderLoot() {
        ["weapon", "armor", "ring"].forEach(function (slot) {
            var item = state.equipment[slot];
            var el = els["slot" + slot.charAt(0).toUpperCase() + slot.slice(1)];
            if (!item) { el.textContent = "—"; el.style.color = ""; return; }
            el.textContent = item.icon + " " + item.name;
            el.style.color = RARITY[item.rarity].color;
        });

        els.inventoryList.innerHTML = "";
        if (state.inventory.length === 0) {
            els.inventoryList.innerHTML = '<li class="empty-msg">Tuez des monstres ou ouvrez des coffres pour obtenir du loot !</li>';
            return;
        }
        state.inventory.forEach(function (item) {
            var li = document.createElement("li");
            li.className = "item-card loot-card rarity-border-" + item.rarity;
            li.innerHTML = '<div class="item-icon">' + item.icon + '</div>' +
                '<div class="item-info"><div class="item-name" style="color:' + RARITY[item.rarity].color + '">' + item.name + '</div>' +
                '<div class="item-desc">' + RARITY[item.rarity].label + " · " + formatLootBonus(item) + '</div></div>' +
                '<div class="item-action loot-actions">' +
                '<button class="btn-small btn-equip" data-uid="' + item.uid + '">Équiper</button>' +
                '<button class="btn-small btn-sell" data-uid="' + item.uid + '">Vendre</button></div>';
            li.querySelector(".btn-equip").addEventListener("click", function (e) {
                e.stopPropagation(); equipItem(item.uid);
            });
            li.querySelector(".btn-sell").addEventListener("click", function (e) {
                e.stopPropagation(); sellItem(item.uid);
            });
            els.inventoryList.appendChild(li);
        });
    }

    function renderQuests() {
        initQuests();
        els.questList.innerHTML = "";
        state.quests.items.forEach(function (quest) {
            var prog = quest.type === "stage" ? state.maxStageReached : (state.quests.progress[quest.type] || 0);
            var done = prog >= quest.target;
            var li = document.createElement("li");
            li.className = "item-card" + (quest.claimed ? " disabled" : done ? " quest-done" : "");
            var rewardText = (quest.reward.gold ? "🪙 " + formatNumber(quest.reward.gold) : "") +
                (quest.reward.gems ? " 💎 " + quest.reward.gems : "");
            li.innerHTML = '<div class="item-icon">📜</div><div class="item-info">' +
                '<div class="item-name">' + quest.desc + '</div>' +
                '<div class="item-desc">' + Math.min(prog, quest.target) + " / " + quest.target + " — " + rewardText + '</div></div>' +
                (done && !quest.claimed ? '<button class="btn-small btn-claim" data-qid="' + quest.id + '">Réclamer</button>' :
                quest.claimed ? '<span class="claimed">✓</span>' : "");
            var btn = li.querySelector(".btn-claim");
            if (btn) btn.addEventListener("click", function () { claimQuest(quest.id); });
            els.questList.appendChild(li);
        });

        els.achievementList.innerHTML = "";
        ACHIEVEMENTS.forEach(function (ach) {
            var done = !!state.achievements[ach.id];
            var val = ach.stat === "dailyStreak" ? state.daily.streak :
                ach.stat === "maxComboReached" ? state.stats.maxComboReached :
                ach.stat === "infiniteBest" ? state.infiniteBest :
                state.stats[ach.stat] || 0;
            var li = document.createElement("li");
            li.className = "item-card" + (done ? " achievement-done" : "");
            li.innerHTML = '<div class="item-icon">' + ach.icon + '</div><div class="item-info">' +
                '<div class="item-name">' + ach.name + (done ? " ✓" : "") + '</div>' +
                '<div class="item-desc">' + ach.desc + " — " + Math.min(val, ach.target) + "/" + ach.target +
                (ach.reward.gems ? " · 💎 " + ach.reward.gems : "") + '</div></div>';
            els.achievementList.appendChild(li);
        });
    }

    function showToast(msg) {
        els.toast.textContent = msg;
        els.toast.classList.remove("hidden");
        clearTimeout(els.toast._timer);
        els.toast._timer = setTimeout(function () { els.toast.classList.add("hidden"); }, 2200);
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
        initQuests();
        checkArtifactDiscoveries();

        spriteEngine = new SpriteEngine(els.monsterSprite, els.heroSprites);
        spriteEngine.resize();
        spriteEngine.startLoop();

        initTabs();
        updateEventBanner();
        spawnMonster();
        renderShop();
        renderLoot();
        renderQuests();
        renderSkills();
        updateHud();
        updateDailyBtn();

        els.monsterZone.addEventListener("touchstart", onTap, { passive: false });
        els.monsterZone.addEventListener("mousedown", onTap);
        els.prestigeBtn.addEventListener("click", doPrestige);
        els.dailyBtn.addEventListener("click", claimDailyReward);
        els.chestBronze.addEventListener("click", function () { openChest("bronze"); });
        els.chestGold.addEventListener("click", function () { openChest("gold"); });
        els.chestLegend.addEventListener("click", function () { openChest("legend"); });
        els.modalClose.addEventListener("click", function () { els.modalOverlay.classList.add("hidden"); });
        els.modeCampaign.addEventListener("click", function () { switchMode("campaign"); });
        els.modeInfinite.addEventListener("click", function () { switchMode("infinite"); });

        animateParticles();
        requestAnimationFrame(gameLoop);
        setInterval(updateActiveBuffs, 100);
        window.addEventListener("beforeunload", saveGame);

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("sw.js").catch(function () {});
        }

        if (state.daily.lastClaim !== todayKey()) {
            setTimeout(function () { showToast("🎁 Récompense quotidienne disponible !"); }, 1500);
        }
    }

    init();
})();
