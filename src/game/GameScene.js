import Phaser from 'phaser'

// Crime Scene Game Scene — interactive evidence board with Phaser 3
export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.evidence = []
    this.clickedEvidence = []
  }

  init(data) {
    this.caseData = data.case || {}
    this.evidence = data.evidence || []
  }

  create() {
    const { width, height } = this.scale

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0a)

    // Subtle grid
    for (let x = 0; x < width; x += 40) {
      this.add.line(0, x, 0, x, height, 0x1a1a1a, 0.3)
    }
    for (let y = 0; y < height; y += 40) {
      this.add.line(0, 0, y, width, y, 0x1a1a1a, 0.3)
    }

    // Title
    const title = this.add.text(width / 2, 30, 'CENA DO CRIME', {
      fontFamily: '"Special Elite", monospace',
      fontSize: '18px',
      color: '#c9a84c',
      letterSpacing: 6,
    }).setOrigin(0.5)

    // Crime scene description card
    const cardX = width / 2
    const cardY = 130
    this.add.rectangle(cardX, cardY, width - 60, 80, 0x111111, 0.9)
      .setStrokeStyle(1, 0xc9a84c, 0.5)

    const descText = this.add.text(cardX, cardY, this.caseData.crimeSceneDescription || 'Local do crime. Evidências espalhadas.', {
      fontFamily: '"Crimson Pro", serif',
      fontSize: '14px',
      color: '#f0ece3',
      align: 'center',
      wordWrap: { width: width - 100 },
    }).setOrigin(0.5)

    // Evidence hotspots
    const hotspotPositions = [
      { x: 0.2, y: 0.45, label: 'Pista 1' },
      { x: 0.5, y: 0.40, label: 'Pista 2' },
      { x: 0.8, y: 0.45, label: 'Pista 3' },
      { x: 0.35, y: 0.65, label: 'Pista 4' },
      { x: 0.65, y: 0.65, label: 'Pista 5' },
    ]

    hotspotPositions.forEach((pos, i) => {
      const hx = width * pos.x
      const hy = height * pos.y
      const evidence = this.evidence[i]

      // Pulsing circle
      const circle = this.add.circle(hx, hy, 22, 0xc41e3a, 0.15)
        .setStrokeStyle(2, 0xc41e3a, 0.8)
        .setInteractive({ useHandCursor: true })

      // Pulse animation
      this.tweens.add({
        targets: circle,
        scale: 1.3,
        alpha: 0.4,
        duration: 1200 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      // Label
      const label = this.add.text(hx, hy - 30, pos.label, {
        fontFamily: '"Special Elite", monospace',
        fontSize: '11px',
        color: '#c9a84c',
        letterSpacing: 2,
      }).setOrigin(0.5)

      // Tooltip on hover
      circle.on('pointerover', () => {
        circle.setFillStyle(0xc41e3a, 0.4)
        if (evidence) {
          this.showTooltip(hx, hy - 50, evidence.label, evidence.text)
        }
      })
      circle.on('pointerout', () => {
        circle.setFillStyle(0xc41e3a, 0.15)
        this.hideTooltip()
      })
      circle.on('pointerdown', () => {
        this.clickedEvidence.push(i)
        circle.setFillStyle(0xc9a84c, 0.6)
        playClick()
        // Camera flash effect
        this.cameras.main.flash(200, 201, 168, 76, false)
        // Emit event up to React
        this.events.emit('evidence-clicked', { index: i, evidence })
      })
    })

    // Red string connections (decorative)
    const lineGfx = this.add.graphics()
    lineGfx.lineStyle(1, 0xc41e3a, 0.2)
    hotspotPositions.slice(0, -1).forEach((pos, i) => {
      const x1 = width * pos.x
      const y1 = height * pos.y
      const x2 = width * hotspotPositions[i + 1].x
      const y2 = height * hotspotPositions[i + 1].y
      lineGfx.lineBetween(x1, y1, x2, y2)
    })

    // "Click evidence" hint
    this.add.text(width / 2, height - 30, 'CLIQUE NAS EVIDÊNCIAS PARA ANALISAR', {
      fontFamily: '"Special Elite", monospace',
      fontSize: '11px',
      color: '#444',
      letterSpacing: 2,
    }).setOrigin(0.5)
  }

  showTooltip(x, y, label, text) {
    this.hideTooltip()
    const w = 220, h = 60
    const bg = this.add.rectangle(x, y, w, h, 0x111111, 0.95)
      .setStrokeStyle(1, 0xc9a84c, 0.8)
    const lbl = this.add.text(x, y - 15, label, {
      fontFamily: '"Special Elite", monospace',
      fontSize: '11px',
      color: '#c9a84c',
    }).setOrigin(0.5)
    const txt = this.add.text(x, y + 8, text, {
      fontFamily: '"Crimson Pro", serif',
      fontSize: '11px',
      color: '#f0ece3',
      wordWrap: { width: w - 16 },
      align: 'center',
    }).setOrigin(0.5)
    this._tooltip = [bg, lbl, txt]
    this.tweens.add({
      targets: [bg, lbl, txt],
      alpha: { from: 0, to: 1 },
      duration: 200,
    })
  }

  hideTooltip() {
    if (this._tooltip) {
      this._tooltip.forEach(o => o.destroy())
      this._tooltip = null
    }
  }
}

// Standalone click sound factory
function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 1200
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } catch (e) {}
}

export const createGameInstance = (parentEl, caseData) => {
  const config = {
    type: Phaser.AUTO,
    width: Math.min(800, window.innerWidth - 32),
    height: 420,
    parent: parentEl,
    backgroundColor: '#0a0a0a',
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  }
  const game = new Phaser.Game(config)
  return game
}
