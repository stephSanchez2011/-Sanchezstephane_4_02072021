window.TT_CONTENT = {
    WORLDS: [
        { id: 1, name: "Forêt sombre", minStage: 1, hpMult: 1, goldMult: 1, gemChance: 0.01, bg: "radial-gradient(ellipse at 50% 30%, #2a1450 0%, #0d0618 70%)" },
        { id: 2, name: "Ruines englouties", minStage: 50, hpMult: 1.8, goldMult: 1.4, gemChance: 0.012, bg: "radial-gradient(ellipse at 50% 30%, #1a3040 0%, #081018 70%)" },
        { id: 3, name: "Marais toxique", minStage: 100, hpMult: 2.5, goldMult: 1.7, gemChance: 0.014, bg: "radial-gradient(ellipse at 50% 30%, #1a3020 0%, #081008 70%)" },
        { id: 4, name: "Pics gelés", minStage: 200, hpMult: 4, goldMult: 2.2, gemChance: 0.018, bg: "radial-gradient(ellipse at 50% 30%, #1a3555 0%, #081220 70%)" },
        { id: 5, name: "Désert des âmes", minStage: 350, hpMult: 7, goldMult: 3, gemChance: 0.02, bg: "radial-gradient(ellipse at 50% 30%, #3a3010 0%, #181008 70%)" },
        { id: 6, name: "Volcan infernal", minStage: 500, hpMult: 10, goldMult: 3.8, gemChance: 0.024, bg: "radial-gradient(ellipse at 50% 30%, #4a1510 0%, #180808 70%)" },
        { id: 7, name: "Cité des titans", minStage: 800, hpMult: 18, goldMult: 5.5, gemChance: 0.028, bg: "radial-gradient(ellipse at 50% 30%, #3a2060 0%, #100818 70%)" },
        { id: 8, name: "Abîme abyssal", minStage: 1200, hpMult: 28, goldMult: 7.5, gemChance: 0.032, bg: "radial-gradient(ellipse at 50% 30%, #0a1830 0%, #040810 70%)" },
        { id: 9, name: "Paradis corrompu", minStage: 1800, hpMult: 45, goldMult: 10, gemChance: 0.036, bg: "radial-gradient(ellipse at 50% 30%, #403050 0%, #181020 70%)" },
        { id: 10, name: "Néant cosmique", minStage: 2500, hpMult: 70, goldMult: 14, gemChance: 0.04, bg: "radial-gradient(ellipse at 50% 30%, #150820 0%, #050210 70%)" },
        { id: 11, name: "Dimension divine", minStage: 4000, hpMult: 120, goldMult: 22, gemChance: 0.05, bg: "radial-gradient(ellipse at 50% 30%, #2a2040 0%, #0a0818 70%)" },
        { id: 12, name: "Fin de l'éternité", minStage: 6000, hpMult: 200, goldMult: 35, gemChance: 0.06, bg: "radial-gradient(ellipse at 50% 30%, #101020 0%, #020208 70%)" }
    ],

    MONSTERS: [
        { name: "Gobelin des cavernes", type: 0 }, { name: "Slime visqueux", type: 1 },
        { name: "Araignée géante", type: 2 }, { name: "Squelette errant", type: 3 },
        { name: "Orc sauvage", type: 4 }, { name: "Chauve-souris démoniaque", type: 5 },
        { name: "Golem de pierre", type: 6 }, { name: "Spectre hurlant", type: 7 },
        { name: "Hydre des marais", type: 8 }, { name: "Dragonnet", type: 9 },
        { name: "Liche maudite", type: 3 }, { name: "Démon mineur", type: 5 },
        { name: "Colosse de lave", type: 6 }, { name: "Wyrm ancien", type: 9 },
        { name: "Loup alpha", type: 4 }, { name: "Champignon vénéneux", type: 1 },
        { name: "Bandit masqué", type: 0 }, { name: "Élémentaire d'eau", type: 7 },
        { name: "Minotaure", type: 4 }, { name: "Harpyie", type: 5 },
        { name: "Gargouille", type: 6 }, { name: "Manticore", type: 9 },
        { name: "Banshee", type: 7 }, { name: "Troll des montagnes", type: 4 },
        { name: "Nuée de scarabées", type: 2 }, { name: "Revenant", type: 3 },
        { name: "Salamandre de feu", type: 9 }, { name: "Kraken des profondeurs", type: 8 },
        { name: "Chimère", type: 9 }, { name: "Archidémon", type: 5 },
        { name: "Avatar du vide", type: 7 }, { name: "Seigneur dragon", type: 9 },
        { name: "Ent ancien", type: 4 }, { name: "Horreur lovecraftienne", type: 7 },
        { name: "Ange déchu", type: 5 }, { name: "Titan de cristal", type: 6 }
    ],

    TITANS: [
        { name: "Golgoth le Brise-monde", icon: "💀", hpMult: 100 },
        { name: "Nyxara Reine des ombres", icon: "🌑", hpMult: 150 },
        { name: "Ignis le Dévoreur", icon: "🌋", hpMult: 220 },
        { name: "Caelum l'Intouchable", icon: "⚡", hpMult: 320 },
        { name: "Mortis l'Éternel", icon: "☠️", hpMult: 450 },
        { name: "Ouroboros", icon: "🐍", hpMult: 650 },
        { name: "Azath le Sans-nom", icon: "👁️", hpMult: 900 },
        { name: "Primordius", icon: "🌌", hpMult: 1200 }
    ],

    HEROES: [
        { id: "warrior", name: "Guerrier", icon: "⚔️", baseDps: 1, baseCost: 15, costMult: 1.07 },
        { id: "archer", name: "Archer", icon: "🏹", baseDps: 4, baseCost: 100, costMult: 1.08 },
        { id: "mage", name: "Mage", icon: "🔮", baseDps: 15, baseCost: 500, costMult: 1.09 },
        { id: "knight", name: "Chevalier", icon: "🛡️", baseDps: 50, baseCost: 2500, costMult: 1.1 },
        { id: "assassin", name: "Assassin", icon: "🗡️", baseDps: 200, baseCost: 12000, costMult: 1.11 },
        { id: "paladin", name: "Paladin", icon: "✨", baseDps: 800, baseCost: 60000, costMult: 1.12 },
        { id: "necro", name: "Nécromancien", icon: "💀", baseDps: 3500, baseCost: 300000, costMult: 1.13 },
        { id: "dragonslayer", name: "Tueur de dragons", icon: "🐉", baseDps: 15000, baseCost: 1500000, costMult: 1.14 },
        { id: "druid", name: "Druide", icon: "🌿", baseDps: 65000, baseCost: 8000000, costMult: 1.145 },
        { id: "samurai", name: "Samouraï", icon: "⛩️", baseDps: 280000, baseCost: 40000000, costMult: 1.15 },
        { id: "valkyrie", name: "Valkyrie", icon: "🪽", baseDps: 1200000, baseCost: 200000000, costMult: 1.155 },
        { id: "warlock", name: "Démoniste", icon: "👹", baseDps: 5000000, baseCost: 1000000000, costMult: 1.16 },
        { id: "ranger", name: "Rôdeur", icon: "🎯", baseDps: 22000000, baseCost: 5000000000, costMult: 1.165 },
        { id: "monk", name: "Moine", icon: "🧘", baseDps: 95000000, baseCost: 25000000000, costMult: 1.17 },
        { id: "bard", name: "Barde", icon: "🎵", baseDps: 400000000, baseCost: 120000000000, costMult: 1.175 },
        { id: "golemancer", name: "Golemancien", icon: "🗿", baseDps: 1800000000, baseCost: 600000000000, costMult: 1.18 },
        { id: "phoenix", name: "Maître phénix", icon: "🔥", baseDps: 8000000000, baseCost: 3e12, costMult: 1.185 },
        { id: "chrono", name: "Chronomancien", icon: "⏰", baseDps: 35000000000, baseCost: 1.5e13, costMult: 1.19 },
        { id: "celestial", name: "Céleste", icon: "🌟", baseDps: 1.5e11, baseCost: 7e13, costMult: 1.195 },
        { id: "voidwalker", name: "Marcheur du vide", icon: "🕳️", baseDps: 6.5e11, baseCost: 3.5e14, costMult: 1.2 }
    ],

    UPGRADES: [
        { id: "tap1", name: "Force du poing", icon: "👊", desc: "+2 dégâts par tap", baseCost: 50, tapBonus: 2 },
        { id: "tap2", name: "Gants renforcés", icon: "🥊", desc: "+5 dégâts par tap", baseCost: 250, tapBonus: 5 },
        { id: "tap3", name: "Art martial", icon: "🥋", desc: "+15 dégâts par tap", baseCost: 1000, tapBonus: 15 },
        { id: "tap4", name: "Frappe légendaire", icon: "💥", desc: "+50 dégâts par tap", baseCost: 5000, tapBonus: 50 },
        { id: "tap5", name: "Poing divin", icon: "✊", desc: "+200 dégâts par tap", baseCost: 25000, tapBonus: 200 },
        { id: "tap6", name: "Frappe titanesque", icon: "🌟", desc: "+1000 dégâts par tap", baseCost: 150000, tapBonus: 1000 },
        { id: "tap7", name: "Poing cosmique", icon: "🌌", desc: "+5000 dégâts par tap", baseCost: 800000, tapBonus: 5000 },
        { id: "tap8", name: "Impact primordial", icon: "💫", desc: "+25000 dégâts par tap", baseCost: 5000000, tapBonus: 25000 },
        { id: "tap9", name: "Frappe du créateur", icon: "✴️", desc: "+150000 dégâts par tap", baseCost: 30000000, tapBonus: 150000 },
        { id: "tap10", name: "Toucher de l'infini", icon: "♾️", desc: "+1M dégâts par tap", baseCost: 200000000, tapBonus: 1000000 },
        { id: "tap11", name: "Art du titan", icon: "🏆", desc: "+8M dégâts par tap", baseCost: 1.5e9, tapBonus: 8000000 },
        { id: "tap12", name: "Anéantissement", icon: "🌋", desc: "+50M dégâts par tap", baseCost: 1e10, tapBonus: 50000000 }
    ],

    SKILLS: [
        { id: "warCry", name: "Cri de guerre", icon: "📣", desc: "×2 tap", duration: 30, cooldown: 120, effect: "tapMult", value: 2 },
        { id: "midas", name: "Main de Midas", icon: "✋", desc: "×10 or", duration: 30, cooldown: 180, effect: "goldMult", value: 10 },
        { id: "lightning", name: "Foudre", icon: "⚡", desc: "−20% PV", duration: 0, cooldown: 60, effect: "instantDmg", value: 0.2 },
        { id: "fury", name: "Furie héroïque", icon: "🔥", desc: "×5 DPS", duration: 30, cooldown: 150, effect: "dpsMult", value: 5 },
        { id: "shadow", name: "Clone d'ombre", icon: "👤", desc: "×3 tap 20s", duration: 20, cooldown: 200, effect: "tapMult", value: 3 },
        { id: "heaven", name: "Frappe céleste", icon: "🌩️", desc: "−40% PV", duration: 0, cooldown: 90, effect: "instantDmg", value: 0.4 },
        { id: "treasure", name: "Vision trésor", icon: "👁️", desc: "×15 or 25s", duration: 25, cooldown: 240, effect: "goldMult", value: 15 },
        { id: "bloodlust", name: "Soif de sang", icon: "🩸", desc: "×8 DPS 20s", duration: 20, cooldown: 180, effect: "dpsMult", value: 8 }
    ],

    ARTIFACTS: [
        { id: "sword", name: "Lame du titan", icon: "🗡️", unlockStage: 15, desc: "+3% tap / niv.", perLevel: 0.03 },
        { id: "shield", name: "Bouclier ancien", icon: "🛡️", unlockStage: 25, desc: "+5% DPS / niv.", perLevel: 0.05 },
        { id: "coin", name: "Pièce maudite", icon: "🪙", unlockStage: 35, desc: "+8% or / niv.", perLevel: 0.08 },
        { id: "eye", name: "Œil du chasseur", icon: "👁️", unlockStage: 45, desc: "+2% crit / niv.", perLevel: 0.02 },
        { id: "hourglass", name: "Sablier du boss", icon: "⏳", unlockStage: 55, desc: "+3s boss / niv.", perLevel: 3 },
        { id: "book", name: "Grimoire oublié", icon: "📖", unlockStage: 70, desc: "−3% coût / niv.", perLevel: 0.03 },
        { id: "heart", name: "Cœur de cristal", icon: "💎", unlockStage: 120, desc: "+1% loot / niv.", perLevel: 0.01 },
        { id: "clover", name: "Trèfle doré", icon: "🍀", unlockStage: 200, desc: "+1% gems / niv.", perLevel: 0.01 },
        { id: "mask", name: "Masque du combo", icon: "🎭", unlockStage: 300, desc: "+2% combo / niv.", perLevel: 0.02 },
        { id: "ring2", name: "Anneau du titan", icon: "💍", unlockStage: 400, desc: "+4% all / niv.", perLevel: 0.04, type: "all" },
        { id: "feather", name: "Plume de phénix", icon: "🪶", unlockStage: 550, desc: "+5% skill power", perLevel: 0.05, type: "skill" },
        { id: "skull", name: "Crâne maudit", icon: "💀", unlockStage: 750, desc: "+10% boss or", perLevel: 0.1, type: "bossGold" },
        { id: "crown", name: "Couronne perdue", icon: "👑", unlockStage: 1000, desc: "+6% prestige", perLevel: 0.06, type: "prestige" },
        { id: "moon", name: "Lune noire", icon: "🌙", unlockStage: 1500, desc: "+3% titan dmg", perLevel: 0.03, type: "titan" },
        { id: "sun", name: "Soleil ardent", icon: "☀️", unlockStage: 2000, desc: "+2% pet bonus", perLevel: 0.02, type: "pet" },
        { id: "void", name: "Fragment du vide", icon: "🕳️", unlockStage: 3000, desc: "+8% infini", perLevel: 0.08, type: "infinite" }
    ],

    PETS: [
        { id: "slime_pet", name: "Mini-slime", icon: "🟢", cost: 8, desc: "+5% or", bonus: { gold: 0.05 } },
        { id: "bat_pet", name: "Chauve-souris", icon: "🦇", cost: 15, desc: "+4% tap", bonus: { tap: 0.04 } },
        { id: "wolf_pet", name: "Louveteau", icon: "🐺", cost: 25, desc: "+6% DPS", bonus: { dps: 0.06 } },
        { id: "fairy", name: "Fée lumineuse", icon: "🧚", cost: 40, desc: "+3% crit", bonus: { crit: 0.03 } },
        { id: "phoenix_pet", name: "Bébé phénix", icon: "🔥", cost: 60, desc: "+8% or + tap", bonus: { gold: 0.04, tap: 0.04 } },
        { id: "dragon_pet", name: "Dragonnet", icon: "🐲", cost: 100, desc: "+10% DPS", bonus: { dps: 0.1 } },
        { id: "golem_pet", name: "Mini-golem", icon: "🗿", cost: 150, desc: "+5% all dmg", bonus: { tap: 0.025, dps: 0.025 } },
        { id: "spirit", name: "Esprit ancestral", icon: "👻", cost: 250, desc: "+12% loot", bonus: { loot: 0.12 } },
        { id: "demon_pet", name: "Imp démoniaque", icon: "😈", cost: 400, desc: "+8% boss or", bonus: { bossGold: 0.08 } },
        { id: "cosmic", name: "Entité cosmique", icon: "🌌", cost: 750, desc: "+15% all", bonus: { tap: 0.05, dps: 0.05, gold: 0.05 } }
    ],

    LOOT_NAMES: {
        weapon: ["Dague rouillée", "Épée courte", "Hache de guerre", "Marteau titan", "Lame runique", "Tranchant stellaire", "Faux du néant", "Excalibur"],
        armor: ["Cuir bouilli", "Cuirasse", "Plastron d'acier", "Robe magique", "Armure runique", "Écailles de dragon", "Plaque divine", "Carapace cosmique"],
        ring: ["Anneau de cuivre", "Anneau de force", "Bague d'or", "Sceau du crit", "Anneau du titan", "Chevalière royale", "Loop temporel", "Anneau de l'infini"],
        amulet: ["Amulette bois", "Pendentif argent", "Talisman feu", "Collier lune", "Amulette dragon", "Relique ancienne", "Joyau primordial", "Cœur du titan"]
    },

    ACHIEVEMENTS: [
        { id: "kills10", name: "Chasseur novice", desc: "Tuer 10 monstres", icon: "🎯", target: 10, stat: "totalKills", reward: { gems: 1 } },
        { id: "kills100", name: "Exterminateur", desc: "Tuer 100 monstres", icon: "💀", target: 100, stat: "totalKills", reward: { gems: 3 } },
        { id: "kills1000", name: "Génocide", desc: "Tuer 1000 monstres", icon: "☠️", target: 1000, stat: "totalKills", reward: { gems: 10 } },
        { id: "kills10000", name: "Apocalypse", desc: "Tuer 10000 monstres", icon: "🔥", target: 10000, stat: "totalKills", reward: { gems: 50 } },
        { id: "stage50", name: "Halfway hero", desc: "Étape 50", icon: "🏔️", target: 50, stat: "maxStageReached", reward: { gems: 5 } },
        { id: "stage200", name: "Explorateur", desc: "Étape 200", icon: "🗺️", target: 200, stat: "maxStageReached", reward: { gems: 15 } },
        { id: "stage500", name: "Conquérant", desc: "Étape 500", icon: "👑", target: 500, stat: "maxStageReached", reward: { gems: 30 } },
        { id: "stage1000", name: "Légende", desc: "Étape 1000", icon: "🌟", target: 1000, stat: "maxStageReached", reward: { gems: 60 } },
        { id: "stage3000", name: "Immortel", desc: "Étape 3000", icon: "♾️", target: 3000, stat: "maxStageReached", reward: { gems: 150 } },
        { id: "boss10", name: "Tueur de boss", desc: "10 boss", icon: "👹", target: 10, stat: "totalBossKills", reward: { gems: 5 } },
        { id: "boss50", name: "Fléau des boss", desc: "50 boss", icon: "👺", target: 50, stat: "totalBossKills", reward: { gems: 20 } },
        { id: "titan1", name: "Titanomachie", desc: "Vaincre 1 titan", icon: "💀", target: 1, stat: "titansKilled", reward: { gems: 25 } },
        { id: "titan5", name: "Dieu-slayer", desc: "Vaincre 5 titans", icon: "⚡", target: 5, stat: "titansKilled", reward: { gems: 80 } },
        { id: "combo20", name: "Doigts de feu", desc: "Combo ×30", icon: "🔥", target: 30, stat: "maxComboReached", reward: { gems: 3 } },
        { id: "legendary", name: "Fortune", desc: "Loot légendaire", icon: "🌟", target: 1, stat: "legendaryLoot", reward: { gems: 20 } },
        { id: "legendary10", name: "Trésorier", desc: "10 loots légendaires", icon: "💎", target: 10, stat: "legendaryLoot", reward: { gems: 100 } },
        { id: "prestige1", name: "Renaissance", desc: "1 prestige", icon: "♻️", target: 1, stat: "prestigeCount", reward: { gems: 10 } },
        { id: "prestige5", name: "Cycle éternel", desc: "5 prestiges", icon: "🔄", target: 5, stat: "prestigeCount", reward: { gems: 40 } },
        { id: "streak7", name: "Fidèle", desc: "7 jours daily", icon: "📅", target: 7, stat: "dailyStreak", reward: { gems: 15 } },
        { id: "infinite20", name: "Vague sans fin", desc: "Vague 20 infini", icon: "♾️", target: 20, stat: "infiniteBest", reward: { gems: 8 } },
        { id: "infinite50", name: "Éternel", desc: "Vague 50 infini", icon: "🌀", target: 50, stat: "infiniteBest", reward: { gems: 25 } },
        { id: "infinite100", name: "Au-delà", desc: "Vague 100 infini", icon: "🌌", target: 100, stat: "infiniteBest", reward: { gems: 75 } },
        { id: "pets3", name: "Dresseur", desc: "3 compagnons", icon: "🐾", target: 3, stat: "petsOwned", reward: { gems: 15 } },
        { id: "pets10", name: "Maître des bêtes", desc: "10 compagnons", icon: "🦁", target: 10, stat: "petsOwned", reward: { gems: 50 } },
        { id: "codex10", name: "Naturaliste", desc: "10 monstres au codex", icon: "📖", target: 10, stat: "codexCount", reward: { gems: 10 } },
        { id: "codex30", name: "Encyclopédie", desc: "30 monstres au codex", icon: "📚", target: 30, stat: "codexCount", reward: { gems: 40 } },
        { id: "taps100k", name: "Tap mania", desc: "100K taps", icon: "👆", target: 100000, stat: "totalTaps", reward: { gems: 20 } },
        { id: "chest50", name: "Pilleur", desc: "50 coffres", icon: "📦", target: 50, stat: "chestsOpened", reward: { gems: 25 } }
    ],

    WEEKLY_EVENTS: [
        { id: "goldRush", name: "Ruée vers l'or", icon: "🪙", desc: "×2 or", goldMult: 2 },
        { id: "gemHunt", name: "Chasse aux gemmes", icon: "💎", desc: "×3 gemmes", gemMult: 3 },
        { id: "comboFest", name: "Festival combo", icon: "🔥", desc: "×2 combo", comboMult: 2 },
        { id: "bossHunt", name: "Chasse au boss", icon: "👹", desc: "×3 or boss", bossGoldMult: 3 },
        { id: "lootRain", name: "Pluie de loot", icon: "📦", desc: "×2 loot", lootMult: 2 },
        { id: "heroFury", name: "Furie des héros", icon: "⚔️", desc: "×1.5 DPS", dpsMult: 1.5 },
        { id: "titanWeek", name: "Semaine des titans", icon: "💀", desc: "×2 récomp. titans", titanMult: 2 },
        { id: "petFest", name: "Festival compagnons", icon: "🐾", desc: "−30% coût pets", petDiscount: 0.3 }
    ]
};
