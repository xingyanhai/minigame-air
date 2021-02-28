import Animation from '../base/animation'
import DataBus from '../databus'
import Util from "./util";
// 敌机类型
const ENEMY_SIZE = {
  1: {
    width: 30,
    height: 20,
    src: `${Util.imgSrc}/enemy.png`,
    bloodValue: 1
  },
  2: {
    width: 60,
    height: 40,
    src: `${Util.imgSrc}/enemy.png`,
    bloodValue: 5
  },
  3: {
    width: 120,
    height: 80,
    src: `${Util.imgSrc}/enemy.png`,
    bloodValue: 10
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
  constructor(size = 3) {
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

    const EXPLO_IMG_PREFIX = `${Util.imgSrc}/explosion`
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(`${EXPLO_IMG_PREFIX + (i + 1)}.png`)
    }

    this.initFrames(frames)
  }


  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height) databus.removeEnemey(this)
  }
}
