import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { soundManager } from '../../utils/audio';

const COLOR_PALETTES = {
  gold: ['#ffd700', '#f59e0b', '#fbbf24', '#fff3b0', '#ffffff'],
  royal: ['#ef4444', '#f97316', '#ffd700', '#dc2626', '#ffe4e6'],
  emerald: ['#10b981', '#34d399', '#6ee7b7', '#ffd700', '#ffffff'],
  cosmic: ['#a855f7', '#ec4899', '#38bdf8', '#ffd700', '#ffffff'],
  saffron: ['#ff6b00', '#ff9e00', '#ffd000', '#ff3c00', '#ffffff'],
  rainbow: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ffd700'],
};

const PALETTE_KEYS = Object.keys(COLOR_PALETTES);

const triggerHaptic = (pattern) => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {}
  }
};

// 1. AERIAL ROCKET
class Rocket {
  constructor(x, y, targetX, targetY, pattern, paletteName, onDetonate) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.pattern = pattern;
    this.paletteName = paletteName;
    this.palette = COLOR_PALETTES[paletteName] || COLOR_PALETTES.gold;
    this.onDetonate = onDetonate;

    this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
    this.distanceTraveled = 0;
    this.trail = [];
    this.trailLength = 6;

    this.angle = Math.atan2(targetY - y, targetX - x);
    this.speed = 15 + Math.random() * 4;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    this.exploded = false;
    this.headColor = this.palette[0];
  }

  update(speedMult = 1) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    this.x += this.vx * speedMult;
    this.y += this.vy * speedMult;
    this.distanceTraveled = Math.hypot(this.x - this.startX, this.y - this.startY);

    if (this.distanceTraveled >= this.distanceToTarget || (this.vy >= 0 && this.y <= this.targetY + 20)) {
      this.exploded = true;
      this.onDetonate(this.targetX, this.targetY, this.pattern, this.paletteName);
    }
  }

  draw(ctx) {
    const rainbowColors = ['#a855f7', '#4f46e5', '#06b6d4', '#22c55e', '#facc15', '#f97316', '#ef4444'];
    const activeColor = rainbowColors[Math.floor((Date.now() / 70) % 7)];

    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = activeColor;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// 2. RAM BAAN (ARROW OF LIGHT)
class RamBaan {
  constructor(startX, startY, targetX, targetY, onHit) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.onHit = onHit;
    this.trail = [];
    this.angle = Math.atan2(targetY - startY, targetX - startX);
    this.speed = 22;
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.isDead = false;
    soundManager.playRocketLaunch(0);
  }

  update(speedMult = 1) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 14) this.trail.shift();

    this.x += this.vx * speedMult;
    this.y += this.vy * speedMult;

    if (this.y <= this.targetY || Math.hypot(this.targetX - this.x, this.targetY - this.y) < 25) {
      this.isDead = true;
      this.onHit(this.x, this.y);
    }
  }

  draw(ctx) {
    // Arrow trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = 'rgba(255, 240, 160, 0.9)';
      ctx.lineWidth = 4.5;
      ctx.stroke();
    }

    // Glowing arrowhead
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-10, -6);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 6);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 25;
    ctx.fill();

    ctx.restore();
  }
}

// 3. EXPLOSION PARTICLE
class Particle {
  constructor(x, y, vx, vy, color, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.alpha = 1.0;
    this.decay = options.decay || 0.012 + Math.random() * 0.012;
    this.friction = options.friction || 0.965;
    this.gravity = options.gravity !== undefined ? options.gravity : 0.05;
    this.radius = options.radius || 2.0 + Math.random() * 1.6;
    this.twinkle = options.twinkle !== undefined ? options.twinkle : Math.random() > 0.3;
    this.twinkleSpeed = 0.08 + Math.random() * 0.12;
    this.trail = [];
    this.maxTrail = options.maxTrail || 5;
    this.hasSecondary = options.hasSecondary || false;
    this.secondaryTriggered = false;
  }

  update(particlesRef, speedMultiplier = 1) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity * speedMultiplier;

    this.x += this.vx * speedMultiplier;
    this.y += this.vy * speedMultiplier;
    this.alpha -= this.decay * speedMultiplier;

