import DataBus from '../databus'
const databus = new DataBus()
// 爆炸粒子类
export default class Particle {
    constructor (x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.vel = {
            x: 0,
            y: 0 };

        this.shrink = .97;
        this.size = 2;

        this.resistance = 1;
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        this.fade = 0;
        this.color = 0;

        this.visible = true
    }
    init () {
        var angle = Math.random() * Math.PI * 2;

        // emulate 3D effect by using cosine and put more particles in the middle
        var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

        this.vel.x = Math.cos(angle) * speed;
        this.vel.y = Math.sin(angle) * speed;

        this.size = 10;

        this.gravity = 0.2;
        this.resistance = 0.92;
        this.shrink = Math.random() * 0.05 + 0.93;

        this.flick = true;
        this.color = Math.floor(Math.random() * 360 / 10) * 10;
    }
    update () {
        // apply resistance 乘以阻力
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;

        // gravity down 加上重力
        this.vel.y += this.gravity;

        // update position based on speed
        this.x += this.vel.x;
        this.y += this.vel.y;

        // shrink 乘以收缩
        this.size *= this.shrink;

        // fade out
        this.alpha -= this.fade;

        this.visible = this.alpha >= 0.1 && this.size >= 5;
        // 对象回收
        if (this.y > window.innerHeight || this.visible === false || this.x < 0 || this.x > window.innerWidth) {
            // databus.removeParticle(this)
        }
    }
    render (c) {
        if (!this.visible) {
            return;
        }

        c.save();

        c.globalCompositeOperation = 'lighter';

        var x = this.x,
            y = this.y,
            r = this.size / 2;

        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
        gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
        gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
        gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.x, this.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);

        c.closePath();
        c.fill();

        c.restore();
    }
}
