import Animation from '../base/animation'
import DataBus from '../databus'
import Util from './util'
import Sprite from "../base/sprite";
const SUPPLY_IMG_SRC = `${Util.imgSrc}/supply.png`
const SUPPLY_WIDTH = 20
const SUPPLY_HEIGHT = 25

const __ = {
  speed: Symbol('speed-supply')
}

const databus = new DataBus()

export default class Supply extends Sprite {
  constructor() {
    super(SUPPLY_IMG_SRC, SUPPLY_WIDTH, SUPPLY_HEIGHT)
  }

  init(speed) {
    this.x = Util.rnd(0, window.innerWidth - SUPPLY_WIDTH)
    this.y = -this.height

    this[__.speed] = speed

    this.visible = true
  }


  // 每一帧更新子弹位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height) databus.removeSupply(this)
  }
}
