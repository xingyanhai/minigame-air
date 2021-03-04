// 火箭类
import DataBus from '../databus'
import Particle from './particle'
const databus = new DataBus()
export default class Rocket {
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
        this.explosionColor = 0;
    }
    static originalSize = 8
    init () {
        this.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
        this.vel.y = Math.random() * -3 - 4; // -4  ~  -7
        this.vel.x = Math.random() * 6 - 1; // -3 ~  3
        this.size = Rocket.originalSize;
        this.shrink = 0.999;
        this.gravity = 0.01;
    }
    // 爆炸
    explode () {
        var count = Math.random() * 10 + 80;

        for (var i = 0; i < count; i++) {
            const particle = databus.pool.getItemByClass('particle', Particle, this.x, this.y)
            particle.init()
            databus.particles.push(particle);
        }
    }
    update () {
        // apply resistance 乘以阻力
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;

        // gravity down 加上重力
        this.vel.y += this.gravity;

        // update position based on speed
        // this.x += this.vel.x;
        this.y += this.vel.y;

        // shrink 乘以收缩
        this.size *= this.shrink;

        // fade out
        this.alpha -= this.fade;

        this.visible = this.alpha >= 0.1 && this.size >= 1;

        // 对象回收
        if (this.y > window.innerHeight || this.visible === false || this.x < 0 || this.x > window.innerWidth) {
            databus.removeRocket(this)
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
        gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
        gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.x, this.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        c.restore();
    }
}