    if (this.hasSecondary && !this.secondaryTriggered && this.alpha < 0.5) {
      this.secondaryTriggered = true;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2 + Math.random() * 0.2;
        const spd = 1.5 + Math.random() * 1.5;
        particlesRef.push(
          new Particle(this.x, this.y, Math.cos(a) * spd, Math.sin(a) * spd, '#ffffff', {
            decay: 0.03,
            friction: 0.95,
            gravity: 0.04,
            radius: 1.4,
            maxTrail: 2,
          })
        );
      }
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    let currentAlpha = this.alpha;
    if (this.twinkle) {
      currentAlpha = Math.max(0.18, this.alpha * (0.65 + Math.sin(Date.now() * this.twinkleSpeed) * 0.35));
    }

    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = currentAlpha * 0.65;
      ctx.lineWidth = this.radius * 0.9;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = currentAlpha;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

// 4. FLOATING WATER DIYA (RIPPLES & SACRED LIGHT)
class WaterDiya {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 450;
    this.maxLife = 450;
    this.isDead = false;
    this.flameFlicker = Math.random() * 10;
  }

  update(particlesRef, speedMultiplier = 1) {
    this.life -= speedMultiplier;
    this.flameFlicker += 0.2 * speedMultiplier;
    this.x += Math.sin(this.flameFlicker * 0.4) * 0.15;
    if (this.life <= 0) this.isDead = true;

    // Soft spark motes drifting up
    if (Math.random() > 0.4) {
      particlesRef.push(
        new Particle(this.x + (Math.random() - 0.5) * 6, this.y - 14, (Math.random() - 0.5) * 0.4, -0.6, '#ffd700', {
          decay: 0.04,
          radius: 1.2,
          gravity: -0.01,
        })
      );
    }
  }

  draw(ctx) {
    ctx.save();
    let alpha = Math.min(1.0, this.life / 30);
    ctx.globalAlpha = alpha;

    // Water ripple reflection ring
    const rippleRadius = 24 + Math.sin(this.flameFlicker) * 4;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 4, rippleRadius, rippleRadius * 0.35, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 180, 50, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Clay diya base
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, 16, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#b45309';
    ctx.fill();

    // Glowing oil center
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 1, 12, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#d97706';
    ctx.fill();

    // Dancing flame teardrop
    const flameH = 14 + Math.sin(this.flameFlicker * 2) * 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 2 - flameH);
    ctx.quadraticCurveTo(this.x + 6, this.y - 2, this.x, this.y - 1);
    ctx.quadraticCurveTo(this.x - 6, this.y - 2, this.x, this.y - 2 - flameH);
    ctx.fillStyle = '#ffedd5';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20;
    ctx.fill();

    ctx.restore();
  }
}

// 5. ANAAR (FOUNTAIN)
class AnaarFountain {
  constructor(x, y, duration = 190) {
    this.x = x;
    this.y = y;
    this.life = duration;
    this.maxLife = duration;
    this.isDead = false;
    soundManager.playAnaarSizzle();
    triggerHaptic([30, 50, 30, 50]);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.life -= speedMultiplier;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }

