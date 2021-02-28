import Sprite from '../base/sprite'
import DataBus from '../databus'
import Util from "../npc/util";
const BULLET_IMG_SRC = `${Util.imgSrc}/bullet.png`
const BULLET_WIDTH = 10
const BULLET_HEIGHT = 15

const __ = {
  speed: Symbol('speed')
}

const databus = new DataBus()

export default class Bullet extends Sprite {
  constructor() {
    super(BULLET_IMG_SRC, BULLET_WIDTH, BULLET_HEIGHT)
  }

  init(x, y, speed) {
    this.x = x
    this.y = y

    this[__.speed] = speed

    this.visible = true
  }

  // 每一帧更新子弹位置
  update() {
    this.y -= this[__.speed]
    // 子弹不在回收，因为会导致子弹重复的bug
    // 超出屏幕外回收自身
    // if (this.y < -this.height * 10) databus.removeBullets(this)
  }
}
