window.SpriteEngine = (function () {
    "use strict";

    var PALETTES = [
        { body: "#7b2cbf", dark: "#3c096c", accent: "#9d4edd", eye: "#fff" },
        { body: "#06d6a0", dark: "#118ab2", accent: "#83ffe7", eye: "#fff" },
        { body: "#2d1b4e", dark: "#10002b", accent: "#7b2cbf", eye: "#ff006e" },
        { body: "#e0e0e0", dark: "#9e9e9e", accent: "#fff", eye: "#ff006e" },
        { body: "#588157", dark: "#344e41", accent: "#a7c957", eye: "#ffd166" },
        { body: "#5a189a", dark: "#240046", accent: "#c77dff", eye: "#ff006e" },
        { body: "#6c757d", dark: "#495057", accent: "#adb5bd", eye: "#ffd166" },
        { body: "#90e0ef", dark: "#0077b6", accent: "#caf0f8", eye: "#fff" },
        { body: "#2d6a4f", dark: "#1b4332", accent: "#52b788", eye: "#ffd166" },
        { body: "#ff6b35", dark: "#d00000", accent: "#ffba08", eye: "#fff" }
    ];

    function SpriteEngine(canvas, heroCanvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.heroCanvas = heroCanvas;
        this.heroCtx = heroCanvas ? heroCanvas.getContext("2d") : null;
        this.type = 0;
        this.special = null;
        this.isBoss = false;
        this.anim = "idle";
        this.time = 0;
        this.hitFlash = 0;
        this.dieProgress = 0;
        this.shakeX = 0;
        this.shakeY = 0;
        this.heroes = [];
        this.running = true;
    }

    SpriteEngine.prototype.setMonster = function (type, special, isBoss) {
        this.type = type % 10;
        this.special = special;
        this.isBoss = isBoss;
        this.anim = "idle";
        this.dieProgress = 0;
        this.hitFlash = 0;
        this.shakeX = 0;
        this.shakeY = 0;
    };

    SpriteEngine.prototype.triggerHit = function () {
        this.hitFlash = 1;
        this.shakeX = (Math.random() - 0.5) * 12;
        this.shakeY = (Math.random() - 0.5) * 8;
        if (this.anim !== "die") this.anim = "hit";
    };

    SpriteEngine.prototype.triggerDie = function () {
        this.anim = "die";
        this.dieProgress = 0;
    };

    SpriteEngine.prototype.setHeroes = function (heroes) {
        this.heroes = heroes || [];
    };

    SpriteEngine.prototype.resize = function () {
        var rect = this.canvas.parentElement.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        var size = Math.min(rect.width, rect.height);
        this.canvas.width = size * dpr;
        this.canvas.height = size * dpr;
        this.canvas.style.width = size + "px";
        this.canvas.style.height = size + "px";
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.size = size;
        this.cx = size / 2;
        this.cy = size / 2;

        if (this.heroCanvas) {
            this.heroCanvas.width = rect.width * dpr;
            this.heroCanvas.height = 36 * dpr;
            this.heroCanvas.style.width = rect.width + "px";
            this.heroCanvas.style.height = "36px";
            this.heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.heroW = rect.width;
        }
    };

    SpriteEngine.prototype.update = function (dt) {
        this.time += dt;
        if (this.hitFlash > 0) this.hitFlash -= dt * 4;
        if (this.anim === "hit" && this.hitFlash <= 0) this.anim = "idle";
        if (this.anim === "die") this.dieProgress = Math.min(1, this.dieProgress + dt * 2.5);
        this.shakeX *= 0.8;
        this.shakeY *= 0.8;
    };

    SpriteEngine.prototype.draw = function () {
        if (!this.size) this.resize();
        var ctx = this.ctx;
        var s = this.size;
        ctx.clearRect(0, 0, s, s);

        if (this.anim === "die") {
            this.drawDie(ctx);
            return;
        }

        ctx.save();
        ctx.translate(this.cx + this.shakeX, this.cy + this.shakeY);

        var breathe = Math.sin(this.time * 3) * 4;
        var scale = (this.isBoss ? 1.15 : 1) + Math.sin(this.time * 2) * 0.03;
        if (this.special === "golden") scale *= 1 + Math.sin(this.time * 6) * 0.05;
        ctx.scale(scale, scale);
        ctx.translate(0, breathe);

        this.drawAura(ctx);
        this.drawMonsterBody(ctx);

        if (this.hitFlash > 0) {
            ctx.globalAlpha = this.hitFlash * 0.5;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(0, 0, 70, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        ctx.restore();
        this.drawHeroes();
    };

    SpriteEngine.prototype.drawAura = function (ctx) {
        if (this.special === "golden") {
            ctx.save();
            ctx.globalAlpha = 0.3 + Math.sin(this.time * 5) * 0.15;
            var g = ctx.createRadialGradient(0, 0, 20, 0, 0, 90);
            g.addColorStop(0, "#ffd166");
            g.addColorStop(1, "transparent");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(0, 0, 90, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        if (this.isBoss || this.special === "elite") {
            ctx.save();
            ctx.globalAlpha = 0.2 + Math.sin(this.time * 4) * 0.1;
            ctx.strokeStyle = "#ef476f";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 78 + Math.sin(this.time * 3) * 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        if (this.special === "treasure") {
            ctx.save();
            for (var i = 0; i < 4; i++) {
                var a = this.time * 2 + i * 1.5;
                ctx.globalAlpha = 0.6;
                ctx.fillStyle = "#06d6a0";
                ctx.font = "14px sans-serif";
                ctx.fillText("✦", Math.cos(a) * 60, Math.sin(a) * 60);
            }
            ctx.restore();
        }
    };

    SpriteEngine.prototype.drawMonsterBody = function (ctx) {
        var pal = PALETTES[this.type];
        if (this.isBoss && this.special !== "golden") {
            pal = { body: "#c1121f", dark: "#780000", accent: "#ff6b6b", eye: "#ffd166" };
        }
        if (this.special === "golden") {
            pal = { body: "#ffd166", dark: "#fca311", accent: "#fff3b0", eye: "#fff" };
        }

        var fn = "drawType" + this.type;
        if (typeof this[fn] === "function") this[fn](ctx, pal);
        else this.drawType0(ctx, pal);
    };

    SpriteEngine.prototype.drawType0 = function (ctx, p) {
        ctx.fillStyle = p.dark;
        ctx.beginPath();
        ctx.ellipse(-35, -20, 12, 18, -0.4, 0, Math.PI * 2);
        ctx.ellipse(35, -20, 12, 18, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, 5, 55, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        this.drawEyes(ctx, p, -18, -8, 18, -8);
        ctx.fillStyle = p.dark;
        ctx.beginPath();
        ctx.ellipse(0, 18, 18, 10, 0, 0, Math.PI);
        ctx.fill();
    };

    SpriteEngine.prototype.drawType1 = function (ctx, p) {
        var wobble = Math.sin(this.time * 5) * 8;
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, 10, 50 + wobble * 0.3, 45 - wobble * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.ellipse(-15, -5, 12, 8, -0.5, 0, Math.PI * 2);
        ctx.fill();
        this.drawEyes(ctx, p, -15, 0, 15, 0);
    };

    SpriteEngine.prototype.drawType2 = function (ctx, p) {
        for (var i = 0; i < 8; i++) {
            var angle = (i / 8) * Math.PI * 2 + this.time * 2;
            ctx.strokeStyle = p.dark;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 30, Math.sin(angle) * 25);
            ctx.lineTo(Math.cos(angle) * 55, Math.sin(angle) * 50);
            ctx.stroke();
        }
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        this.drawEyes(ctx, p, -12, -5, 12, -5);
    };

    SpriteEngine.prototype.drawType3 = function (ctx, p) {
        var rattle = Math.sin(this.time * 8) * 2;
        ctx.fillStyle = p.body;
        ctx.fillRect(-25 + rattle, -40, 50, 55);
        ctx.fillRect(-30, -55, 60, 18);
        this.drawEyes(ctx, p, -12, -35, 12, -35);
        ctx.fillStyle = p.dark;
        ctx.fillRect(-20, 10, 40, 8);
        for (var i = 0; i < 5; i++) {
            ctx.fillRect(-20 + i * 10 + rattle, 18, 6, 20 + Math.sin(this.time * 6 + i) * 5);
        }
    };

    SpriteEngine.prototype.drawType4 = function (ctx, p) {
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, 0, 50, 55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.dark;
        ctx.fillRect(-40, -30, 18, 30);
        ctx.fillRect(22, -30, 18, 30);
        this.drawEyes(ctx, p, -15, -10, 15, -10);
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.moveTo(-8, 15);
        ctx.lineTo(0, 28);
        ctx.lineTo(8, 15);
        ctx.fill();
    };

    SpriteEngine.prototype.drawType5 = function (ctx, p) {
        var flap = Math.sin(this.time * 10) * 15;
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, 5, 35, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.dark;
        ctx.beginPath();
        ctx.moveTo(-50, -flap);
        ctx.quadraticCurveTo(-20, -20, 0, 0);
        ctx.quadraticCurveTo(20, -20, 50, -flap);
        ctx.fill();
        this.drawEyes(ctx, p, -10, 0, 10, 0);
    };

    SpriteEngine.prototype.drawType6 = function (ctx, p) {
        ctx.fillStyle = p.body;
        ctx.fillRect(-45, -35, 90, 70);
        ctx.fillStyle = p.dark;
        ctx.fillRect(-35, -25, 25, 20);
        ctx.fillRect(10, -25, 25, 20);
        ctx.fillStyle = p.accent;
        ctx.fillRect(-15, 10, 30, 8);
        ctx.fillRect(-10, 18, 20, 25);
    };

    SpriteEngine.prototype.drawType7 = function (ctx, p) {
        var float = Math.sin(this.time * 2) * 10;
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, float, 45, 55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = p.accent;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.ellipse(0, float, 55, 65, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        this.drawEyes(ctx, p, -12, -5 + float, 12, -5 + float);
    };

    SpriteEngine.prototype.drawType8 = function (ctx, p) {
        [-35, 0, 35].forEach(function (ox, i) {
            ctx.fillStyle = p.body;
            ctx.beginPath();
            ctx.ellipse(ox, -10 + i * 5, 28, 25, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        this.drawEyes(ctx, p, -20, -15, -5, -15);
        this.drawEyes(ctx, p, 5, -15, 20, -15);
    };

    SpriteEngine.prototype.drawType9 = function (ctx, p) {
        ctx.fillStyle = p.body;
        ctx.beginPath();
        ctx.ellipse(0, 10, 48, 42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.dark;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(-20, -20);
        ctx.lineTo(20, -20);
        ctx.fill();
        ctx.fillStyle = p.accent;
        ctx.beginPath();
        ctx.moveTo(-30, 5);
        ctx.quadraticCurveTo(-55, 15, -45, 35);
        ctx.lineTo(-20, 20);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(30, 5);
        ctx.quadraticCurveTo(55, 15, 45, 35);
        ctx.lineTo(20, 20);
        ctx.fill();
        this.drawEyes(ctx, p, -14, -5, 14, -5);
    };

    SpriteEngine.prototype.drawEyes = function (ctx, p, x1, y1, x2, y2) {
        var blink = Math.sin(this.time * 0.5) > 0.95;
        var h = blink ? 2 : 10;
        ctx.fillStyle = p.eye;
        ctx.beginPath();
        ctx.ellipse(x1, y1, 8, h, 0, 0, Math.PI * 2);
        ctx.ellipse(x2, y2, 8, h, 0, 0, Math.PI * 2);
        ctx.fill();
        if (!blink) {
            ctx.fillStyle = "#111";
            ctx.beginPath();
            ctx.arc(x1 + 2, y1, 4, 0, Math.PI * 2);
            ctx.arc(x2 + 2, y2, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    SpriteEngine.prototype.drawDie = function (ctx) {
        var p = this.dieProgress;
        var pal = PALETTES[this.type];
        ctx.save();
        ctx.translate(this.cx, this.cy);
        ctx.scale(1 + p * 0.5, 1 + p * 0.5);
        ctx.globalAlpha = 1 - p;
        for (var i = 0; i < 8; i++) {
            var a = (i / 8) * Math.PI * 2;
            var dist = 20 + p * 80;
            ctx.fillStyle = i % 2 ? pal.body : pal.accent;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, 8 - p * 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    };

    SpriteEngine.prototype.drawHeroes = function () {
        if (!this.heroCtx || !this.heroes.length) return;
        var ctx = this.heroCtx;
        var w = this.heroW;
        ctx.clearRect(0, 0, w, 36);
        var count = Math.min(this.heroes.length, 8);
        var spacing = w / (count + 1);
        this.heroes.slice(0, 8).forEach(function (hero, i) {
            var x = spacing * (i + 1);
            var bounce = Math.sin(Date.now() / 300 + i) * 3;
            ctx.font = "20px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(hero.icon, x, 22 + bounce);
            if (hero.level > 0) {
                ctx.font = "bold 8px sans-serif";
                ctx.fillStyle = "#ffd166";
                ctx.fillText(hero.level, x + 10, 12 + bounce);
            }
        });
    };

    SpriteEngine.prototype.startLoop = function () {
        var self = this;
        var last = performance.now();
        function loop(now) {
            if (!self.running) return;
            var dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            self.update(dt);
            self.draw();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
        window.addEventListener("resize", function () { self.resize(); });
    };

    SpriteEngine.prototype.stop = function () { this.running = false; };

    return SpriteEngine;
})();