    const emitCount = Math.floor(9 + Math.random() * 7);
    for (let i = 0; i < emitCount; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.55;
      const progress = 1 - Math.abs(this.life - this.maxLife / 2) / (this.maxLife / 2);
      const speed = 8.0 + progress * 11.0 + Math.random() * 4.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const colors = ['#ffffff', '#fff3b0', '#ffd700', '#f59e0b', '#ef4444', '#10b981'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particlesRef.push(
        new Particle(this.x, this.y - 14, vx, vy, color, {
          decay: 0.02 + Math.random() * 0.015,
          friction: 0.965,
          gravity: 0.17,
          radius: 2.2 + Math.random() * 1.4,
          maxTrail: 4,
          twinkle: true,
        })
      );
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 14);
    ctx.lineTo(this.x - 14, this.y + 6);
    ctx.lineTo(this.x + 14, this.y + 6);
    ctx.closePath();
    ctx.fillStyle = '#b45309';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y - 14, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// 6. CHAKRI (GROUND SPINNER)
class GroundChakri {
  constructor(x, y, duration = 160) {
    this.x = x;
    this.y = y;
    this.life = duration;
    this.isDead = false;
    this.angle = 0;
    this.spinSpeed = 0.44;
    soundManager.playChakriWhir();
    triggerHaptic([40, 40, 40]);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.life -= speedMultiplier;
    this.angle += this.spinSpeed * speedMultiplier;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }

    for (let arm = 0; arm < 4; arm++) {
      const a = this.angle + (arm * Math.PI * 2) / 4;
      const speed = 6.5 + Math.random() * 4.5;
      const vx = Math.cos(a) * speed;
      const vy = Math.sin(a) * (speed * 0.45);
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#38bdf8', '#ffd700'];
      const color = colors[arm % colors.length];

      particlesRef.push(
        new Particle(this.x, this.y, vx, vy, color, {
          decay: 0.022 + Math.random() * 0.015,
          friction: 0.955,
          gravity: 0.02,
          radius: 2.0,
          maxTrail: 4,
          twinkle: true,
        })
      );
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.restore();
  }
}

// 7. SUTLI BOMB (ATOM BOMB)
class SutliBomb {
  constructor(x, y, onExplode) {
    this.x = x;
    this.y = y;
    this.fuseLife = 28;
    this.isDead = false;
    this.onExplode = onExplode;
    soundManager.playSutliBomb();
    triggerHaptic(50);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.fuseLife -= speedMultiplier;

    if (this.fuseLife > 0) {
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
        const spd = 1.5 + Math.random() * 2.5;
        particlesRef.push(
          new Particle(this.x, this.y - 16, Math.cos(a) * spd, Math.sin(a) * spd, '#ffd700', {
            decay: 0.08,
            radius: 1.3,
            gravity: 0.03,
          })
        );
      }
    } else if (!this.isDead) {
      this.isDead = true;
      this.onExplode(this.x, this.y);
    }
  }

  draw(ctx) {
    if (this.fuseLife > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#15803d';
      ctx.fill();

      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(this.x - 16, this.y);
      ctx.lineTo(this.x + 16, this.y);
      ctx.moveTo(this.x, this.y - 16);
      ctx.lineTo(this.x, this.y + 16);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.x, this.y - 16);
      ctx.lineTo(this.x + 5, this.y - 24);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.x + 5, this.y - 24, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

// 8. SHOCKWAVE EXPANSION RING
class ShockwaveRing {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.maxRadius = 380;
    this.alpha = 0.9;
    this.isDead = false;
  }

  update(speedMult = 1) {
    this.radius += 18 * speedMult;
    this.alpha -= 0.04 * speedMult;
    if (this.alpha <= 0 || this.radius >= this.maxRadius) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 230, 140, ${Math.max(0, this.alpha)})`;
    ctx.lineWidth = Math.max(1, 6 * this.alpha);
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();
  }
}

// 9. SKY STAR
class SkyStar {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * (h * 0.7);
    this.baseRadius = 0.5 + Math.random() * 1.0;
    this.alpha = 0.2 + Math.random() * 0.6;
    this.speed = 0.002 + Math.random() * 0.004;
    this.phase = Math.random() * Math.PI * 2;
  }

  draw(ctx, time) {
    const a = this.alpha + Math.sin(time * this.speed + this.phase) * 0.25;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 248, 220, ${Math.max(0.1, a)})`;
    ctx.fill();
  }
}

// 10. SAANP KI GOLI (GROWING BLACK CARBON SNAKE)
class SnakeGoli {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 280;
    this.isDead = false;
    this.segments = [{ x, y, r: 8, angle: 0 }];
    this.growTimer = 0;
    this.growthAngle = -Math.PI / 2;
    soundManager.playSnakeHiss();
    triggerHaptic([30, 40, 30, 40]);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.life -= speedMultiplier;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }

