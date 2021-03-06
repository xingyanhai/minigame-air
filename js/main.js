import Player from './player/index'
import Enemy from './npc/enemy'
import Supply from './npc/supply'
import Rocket from './npc/rocket'
import Particle from './npc/particle'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Util from "./npc/util";

const ctx = canvas.getContext('2d')
const databus = new DataBus()
const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.restart()
    this.initEvent()
  }
  // 绑定事件
  initEvent () {
    // 绑定暂停，开始事件
    this.startOrPauseEvent = ((e) => {
      e.preventDefault()

      const x = e.touches[0].clientX
      const y = e.touches[0].clientY

      const area = this.gameinfo.pauseStartBtnArea

      if (x >= area.startX
          && x <= area.endX
          && y >= area.startY
          && y <= area.endY) this.startOrPause()
    })
    canvas.addEventListener('touchstart', this.startOrPauseEvent)
  }
  // 重新开始
  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    // this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
  // 开始/暂停
  startOrPause () {
    databus.isPlaying = !databus.isPlaying
  }
  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 60 === 0) {
      let size = Util.rnd(1, 4)
      const enemy = databus.pool.getItemByClass(`enemy-${size}` , Enemy, size)
      enemy.init(3)
      databus.enemys.push(enemy)
    }
  }

  /**
   * 随着帧数变化的补给生成逻辑
   * 帧数取模定义成生成的频率
   */
  supplyGenerate() {
    if (databus.frame % 500 === 0) {
      const supply = databus.pool.getItemByClass('supply', Supply)
      supply.init(2)
      databus.supplys.push(supply)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    const that = this
    // 我方子弹是否碰到敌机
    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        const enemy = databus.enemys[i]

        if (enemy.isCollideWith(bullet)) {
          // 播放爆炸动画
          enemy.playAnimation()
          enemy.currentBlood --
          if (enemy.currentBlood <= 0) {
            enemy.visible = false
            // 分数增加量为总血量
            databus.score += enemy.totalBlood
          }
          // that.music.playExplosion()

          bullet.visible = false


          break
        }
      }
    })

    // 我方飞机是否碰到敌机
    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      const enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
    // 判断是否碰撞到补给，则加一颗子弹
    for (let i = 0, il = databus.supplys.length; i < il; i++) {
      const supply = databus.supplys[i]

      if (this.player.isCollideWith(supply)) {
        this.player.rocketCount ++
        supply.visible = false
        break
      }
    }

    // 判断是否烟火火箭爆炸
    for (var i = 0; i < databus.rockets.length; i++) {

      // calculate distance with Pythagoras
      // var distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));

      // random chance of 1% if rockets is above the middle
      var randomChance = databus.rockets[i].y < screenHeight * 2 / 3 ? Math.random() * 100 <= 1 : false;

      /* Explosion rules
       - 80% of screen
       - going down
       - close to the mouse
       - 1% chance of random explosion
       */
      let rocket = databus.rockets[i]
      if (rocket.y < screenHeight / 5 || rocket.vel.y >= 0 ||  randomChance) {
        // 爆炸
        // rocket.explode();
        // rocket.visible = false
        // this.music.playPa()
      } else {
        for (let j = 0, jl = databus.enemys.length; j < jl; j++) {
          const enemy = databus.enemys[j]

          if (enemy.isCollideWith(rocket)) {
            // 播放爆炸动画
            enemy.playAnimation()
            enemy.currentBlood --
            if (enemy.currentBlood <= 0) {
              enemy.visible = false
              // 分数增加量为总血量
              databus.score += enemy.totalBlood
            }
            // 爆炸
            rocket.explode();
            rocket.visible = false
            this.music.playPa()
            break
          }
        }
      }
    }

  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    const x = e.touches[0].clientX
    const y = e.touches[0].clientY

    const area = this.gameinfo.btnArea

    if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY) this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // this.bg.render(ctx)
    databus.bullets
      .concat(databus.enemys)
      .concat(databus.supplys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })
    databus.rockets
    .concat(databus.particles)
    .forEach((item) => {
      item.render(ctx)
    })

    this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)


    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
      canvas.removeEventListener(
          'touchstart',
          this.startOrPauseEvent
      )
    } else {
      this.gameinfo.renderGameBtns(ctx, databus)
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver) return
    if (databus.isPlaying) {
      databus.frame++
    } else { // 游戏暂停
      return
    }

    // this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.supplys)
      .concat(databus.rockets)
      .concat(databus.particles)
      .forEach((item) => {
        item.update()
      })
    console.log(
        `
        子弹：${databus.bullets.length}
        敌人：${databus.enemys.length}
        补给：${databus.supplys.length}
        火箭：${databus.rockets.length}
        微粒：${databus.particles.length}
        `
    )
    // 生成敌人
    this.enemyGenerate()
    // 生成补给
    this.supplyGenerate()


    // 全局碰撞检测
    this.collisionDetection()

    if (databus.frame % 30 === 0) {
      // 发射子弹
      // this.player.shoot()
      // this.music.playShoot()
      setTimeout(() => {
        for(let i = 0; i< this.player.rocketCount; i++) {
          setTimeout(() => {
            // 发射烟花
            this.player.rocketShoot()
            this.music.playJiu()
          }, 100 * i)
        }

      }, 100)
    }
  }

  // 实现游戏帧循环
  loop() {

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
