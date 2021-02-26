import Animation from '../base/animation'
import DataBus from '../databus'
import Util from './util'
const SUPPLY_IMG_SRC = 'images/hero.png'
const SUPPLY_WIDTH = 60
const SUPPLY_HEIGHT = 60

const __ = {
  speed: Symbol('speed-supply')
}

const databus = new DataBus()

export default class Supply extends Animation {
  constructor() {
    super(SUPPLY_IMG_SRC, SUPPLY_WIDTH, SUPPLY_HEIGHT)

    this.initSupplyAnimation()
  }

  init(speed) {
    this.x = Util.rnd(0, window.innerWidth - SUPPLY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }

  // 预定义补给的帧动画
  initSupplyAnimation() {
    const frames = []

    const EXPLO_IMG_PREFIX = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for (let i = 0; i < EXPLO_FRAME_COUNT; i++) {
      frames.push(`${EXPLO_IMG_PREFIX + (i + 1)}.png`)
    }

    this.initFrames(frames)
    // 补给自带动画,自动播放
    this.playAnimation()
  }


  // 播放预定的帧动画
  playAnimation(index = 0, loop = true) {
    // 动画播放的时候精灵图不再展示，播放帧动画的具体帧

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
    if (this.y > window.innerHeight + this.height) databus.removeSupply(this)
  }
}