    if (this.segments.length < 52) {
      this.growTimer += speedMultiplier;
      if (this.growTimer >= 2.6) {
        this.growTimer = 0;
        const head = this.segments[this.segments.length - 1];
        this.growthAngle += (Math.random() - 0.5) * 0.85;
        const step = 4.2;
        const nx = head.x + Math.cos(this.growthAngle) * step;
        const ny = head.y + Math.sin(this.growthAngle) * step - 1.2;
        const radius = Math.max(4.5, 8.5 - this.segments.length * 0.08);
        this.segments.push({ x: nx, y: ny, r: radius, angle: this.growthAngle });

        if (Math.random() > 0.4) {
          particlesRef.push(
            new Particle(nx, ny, (Math.random() - 0.5) * 0.8, -1.0 - Math.random() * 0.8, '#57534e', {
              decay: 0.02,
              radius: 4 + Math.random() * 3,
              gravity: -0.01,
            })
          );
        }
      }

      const tip = this.segments[this.segments.length - 1];
      for (let i = 0; i < 2; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 0.5 + Math.random() * 1.5;
        particlesRef.push(
          new Particle(tip.x, tip.y, Math.cos(a) * spd, Math.sin(a) * spd, '#ff4500', {
            decay: 0.06,
            radius: 1.4,
            gravity: 0.02,
          })
        );
      }
    }
  }

  draw(ctx) {
    ctx.save();
    const alpha = Math.min(1.0, this.life / 30);
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.ellipse(this.x, this.y, 11, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1917';
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    for (let i = 0; i < this.segments.length; i++) {
      const seg = this.segments[i];
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, seg.r, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#292524' : '#1c1917';
      ctx.fill();

      if (i > this.segments.length - 6) {
        ctx.strokeStyle = '#ff6b00';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ff4500';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    ctx.restore();
  }
}

// 11. BIJLI CRACKER CLUSTER
class BijliCluster {
  constructor(x, y, onTriggerFlash) {
    this.x = x;
    this.y = y;
    this.life = 70;
    this.isDead = false;
    this.onTriggerFlash = onTriggerFlash;
    this.popTimer = 0;
    this.popCount = 0;
    this.maxPops = 14;
    soundManager.playBijliSnap();
    triggerHaptic([20, 20, 20]);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.life -= speedMultiplier;
    this.popTimer += speedMultiplier;

    if (this.popCount < this.maxPops && this.popTimer >= 3.6) {
      this.popTimer = 0;
      this.popCount++;

      const px = this.x + (Math.random() - 0.5) * 65;
      const py = this.y + (Math.random() - 0.5) * 65;

      if (this.onTriggerFlash) {
        this.onTriggerFlash(px, py, '#ffffff', 0.45, 130);
      }

      for (let i = 0; i < 14; i++) {
        const a = Math.random() * Math.PI * 2;
        const spd = 2.5 + Math.random() * 5.0;
        const colors = ['#ffffff', '#ffd700', '#ef4444', '#f97316'];
        particlesRef.push(
          new Particle(px, py, Math.cos(a) * spd, Math.sin(a) * spd, colors[Math.floor(Math.random() * colors.length)], {
            decay: 0.045,
            radius: 1.6,
            gravity: 0.06,
            twinkle: true,
          })
        );
      }
    }

    if (this.life <= 0 && this.popCount >= this.maxPops) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.restore();
  }
}

// 12. MAGIC HUNTER TUBE (MULTI-SHOT REPEATER)
class MagicHunterTube {
  constructor(x, y, onShootComet) {
    this.x = x;
    this.y = y;
    this.shotsFired = 0;
    this.totalShots = 8;
    this.timer = 0;
    this.interval = 14;
    this.isDead = false;
    this.onShootComet = onShootComet;
    triggerHaptic(40);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.timer += speedMultiplier;
    if (this.shotsFired < this.totalShots && this.timer >= this.interval) {
      this.timer = 0;
      this.shotsFired++;
      this.onShootComet(this.x, this.y, this.shotsFired);
      soundManager.playHunterShot();
      triggerHaptic(25);

      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
        const spd = 3 + Math.random() * 4;
        particlesRef.push(
          new Particle(this.x, this.y - 20, Math.cos(a) * spd, Math.sin(a) * spd, '#ffd700', {
            decay: 0.07,
            radius: 1.8,
            gravity: 0.04,
          })
        );
      }
    }

    if (this.shotsFired >= this.totalShots && this.timer > 30) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(this.x - 5, this.y - 22, 10, 26);
    ctx.fillStyle = '#eab308';
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 22, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }
}

// 13. HUNTER COMET
class HunterComet {
  constructor(x, y, targetX, targetY, color, onExplode) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.onExplode = onExplode;
    this.trail = [];
    this.exploded = false;

    const angle = Math.atan2(targetY - y, targetX - x);
    this.speed = 18 + Math.random() * 3;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.distanceTotal = Math.hypot(targetX - x, targetY - y);
  }

  update(speedMultiplier = 1) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 7) this.trail.shift();

    this.x += this.vx * speedMultiplier;
    this.y += this.vy * speedMultiplier;

    const dist = Math.hypot(this.x - this.startX, this.y - this.startY);
    if (dist >= this.distanceTotal || this.y <= this.targetY) {
      this.exploded = true;
      this.onExplode(this.targetX, this.targetY, this.color);
    }
  }

  draw(ctx) {
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// 14. SKY KANDIL LANTERN
class SkyKandilLantern {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = -(1.2 + Math.random() * 0.7);
    this.life = 500;
    this.isDead = false;
    this.swayPhase = Math.random() * Math.PI * 2;
    this.flameFlicker = 0;
    this.color = ['#f59e0b', '#f97316', '#ef4444', '#ec4899', '#eab308'][Math.floor(Math.random() * 5)];
    soundManager.playKandilSound();
    triggerHaptic(30);
  }

  update(particlesRef, speedMultiplier = 1) {
    this.life -= speedMultiplier;
    this.swayPhase += 0.035 * speedMultiplier;
    this.flameFlicker += 0.25 * speedMultiplier;

    this.x += Math.sin(this.swayPhase) * 0.65 * speedMultiplier;
    this.y += this.vy * speedMultiplier;

    if (this.life <= 0 || this.y < -80) {
      this.isDead = true;
    }

    if (Math.random() > 0.8) {
      particlesRef.push(
        new Particle(this.x + (Math.random() - 0.5) * 8, this.y + 12, (Math.random() - 0.5) * 0.3, 0.4, '#ffd700', {
          decay: 0.05,
          radius: 1.2,
          gravity: 0.01,
        })
      );
    }
  }

  draw(ctx) {
    ctx.save();
    const alpha = Math.min(1.0, this.life / 40);
    ctx.globalAlpha = alpha;

    const flicker = Math.sin(this.flameFlicker) * 2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 24 + flicker, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 25;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 18);
    ctx.lineTo(this.x + 14, this.y - 4);
    ctx.lineTo(this.x + 10, this.y + 14);
    ctx.lineTo(this.x - 10, this.y + 14);
    ctx.lineTo(this.x - 14, this.y - 4);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha * 0.85;
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y + 2, 4.5 + flicker * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x - 6, this.y + 14);
    ctx.lineTo(this.x - 6 + Math.sin(this.swayPhase) * 2, this.y + 24);
    ctx.moveTo(this.x, this.y + 14);
    ctx.lineTo(this.x + Math.sin(this.swayPhase) * 2, this.y + 26);
    ctx.moveTo(this.x + 6, this.y + 14);
    ctx.lineTo(this.x + 6 + Math.sin(this.swayPhase) * 2, this.y + 24);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
}

