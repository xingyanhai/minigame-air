let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src = 'audio/bgm.mp3'

    this.shootAudio = new Audio()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio = new Audio()
    this.boomAudio.src = 'audio/boom.mp3'

    this.jiuAudio = new Audio()
    this.jiuAudio.src = 'audio/jiu.mp3'

    this.paAudio = new Audio()
    this.paAudio.src = 'audio/pa.mp3'

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  playJiu() {
    this.jiuAudio.currentTime = 0
    this.jiuAudio.play()
  }

  playPa() {
    this.paAudio.currentTime = 0
    this.paAudio.play()
  }
}
