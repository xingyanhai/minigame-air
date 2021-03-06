import Sprite from '../base/sprite'
import Bullet from './bullet'
import DataBus from '../databus'
import Util from "../npc/util";
import Rocket from '../npc/rocket'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight

// 玩家相关常量设置
const PLAYER_IMG_SRC = `${Util.imgSrc}/hero.png`
const PLAYER_WIDTH = 90
const PLAYER_HEIGHT = 60

const databus = new DataBus()

export default class Player extends Sprite {
  constructor() {
    super(PLAYER_IMG_SRC, PLAYER_WIDTH, PLAYER_HEIGHT)

    // 玩家默认处于屏幕底部居中位置
    this.x = screenWidth / 2 - this.width / 2
    this.y = screenHeight - this.height - 30

    // 用于在手指移动的时候标识手指是否已经在飞机上了
    this.touched = false

    this.bullets = []
    // 子弹数量
    this.bulletCount = 1
    // 子弹间隔
    this.bulletSpace = 2
    // 烟花子弹数量
    this.rocketCount = 3
    // 初始化事件监听
    this.initEvent()
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
   */
  checkIsFingerOnAir(x, y) {
    const deviation = 30

    return !!(x >= this.x - deviation
              && y >= this.y - deviation
              && x <= this.x + this.width + deviation
              && y <= this.y + this.height + deviation)
  }

  /**
   * 根据手指的位置设置飞机的位置
   * 保证手指处于飞机中间
   * 同时限定飞机的活动范围限制在屏幕中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let disX = x - this.width / 2
    let disY = y - this.height / 2

    if (disX < 0) disX = 0

    else if (disX > screenWidth - this.width) disX = screenWidth - this.width

    if (disY <= 0) disY = 0

    else if (disY > screenHeight - this.height) disY = screenHeight - this.height

    this.x = disX
    this.y = disY
  }

  /**
   * 玩家响应手指的触摸事件
   * 改变战机的位置
   */
  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      //
      if (this.checkIsFingerOnAir(x, y)) {
        this.touched = true

        this.setAirPosAcrossFingerPosZ(x, y)
      }
    }))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      if (this.touched) this.setAirPosAcrossFingerPosZ(x, y)
    }))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()

      this.touched = false
    }))
  }
  get maxBulletCount () {
    const bullet = databus.pool.getItemByClass('bullet', Bullet);
    return Math.ceil((screenWidth * 2 + this.bulletSpace) / (bullet.width + this.bulletSpace))
  }
  /**
   * 玩家射击操作
   * 射击时机由外部决定
   */
  shoot() {
    let count = (this.bulletCount < this.maxBulletCount ? this.bulletCount: this.maxBulletCount)
    for(let i = 0; i <count ; i++) {
      const bullet = databus.pool.getItemByClass('bullet', Bullet);
      // 我方飞机中点
      const middle = this.x + this.width / 2
      // 子弹间隔
      let bulletSpace = this.bulletSpace
      // 所有子弹总宽度
      const allBulletWidth = bullet.width * count + bulletSpace * (count - 1)

      const x = middle - allBulletWidth / 2 + i * (bullet.width + bulletSpace)
      bullet.init(
          x,
          this.y - 10,
          10
      )
      databus.bullets.push(bullet)
    }
  }
  /**
   * 玩家射击烟花操作
   * 射击时机由外部决定
   */
  rocketShoot() {
    const rocket = databus.pool.getItemByClass('rocket', Rocket, this.x + this.width / 2, this.y)
    rocket.init()
    databus.rockets.push(rocket);
  }

}
