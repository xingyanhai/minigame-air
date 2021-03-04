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

    this.jiuAudioList = [new Audio()]
    this.jiuAudioList[0].src = 'audio/jiu.mp3'

    this.paAudioList = [new Audio()]
    this.paAudioList[0].src = 'audio/pa.mp3'

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
    let jiuAudio = this.jiuAudioList.find(e => {
      return e.paused === true
    })
    if (!jiuAudio) {
      jiuAudio = new Audio()
      jiuAudio.src = 'audio/jiu.mp3'
      this.jiuAudioList.push(jiuAudio)
    }
    jiuAudio.currentTime = 0
    jiuAudio.play()
  }

  playPa() {
    let paAudio = this.paAudioList.find(e => {
      return e.paused === true
    })
    if (!paAudio) {
      paAudio = new Audio()
      paAudio.src = 'audio/pa.mp3'
      this.paAudioList.push(paAudio)
    }
    paAudio.currentTime = 0
    paAudio.play()
  }
}
