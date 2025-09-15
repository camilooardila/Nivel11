class SelfHealingMaterialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SelfHealingMaterialScene' });
    this.selectedAnswer = null;
    this.cracks = [];
    this.materialParticles = [];
  }

  create() {
    this.createBackground();
    this.createMaterialVisualization();
    this.createCracks();
    this.createQuizInterface();
    this.createAdvancedAnimations();
    
    // Iniciar sonido de fondo de pregunta
    this.playQuestionBackgroundSound();
  }

  createBackground() {
    // Fondo degradado científico
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x001122, 0x001122, 0x003366, 0x003366, 1);
    bg.fillRect(0, 0, 800, 600);

    // Partículas de fondo mejoradas con múltiples tipos
    for (let i = 0; i < 40; i++) {
      const particleType = Phaser.Math.Between(0, 2);
      let particle;
      
      if (particleType === 0) {
        // Partículas circulares básicas
        particle = this.add.circle(
          Phaser.Math.Between(0, 800),
          Phaser.Math.Between(0, 600),
          Phaser.Math.Between(1, 4),
          Phaser.Math.RND.pick([0x4488ff, 0x00ff88, 0x88ffaa, 0x66aaff]),
          Phaser.Math.FloatBetween(0.2, 0.5)
        );
      } else if (particleType === 1) {
        // Partículas estrella
        particle = this.add.star(
          Phaser.Math.Between(0, 800),
          Phaser.Math.Between(0, 600),
          5,
          Phaser.Math.Between(2, 6),
          Phaser.Math.Between(4, 10),
          Phaser.Math.RND.pick([0x00ffff, 0xffaa00, 0xff88ff]),
          Phaser.Math.FloatBetween(0.3, 0.6)
        );
      } else {
        // Partículas hexagonales
        particle = this.add.polygon(
          Phaser.Math.Between(0, 800),
          Phaser.Math.Between(0, 600),
          [0, -6, 5, -3, 5, 3, 0, 6, -5, 3, -5, -3],
          Phaser.Math.RND.pick([0x88ff44, 0xff4488, 0x4488ff]),
          Phaser.Math.FloatBetween(0.2, 0.4)
        );
      }
      
      // Animación de movimiento más fluida
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(150, 300),
        x: particle.x + Phaser.Math.Between(-50, 50),
        alpha: { from: particle.alpha, to: 0 },
        rotation: Phaser.Math.Between(0, Math.PI * 2),
        scaleX: { from: 1, to: Phaser.Math.FloatBetween(0.5, 1.5) },
        scaleY: { from: 1, to: Phaser.Math.FloatBetween(0.5, 1.5) },
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        ease: 'Sine.easeInOut',
        onRepeat: () => {
          particle.y = 650;
          particle.x = Phaser.Math.Between(0, 800);
          particle.alpha = Phaser.Math.FloatBetween(0.2, 0.6);
          particle.rotation = 0;
          particle.scaleX = 1;
          particle.scaleY = 1;
        }
      });
      
      // Efecto de pulsación sutil
      this.tweens.add({
        targets: particle,
        scaleX: { from: 1, to: 1.2 },
        scaleY: { from: 1, to: 1.2 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: Phaser.Math.Between(0, 2000)
      });
    }
  }

  createMaterialVisualization() {
    // Título de la fase con efectos mejorados
    const title = this.add.text(400, 30, '🔹 FASE 3: DESARROLLO DE MATERIALES AUTORREPARABLES', {
      fontSize: '20px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Efecto de brillo pulsante en el título
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.7 },
      scaleX: { from: 1, to: 1.02 },
      scaleY: { from: 1, to: 1.02 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Efecto de resplandor
    const titleGlow = this.add.text(400, 30, '🔹 FASE 3: DESARROLLO DE MATERIALES AUTORREPARABLES', {
      fontSize: '20px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ffff',
      alpha: 0.3
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: titleGlow,
      scaleX: { from: 1, to: 1.1 },
      scaleY: { from: 1, to: 1.1 },
      alpha: { from: 0.3, to: 0 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Power2.easeInOut'
    });

    // Panel del material con efectos mejorados
    const materialPanel = this.add.rectangle(400, 200, 500, 200, 0x2a2a2a, 0.9);
    materialPanel.setStrokeStyle(3, 0x00ff88);
    
    // Efecto de pulsación en el panel
    this.tweens.add({
      targets: materialPanel,
      scaleX: { from: 1, to: 1.01 },
      scaleY: { from: 1, to: 1.01 },
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Efecto de brillo en el borde
    this.tweens.add({
      targets: materialPanel,
      strokeAlpha: { from: 1, to: 0.3 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Power2.easeInOut'
    });

    // Título del material con brillo
    const materialLabel = this.add.text(400, 110, 'MATERIAL POLIMÉRICO INTELIGENTE', {
      fontSize: '16px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff88',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Efecto de brillo en la etiqueta
    this.tweens.add({
      targets: materialLabel,
      alpha: { from: 1, to: 0.6 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Crear estructura molecular visual
    this.createMolecularStructure();

    // Indicador de estado
    this.statusText = this.add.text(400, 320, 'ESTADO: GRIETA MICROSCÓPICA DETECTADA', {
      fontSize: '14px',
      fontFamily: 'Consolas, monospace',
      fill: '#ffaa00',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Efecto de parpadeo en el indicador
    this.tweens.add({
      targets: this.statusText,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  createMolecularStructure() {
    // Crear red molecular hexagonal mejorada
    const centerX = 400;
    const centerY = 200;
    const radius = 80;
    
    // Crear ondas de energía de fondo
    for (let wave = 0; wave < 3; wave++) {
      const energyWave = this.add.circle(centerX, centerY, 20 + wave * 30, 0x00ff88, 0.1);
      energyWave.setStrokeStyle(1, 0x00ff88, 0.3);
      
      this.tweens.add({
        targets: energyWave,
        scaleX: { from: 1, to: 3 },
        scaleY: { from: 1, to: 3 },
        alpha: { from: 0.3, to: 0 },
        duration: 3000,
        repeat: -1,
        delay: wave * 1000,
        ease: 'Power2.easeOut'
      });
    }
    
    // Nodos moleculares con efectos mejorados
    const nodes = [];
    const connections = [];
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Nodo principal
      const node = this.add.circle(x, y, 8, 0x00ff88, 0.8);
      node.setStrokeStyle(2, 0x88ffaa);
      nodes.push(node);
      
      // Halo de energía alrededor del nodo
      const halo = this.add.circle(x, y, 15, 0x00ff88, 0.2);
      halo.setStrokeStyle(1, 0x00ff88, 0.4);
      
      // Partículas orbitales
      for (let orbit = 0; orbit < 2; orbit++) {
        const orbital = this.add.circle(x, y, 2, 0x88ffaa, 0.7);
        
        this.tweens.add({
          targets: orbital,
          x: x + Math.cos(0) * (12 + orbit * 6),
          y: y + Math.sin(0) * (12 + orbit * 6),
          duration: 0
        });
        
        this.tweens.add({
          targets: orbital,
          rotation: Math.PI * 2,
          duration: 2000 + orbit * 500,
          repeat: -1,
          ease: 'Linear',
          onUpdate: () => {
            const currentAngle = orbital.rotation;
            orbital.x = x + Math.cos(currentAngle) * (12 + orbit * 6);
            orbital.y = y + Math.sin(currentAngle) * (12 + orbit * 6);
          }
        });
      }
      
      // Animación de pulsación mejorada
      this.tweens.add({
        targets: node,
        scaleX: { from: 1, to: 1.3 },
        scaleY: { from: 1, to: 1.3 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        delay: i * 300,
        ease: 'Sine.easeInOut'
      });
      
      // Animación del halo
      this.tweens.add({
        targets: halo,
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        alpha: { from: 0.2, to: 0.05 },
        duration: 2500,
        yoyo: true,
        repeat: -1,
        delay: i * 400,
        ease: 'Power2.easeInOut'
      });
      
      // Conexiones entre nodos con efectos de flujo
      if (i < 5) {
        const nextAngle = ((i + 1) * Math.PI * 2) / 6;
        const nextX = centerX + Math.cos(nextAngle) * radius;
        const nextY = centerY + Math.sin(nextAngle) * radius;
        
        const line = this.add.line(0, 0, x, y, nextX, nextY, 0x00ff88, 0.6);
        line.setLineWidth(3);
        connections.push(line);
        
        // Partícula de flujo de energía
        const energyFlow = this.add.circle(x, y, 3, 0x88ffaa, 0.9);
        
        this.tweens.add({
          targets: energyFlow,
          x: nextX,
          y: nextY,
          duration: 1500,
          repeat: -1,
          ease: 'Power2.easeInOut',
          delay: i * 200,
          onComplete: () => {
            energyFlow.x = x;
            energyFlow.y = y;
          }
        });
      }
    }
    
    // Conexión del último nodo con el primero
    const firstAngle = 0;
    const lastAngle = (5 * Math.PI * 2) / 6;
    const firstX = centerX + Math.cos(firstAngle) * radius;
    const firstY = centerY + Math.sin(firstAngle) * radius;
    const lastX = centerX + Math.cos(lastAngle) * radius;
    const lastY = centerY + Math.sin(lastAngle) * radius;
    
    const closingLine = this.add.line(0, 0, firstX, firstY, lastX, lastY, 0x00ff88, 0.6);
    closingLine.setLineWidth(3);
    connections.push(closingLine);
    
    // Partícula de flujo para la conexión final
    const finalFlow = this.add.circle(lastX, lastY, 3, 0x88ffaa, 0.9);
    this.tweens.add({
      targets: finalFlow,
      x: firstX,
      y: firstY,
      duration: 1500,
      repeat: -1,
      ease: 'Power2.easeInOut',
      delay: 1000,
      onComplete: () => {
        finalFlow.x = lastX;
        finalFlow.y = lastY;
      }
    });
    
    // Animación de las conexiones
    connections.forEach((connection, index) => {
      this.tweens.add({
        targets: connection,
        alpha: { from: 0.6, to: 0.9 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        delay: index * 150,
        ease: 'Sine.easeInOut'
      });
    });
    
    // Nodo central mejorado
    const centralNode = this.add.circle(centerX, centerY, 12, 0xffaa00, 0.9);
    centralNode.setStrokeStyle(3, 0xff8800);
    
    // Núcleo interno pulsante
    const innerCore = this.add.circle(centerX, centerY, 6, 0xff6600, 0.8);
    
    // Anillos de energía alrededor del núcleo
    for (let ring = 0; ring < 3; ring++) {
      const energyRing = this.add.circle(centerX, centerY, 20 + ring * 8, 0xffaa00, 0.1);
      energyRing.setStrokeStyle(1, 0xffaa00, 0.3);
      
      this.tweens.add({
        targets: energyRing,
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        alpha: { from: 0.3, to: 0 },
        duration: 2000,
        repeat: -1,
        delay: ring * 600,
        ease: 'Power2.easeOut'
      });
    }
    
    // Animaciones del nodo central
    this.tweens.add({
      targets: centralNode,
      rotation: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      ease: 'Linear'
    });
    
    this.tweens.add({
      targets: innerCore,
      scaleX: { from: 1, to: 1.4 },
      scaleY: { from: 1, to: 1.4 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createCracks() {
    // Crear grietas microscópicas mejoradas
    const crackPaths = [
      { startX: 350, startY: 180, endX: 380, endY: 200 },
      { startX: 420, startY: 190, endX: 450, endY: 210 },
      { startX: 370, startY: 220, endX: 390, endY: 240 },
      { startX: 330, startY: 210, endX: 360, endY: 230 },
      { startX: 440, startY: 170, endX: 470, endY: 190 }
    ];

    crackPaths.forEach((path, index) => {
      // Crear grieta principal
      const crack = this.add.line(
        0, 0,
        path.startX, path.startY,
        path.endX, path.endY,
        0xff4444, 0.9
      );
      crack.setLineWidth(4);
      
      // Crear ramificaciones de la grieta
      const branch1 = this.add.line(
        0, 0,
        path.startX + 10, path.startY + 5,
        path.startX + 20, path.startY - 8,
        0xff6666, 0.7
      );
      branch1.setLineWidth(2);
      
      const branch2 = this.add.line(
        0, 0,
        path.endX - 8, path.endY - 3,
        path.endX + 5, path.endY + 12,
        0xff6666, 0.7
      );
      branch2.setLineWidth(2);
      
      // Efecto de crecimiento de grieta
      [crack, branch1, branch2].forEach((element, branchIndex) => {
        element.setScale(0);
        this.tweens.add({
          targets: element,
          scaleX: 1,
          scaleY: 1,
          duration: 1200,
          delay: index * 500 + branchIndex * 200,
          ease: 'Power2.easeOut'
        });
      });
      
      // Efecto de pulsación mejorado
      this.tweens.add({
        targets: crack,
        alpha: { from: 0.9, to: 0.4 },
        scaleX: { from: 1, to: 1.15 },
        scaleY: { from: 1, to: 1.15 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        delay: index * 300,
        ease: 'Sine.easeInOut'
      });
      
      // Efecto de ondulación en las ramificaciones
      [branch1, branch2].forEach((branch, branchIndex) => {
        this.tweens.add({
          targets: branch,
          alpha: { from: 0.7, to: 0.2 },
          rotation: { from: 0, to: 0.1 },
          duration: 1000,
          yoyo: true,
          repeat: -1,
          delay: index * 400 + branchIndex * 150,
          ease: 'Sine.easeInOut'
        });
      });
      
      this.cracks.push(crack, branch1, branch2);
    });
  }

  createQuizInterface() {
    // Pregunta principal
    this.add.text(400, 380, '📢 El material ha sufrido una grieta microscópica. ¿Cómo debe responder?', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // Opciones de respuesta
    const options = [
      { text: '(A) Generar calor y presión para fusionar la grieta.', correct: true },
      { text: '(B) Dejar la grieta abierta para evitar más daños.', correct: false },
      { text: '(C) Reforzar la grieta con más material sin sellarla.', correct: false },
      { text: '(D) Aplicar un sistema de vibración para dispersar la grieta.', correct: false }
    ];

    options.forEach((option, index) => {
      const y = 430 + (index * 40);
      
      // Botón de opción
      const button = this.add.rectangle(400, y, 650, 35, 0x333333, 0.8);
      button.setStrokeStyle(2, 0x555555);
      button.setInteractive();
      
      // Texto de la opción
      const optionText = this.add.text(400, y, option.text, {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff'
      }).setOrigin(0.5);
      
      // Animación de entrada
      button.setScale(0);
      optionText.setScale(0);
      
      this.tweens.add({
        targets: [button, optionText],
        scaleX: 1,
        scaleY: 1,
        duration: 600,
        delay: index * 150,
        ease: 'Back.easeOut'
      });
      
      // Eventos de interacción mejorados con sonidos
      button.on('pointerover', () => {
        if (!this.selectedAnswer) {
          // Sonido suave de hover
          this.playHoverSound();
          
          this.tweens.add({
            targets: button,
            scaleX: 1.05,
            scaleY: 1.05,
            fillColor: 0x444444,
            duration: 200,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: optionText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 200,
            ease: 'Power2.easeOut'
          });
          
          button.setStrokeStyle(2, 0x00ff88);
          
          // Efecto de brillo sutil
          const glowEffect = this.add.rectangle(400, y, 650, 35, 0x00ff88, 0.1);
          glowEffect.setDepth(-1);
          
          this.tweens.add({
            targets: glowEffect,
            alpha: { from: 0.1, to: 0 },
            scaleX: { from: 1, to: 1.1 },
            scaleY: { from: 1, to: 1.1 },
            duration: 300,
            ease: 'Power2.easeOut',
            onComplete: () => glowEffect.destroy()
          });
        }
      });
      
      button.on('pointerout', () => {
        if (!this.selectedAnswer) {
          this.tweens.add({
            targets: button,
            scaleX: 1,
            scaleY: 1,
            fillColor: 0x333333,
            duration: 200,
            ease: 'Power2.easeOut'
          });
          
          this.tweens.add({
            targets: optionText,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Power2.easeOut'
          });
          
          button.setStrokeStyle(2, 0x555555);
        }
      });
      
      button.on('pointerdown', () => {
        if (!this.selectedAnswer) {
          // Sonido de click
          this.playClickSound();
          
          // Animación de click con efectos mejorados
          this.tweens.add({
            targets: [button, optionText],
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 100,
            yoyo: true,
            ease: 'Power2.easeInOut',
            onComplete: () => {
              this.selectAnswer(index, option.correct, button, optionText);
            }
          });
          
          // Efecto de ondas al hacer click
          for (let i = 0; i < 3; i++) {
            const ripple = this.add.circle(400, y, 10, 0x00ff88, 0.3);
            ripple.setDepth(-1);
            
            this.tweens.add({
              targets: ripple,
              scaleX: 8 + i * 2,
              scaleY: 8 + i * 2,
              alpha: 0,
              duration: 600,
              delay: i * 100,
              ease: 'Power2.easeOut',
              onComplete: () => ripple.destroy()
            });
          }
        }
      });
    });
  }

  selectAnswer(index, isCorrect, button, text) {
    this.selectedAnswer = index;
    
    // Deshabilitar todas las opciones
    this.children.list.forEach(child => {
      if (child.type === 'Rectangle' && child.y > 400) {
        child.disableInteractive();
      }
    });
    
    if (isCorrect) {
      // Respuesta correcta
      button.setFillStyle(0x004400, 0.9);
      button.setStrokeStyle(3, 0x00ff00);
      text.setFill('#00ff00');
      
      // MENSAJE DE FELICITACIONES CÁLIDO Y MOTIVADOR
      const congratsTitle = this.add.text(400, 200, '🌟 ¡Excelente trabajo! 🌟', {
        fontSize: '28px',
        fontFamily: 'Georgia, serif',
        fill: '#ffd700',
        fontWeight: 'bold',
        stroke: '#ff9500',
        strokeThickness: 2
      }).setOrigin(0.5);
      
      const epicTitle = this.add.text(400, 240, '💫 Has demostrado gran conocimiento científico 💫', {
        fontSize: '20px',
        fontFamily: 'Georgia, serif',
        fill: '#87ceeb',
        fontWeight: 'bold',
        stroke: '#4682b4',
        strokeThickness: 2
      }).setOrigin(0.5);
      
      // Crear múltiples capas de resplandor épico
      const glowTitle1 = this.add.text(400, 200, '🏆 ¡MISIÓN COMPLETADA CON ÉXITO! 🏆', {
        fontSize: '32px',
        fontFamily: 'Orbitron',
        fill: '#ffdd00',
        alpha: 0.4
      }).setOrigin(0.5);
      
      const glowTitle2 = this.add.text(400, 200, '🏆 ¡MISIÓN COMPLETADA CON ÉXITO! 🏆', {
        fontSize: '32px',
        fontFamily: 'Orbitron',
        fill: '#ffffff',
        alpha: 0.3
      }).setOrigin(0.5);
      
      const glowEpic1 = this.add.text(400, 240, '⭐ ¡ERES UN CIENTÍFICO EXCEPCIONAL! ⭐', {
        fontSize: '24px',
        fontFamily: 'Orbitron',
        fill: '#00ff88',
        alpha: 0.4
      }).setOrigin(0.5);
      
      const glowEpic2 = this.add.text(400, 240, '⭐ ¡ERES UN CIENTÍFICO EXCEPCIONAL! ⭐', {
        fontSize: '24px',
        fontFamily: 'Orbitron',
        fill: '#ffffff',
        alpha: 0.3
      }).setOrigin(0.5);
      
      const successMessage = this.add.text(400, 280, '🌸 El material se ha regenerado completamente 🌸', {
        fontSize: '18px',
        fontFamily: 'Georgia, serif',
        fill: '#98fb98',
        fontWeight: 'normal',
        stroke: '#228b22',
        strokeThickness: 1
      }).setOrigin(0.5);
      
      const achievementMessage = this.add.text(400, 310, '🏅 Has completado esta etapa con éxito 🏅', {
        fontSize: '16px',
        fontFamily: 'Georgia, serif',
        fill: '#dda0dd',
        fontWeight: 'normal',
        stroke: '#9370db',
        strokeThickness: 1
      }).setOrigin(0.5);
      
      const nextPhaseMessage = this.add.text(400, 340, '✨ Continuando hacia la siguiente aventura... ✨', {
        fontSize: '16px',
        fontFamily: 'Georgia, serif',
        fill: '#f0e68c',
        fontStyle: 'italic',
        fontWeight: 'normal',
        stroke: '#daa520',
        strokeThickness: 1
      }).setOrigin(0.5);
      
      // EFECTOS DE SONIDO ÉPICOS
      // Crear sonidos usando Web Audio API
      this.playVictorySound();
      this.time.delayedCall(500, () => this.playAchievementSound());
      this.time.delayedCall(1000, () => this.playSuccessChime());
      
      // Efectos de celebración ESPECTACULARES
      congratsTitle.setScale(0);
      epicTitle.setScale(0);
      glowTitle1.setScale(0);
      glowTitle2.setScale(0);
      glowEpic1.setScale(0);
      glowEpic2.setScale(0);
      successMessage.setAlpha(0);
      achievementMessage.setAlpha(0);
      nextPhaseMessage.setAlpha(0);
      
      // Animación explosiva del título principal
      this.tweens.add({
        targets: congratsTitle,
        scaleX: 1,
        scaleY: 1,
        rotation: 0.1,
        duration: 1200,
        ease: 'Elastic.easeOut'
      });
      
      // Animación del título épico
      this.tweens.add({
        targets: epicTitle,
        scaleX: 1,
        scaleY: 1,
        rotation: -0.05,
        duration: 1000,
        delay: 300,
        ease: 'Back.easeOut'
      });
      
      // Animaciones de resplandor épico
      this.tweens.add({
        targets: glowTitle1,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 1300,
        delay: 200,
        ease: 'Power2.easeOut'
      });
      
      this.tweens.add({
        targets: glowTitle2,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 1500,
        delay: 400,
        ease: 'Power2.easeOut'
      });
      
      this.tweens.add({
        targets: glowEpic1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 1100,
        delay: 500,
        ease: 'Power2.easeOut'
      });
      
      this.tweens.add({
        targets: glowEpic2,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 1300,
        delay: 700,
        ease: 'Power2.easeOut'
      });
      
      // Animación de los mensajes con rebote épico
      this.tweens.add({
        targets: successMessage,
        alpha: 1,
        y: successMessage.y - 20,
        scaleX: { from: 0.7, to: 1 },
        scaleY: { from: 0.7, to: 1 },
        duration: 900,
        delay: 800,
        ease: 'Bounce.easeOut'
      });
      
      this.tweens.add({
        targets: achievementMessage,
        alpha: 1,
        scaleX: { from: 0.3, to: 1 },
        scaleY: { from: 0.3, to: 1 },
        rotation: { from: 0.2, to: 0 },
        duration: 800,
        delay: 1200,
        ease: 'Elastic.easeOut'
      });
      
      this.tweens.add({
        targets: nextPhaseMessage,
        alpha: 1,
        scaleX: { from: 0.4, to: 1 },
        scaleY: { from: 0.4, to: 1 },
        duration: 700,
        delay: 1600,
        ease: 'Back.easeOut'
      });
      
      // Efecto de brillo pulsante continuo en los títulos
      this.tweens.add({
        targets: congratsTitle,
        alpha: { from: 1, to: 0.7 },
        scaleX: { from: 1, to: 1.08 },
        scaleY: { from: 1, to: 1.08 },
        duration: 900,
        yoyo: true,
        repeat: -1,
        delay: 1400,
        ease: 'Sine.easeInOut'
      });
      
      this.tweens.add({
        targets: epicTitle,
        alpha: { from: 1, to: 0.6 },
        scaleX: { from: 1, to: 1.06 },
        scaleY: { from: 1, to: 1.06 },
        duration: 1100,
        yoyo: true,
        repeat: -1,
        delay: 1600,
        ease: 'Sine.easeInOut'
      });
      
      // Efecto de ondas de resplandor épico
      this.tweens.add({
        targets: [glowTitle1, glowTitle2],
        alpha: { from: 0.4, to: 0 },
        scaleX: { from: 1, to: 2.2 },
        scaleY: { from: 1, to: 2.2 },
        duration: 2200,
        yoyo: true,
        repeat: -1,
        delay: 1700,
        ease: 'Power2.easeOut'
      });
      
      this.tweens.add({
        targets: [glowEpic1, glowEpic2],
        alpha: { from: 0.4, to: 0 },
        scaleX: { from: 1, to: 2 },
        scaleY: { from: 1, to: 2 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        delay: 1900,
        ease: 'Power2.easeOut'
      });
      
      // Efectos de pulsación en los mensajes
      this.tweens.add({
        targets: successMessage,
        alpha: { from: 1, to: 0.8 },
        scaleX: { from: 1, to: 1.03 },
        scaleY: { from: 1, to: 1.03 },
        duration: 1200,
        yoyo: true,
        repeat: -1,
        delay: 2000,
        ease: 'Sine.easeInOut'
      });
      
      this.tweens.add({
        targets: achievementMessage,
        rotation: { from: -0.02, to: 0.02 },
        scaleX: { from: 1, to: 1.02 },
        scaleY: { from: 1, to: 1.02 },
        duration: 1400,
        yoyo: true,
        repeat: -1,
        delay: 2200,
        ease: 'Sine.easeInOut'
      });
      
      // Efecto de rotación sutil en el mensaje de siguiente fase
      this.tweens.add({
        targets: nextPhaseMessage,
        rotation: { from: -0.03, to: 0.03 },
        alpha: { from: 1, to: 0.9 },
        duration: 1600,
        yoyo: true,
        repeat: -1,
        delay: 2400,
        ease: 'Sine.easeInOut'
      });
      
      // Partículas de celebración ESPECTACULARES
      for (let i = 0; i < 30; i++) {
        this.time.delayedCall(500 + i * 50, () => {
          const celebParticle = this.add.circle(
            Phaser.Math.Between(100, 700),
            700,
            Phaser.Math.Between(4, 12),
            Phaser.Math.RND.pick([0x00ff88, 0xffaa00, 0x00ffff, 0xff4488, 0x88ff44]),
            0.9
          );
          
          // Agregar brillo a las partículas
          celebParticle.setStrokeStyle(2, 0xffffff, 0.8);
          
          this.tweens.add({
            targets: celebParticle,
            y: Phaser.Math.Between(400, 550),
            x: celebParticle.x + Phaser.Math.Between(-100, 100),
            alpha: 0,
            scaleX: { from: 1, to: 0.1 },
            scaleY: { from: 1, to: 0.1 },
            rotation: Phaser.Math.Between(0, Math.PI * 4),
            duration: 2500,
            ease: 'Power3.easeOut',
            onComplete: () => celebParticle.destroy()
          });
        });
      }
      
      // Fuegos artificiales de partículas
      for (let j = 0; j < 5; j++) {
        this.time.delayedCall(800 + j * 300, () => {
          const centerX = Phaser.Math.Between(200, 600);
          const centerY = Phaser.Math.Between(300, 500);
          
          for (let k = 0; k < 12; k++) {
            const angle = (k * Math.PI * 2) / 12;
            const fireworkParticle = this.add.circle(
              centerX,
              centerY,
              Phaser.Math.Between(2, 6),
              Phaser.Math.RND.pick([0x00ff88, 0xffaa00, 0x00ffff, 0xff8844]),
              1
            );
            
            this.tweens.add({
              targets: fireworkParticle,
              x: centerX + Math.cos(angle) * Phaser.Math.Between(50, 120),
              y: centerY + Math.sin(angle) * Phaser.Math.Between(50, 120),
              alpha: 0,
              scaleX: { from: 1, to: 0 },
              scaleY: { from: 1, to: 0 },
              duration: 1500,
              ease: 'Power2.easeOut',
              onComplete: () => fireworkParticle.destroy()
            });
          }
        });
      }
      
      // Estrellas brillantes cayendo
      for (let s = 0; s < 20; s++) {
        this.time.delayedCall(1200 + s * 80, () => {
          const star = this.add.star(
            Phaser.Math.Between(0, 800),
            -20,
            5,
            Phaser.Math.Between(8, 15),
            Phaser.Math.Between(4, 8),
            Phaser.Math.RND.pick([0xffff00, 0x00ffff, 0xff88ff]),
            1
          );
          
          this.tweens.add({
            targets: star,
            y: Phaser.Math.Between(500, 650),
            x: star.x + Phaser.Math.Between(-30, 30),
            rotation: Math.PI * 4,
            alpha: { from: 1, to: 0 },
            scaleX: { from: 1, to: 0.3 },
            scaleY: { from: 1, to: 0.3 },
            duration: 3000,
            ease: 'Power2.easeInOut',
            onComplete: () => star.destroy()
          });
        });
      }
      
      this.time.delayedCall(1000, () => {
        this.showSuccessMessage();
        this.healMaterial();
      });
      
      this.time.delayedCall(4000, () => {
        this.showCorrectSolution();
      });
      
      // Transición automática a la siguiente escena después de 8 segundos
      this.time.delayedCall(8000, () => {
        this.playTransitionSound();
        this.transitionToNextScene();
      });
    } else {
      // Respuesta incorrecta
      button.setFillStyle(0x440000, 0.9);
      button.setStrokeStyle(3, 0xff0000);
      text.setFill('#ff0000');
      
      this.time.delayedCall(1000, () => {
        this.showErrorMessage();
        this.expandCracks();
      });
      
      this.time.delayedCall(3000, () => {
        this.resetQuizForRetry();
      });
    }
  }

  healMaterial() {
    // Sonido de curación
    this.playTransitionSound();
    
    // Onda de curación inicial
    const healingWave = this.add.circle(400, 200, 8, 0x00ff88, 0.4);
    healingWave.setStrokeStyle(4, 0x44ff88, 0.8);
    
    this.tweens.add({
      targets: healingWave,
      scaleX: 20,
      scaleY: 20,
      alpha: 0,
      duration: 2500,
      ease: 'Power2.easeOut',
      onComplete: () => healingWave.destroy()
    });
    
    // Efecto de curación de grietas mejorado
    this.cracks.forEach((crack, index) => {
      // Aura de curación antes del proceso
      const healingAura = this.add.circle(crack.x, crack.y, 25, 0x88ffaa, 0.3);
      healingAura.setStrokeStyle(2, 0x00ff88, 0.6);
      
      this.tweens.add({
        targets: healingAura,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: 1800,
        delay: index * 150,
        ease: 'Power2.easeOut',
        onComplete: () => healingAura.destroy()
      });
      
      // Partículas de curación espectaculares
      for (let i = 0; i < 20; i++) {
        const particleType = Phaser.Math.Between(0, 2);
        let healParticle;
        
        if (particleType === 0) {
          // Partículas de luz cristalina
          healParticle = this.add.circle(
            crack.x + Phaser.Math.Between(-40, 40),
            crack.y + Phaser.Math.Between(-40, 40),
            Phaser.Math.Between(4, 8),
            Phaser.Math.RND.pick([0x00ff88, 0x44ff44, 0x88ffaa, 0xaaffcc]),
            0.9
          );
          healParticle.setStrokeStyle(1, 0xffffff, 0.7);
        } else if (particleType === 1) {
          // Estrellas de curación
          healParticle = this.add.star(
            crack.x + Phaser.Math.Between(-40, 40),
            crack.y + Phaser.Math.Between(-40, 40),
            6,
            Phaser.Math.Between(4, 7),
            Phaser.Math.Between(8, 12),
            0x66ffaa,
            0.8
          );
        } else {
          // Hexágonos moleculares
          healParticle = this.add.polygon(
            crack.x + Phaser.Math.Between(-40, 40),
            crack.y + Phaser.Math.Between(-40, 40),
            [0, -6, 5, -3, 5, 3, 0, 6, -5, 3, -5, -3],
            0x88ffcc,
            0.8
          );
        }
        
        // Animación convergente hacia la grieta
        this.tweens.add({
          targets: healParticle,
          x: crack.x,
          y: crack.y,
          alpha: 0,
          scaleX: { from: 1, to: 0.1 },
          scaleY: { from: 1, to: 0.1 },
          rotation: Phaser.Math.Between(0, Math.PI * 3),
          duration: 1800,
          delay: index * 100 + i * 40,
          ease: 'Power2.easeInOut',
          onComplete: () => healParticle.destroy()
        });
      }
      
      // Cerrar grieta con efecto dramático
      this.tweens.add({
        targets: crack,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        rotation: Phaser.Math.FloatBetween(-0.5, 0.5),
        duration: 2000,
        delay: index * 250,
        ease: 'Elastic.easeIn',
        onComplete: () => {
          crack.destroy();
          
          // Explosión de curación al cerrar
          const healBurst = this.add.circle(crack.x, crack.y, 5, 0x00ff88, 0.8);
          healBurst.setStrokeStyle(3, 0xffffff, 1);
          
          this.tweens.add({
            targets: healBurst,
            scaleX: 6,
            scaleY: 6,
            alpha: 0,
            duration: 1000,
            ease: 'Power3.easeOut',
            onComplete: () => healBurst.destroy()
          });
          
          // Partículas de celebración
          for (let j = 0; j < 8; j++) {
            const angle = (j * Math.PI * 2) / 8;
            const celebParticle = this.add.circle(
              crack.x,
              crack.y,
              3,
              0xaaffcc,
              0.9
            );
            
            this.tweens.add({
              targets: celebParticle,
              x: crack.x + Math.cos(angle) * 40,
              y: crack.y + Math.sin(angle) * 40,
              alpha: 0,
              scaleX: 0.2,
              scaleY: 0.2,
              duration: 800,
              ease: 'Power2.easeOut',
              onComplete: () => celebParticle.destroy()
            });
          }
        }
      });
    });
    
    // Ondas de regeneración molecular
    for (let wave = 0; wave < 6; wave++) {
      this.time.delayedCall(wave * 300, () => {
        const molecularWave = this.add.circle(400, 200, 3, 0x66ffaa, 0.5);
        molecularWave.setStrokeStyle(2, 0x00ff88, 0.7);
        
        this.tweens.add({
          targets: molecularWave,
          scaleX: 12,
          scaleY: 12,
          alpha: 0,
          duration: 1800,
          ease: 'Power2.easeOut',
          onComplete: () => molecularWave.destroy()
        });
      });
    }
    
    // Actualizar estado con animación épica
    this.time.delayedCall(2500, () => {
      this.statusText.setText('ESTADO: MATERIAL COMPLETAMENTE REGENERADO');
      this.statusText.setFill('#00ff88');
      
      // Efecto de brillo pulsante en el texto
      this.tweens.add({
        targets: this.statusText,
        scaleX: { from: 1, to: 1.15 },
        scaleY: { from: 1, to: 1.15 },
        alpha: { from: 1, to: 0.8 },
        duration: 600,
        yoyo: true,
        repeat: 3,
        ease: 'Sine.easeInOut'
      });
      
      // Efecto de brillo en todo el material
      const materialGlow = this.add.rectangle(400, 200, 500, 200, 0x00ff88, 0.2);
      this.tweens.add({
        targets: materialGlow,
        alpha: { from: 0.2, to: 0 },
        scaleX: { from: 1, to: 1.2 },
        scaleY: { from: 1, to: 1.2 },
        duration: 1000,
        onComplete: () => materialGlow.destroy()
      });
    });
  }

  expandCracks() {
    // Sonido de error crítico
    this.playClickSound();
    
    // Onda de choque inicial
    const shockWave = this.add.circle(400, 200, 8, 0xff4444, 0.5);
    shockWave.setStrokeStyle(5, 0xff0000, 0.9);
    
    this.tweens.add({
      targets: shockWave,
      scaleX: 18,
      scaleY: 18,
      alpha: 0,
      duration: 2000,
      ease: 'Power2.easeOut',
      onComplete: () => shockWave.destroy()
    });
    
    // Efecto de expansión de grietas dramático
    this.cracks.forEach((crack, index) => {
      // Aura de peligro
      const dangerAura = this.add.circle(crack.x, crack.y, 20, 0xff6666, 0.4);
      dangerAura.setStrokeStyle(3, 0xff0000, 0.8);
      
      this.tweens.add({
        targets: dangerAura,
        scaleX: 4,
        scaleY: 4,
        alpha: 0,
        duration: 1500,
        delay: index * 120,
        ease: 'Power2.easeOut',
        onComplete: () => dangerAura.destroy()
      });
      
      // Expandir grieta con efectos adicionales
      this.tweens.add({
        targets: crack,
        scaleX: 2.8,
        scaleY: 2.8,
        alpha: 1,
        rotation: Phaser.Math.FloatBetween(-0.3, 0.3),
        duration: 1200,
        delay: index * 150,
        ease: 'Elastic.easeOut'
      });
      
      // Efecto de pulsación continua en las grietas
      this.time.delayedCall(index * 150 + 1200, () => {
        this.tweens.add({
          targets: crack,
          scaleX: { from: 2.8, to: 3.2 },
          scaleY: { from: 2.8, to: 3.2 },
          alpha: { from: 1, to: 0.7 },
          duration: 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      });
      
      // Crear grietas secundarias
      for (let branch = 0; branch < 3; branch++) {
        this.time.delayedCall(index * 200 + branch * 300, () => {
          const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const distance = Phaser.Math.Between(30, 60);
          
          const branchCrack = this.add.line(
            0, 0,
            crack.x, crack.y,
            crack.x + Math.cos(angle) * distance,
            crack.y + Math.sin(angle) * distance,
            0xff6666, 0.8
          );
          branchCrack.setLineWidth(4);
          branchCrack.setScale(0);
          
          this.tweens.add({
            targets: branchCrack,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 800,
            ease: 'Back.easeOut'
          });
          
          this.cracks.push(branchCrack);
        });
      }
      
      // Partículas de daño espectaculares
      for (let i = 0; i < 18; i++) {
        const particleType = Phaser.Math.Between(0, 2);
        let damageParticle;
        
        if (particleType === 0) {
          // Chispas de daño
          damageParticle = this.add.circle(
            crack.x + Phaser.Math.Between(-50, 50),
            crack.y + Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(4, 10),
            Phaser.Math.RND.pick([0xff4444, 0xff6666, 0xcc2222, 0xff8888]),
            0.9
          );
          damageParticle.setStrokeStyle(2, 0xff0000, 0.8);
        } else if (particleType === 1) {
          // Fragmentos angulares
          damageParticle = this.add.triangle(
            crack.x + Phaser.Math.Between(-50, 50),
            crack.y + Phaser.Math.Between(-50, 50),
            0, -8, -6, 6, 6, 6,
            0xff6666,
            0.8
          );
        } else {
          // Partículas de humo/polvo
          damageParticle = this.add.circle(
            crack.x + Phaser.Math.Between(-50, 50),
            crack.y + Phaser.Math.Between(-50, 50),
            Phaser.Math.Between(6, 14),
            0x666666,
            0.7
          );
        }
        
        // Efecto explosivo mejorado
        this.tweens.add({
          targets: damageParticle,
          x: damageParticle.x + Phaser.Math.Between(-120, 120),
          y: damageParticle.y + Phaser.Math.Between(-120, 120),
          alpha: 0,
          scaleX: { from: 1, to: 0.1 },
          scaleY: { from: 1, to: 0.1 },
          rotation: Phaser.Math.Between(-Math.PI * 2, Math.PI * 2),
          duration: 2200,
          delay: index * 100 + i * 60,
          ease: 'Power3.easeOut',
          onComplete: () => damageParticle.destroy()
        });
      }
    });
    
    // Ondas de destrucción
    for (let wave = 0; wave < 4; wave++) {
      this.time.delayedCall(wave * 400, () => {
        const destructionWave = this.add.circle(400, 200, 5, 0xff6666, 0.4);
        destructionWave.setStrokeStyle(3, 0xff0000, 0.7);
        
        this.tweens.add({
          targets: destructionWave,
          scaleX: 15,
          scaleY: 15,
          alpha: 0,
          duration: 1600,
          ease: 'Power2.easeOut',
          onComplete: () => destructionWave.destroy()
        });
      });
    }
    
    // Actualizar estado con efectos dramáticos
    this.statusText.setText('ESTADO: RIESGO CRÍTICO DE RUPTURA');
    this.statusText.setFill('#ff0000');
    
    // Efecto de alerta mejorado
    this.tweens.add({
      targets: this.statusText,
      scaleX: { from: 1, to: 1.2 },
      scaleY: { from: 1, to: 1.2 },
      alpha: { from: 1, to: 0.6 },
      duration: 400,
      yoyo: true,
      repeat: 8,
      ease: 'Power2.easeInOut'
    });
    
    // Efecto de vibración en la cámara
    this.cameras.main.shake(3000, 0.015);
    
    // Efecto de parpadeo rojo en toda la pantalla
    const dangerOverlay = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.1);
    this.tweens.add({
      targets: dangerOverlay,
      alpha: { from: 0.1, to: 0 },
      duration: 200,
      yoyo: true,
      repeat: 6,
      onComplete: () => dangerOverlay.destroy()
    });
  }

  showSuccessMessage() {
    const successPanel = this.add.rectangle(400, 180, 600, 150, 0x004400, 0.95);
    successPanel.setStrokeStyle(3, 0x00ff00, 1);
    
    const successTitle = this.add.text(400, 150, '✔️ ¡PROCESO CORRECTO!', {
      fontSize: '22px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const successMessage = this.add.text(400, 190, 'El material se autorrepara mediante calor y presión.\nLa grieta se cierra y el material brilla como nuevo.', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);
    
    [successPanel, successTitle, successMessage].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 500,
        delay: index * 100,
        ease: 'Back.easeOut'
      });
    });
    
    this.successElements = [successPanel, successTitle, successMessage];
  }

  showErrorMessage() {
    const errorPanel = this.add.rectangle(400, 300, 600, 150, 0x440000, 0.95);
    errorPanel.setStrokeStyle(3, 0xff0000, 1);
    
    const errorTitle = this.add.text(400, 270, '❌ RESPUESTA INCORRECTA', {
      fontSize: '22px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff0000',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const errorMessage = this.add.text(400, 310, 'La grieta se expande y compromete la integridad.\nRevisa la respuesta y vuelve a intentarlo.', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);
    
    [errorPanel, errorTitle, errorMessage].forEach((element, index) => {
      element.setAlpha(0);
      this.tweens.add({
        targets: element,
        alpha: 1,
        y: element.y - 10,
        duration: 500,
        delay: index * 100,
        ease: 'Back.easeOut'
      });
    });
    
    this.errorElements = [errorPanel, errorTitle, errorMessage];
  }

  resetQuizForRetry() {
    // Limpiar elementos de error
    if (this.errorElements) {
      this.errorElements.forEach(element => {
        this.tweens.add({
          targets: element,
          alpha: 0,
          duration: 300,
          onComplete: () => element.destroy()
        });
      });
      this.errorElements = null;
    }
    
    // Resetear grietas a estado original
    this.cracks.forEach(crack => {
      this.tweens.add({
        targets: crack,
        scaleX: 1,
        scaleY: 1,
        alpha: 0.8,
        duration: 500
      });
    });
    
    // Resetear estado
    this.statusText.setText('ESTADO: GRIETA MICROSCÓPICA DETECTADA');
    this.statusText.setFill('#ffaa00');
    this.selectedAnswer = null;
    
    // Restaurar botones
    this.children.list.forEach(child => {
      if (child.type === 'Rectangle' && child.y > 400) {
        child.setFillStyle(0x333333, 0.8);
        child.setStrokeStyle(2, 0x555555);
        child.setInteractive();
      }
    });
    
    // Restaurar colores de texto
    this.children.list.forEach(child => {
      if (child.type === 'Text' && child.y > 400) {
        child.setFill('#ffffff');
      }
    });
  }

  showCorrectSolution() {
    // Limpiar elementos de éxito
    if (this.successElements) {
      this.successElements.forEach(element => {
        this.tweens.add({
          targets: element,
          alpha: 0,
          duration: 500,
          onComplete: () => element.destroy()
        });
      });
      this.successElements = null;
    }
    
    // Transición suave a la siguiente escena
    this.time.delayedCall(2500, () => {
      // Efecto de fade out
      const fadeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
      
      this.tweens.add({
        targets: fadeOverlay,
        alpha: 1,
        duration: 1000,
        ease: 'Power2.easeInOut',
        onComplete: () => {
          // Efecto de partículas de transición
          for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
              Phaser.Math.Between(0, 800),
              Phaser.Math.Between(0, 600),
              Phaser.Math.Between(2, 6),
              0x00ff88,
              0.8
            );
            
            this.tweens.add({
              targets: particle,
              x: 400,
              y: 300,
              alpha: 0,
              scaleX: 0,
              scaleY: 0,
              duration: 800,
              delay: i * 40,
              ease: 'Power2.easeIn',
              onComplete: () => particle.destroy()
            });
          }
          
          // Cambiar a la siguiente escena después del efecto
          this.time.delayedCall(1000, () => {
            this.transitionToNextScene();
          });
        }
      });
    });
  }

  createAdvancedAnimations() {
    // Partículas de datos científicos mejoradas
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 250, () => {
        const dataText = this.add.text(
          Phaser.Math.Between(0, 800),
          600,
          Phaser.Math.RND.pick(['C₈H₈', 'H₂O', 'CO₂', 'N₂', 'O₂', 'CH₄', 'SiO₂', 'Al₂O₃', 'Fe₂O₃']),
          {
            fontSize: Phaser.Math.Between(8, 12) + 'px',
            fontFamily: 'Consolas, monospace',
            fill: Phaser.Math.RND.pick(['#4488ff', '#66aaff', '#88ccff']),
            alpha: Phaser.Math.Between(0.3, 0.6)
          }
        );
        
        // Movimiento ondulante
        this.tweens.add({
          targets: dataText,
          y: -50,
          x: dataText.x + Phaser.Math.Between(-50, 50),
          alpha: { from: dataText.alpha, to: 0 },
          rotation: Phaser.Math.Between(-0.2, 0.2),
          scaleX: { from: 1, to: 0.5 },
          scaleY: { from: 1, to: 0.5 },
          duration: Phaser.Math.Between(5000, 10000),
          ease: 'Sine.easeInOut',
          onComplete: () => dataText.destroy()
        });
      });
    }
    
    // Efecto de ondas energéticas
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        const energyWave = this.add.circle(400, 200, 10, 0x00ff88, 0.3);
        energyWave.setStrokeStyle(2, 0x00ff88, 0.6);
        
        this.tweens.add({
          targets: energyWave,
          scaleX: 8,
          scaleY: 8,
          alpha: 0,
          duration: 2000,
          ease: 'Power2.easeOut',
          onComplete: () => energyWave.destroy()
        });
      },
      loop: true
    });
  }

  // MÉTODOS DE SONIDO ÉPICOS Y AMENOS
  playVictorySound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Sonido de victoria épico con armonías
      const createOscillator = (freq, type = 'triangle', gain = 0.2) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
        
        return { oscillator, gainNode };
      };
      
      // Secuencia de acordes triunfales con armonías
      const chords = [
        [523.25, 659.25, 783.99], // C mayor
        [587.33, 739.99, 880.00], // D mayor
        [659.25, 830.61, 987.77], // E mayor
        [1046.50, 1318.51, 1567.98] // C mayor octava alta
      ];
      
      chords.forEach((chord, chordIndex) => {
        setTimeout(() => {
          const oscillators = [];
          
          chord.forEach((freq, noteIndex) => {
            const { oscillator, gainNode } = createOscillator(freq, 'triangle', 0.15 - noteIndex * 0.02);
            
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
            
            oscillator.start();
            oscillators.push(oscillator);
            
            setTimeout(() => {
              try { oscillator.stop(); } catch (e) {}
            }, 450);
          });
        }, chordIndex * 200);
      });
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  playAchievementSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Sonido de logro con efecto de cristal mágico
      const createSparkle = (freq, delay, duration = 0.3) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          const filter = audioContext.createBiquadFilter();
          
          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(800, audioContext.currentTime);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(freq * 2, audioContext.currentTime + duration);
          
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          
          oscillator.start();
          
          setTimeout(() => {
            try { oscillator.stop(); } catch (e) {}
          }, duration * 1000 + 50);
        }, delay);
      };
      
      // Cascada de cristales
      const frequencies = [800, 1000, 1200, 1500, 1800, 2200];
      frequencies.forEach((freq, index) => {
        createSparkle(freq, index * 80, 0.4);
      });
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  playSuccessChime() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Campanadas celestiales con reverb
      const createChime = (frequency, delay, duration = 1.2) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          const filter = audioContext.createBiquadFilter();
          
          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(3000, audioContext.currentTime);
          filter.Q.setValueAtTime(1, audioContext.currentTime);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          
          // Envolvente más suave y natural
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
          
          oscillator.start();
          
          setTimeout(() => {
            try { oscillator.stop(); } catch (e) {}
          }, duration * 1000 + 50);
        }, delay);
      };
      
      // Secuencia de campanadas más rica y armoniosa
      const melody = [
        { freq: 1046.50, delay: 0 },    // C6
        { freq: 1318.51, delay: 150 },  // E6
        { freq: 1567.98, delay: 300 },  // G6
        { freq: 2093.00, delay: 450 },  // C7
        { freq: 1760.00, delay: 600 },  // A6
        { freq: 2093.00, delay: 750 }   // C7 final
      ];
      
      melody.forEach(note => {
        createChime(note.freq, note.delay, 1.5);
      });
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  // NUEVOS SONIDOS PARA INTERACCIONES
  playHoverSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
      
      oscillator.start();
      
      setTimeout(() => {
        try { oscillator.stop(); } catch (e) {}
      }, 150);
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  playClickSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, audioContext.currentTime);
      
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      oscillator.start();
      
      setTimeout(() => {
        try { oscillator.stop(); } catch (e) {}
      }, 100);
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  playQuestionBackgroundSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Crear un sonido de fondo muy suave y dulce
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      const reverbGain = audioContext.createGain();
      
      // Configurar osciladores para un sonido muy suave y grave
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(130.81, audioContext.currentTime); // Do2 - muy grave
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(164.81, audioContext.currentTime); // Mi2 - muy grave
      oscillator3.type = 'sine';
      oscillator3.frequency.setValueAtTime(196.00, audioContext.currentTime); // Sol2 - muy grave
      
      // Filtro pasa bajos muy suave para eliminar asperezas
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(300, audioContext.currentTime);
      filterNode.Q.setValueAtTime(0.2, audioContext.currentTime);
      
      // Configurar volumen extremadamente bajo
       gainNode.gain.setValueAtTime(0, audioContext.currentTime);
       gainNode.gain.linearRampToValueAtTime(0.0005, audioContext.currentTime + 3.0);
      
      // Agregar reverb muy sutil
      reverbGain.gain.setValueAtTime(0.05, audioContext.currentTime);
      
      // Conectar nodos con reverb suave
      oscillator1.connect(filterNode);
      oscillator2.connect(filterNode);
      oscillator3.connect(filterNode);
      filterNode.connect(gainNode);
      filterNode.connect(reverbGain);
      gainNode.connect(audioContext.destination);
      reverbGain.connect(audioContext.destination);
      
      // Iniciar sonido con fade in más gradual
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator3.start(audioContext.currentTime);
      
      // Detener después de 30 segundos con fade out
      gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 29);
      oscillator1.stop(audioContext.currentTime + 30);
      oscillator2.stop(audioContext.currentTime + 30);
      oscillator3.stop(audioContext.currentTime + 30);
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }
  
  playTransitionSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Sonido de transición suave como viento
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.8);
      
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.8);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
      
      oscillator.start();
      
      setTimeout(() => {
        try { oscillator.stop(); } catch (e) {}
      }, 800);
      
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }

  transitionToNextScene() {
    console.log('Transicionando desde SelfHealingMaterialScene a scenaVideo4');
    
    // Sonido de transición
    this.playTransitionSound();
    
    // Efecto de desvanecimiento con partículas
    const fadeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
    
    // Partículas de transición
    for (let i = 0; i < 20; i++) {
      const transitionParticle = this.add.circle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.Between(3, 8),
        0x00ff88,
        0.8
      );
      
      this.tweens.add({
        targets: transitionParticle,
        x: 400,
        y: 300,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: 1000,
        delay: i * 50,
        ease: 'Power2.easeIn'
      });
    }
    
    // Desvanecimiento suave
    this.tweens.add({
      targets: fadeOverlay,
      alpha: 1,
      duration: 1200,
      ease: 'Power2.easeInOut',
      onComplete: () => {
        // Transición a la siguiente escena según el orden en game.js
        this.scene.start('scenaVideo4');
      }
    });
  }
}

window.SelfHealingMaterialScene = SelfHealingMaterialScene;