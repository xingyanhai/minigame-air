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
