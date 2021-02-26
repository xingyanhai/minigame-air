import Animation from '../base/animation'
import DataBus from '../databus'

// 敌机类型
const ENEMY_SIZE = {
  1: {
    width: 60,
    height: 60,
    src: 'images/enemy.png',
    bloodValue: 1
  },
  2: {
    width: 75,
    height: 75,
    src: 'images/enemy.png',
    bloodValue: 3
  },
  3: {
    width: 120,
    height: 120,
    src: 'images/enemy.png',
    bloodValue: 5
  }
}

const __ = {
  speed: Symbol('speed')
}

const databus = new DataBus()

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor(size) {
    super(ENEMY_SIZE[size].src, ENEMY_SIZE[size].width, ENEMY_SIZE[size].height)
    this.size = size
    this.initExplosionAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - ENEMY_SIZE[this.size].width)
    this.y = -this.height
    // 总血条值
    this.totalBlood = ENEMY_SIZE[this.size].bloodValue
    // 当前血条值
    this.currentBlood = ENEMY_SIZE[this.size].bloodValue

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    const frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(`${EXPLO_IMG_PREFIX + (i + 1)}.png`)
    }

    this.initFrames(frames)
  }

  // 播放爆炸动画
  playExplosionAnimation(index = 0, loop = false) {
    this.stop()
    this.isPlaying = true
    this.loop = loop
    this.index = index

    if (this.interval > 0 && this.count) {
      this[__.timer] = setInterval(
          this.frameLoop.bind(this),
          this.interval
      )
    }
  }

  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height) databus.removeEnemey(this)
  }
}