const FireworksCanvas = forwardRef(
  (
    {
      autoPlay = true,
      selectedPattern = 'all',
      selectedPalette = 'gold',
      crackerType = 'rocket',
      slowMotion = false,
      onScreenShake,
      onInteraction,
    },
    ref
  ) => {
    const canvasRef = useRef(null);
    const rocketsRef = useRef([]);
    const particlesRef = useRef([]);
    const specialCrackersRef = useRef([]);
    const shockwavesRef = useRef([]);
    const starsRef = useRef([]);
    const flashesRef = useRef([]);
    const animFrameRef = useRef(null);
    const nextAutoLaunchRef = useRef(Date.now() + 1000);
    const isDraggingRef = useRef(false);
    const lastDragLaunchRef = useRef(0);
    const sparklerPosRef = useRef(null);

    const speedMultiplier = slowMotion ? 0.35 : 1.0;

    const triggerSkyFlash = useCallback((x, y, color, intensity = 0.35, radius = 240) => {
      flashesRef.current.push({
        x,
        y,
        color,
        radius,
        alpha: intensity,
        decay: 0.035,
      });
    }, []);

    // 7-Color Rainbow Rocket Explosion (VIBGYOR)
    const detonateFirework = useCallback(
      (x, y, pattern, paletteName) => {
        triggerSkyFlash(x, y, '#ffffff', 0.65, 360);

        const pan = (x / (window.innerWidth || 1000)) * 2 - 1;
        soundManager.playExplosion(pan);
        triggerHaptic(40);

        // Authentic 7 Colors of the Rainbow: Violet, Indigo, Blue, Green, Yellow, Orange, Red
        const sevenColors = [
          '#a855f7', // Violet
          '#4f46e5', // Indigo
          '#06b6d4', // Blue / Cyan
          '#22c55e', // Green
          '#facc15', // Yellow
          '#f97316', // Orange
          '#ef4444', // Red
        ];

        // 175 particles radiating in symmetric 7-color rainbow petals
        const count = 175;
        for (let i = 0; i < count; i++) {
          const colorIdx = i % 7;
          const color = sevenColors[colorIdx];
          const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
          const speed = 2.4 + (colorIdx / 7) * 4.2 + Math.random() * 2.5;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;

          particlesRef.current.push(
            new Particle(x, y, vx, vy, color, {
              decay: 0.012 + Math.random() * 0.008,
              friction: 0.968,
              gravity: 0.055,
              radius: 2.5,
              maxTrail: 8,
              twinkle: true,
            })
          );
        }

        // Sparkling bright white core in the center
        for (let j = 0; j < 28; j++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 1.0 + Math.random() * 2.8;
          particlesRef.current.push(
            new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, '#ffffff', {
              decay: 0.035,
              friction: 0.95,
              gravity: 0.03,
              radius: 2.2,
              twinkle: true,
            })
          );
        }
      },
      [triggerSkyFlash]
    );

    // Sutli bomb explosion with shockwave ring
    const explodeSutliBomb = useCallback(
      (x, y) => {
        triggerSkyFlash(x, y, '#ffd700', 0.95, 520);
        triggerHaptic([90, 50, 160]);
        if (onScreenShake) onScreenShake();

        shockwavesRef.current.push(new ShockwaveRing(x, y));

        for (let i = 0; i < 95; i++) {
          const a = (i * Math.PI * 2) / 95;
          const spd = 9.0 + Math.random() * 6.5;
          particlesRef.current.push(
            new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, '#f59e0b', {
              decay: 0.025,
              friction: 0.94,
              gravity: 0.05,
              radius: 2.8,
              maxTrail: 4,
            })
          );
        }

        for (let s = 0; s < 45; s++) {
          const a = Math.random() * Math.PI * 2;
          const spd = 1.5 + Math.random() * 4;
          particlesRef.current.push(
            new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, '#78716c', {
              decay: 0.009,
              friction: 0.96,
              gravity: -0.02,
              radius: 5 + Math.random() * 6,
              twinkle: false,
            })
          );
        }
      },
      [triggerSkyFlash, onScreenShake]
    );

    // Ram Baan explosion: Divine Golden Willow Waterfall
    const explodeRamBaan = useCallback(
      (x, y) => {
        triggerSkyFlash(x, y, '#ffffff', 0.9, 500);
        soundManager.playExplosion(0, 1.4);
        triggerHaptic([50, 50, 80]);

        // Weeping willow golden waterfall
        const count = 180;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 6.0;
          particlesRef.current.push(
            new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, '#ffd700', {
              decay: 0.006,
              friction: 0.978,
              gravity: 0.08,
              radius: 2.4,
              maxTrail: 12,
              twinkle: true,
            })
          );
        }
      },
      [triggerSkyFlash]
    );

    const launchRocket = useCallback(
      (startX, startY, targetX, targetY, pattern = 'all', paletteName = null) => {
        const chosenPalette =
          paletteName || selectedPalette || PALETTE_KEYS[Math.floor(Math.random() * PALETTE_KEYS.length)];
        const pan = (startX / (window.innerWidth || 1000)) * 2 - 1;
        soundManager.playRocketLaunch(pan);

        rocketsRef.current.push(
          new Rocket(startX, startY, targetX, targetY, pattern, chosenPalette, detonateFirework)
        );
      },
      [detonateFirework, selectedPalette]
    );

    const triggerLadiAt = useCallback(
      (x, y) => {
        soundManager.playLadiChain(28);
        const count = 28;
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const offsetX = x + (Math.random() - 0.5) * 50;
            const offsetY = y + i * 4 + (Math.random() - 0.5) * 15;

            triggerSkyFlash(offsetX, offsetY, '#ffd700', 0.28, 150);
            triggerHaptic(15);

            for (let p = 0; p < 18; p++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 4.5;
              particlesRef.current.push(
                new Particle(
                  offsetX,
                  offsetY,
                  Math.cos(angle) * spd,
                  Math.sin(angle) * spd,
                  ['#ff0000', '#ffd700', '#ffffff', '#ff9900'][Math.floor(Math.random() * 4)],
                  {
                    decay: 0.04,
                    friction: 0.94,
                    gravity: 0.06,
                    radius: 1.6,
                    twinkle: true,
                  }
                )
              );
            }
          }, i * 70);
        }
      },
      [triggerSkyFlash]
    );

    const triggerGrandCelebration = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const w = canvas.width;
      const h = canvas.height;

      const total = 18;
      for (let i = 0; i < total; i++) {
        setTimeout(() => {
          const startX = w * 0.1 + Math.random() * (w * 0.8);
          const targetX = w * 0.1 + ((i + 0.5) / total) * (w * 0.8) + (Math.random() - 0.5) * 80;
          const targetY = h * 0.1 + Math.random() * (h * 0.35);
          const palette = PALETTE_KEYS[i % PALETTE_KEYS.length];
          launchRocket(startX, h + 20, targetX, targetY, 'all', palette);
        }, i * 230);
      }
    }, [launchRocket]);

    useImperativeHandle(ref, () => ({
      launchAt: (x, y, pattern = selectedPattern) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        launchRocket(x + (Math.random() - 0.5) * 60, canvas.height + 20, x, y, pattern);
      },
      triggerCelebration: triggerGrandCelebration,
      captureSnapshot: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        try {
          return canvas.toDataURL('image/png');
        } catch (e) {
          return null;
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        starsRef.current = [];
        for (let i = 0; i < 90; i++) {
          starsRef.current.push(new SkyStar(canvas.width, canvas.height));
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      const render = () => {
        const time = Date.now();

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        // Stars
        for (let star of starsRef.current) {
          star.draw(ctx, time);
        }

        // Sky flash illumination
        for (let i = flashesRef.current.length - 1; i >= 0; i--) {
          const f = flashesRef.current[i];
          const grad = ctx.createRadialGradient(f.x, f.y, 10, f.x, f.y, f.radius);
          grad.addColorStop(0, f.color);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.globalAlpha = f.alpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;

          f.alpha -= f.decay * speedMultiplier;
          if (f.alpha <= 0) flashesRef.current.splice(i, 1);
        }

        // Shockwave rings
        for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
          const sw = shockwavesRef.current[i];
          sw.update(speedMultiplier);
          sw.draw(ctx);
          if (sw.isDead) shockwavesRef.current.splice(i, 1);
        }

        // Auto fireworks in background
        if (autoPlay && time > nextAutoLaunchRef.current) {
          const startX = canvas.width * 0.15 + Math.random() * (canvas.width * 0.7);
          const targetX = startX + (Math.random() - 0.5) * 180;
          const targetY = canvas.height * 0.12 + Math.random() * (canvas.height * 0.38);
          launchRocket(startX, canvas.height + 20, targetX, targetY, selectedPattern);
          nextAutoLaunchRef.current = time + 1400 + Math.random() * 1800;
        }

        // Special crackers (Anaar, Chakri, Bomb, Hunter)
        for (let i = specialCrackersRef.current.length - 1; i >= 0; i--) {
          const cr = specialCrackersRef.current[i];
          cr.update(particlesRef.current, speedMultiplier);
          cr.draw(ctx);
          if (cr.isDead) specialCrackersRef.current.splice(i, 1);
        }

        // Hyper-Realistic Hand Sparkler (Phuljhadi with metal wire, ember core, branching starburst needles & smoke)
        if (sparklerPosRef.current) {
          const sp = sparklerPosRef.current;

          // 1. Draw Metallic Sparkler Wire Stick & Incandescent Tip
          ctx.save();
          // Metal Wire Stick extending diagonally to the bottom-right
          ctx.beginPath();
          ctx.moveTo(sp.x + 36, sp.y + 64);
          ctx.lineTo(sp.x, sp.y);
          ctx.strokeStyle = '#9ca3af'; // Steel wire
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Dark pyrotechnic chemical coating
          ctx.beginPath();
          ctx.moveTo(sp.x + 18, sp.y + 32);
          ctx.lineTo(sp.x, sp.y);
          ctx.strokeStyle = '#374151'; // Charcoal chemical coating
          ctx.lineWidth = 3.8;
          ctx.stroke();

          // Red-hot burning collar right below flame
          ctx.beginPath();
          ctx.moveTo(sp.x + 5, sp.y + 9);
          ctx.lineTo(sp.x, sp.y);
          ctx.strokeStyle = '#ff4500';
          ctx.lineWidth = 4.2;
          ctx.stroke();

          // 2. White-Hot Burning Combustion Core with Radial Halo
          const flicker = (Math.random() - 0.5) * 1.5;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 4 + flicker, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ff9900';
          ctx.shadowBlur = 24;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 8 + flicker * 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 200, 50, 0.35)';
          ctx.fill();
          ctx.restore();

          // 3. Emitter: 18 Branching Starburst Sparks (Dendritic Micro-Explosions)
          const sparkCount = 18;
          for (let k = 0; k < sparkCount; k++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3.5 + Math.random() * 8.5;
            const colors = ['#ffffff', '#ffffff', '#ffd700', '#fff3b0', '#ffea75', '#ff8c00'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particlesRef.current.push(
              new Particle(
                sp.x + (Math.random() - 0.5) * 2,
                sp.y + (Math.random() - 0.5) * 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                color,
                {
                  decay: 0.042 + Math.random() * 0.035,
                  friction: 0.915,
                  gravity: 0.09,
                  radius: 1.8 + Math.random() * 0.8,
                  maxTrail: 5,
                  twinkle: true,
                  hasSecondary: Math.random() > 0.45, // 55% sparks split into secondary sparkling needles!
                }
              )
            );
          }

          // 4. Wispy Rising Smoke Puffs
          if (Math.random() > 0.45) {
            particlesRef.current.push(
              new Particle(
                sp.x + (Math.random() - 0.5) * 4,
                sp.y - 2,
                (Math.random() - 0.5) * 0.7,
                -1.2 - Math.random() * 0.8,
                '#52525b',
                {
                  decay: 0.018,
                  friction: 0.97,
                  gravity: -0.015,
                  radius: 3.5 + Math.random() * 2.5,
                  twinkle: false,
                }
              )
            );
          }
        }

        // Rockets
        for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
          const r = rocketsRef.current[i];
          r.update(speedMultiplier);
          r.draw(ctx);
          if (r.exploded) rocketsRef.current.splice(i, 1);
        }

        // Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.update(particlesRef.current, speedMultiplier);
          p.draw(ctx);
          if (p.alpha <= 0) particlesRef.current.splice(i, 1);
        }

        animFrameRef.current = requestAnimationFrame(render);
      };

      render();

      return () => {
        cancelAnimationFrame(animFrameRef.current);
        window.removeEventListener('resize', handleResize);
      };
    }, [autoPlay, launchRocket, selectedPattern, speedMultiplier]);

    // Shoot Hunter comet upwards
    const shootHunterComet = useCallback(
      (startX, startY, shotIndex) => {
        const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#a855f7', '#ffd700', '#ec4899', '#ffffff'];
        const color = colors[shotIndex % colors.length];
        const targetX = startX + (Math.random() - 0.5) * 260;
        const targetY = window.innerHeight * 0.12 + Math.random() * (window.innerHeight * 0.28);
        rocketsRef.current.push(
          new HunterComet(startX, startY - 20, targetX, targetY, color, (ex, ey, c) => {
            triggerSkyFlash(ex, ey, c, 0.45, 180);
            soundManager.playExplosion(0, 0.5);
            triggerHaptic(20);
            for (let i = 0; i < 35; i++) {
              const a = Math.random() * Math.PI * 2;
              const spd = 2.0 + Math.random() * 4.0;
              particlesRef.current.push(
                new Particle(ex, ey, Math.cos(a) * spd, Math.sin(a) * spd, c, {
                  decay: 0.03,
                  radius: 1.8,
                  gravity: 0.05,
                  twinkle: true,
                })
              );
            }
          })
        );
      },
      [triggerSkyFlash]
    );

    // Handle touch/click point for selected cracker
    const handleTriggerPoint = (x, y) => {
      soundManager.unlockAudio();
      if (onInteraction) onInteraction();

      if (crackerType === 'anaar') {
        specialCrackersRef.current.push(new AnaarFountain(x, y));
      } else if (crackerType === 'chakri') {
        specialCrackersRef.current.push(new GroundChakri(x, y));
      } else if (crackerType === 'bomb') {
        specialCrackersRef.current.push(new SutliBomb(x, y, explodeSutliBomb));
      } else if (crackerType === 'ladi') {
        triggerLadiAt(x, y);
      } else if (crackerType === 'hunter') {
        specialCrackersRef.current.push(new MagicHunterTube(x, y, shootHunterComet));
      } else if (crackerType === 'sparkler') {
        sparklerPosRef.current = { x, y };
        soundManager.startSparklerSound();
      } else {
        // Rocket (default)
        launchRocket(x + (Math.random() - 0.5) * 40, canvasRef.current.height + 20, x, y, selectedPattern);
        lastDragLaunchRef.current = Date.now();
      }
    };

    const handlePointerDown = (e) => {
      if (e.pointerType === 'touch') return; // Handled by onTouchStart on touch devices
      isDraggingRef.current = true;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleTriggerPoint(x, y);
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (!isDraggingRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (crackerType === 'sparkler') {
        sparklerPosRef.current = { x, y };
        return;
      }

      if (crackerType === 'rocket') {
        const now = Date.now();
        if (now - lastDragLaunchRef.current > 120) {
          lastDragLaunchRef.current = now;
          launchRocket(x + (Math.random() - 0.5) * 40, canvasRef.current.height + 20, x, y, selectedPattern);
        }
      }
    };

    const handlePointerUp = (e) => {
      if (e.pointerType === 'touch') return;
      isDraggingRef.current = false;
      sparklerPosRef.current = null;
      soundManager.stopSparklerSound();
    };

    // Mobile touch handling (with multi-touch & drag rockets / sparkler)
    const handleTouchStart = (e) => {
      isDraggingRef.current = true;
      const rect = canvasRef.current.getBoundingClientRect();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        handleTriggerPoint(x, y);
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        if (crackerType === 'sparkler') {
          sparklerPosRef.current = { x, y };
        } else if (crackerType === 'rocket') {
          const now = Date.now();
          if (now - lastDragLaunchRef.current > 120) {
            lastDragLaunchRef.current = now;
            launchRocket(x + (Math.random() - 0.5) * 40, canvasRef.current.height + 20, x, y, selectedPattern);
          }
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length === 0) {
        isDraggingRef.current = false;
        sparklerPosRef.current = null;
        soundManager.stopSparklerSound();
      }
    };

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="fixed inset-0 z-10 w-full h-full cursor-crosshair select-none touch-none overscroll-none"
        title="Tap or Drag anywhere to ignite firecrackers!"
      />
    );
  }
);

export default FireworksCanvas;
