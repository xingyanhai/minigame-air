import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.enemys = []
    this.supplys = []
    this.rockets = []
    this.particles = []
    this.animations = []
    this.gameOver = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    enemy.visible = false
    let index = this.enemys.findIndex(e => e === enemy)
    this.enemys.splice(index,1)

    this.pool.recover(`enemy-${enemy.size}`, enemy)
  }

  /**
   * 回收烟花火箭，进入对象池
   * 此后不进入帧循环
   */
  removeRocket(rocket) {
    rocket.visible = false
    let index = this.rockets.findIndex(e => e === rocket)
    this.rockets.splice(index,1)

    this.pool.recover('rocket', rocket)
  }

  /**
   * 回收烟花微粒，进入对象池
   * 此后不进入帧循环
   */
  removeParticle(particle) {
    particle.visible = false
    let index = this.particles.findIndex(e => e === particle)
    this.particles.splice(index,1)

    this.pool.recover('particle', particle)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    const temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
  /**
   * 回收补给，进入对象池
   * 此后不进入帧循环
   */
  removeSupply(bullet) {
    const temp = this.supplys.shift()

    temp.visible = false

    this.pool.recover('supply', bullet)
  }
}
