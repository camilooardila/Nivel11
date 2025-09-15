class ArduinoNanobotScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ArduinoNanobotScene' });
    this.selectedAnswer = null;
    this.codeBlocks = [];
    this.nanobots = [];
    this.regulatorBots = [];
    this.currentCompilationTween = null;
    this.compilationElements = [];
  }

  create() {
    this.createSounds();
    this.createBackground();
    this.createArduinoIDE();
    this.createCodeWithError();
    this.createQuizOptions();
    this.createAdvancedAnimations();
  }

  createSounds() {
    // Crear contexto de audio para sonidos sintéticos
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {
      typing: this.createTypingSound(),
      success: this.createSuccessSound(),
      error: this.createErrorSound(),
      compile: this.createCompileSound()
    };
  }

  createTypingSound() {
    return () => {
      // Crear el click característico del iPhone
      const clickOsc = this.audioContext.createOscillator();
      const clickGain = this.audioContext.createGain();
      
      // Crear filtro suave para sonido menos tedioso
       const clickFilter = this.audioContext.createBiquadFilter();
       clickFilter.type = 'lowpass';
       clickFilter.frequency.setValueAtTime(1500, this.audioContext.currentTime);
       clickFilter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
       
       // Frecuencia más suave y menos aguda (523 Hz - Do5)
       clickOsc.type = 'sine';
       clickOsc.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
      
      // Conectar el audio
      clickOsc.connect(clickGain);
      clickGain.connect(clickFilter);
      clickFilter.connect(this.audioContext.destination);
      
      // Envolvente muy rápida y precisa como iPhone
      const now = this.audioContext.currentTime;
      
      // Click muy suave y ameno
        clickGain.gain.setValueAtTime(0, now);
        clickGain.gain.linearRampToValueAtTime(0.08, now + 0.008); // Volumen más bajo y ataque más suave
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); // Caída más larga y gradual
       
       // Iniciar y detener con duración más suave
       clickOsc.start(now);
       clickOsc.stop(now + 0.08); // Duración ligeramente más larga
    };
  }

  createSuccessSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(784, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    };
  }

  createErrorSound() {
    return () => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.8);
    };
  }

  createCompileSound() {
    return () => {
      // Secuencia musical más elaborada para compilación
      const melody = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      
      melody.forEach((freq, i) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          const filter = this.audioContext.createBiquadFilter();
          
          oscillator.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          
          // Filtro resonante para sonido más rico
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq * 2, this.audioContext.currentTime);
          filter.Q.setValueAtTime(5, this.audioContext.currentTime);
          
          gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.2);
        }, i * 100);
      });
    };
  }

  createBackground() {
    // Fondo futurista tipo Arduino IDE
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1e1e1e, 0x1e1e1e, 0x2d2d30, 0x2d2d30, 1);
    bg.fillRect(0, 0, 800, 600);

    // Líneas de grid futuristas
    const grid = this.add.graphics();
    grid.lineStyle(1, 0x404040, 0.3);
    for (let i = 0; i < 800; i += 40) {
      grid.moveTo(i, 0);
      grid.lineTo(i, 600);
    }
    for (let i = 0; i < 600; i += 40) {
      grid.moveTo(0, i);
      grid.lineTo(800, i);
    }
    grid.strokePath();

    // Partículas de fondo
    this.createBackgroundParticles();
  }

  createBackgroundParticles() {
    // Partículas flotantes con movimiento orbital
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(100, 500),
        Phaser.Math.Between(1, 3),
        Phaser.Math.RND.pick([0x00ffff, 0x0088ff, 0x88ddff]),
        Phaser.Math.FloatBetween(0.2, 0.6)
      );
      
      // Movimiento orbital complejo
      const centerX = particle.x;
      const centerY = particle.y;
      const radius = Phaser.Math.Between(20, 80);
      const speed = Phaser.Math.FloatBetween(0.5, 2);
      
      this.tweens.add({
        targets: particle,
        angle: 360,
        duration: Phaser.Math.Between(4000, 8000) / speed,
        repeat: -1,
        ease: 'Linear',
        onUpdate: (tween) => {
          const angle = tween.getValue();
          particle.x = centerX + Math.cos(Phaser.Math.DegToRad(angle)) * radius;
          particle.y = centerY + Math.sin(Phaser.Math.DegToRad(angle)) * radius;
        }
      });
      
      // Efecto de brillo pulsante
      this.tweens.add({
        targets: particle,
        alpha: { from: particle.alpha, to: particle.alpha * 0.3 },
        scaleX: { from: 1, to: 1.5 },
        scaleY: { from: 1, to: 1.5 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    
    // Partículas de datos flotantes
    for (let i = 0; i < 15; i++) {
      const dataParticle = this.add.text(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 600),
        Phaser.Math.RND.pick(['01', '10', '11', '00', '101', '010']),
        {
          fontSize: '8px',
          fontFamily: 'Consolas, monospace',
          fill: '#00ff88',
          alpha: 0.3
        }
      );
      
      this.tweens.add({
        targets: dataParticle,
        y: dataParticle.y - 600,
        alpha: { from: 0.3, to: 0 },
        duration: Phaser.Math.Between(8000, 12000),
        repeat: -1,
        ease: 'Linear',
        onRepeat: () => {
          dataParticle.y = 650;
          dataParticle.x = Phaser.Math.Between(0, 800);
          dataParticle.alpha = 0.3;
        }
      });
    }
  }

  createArduinoIDE() {
    // Título de la fase
    this.add.text(400, 30, 'FASE 2: PROGRAMACIÓN DE NANORROBOTS REGULADORES', {
      fontSize: '20px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Panel del IDE
    const idePanel = this.add.rectangle(400, 200, 380, 300, 0x252526, 0.9);
    idePanel.setStrokeStyle(2, 0x007acc);

    // Barra de título del IDE
    const titleBar = this.add.rectangle(400, 70, 380, 30, 0x3c3c3c);
    this.add.text(400, 70, '🔧 Arduino IDE Futurista - NanoBot Controller', {
      fontSize: '12px',
      fontFamily: 'Consolas, monospace',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Números de línea
    const lineNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    lineNumbers.forEach((num, index) => {
      this.add.text(225, 110 + (index * 20), num, {
        fontSize: '12px',
        fontFamily: 'Consolas, monospace',
        fill: '#858585'
      });
    });
  }

  createCodeWithError() {
    const codeLines = [
      'int nanobotSensor = A0;',
      'int nanobotDestruir = 9;',
      'void setup() {',
      '  pinMode(nanobotDestruir, OUTPUT);',
      '  Serial.begin(9600);',
      '}',
      'void loop() {',
      '  int cantidad = analogRead(nanobotSensor);',
      '  if (cantidad > 500) {',
      '    digitalWrite(nanobotDestruir, HIGH);',
      '  }',
      '}'
    ];

    this.codeTexts = [];

    codeLines.forEach((line, index) => {
      const codeText = this.add.text(250, 110 + (index * 20), '', {
        fontSize: '12px',
        fontFamily: 'Consolas, monospace',
        fill: index === 3 || index === 6 || index === 8 ? '#ff6b6b' : '#d4d4d4',
        backgroundColor: index === 3 || index === 6 || index === 8 ? '#3c1e1e' : 'transparent',
        padding: { x: 2, y: 1 }
      });
      
      this.codeTexts.push(codeText);
      
      // Efecto de typing mejorado con caracteres individuales y sonidos realistas
      const originalText = line;
      let charIndex = 0;
      
      const typeChar = () => {
        if (charIndex < originalText.length) {
          codeText.setText(originalText.substring(0, charIndex + 1));
          
          // Sonido de tecleo más realista
          if (this.sounds.typing) {
            this.sounds.typing();
          }
          
          // Cursor parpadeante más dinámico
          const cursor = this.add.text(
            codeText.x + codeText.width,
            codeText.y,
            '|',
            { 
              fontSize: '12px', 
              fontFamily: 'Consolas, monospace', 
              fill: '#00ff00',
              alpha: 1
            }
          );
          
          // Animación del cursor más suave
          this.tweens.add({
            targets: cursor,
            alpha: { from: 1, to: 0.2 },
            scaleY: { from: 1, to: 0.8 },
            duration: 400,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut',
            onComplete: () => cursor.destroy()
          });
          
          charIndex++;
          
          // Velocidad variable de escritura más realista
          const nextDelay = originalText[charIndex - 1] === ' ' ? 
            Phaser.Math.Between(80, 120) : 
            Phaser.Math.Between(40, 100);
            
          this.time.delayedCall(nextDelay, typeChar);
        } else {
          // Cursor final que parpadea al terminar la línea
          const finalCursor = this.add.text(
            codeText.x + codeText.width,
            codeText.y,
            '|',
            { 
              fontSize: '12px', 
              fontFamily: 'Consolas, monospace', 
              fill: '#00ff00'
            }
          );
          
          this.tweens.add({
            targets: finalCursor,
            alpha: { from: 1, to: 0 },
            duration: 600,
            yoyo: true,
            repeat: 4,
            onComplete: () => finalCursor.destroy()
          });
        }
      };
      
      // Retraso escalonado más natural entre líneas
      this.time.delayedCall(index * 400 + Phaser.Math.Between(0, 200), typeChar);
    });

    // Indicador de error con animación
    const errorIndicator = this.add.text(400, 110, '⚠️ CÓDIGO CON ERRORES DETECTADOS', {
      fontSize: '14px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff6b6b',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Efecto de parpadeo de alerta
    this.tweens.add({
      targets: errorIndicator,
      alpha: { from: 1, to: 0.3 },
      scaleX: { from: 1, to: 1.1 },
      scaleY: { from: 1, to: 1.1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Partículas de error alrededor del indicador
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(i * 200, () => {
        const errorParticle = this.add.circle(
          400 + Phaser.Math.Between(-100, 100),
          110 + Phaser.Math.Between(-20, 20),
          3,
          0xff4444,
          0.6
        );
        
        this.tweens.add({
          targets: errorParticle,
          y: errorParticle.y - 30,
          alpha: 0,
          duration: 1500,
          ease: 'Power2.easeOut',
          onComplete: () => errorParticle.destroy()
        });
      });
    }
  }

  createQuizOptions() {
    const question = '📢 ¿Cuál es el error principal en este código?';
    
    this.add.text(400, 360, question, {
      fontSize: '16px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ffaa00',
      fontWeight: 'bold',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    const options = [
      { text: '(A) Falta definir el nanobotSensor como entrada.', correct: false },
      { text: '(B) No hay un sistema de control para evitar eliminar más nanorrobots de los necesarios.', correct: true },
      { text: '(C) El analogRead() debe ser digitalRead().', correct: false },
      { text: '(D) El código no permite que los nanorrobots operen en ciclos autónomos.', correct: false }
    ];

    options.forEach((option, index) => {
      const optionButton = this.add.rectangle(400, 420 + (index * 35), 700, 30, 0x333333, 0.8);
      optionButton.setStrokeStyle(2, 0x555555);
      optionButton.setInteractive();
      
      const optionText = this.add.text(400, 420 + (index * 35), option.text, {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        wordWrap: { width: 680 }
      }).setOrigin(0.5);

      optionButton.on('pointerover', () => {
        optionButton.setFillStyle(0x444444);
        optionButton.setStrokeStyle(2, 0x00ffff);
      });

      optionButton.on('pointerout', () => {
        if (this.selectedAnswer !== index) {
          optionButton.setFillStyle(0x333333);
          optionButton.setStrokeStyle(2, 0x555555);
        }
      });

      optionButton.on('pointerdown', () => {
        this.selectAnswer(index, option.correct, optionButton, optionText);
      });
    });
  }

  selectAnswer(index, isCorrect, button, text) {
    if (this.selectedAnswer !== null) return;
    
    this.selectedAnswer = index;
    
    // Efecto de compilación antes de mostrar resultado
    this.showCompilationEffect(() => {
      // Resetear otros botones
      this.children.list.forEach(child => {
        if (child.type === 'Rectangle' && child !== button && child.y > 400) {
          child.setFillStyle(0x333333);
          child.setStrokeStyle(2, 0x555555);
        }
      });

      // Cambiar color del botón seleccionado con transición suave
      if (isCorrect) {
        this.tweens.add({
          targets: button,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 200,
          yoyo: true,
          onComplete: () => {
            button.setFillStyle(0x2d5a2d);
            button.setStrokeStyle(2, 0x00ff00);
            text.setFill('#00ff00');
            if (this.sounds.success) this.sounds.success();
            
            // Efecto de partículas de éxito
            this.createSuccessParticles(button.x, button.y);
            
            // Mostrar mensaje de felicitación
            this.showSuccessMessage();
            
            this.time.delayedCall(3000, () => {
              this.showCorrectSolution();
            });
          }
        });
      } else {
        this.tweens.add({
          targets: button,
          scaleX: 0.9,
          scaleY: 0.9,
          duration: 100,
          yoyo: true,
          repeat: 2,
          onComplete: () => {
            button.setFillStyle(0x5a2d2d);
            button.setStrokeStyle(2, 0xff0000);
            text.setFill('#ff0000');
            if (this.sounds.error) this.sounds.error();
            
            // Efecto de partículas de error
            this.createErrorParticles(button.x, button.y);
            
            // Mostrar mensaje de error y permitir reintento
            this.showErrorMessage();
            
            // Permitir reintento después de 2 segundos
            this.time.delayedCall(2000, () => {
              this.resetQuizForRetry();
            });
          }
        });
      }
    });
  }
  
  showCompilationEffect(callback) {
    // Detener animación anterior si existe
    if (this.currentCompilationTween) {
      this.currentCompilationTween.stop();
      this.currentCompilationTween = null;
    }
    
    // Limpiar elementos anteriores si existen
    if (this.compilationElements) {
      this.compilationElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      this.compilationElements = [];
    }
    
    // Crear overlay de compilación
    const compileOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    
    const compileText = this.add.text(400, 280, 'COMPILANDO...', {
      fontSize: '24px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Barra de progreso
    const progressBg = this.add.rectangle(400, 320, 300, 20, 0x333333);
    const progressBar = this.add.rectangle(252, 320, 0, 16, 0x00ff00);
    progressBar.setOrigin(0, 0.5); // Establecer origen en el borde izquierdo
    
    // Guardar referencias para limpieza
    this.compilationElements = [compileOverlay, compileText, progressBg, progressBar];
    
    // Sonido de compilación
    if (this.sounds.compile) this.sounds.compile();
    
    // Animación de la barra de progreso con control mejorado
    this.currentCompilationTween = this.tweens.add({
      targets: progressBar,
      width: 296, // Mantener dentro del contenedor (300px - 4px de margen)
      duration: 1500, // Reducido de 2000 a 1500ms
      ease: 'Power2.easeInOut',
      onComplete: () => {
        // Verificar que los elementos aún existen antes del desvanecimiento
        if (compileOverlay && compileOverlay.active) {
          // Efecto de desvanecimiento
          this.tweens.add({
            targets: [compileOverlay, compileText, progressBg, progressBar],
            alpha: 0,
            duration: 300, // Reducido de 500 a 300ms
            onComplete: () => {
              // Limpiar elementos de forma segura
              [compileOverlay, compileText, progressBg, progressBar].forEach(element => {
                if (element && element.destroy) {
                  element.destroy();
                }
              });
              this.compilationElements = [];
              this.currentCompilationTween = null;
              callback();
            }
          });
        } else {
          // Si los elementos ya fueron destruidos, ejecutar callback directamente
          this.currentCompilationTween = null;
          callback();
        }
      }
    });
    
    // Partículas de compilación
    for (let i = 0; i < 20; i++) {
      this.time.delayedCall(i * 100, () => {
        const particle = this.add.circle(
          Phaser.Math.Between(100, 700),
          Phaser.Math.Between(200, 400),
          2,
          0x00ff88,
          0.8
        );
        
        this.tweens.add({
          targets: particle,
          y: particle.y - 50,
          alpha: 0,
          duration: 1000,
          ease: 'Power2.easeOut',
          onComplete: () => particle.destroy()
        });
      });
    }
  }
  
  createSuccessParticles(x, y) {
    for (let i = 0; i < 12; i++) {
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(3, 6),
        Phaser.Math.RND.pick([0x00ff00, 0x88ff88, 0xaaffaa]),
        0.8
      );
      
      const angle = (i / 12) * Math.PI * 2;
      const distance = Phaser.Math.Between(50, 100);
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scaleX: 0.2,
        scaleY: 0.2,
        duration: 1000,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }
  
  createErrorParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(2, 5),
        0xff4444,
        0.8
      );
      
      this.tweens.add({
        targets: particle,
        x: x + Phaser.Math.Between(-60, 60),
        y: y + Phaser.Math.Between(-60, 60),
        alpha: 0,
        rotation: Math.PI * 2,
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
    }
  }

  showSuccessMessage() {
    // Crear panel de felicitación
    const successPanel = this.add.rectangle(400, 300, 600, 200, 0x004400, 0.95);
    successPanel.setStrokeStyle(3, 0x00ff00, 1);
    
    const successTitle = this.add.text(400, 250, '🎉 ¡EXCELENTE TRABAJO! 🎉', {
      fontSize: '24px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const successMessage = this.add.text(400, 300, 'Has identificado correctamente el problema en el código.\nLos nanobots reguladores funcionarán de manera segura.', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);
    
    const continueText = this.add.text(400, 350, 'Continuando con la solución...', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fill: '#cccccc',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    // Animación de entrada
    [successPanel, successTitle, successMessage, continueText].forEach((element, index) => {
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
    
    // Guardar referencias para limpiar después
    this.successElements = [successPanel, successTitle, successMessage, continueText];
  }

  showErrorMessage() {
    // Crear panel de error
    const errorPanel = this.add.rectangle(400, 300, 600, 200, 0x440000, 0.95);
    errorPanel.setStrokeStyle(3, 0xff0000, 1);
    
    const errorTitle = this.add.text(400, 250, '❌ RESPUESTA INCORRECTA', {
      fontSize: '22px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff0000',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const errorMessage = this.add.text(400, 300, 'Esa no es la respuesta correcta.\nRevisa el código cuidadosamente y vuelve a intentarlo.', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 550 }
    }).setOrigin(0.5);
    
    const retryText = this.add.text(400, 350, 'Preparando nuevo intento...', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      fill: '#cccccc',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    // Animación de entrada
    [errorPanel, errorTitle, errorMessage, retryText].forEach((element, index) => {
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
    
    // Guardar referencias para limpiar después
    this.errorElements = [errorPanel, errorTitle, errorMessage, retryText];
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
    
    // Resetear estado del quiz
    this.selectedAnswer = null;
    
    // Restaurar todos los botones a su estado original
    this.children.list.forEach(child => {
      if (child.type === 'Rectangle' && child.y > 400 && child.y < 600) {
        child.setFillStyle(0x333333, 0.8);
        child.setStrokeStyle(2, 0x555555);
        child.setInteractive();
      }
    });
    
    // Restaurar colores de texto
    this.children.list.forEach(child => {
      if (child.type === 'Text' && child.y > 400 && child.y < 600) {
        child.setFill('#ffffff');
      }
    });
  }

  showCorrectSolution() {
    // Limpiar elementos de éxito si existen
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
    
    // Transición suave para limpiar pantalla
    const fadeOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
    
    this.tweens.add({
      targets: fadeOverlay,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.children.removeAll();
        this.createBackground();
        
        // Desvanecer el overlay
        this.tweens.add({
          targets: fadeOverlay,
          alpha: 0,
          duration: 500,
          onComplete: () => fadeOverlay.destroy()
        });
      }
    });
    
    // Mostrar código corregido
    this.add.text(400, 50, '✅ CÓDIGO CORREGIDO - NANOBOTS REGULADORES ACTIVADOS', {
      fontSize: '18px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#00ff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const correctedCode = [
      'int nanobotSensor = A0;',
      'int nanobotDestruir = 9;',
      'void setup() {',
      '  pinMode(nanobotSensor, INPUT);     // ✅ Sensor definido',
      '  pinMode(nanobotDestruir, OUTPUT);',
      '}',
      'void loop() {',
      '  int cantidad = analogRead(nanobotSensor);',
      '  if (cantidad > 500) {',
      '    digitalWrite(nanobotDestruir, HIGH);',
      '    delay(2000);                     // ✅ Control de tiempo',
      '    digitalWrite(nanobotDestruir, LOW); // ✅ Apagar después',
      '  }',
      '}'
    ];

    correctedCode.forEach((line, index) => {
      const color = line.includes('✅') ? '#00ff00' : '#d4d4d4';
      const codeText = this.add.text(50, 100 + (index * 18), line, {
        fontSize: '11px',
        fontFamily: 'Consolas, monospace',
        fill: color,
        backgroundColor: line.includes('✅') ? '#1e3c1e' : 'transparent',
        padding: { x: 2, y: 1 }
      });
      
      codeText.setAlpha(0);
      this.tweens.add({
        targets: codeText,
        alpha: 1,
        duration: 100,
        delay: index * 150
      });
    });

    // Crear nanobots reguladores
    this.createRegulatorBots();
    
    // Botón para continuar
    this.time.delayedCall(3000, () => {
      const continueBtn = this.add.rectangle(400, 550, 200, 40, 0x007acc, 0.8);
      continueBtn.setStrokeStyle(2, 0x00ffff);
      continueBtn.setInteractive();
      
      this.add.text(400, 550, 'CONTINUAR', {
        fontSize: '16px',
        fontFamily: 'Rajdhani, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      continueBtn.on('pointerdown', () => {
        this.scene.start('SelfHealingMaterialScene');
      });
    });
  }

  createRegulatorBots() {
    // Crear nanobots reguladores con movimiento inteligente
    const formations = [
      { x: 500, y: 300, pattern: 'circle' },
      { x: 600, y: 350, pattern: 'diamond' },
      { x: 550, y: 400, pattern: 'line' }
    ];
    
    formations.forEach((formation, formIndex) => {
      for (let i = 0; i < 6; i++) {
        let startX, startY;
        
        // Posiciones según el patrón
        switch (formation.pattern) {
          case 'circle':
            const angle = (i / 6) * Math.PI * 2;
            startX = formation.x + Math.cos(angle) * 40;
            startY = formation.y + Math.sin(angle) * 40;
            break;
          case 'diamond':
            const positions = [
              {x: 0, y: -30}, {x: 20, y: -15}, {x: 20, y: 15},
              {x: 0, y: 30}, {x: -20, y: 15}, {x: -20, y: -15}
            ];
            startX = formation.x + positions[i].x;
            startY = formation.y + positions[i].y;
            break;
          case 'line':
            startX = formation.x + (i - 2.5) * 25;
            startY = formation.y;
            break;
        }
        
        // Crear nanobot con núcleo y halo
        const core = this.add.circle(startX, startY, 6, 0x0066ff, 0.9);
        const halo = this.add.circle(startX, startY, 12, 0x88ddff, 0.3);
        
        // Agrupar núcleo y halo
        const regulator = this.add.container(startX, startY, [halo, core]);
        this.regulatorBots.push(regulator);
        
        // Movimiento de patrullaje inteligente
        const patrolPoints = [
          { x: startX, y: startY },
          { x: startX + Phaser.Math.Between(-50, 50), y: startY + Phaser.Math.Between(-30, 30) },
          { x: startX + Phaser.Math.Between(-30, 30), y: startY + Phaser.Math.Between(-50, 50) },
          { x: startX, y: startY }
        ];
        
        let currentPoint = 0;
        const moveToNextPoint = () => {
          const nextPoint = patrolPoints[currentPoint % patrolPoints.length];
          
          this.tweens.add({
            targets: regulator,
            x: nextPoint.x,
            y: nextPoint.y,
            duration: Phaser.Math.Between(2000, 3500),
            ease: 'Power2.easeInOut',
            onComplete: () => {
              currentPoint++;
              this.time.delayedCall(Phaser.Math.Between(500, 1500), moveToNextPoint);
            }
          });
        };
        
        this.time.delayedCall(i * 300, moveToNextPoint);
        
        // Efecto de pulso dinámico del núcleo
        this.tweens.add({
          targets: core,
          scaleX: { from: 1, to: 1.4 },
          scaleY: { from: 1, to: 1.4 },
          alpha: { from: 0.9, to: 0.6 },
          duration: 800 + (i * 100),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        
        // Rotación del halo
        this.tweens.add({
          targets: halo,
          rotation: Math.PI * 2,
          scaleX: { from: 1, to: 1.2 },
          scaleY: { from: 1, to: 1.2 },
          duration: 3000 + (i * 200),
          repeat: -1,
          ease: 'Linear'
        });
        
        // Emisión de partículas reguladoras mejoradas
        this.time.addEvent({
          delay: 1000 + (i * 150),
          callback: () => {
            // Crear múltiples partículas en ráfaga
            for (let p = 0; p < 3; p++) {
              const particle = this.add.circle(
                regulator.x,
                regulator.y,
                Phaser.Math.Between(2, 4),
                Phaser.Math.RND.pick([0x88ddff, 0x00aaff, 0xaaeeff]),
                0.8
              );
              
              // Movimiento en espiral
              const spiralRadius = Phaser.Math.Between(30, 60);
              const spiralSpeed = Phaser.Math.FloatBetween(1, 2);
              
              this.tweens.add({
                targets: particle,
                angle: 360 * spiralSpeed,
                duration: 2000,
                ease: 'Power2.easeOut',
                onUpdate: (tween) => {
                  const angle = tween.getValue();
                  const currentRadius = spiralRadius * (1 - tween.progress);
                  particle.x = regulator.x + Math.cos(Phaser.Math.DegToRad(angle)) * currentRadius;
                  particle.y = regulator.y + Math.sin(Phaser.Math.DegToRad(angle)) * currentRadius;
                  particle.alpha = 0.8 * (1 - tween.progress);
                },
                onComplete: () => particle.destroy()
              });
            }
          },
          repeat: -1
        });
        
        // Efecto de campo de energía
        const energyField = this.add.circle(startX, startY, 20, 0x0088ff, 0.1);
        this.tweens.add({
          targets: energyField,
          scaleX: { from: 1, to: 2 },
          scaleY: { from: 1, to: 2 },
          alpha: { from: 0.1, to: 0 },
          duration: 2000,
          repeat: -1,
          ease: 'Power2.easeOut'
        });
      }
    });
  }

  showOverpopulation() {
    // Transición dramática con efecto de glitch
    const glitchOverlay = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0);
    
    // Efecto de glitch
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 100, () => {
        this.tweens.add({
          targets: glitchOverlay,
          alpha: 0.8,
          duration: 50,
          yoyo: true,
          onComplete: () => {
            if (i === 4) {
              this.children.removeAll();
              this.createBackground();
            }
          }
        });
      });
    }
    
    this.add.text(400, 100, '❌ ERROR: SOBREPOBLACIÓN DESCONTROLADA', {
      fontSize: '20px',
      fontFamily: 'Rajdhani, sans-serif',
      fill: '#ff0000',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Crear muchos nanobots descontrolados con comportamiento caótico
    for (let i = 0; i < 60; i++) {
      const size = Phaser.Math.Between(3, 10);
      const chaosBot = this.add.circle(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(150, 550),
        size,
        Phaser.Math.RND.pick([0xff4444, 0xff6666, 0xff2222, 0xcc0000]),
        0.8
      );
      
      // Movimiento errático con cambios de dirección
      const createChaoticMovement = () => {
        this.tweens.add({
          targets: chaosBot,
          x: Phaser.Math.Between(0, 800),
          y: Phaser.Math.Between(0, 600),
          scaleX: Phaser.Math.FloatBetween(0.5, 2),
          scaleY: Phaser.Math.FloatBetween(0.5, 2),
          rotation: Phaser.Math.Between(-Math.PI * 4, Math.PI * 4),
          duration: Phaser.Math.Between(500, 2000),
          ease: Phaser.Math.RND.pick(['Power2.easeInOut', 'Bounce.easeOut', 'Back.easeInOut']),
          onComplete: createChaoticMovement
        });
      };
      
      this.time.delayedCall(i * 50, createChaoticMovement);
      
      // Efecto de vibración
      this.tweens.add({
        targets: chaosBot,
        alpha: { from: 0.8, to: 0.3 },
        duration: Phaser.Math.Between(100, 300),
        yoyo: true,
        repeat: -1
      });
      
      // Emisión de partículas de error
      if (i % 5 === 0) {
        this.time.addEvent({
          delay: Phaser.Math.Between(200, 800),
          callback: () => {
            const errorParticle = this.add.circle(
              chaosBot.x,
              chaosBot.y,
              2,
              0xff8888,
              0.6
            );
            
            this.tweens.add({
              targets: errorParticle,
              x: errorParticle.x + Phaser.Math.Between(-40, 40),
              y: errorParticle.y + Phaser.Math.Between(-40, 40),
              alpha: 0,
              duration: 1000,
              ease: 'Power2.easeOut',
              onComplete: () => errorParticle.destroy()
            });
          },
          repeat: 20
        });
      }
    }

    // Botón para reintentar
    this.time.delayedCall(2000, () => {
      const retryBtn = this.add.rectangle(400, 550, 200, 40, 0x666666, 0.8);
      retryBtn.setStrokeStyle(2, 0xffffff);
      retryBtn.setInteractive();
      
      this.add.text(400, 550, 'REINTENTAR', {
        fontSize: '16px',
        fontFamily: 'Rajdhani, sans-serif',
        fill: '#ffffff',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      retryBtn.on('pointerdown', () => {
        this.scene.restart();
      });
    });
  }

  createAdvancedAnimations() {
    // Crear efectos de matriz digital (reducido)
    this.createDigitalMatrix();
    
    // Crear pulsos de conexión de red (reducido)
    this.createNetworkPulses();
  }
  

  
  createDigitalMatrix() {
    // Efecto de matriz digital sutil solo en el lado derecho
    for (let i = 0; i < 6; i++) {
      const column = this.add.container(750 + (i * 35), 0);
      
      for (let j = 0; j < 8; j++) {
        const char = this.add.text(0, j * 30, 
          Phaser.Math.RND.pick(['0', '1']),
          {
            fontSize: '8px',
            fontFamily: 'Consolas, monospace',
            fill: '#002200',
            alpha: 0.1
          }
        );
        
        column.add(char);
        
        // Cambiar caracteres menos frecuentemente
        this.time.addEvent({
          delay: Phaser.Math.Between(3000, 8000),
          callback: () => {
            char.setText(Phaser.Math.RND.pick(['0', '1']));
          },
          repeat: -1
        });
      }
    }
  }
  
  createNetworkPulses() {
    // Pulsos de red sutiles solo en áreas que no interfieren con el código
    const networkNodes = [
      { x: 750, y: 100 },
      { x: 800, y: 200 },
      { x: 700, y: 300 }
    ];
    
    // Crear nodos de red pequeños
    networkNodes.forEach(node => {
      const nodeCircle = this.add.circle(node.x, node.y, 2, 0x0088ff, 0.4);
      
      // Pulso del nodo muy sutil
      this.tweens.add({
        targets: nodeCircle,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0.1,
        duration: 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    
    // Crear conexiones muy ocasionales
    this.time.addEvent({
      delay: 8000,
      callback: () => {
        const node1 = Phaser.Math.RND.pick(networkNodes);
        const node2 = Phaser.Math.RND.pick(networkNodes.filter(n => n !== node1));
        
        const line = this.add.graphics();
        line.lineStyle(1, 0x0088ff, 0.2);
        line.moveTo(node1.x, node1.y);
        line.lineTo(node2.x, node2.y);
        line.strokePath();
        
        // Desvanecer la línea lentamente
        this.tweens.add({
          targets: line,
          alpha: 0,
          duration: 3000,
          onComplete: () => line.destroy()
        });
      },
      repeat: -1
    });
  }
  
  // Método de limpieza para evitar elementos colgantes
  shutdown() {
    // Detener animación de compilación si está activa
    if (this.currentCompilationTween) {
      this.currentCompilationTween.stop();
      this.currentCompilationTween = null;
    }
    
    // Limpiar elementos de compilación
    if (this.compilationElements && this.compilationElements.length > 0) {
      this.compilationElements.forEach(element => {
        if (element && element.destroy) {
          element.destroy();
        }
      });
      this.compilationElements = [];
    }
    
    // Detener todos los tweens activos
    this.tweens.killAll();
    
    // Limpiar timers activos
    if (this.time && this.time.removeAllEvents) {
      this.time.removeAllEvents();
    }
  }
}

window.ArduinoNanobotScene = ArduinoNanobotScene;