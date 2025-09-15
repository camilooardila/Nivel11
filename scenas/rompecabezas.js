class Rompecabezas extends Phaser.Scene {
  constructor() {
    super({ key: "Rompecabezas" });
    this.nanorrobotsControlados = 0;
    this.nanorrobotsTotal = 0;
    this.nivelActual = 1;
    this.nivelesMax = 3;
    this.tiempoRestante = 60;
    this.juegoActivo = false;
    this.puntos = 0;
    this.puntosParaBonus = 500;
    this.bonusActivado = false;
    this.nivelContencionPorcentaje = 0; // Porcentaje de contención (0-100)
    this.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  }

  createSounds() {
    // Crear sonidos sintéticos específicos para el juego de rompecabezas
    this.sounds = {
      // Sonidos de captura y contención
      captura: this.createAdvancedSound([440, 550, 660], 0.3, 'triangle', 'capture'),
      capturaExitosa: this.createAdvancedSound([660, 880, 1100], 0.4, 'sine', 'success'),
      
      // Sonidos de replicación y peligro
      replicacion: this.createAdvancedSound([220, 165, 110], 0.5, 'sawtooth', 'danger'),
      replicacionRapida: this.createAdvancedSound([330, 220, 165], 0.3, 'square', 'warning'),
      
      // Sonidos de nivel y progreso
      nivelCompletado: this.createAdvancedSound([523.25, 659.25, 783.99, 1046.50], 1.5, 'triangle', 'victory'),
      puntoGanado: this.createAdvancedSound([880, 1100], 0.2, 'sine', 'point'),
      
      // Sonidos de interfaz
      botonClick: this.createAdvancedSound([660, 880], 0.15, 'square', 'click'),
      contencionCritica: this.createAdvancedSound([110, 220, 110], 0.8, 'sawtooth', 'alarm'),
      
      // Sonidos ambientales
      ambienteContencion: this.createAdvancedSound([165, 220, 275], 2.0, 'sine', 'ambient'),
      energiaContenedor: this.createAdvancedSound([440, 550, 660], 0.6, 'triangle', 'energy'),
      
      // Sonidos de transición
      inicioMision: this.createAdvancedSound([261.63, 329.63, 392.00, 523.25], 1.0, 'triangle', 'mission_start'),
      transicionNivel: this.createAdvancedSound([440, 554.37, 659.25], 0.8, 'sine', 'transition')
    };
  }

  createAdvancedSound(frequencies, duration, waveType = 'sine', soundType = 'default') {
    return {
      play: () => {
        if (this.sound.context) {
          const now = this.sound.context.currentTime;
          
          // Crear múltiples osciladores para armonías
          frequencies.forEach((frequency, index) => {
            const oscillator = this.sound.context.createOscillator();
            const gainNode = this.sound.context.createGain();
            const filterNode = this.sound.context.createBiquadFilter();
            
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.sound.context.destination);
            
            oscillator.frequency.setValueAtTime(frequency, now);
            oscillator.type = waveType;
            
            // Configurar filtro según el tipo de sonido
            switch(soundType) {
              case 'capture':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1200, now);
                break;
              case 'success':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(300, now);
                break;
              case 'danger':
              case 'warning':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(600, now);
                break;
              case 'victory':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(400, now);
                break;
              case 'point':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(2000, now);
                break;
              case 'click':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1000, now);
                break;
              case 'alarm':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(200, now);
                break;
              case 'ambient':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(800, now);
                break;
              case 'energy':
                filterNode.type = 'bandpass';
                filterNode.frequency.setValueAtTime(1500, now);
                break;
              case 'mission_start':
                filterNode.type = 'highpass';
                filterNode.frequency.setValueAtTime(350, now);
                break;
              case 'transition':
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(1800, now);
                break;
            }
            
            // Configurar ganancia con envelope
            const baseGain = 0.06 / frequencies.length;
            const delay = index * 0.02;
            
            gainNode.gain.setValueAtTime(0, now + delay);
            gainNode.gain.linearRampToValueAtTime(baseGain, now + delay + 0.01);
            
            // Envelope específico por tipo de sonido
            switch(soundType) {
              case 'capture':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.2, now + delay + duration * 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'success':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.5, now + delay + duration * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'danger':
              case 'warning':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.3, now + delay + duration * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'victory':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.4, now + delay + duration * 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'point':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.8, now + delay + duration * 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'click':
                gainNode.gain.linearRampToValueAtTime(0, now + delay + duration * 0.2);
                break;
              case 'alarm':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.1, now + delay + duration * 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'ambient':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.4, now + delay + duration * 0.7);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'energy':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.9, now + delay + duration * 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'mission_start':
                gainNode.gain.linearRampToValueAtTime(baseGain * 1.3, now + delay + duration * 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              case 'transition':
                gainNode.gain.linearRampToValueAtTime(baseGain * 0.8, now + delay + duration * 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
                break;
              default:
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
            }
            
            // Modulación de frecuencia para efectos especiales
            if (soundType === 'danger' || soundType === 'alarm') {
              oscillator.frequency.linearRampToValueAtTime(frequency * 0.7, now + delay + duration * 0.5);
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.3, now + delay + duration);
            }
            
            if (soundType === 'success' || soundType === 'victory') {
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + delay + duration * 0.3);
              oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, now + delay + duration);
            }
            
            if (soundType === 'energy') {
              oscillator.frequency.linearRampToValueAtTime(frequency * 1.1, now + delay + duration * 0.5);
              oscillator.frequency.linearRampToValueAtTime(frequency * 0.9, now + delay + duration);
            }
            
            oscillator.start(now + delay);
            oscillator.stop(now + delay + duration);
          });
        }
      }
    };
  }

  preload() {
    // Cargar imágenes de fondo y elementos visuales
    this.load.image('fondo', 'assets/scenaPrincipal/1.jpg');
    this.load.image('nanorrobot', 'assets/rompecabezas/Taller.png'); // Usaremos esta imagen temporalmente
    this.load.image('contenedor', 'assets/rompecabezas/Taller.png'); // Usaremos esta imagen temporalmente
    this.load.image('particula', 'assets/rompecabezas/Taller.png'); // Usaremos esta imagen temporalmente
    
    // Crear textura de pixel para partículas
    this.add.graphics().fillStyle(0xffffff).fillRect(0, 0, 1, 1).generateTexture('pixel', 1, 1);
    
    // Crear sonidos sintéticos
    this.createSounds();
  }

  create() {
    // Obtener dimensiones de la pantalla
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // Añadir fondo
    const background = this.add.image(0, 0, 'fondo');
    const scaleX = screenWidth / background.width;
    const scaleY = screenHeight / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
    background.setPosition(screenWidth / 2, screenHeight / 2);
    
    // Crear contenedor mejorado para la barra de progreso
    this.progressBarContainer = this.add.rectangle(screenWidth / 2, 160, 460, 70, 0x000000, 0.8)
      .setOrigin(0.5)
      .setDepth(9);
      
    // Añadir borde con efecto de brillo
    this.progressBarBorder = this.add.graphics().setDepth(9.5);
    this.progressBarBorder.lineStyle(4, 0x00ffff, 1);
    this.progressBarBorder.strokeRoundedRect(screenWidth / 2 - 230, 160 - 35, 460, 70, 15);
    
    // Añadir borde interno para efecto de profundidad
    this.progressBarInnerBorder = this.add.graphics().setDepth(9.6);
    this.progressBarInnerBorder.lineStyle(2, 0x0088cc, 0.8);
    this.progressBarInnerBorder.strokeRoundedRect(screenWidth / 2 - 225, 160 - 30, 450, 60, 12);
      
    // Crear fondo de la barra con efecto de profundidad
    this.progressBarBackground = this.add.rectangle(screenWidth / 2, 160, 420, 30, 0x1a1a1a)
      .setOrigin(0.5)
      .setDepth(10);
      
    // Añadir borde a la barra de fondo
    this.progressBarBackgroundBorder = this.add.graphics().setDepth(10.1);
    this.progressBarBackgroundBorder.lineStyle(2, 0x444444, 1);
    this.progressBarBackgroundBorder.strokeRoundedRect(screenWidth / 2 - 210, 160 - 15, 420, 30, 8);
    
    // Crear barra de progreso principal con gradiente
    this.progressBar = this.add.rectangle(screenWidth / 2 - 210, 160, 0, 30, 0x00ff00)
      .setOrigin(0, 0.5)
      .setDepth(10.2);
      
    // Añadir efecto de brillo en la barra
    this.progressBarGlow = this.add.rectangle(screenWidth / 2 - 210, 160, 0, 30, 0x88ff88, 0.6)
      .setOrigin(0, 0.5)
      .setDepth(10.3);
      
    // Inicializar variables para animación
    this.progressBarWidth = 0;
    this.targetProgressWidth = 0;
    this.progressBarMaxWidth = 420;
    
    // Añadir texto para mostrar puntos necesarios (reposicionado para mejor visibilidad)
    this.puntosNecesariosTexto = this.add.text(screenWidth / 2, 190, 'Puntos para completar: 0/0', {
      font: '18px Orbitron',
      fill: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(11);
    
    // Añadir título
    const fontSize = this.isMobile ? '32px' : '28px';
    this.add.text(screenWidth / 2, 50, 'NANORROBOTS: PROTOCOLO DE CONTENCIÓN', {
      font: `${fontSize} Orbitron`,
      fill: '#00ffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 2,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5);
    
    // Añadir instrucciones con mayor visibilidad (reposicionadas para evitar conflictos)
    const instruccionesFontSize = this.isMobile ? '22px' : '18px';
    const instruccionesBackground = this.add.rectangle(screenWidth / 2, 250, screenWidth * 0.6, 35, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(5);
    
    // Borde para las instrucciones removido para mejor apariencia
    
    this.instruccionesTexto = this.add.text(screenWidth / 2, 250, 'Arrastra los nanorrobots al contenedor', {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#ffff00',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5).setDepth(6);
    
    // Efecto de parpadeo para las instrucciones
    this.tweens.add({
      targets: this.instruccionesTexto,
      alpha: { from: 1, to: 0.7 },
      yoyo: true,
      repeat: -1,
      duration: 1000
    });
    
    // Crear área de juego
    this.crearAreaJuego();
    
    // Configurar eventos de interacción
    this.configurarEventos();
    
    // Añadir contador de nanorrobots
    this.contadorTexto = this.add.text(screenWidth / 2, screenHeight - 50, `Nanorrobots contenidos: ${this.nanorrobotsControlados}/${this.nanorrobotsTotal}`, {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#00ffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Añadir contador de tiempo (esquina superior izquierda)
    this.tiempoTexto = this.add.text(80, 30, `Tiempo: ${this.tiempoRestante}s`, {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#ffffff',
      align: 'left',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    
    // Añadir indicador de nivel (esquina superior derecha)
    this.nivelTexto = this.add.text(screenWidth - 80, 30, `Nivel: ${this.nivelActual}/${this.nivelesMax}`, {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#ffffff',
      align: 'right',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0.5);
    
    // Añadir indicador de contención (reposicionado en esquina inferior izquierda)
    const contencionY = screenHeight - 60; // Posición cerca del borde inferior
    this.contencionTexto = this.add.text(20, contencionY - 25, 'CONTENCIÓN: 0%', {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#00ff00',
      align: 'left',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0, 0.5);
    
    // Crear fondo para el indicador de contención (debajo del texto)
    this.contencionFondo = this.add.rectangle(20, contencionY, 150, 18, 0x000000, 0.8)
      .setOrigin(0, 0.5)
      .setDepth(8);
    
    // Crear barra de contención
    this.contencionBarra = this.add.rectangle(20, contencionY, 0, 18, 0x00ff00)
      .setOrigin(0, 0.5)
      .setDepth(9);
    
    // Añadir borde a la barra de contención
    this.contencionBorde = this.add.graphics().setDepth(10);
    this.contencionBorde.lineStyle(2, 0xffffff, 1);
    this.contencionBorde.strokeRect(20, contencionY - 9, 150, 18);
    
    // Añadir contador de puntos (más abajo para mejor visibilidad)
    this.puntosTexto = this.add.text(screenWidth - 80, 110, `Puntos: ${this.puntos}`, {
      font: `${instruccionesFontSize} Rajdhani`,
      fill: '#ffff00',
      align: 'right',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0.5);
    
    // Crear mensaje de advertencia de contención crítica (inicialmente oculto)
    this.advertenciaContencion = this.add.text(screenWidth / 2, screenHeight / 2 + 50, '¡CONTENCIÓN CRÍTICA!', {
      font: '32px Orbitron',
      fill: '#ff0000',
      align: 'center',
      stroke: '#ffffff',
      strokeThickness: 3,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setVisible(false).setDepth(50);
    
    // Añadir botón de inicio
    const iniciarBoton = this.add.text(screenWidth / 2, screenHeight / 2, 'INICIAR MISIÓN', {
      font: `${fontSize} Orbitron`,
      fill: '#ffffff',
      backgroundColor: '#00aa00',
      padding: {
        x: 20,
        y: 10
      }
    }).setOrigin(0.5).setInteractive();
    
    iniciarBoton.on('pointerdown', () => {
      // Sonido de clic del botón
      if (this.sounds && this.sounds.inicioMision) {
        this.sounds.inicioMision.play();
      }
      iniciarBoton.destroy();
      this.iniciarJuego();
    });
    
    // Los sonidos sintéticos ya están creados en createSounds()
    // Se acceden a través de this.sounds.nombreDelSonido.play()
  }
  
  crearAreaJuego() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // Crear un contenedor más elaborado para los nanorrobots
    // Primero, crear un grupo para contener todos los elementos del contenedor
    this.contenedorGroup = this.add.group();
    
    // Posición del contenedor
    const contenedorX = screenWidth - 150;
    const contenedorY = screenHeight / 2;
    
    // Crear el fondo del contenedor (cilindro)
    this.contenedor = this.add.graphics();
    this.contenedor.fillStyle(0x000033, 1); // Fondo azul oscuro
    this.contenedor.fillRoundedRect(contenedorX - 50, contenedorY - 100, 100, 200, 20); // Rectángulo redondeado
    this.contenedor.lineStyle(3, 0x00ffff, 1); // Borde cian brillante
    this.contenedor.strokeRoundedRect(contenedorX - 50, contenedorY - 100, 100, 200, 20);
    
    // Añadir detalles al contenedor
    // Líneas horizontales decorativas
    for (let i = 0; i < 5; i++) {
      const lineY = contenedorY - 80 + (i * 40);
      this.contenedor.lineStyle(1, 0x00ffff, 0.5);
      this.contenedor.lineBetween(contenedorX - 45, lineY, contenedorX + 45, lineY);
    }
    
    // Añadir texto al contenedor
    const textoContenedor = this.add.text(contenedorX, contenedorY - 90, 'CONTENCIÓN', {
      font: '16px Orbitron',
      fill: '#00ffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Añadir un indicador de nivel de contención (barra vertical)
    this.nivelContencion = this.add.graphics();
    this.nivelContencion.fillStyle(0x00ff88, 0.7);
    this.nivelContencion.fillRect(contenedorX - 40, contenedorY + 80, 80, 0); // Inicialmente vacío
    
    // Añadir texto de porcentaje en el contenedor
    this.contenedorPorcentajeTexto = this.add.text(contenedorX, contenedorY + 90, '0%', {
      font: '12px Orbitron',
      fill: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    // Crear efecto de alerta para contención alta
    this.alertaContencion = this.add.graphics();
    this.alertaContencion.setVisible(false);
    this.alertaContencion.setDepth(5);
    
    // Añadir efecto de brillo/partículas al contenedor
    const particulas = this.add.particles('particula');
    this.emisorContenedor = particulas.createEmitter({
      x: contenedorX,
      y: contenedorY,
      speed: { min: 10, max: 30 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      tint: 0x00ffff,
      frequency: 500, // Emisión lenta en estado normal
      quantity: 1,
      lifespan: 1000,
      gravityY: -20
    });
    
    // Crear zona de detección para el contenedor
    this.zonaContenedor = this.add.zone(contenedorX, contenedorY, 100, 200);
    this.physics.world.enable(this.zonaContenedor);
    this.zonaContenedor.body.setAllowGravity(false);
    this.zonaContenedor.body.moves = false;
    
    // Grupo para los nanorrobots
    this.nanorrobotsGroup = this.physics.add.group();
    
    // Añadir un efecto de pulso al contenedor
    this.tweens.add({
      targets: this.contenedor,
      alpha: { from: 1, to: 0.8 },
      yoyo: true,
      repeat: -1,
      duration: 2000,
      ease: 'Sine.easeInOut'
    });
    
    // Añadir un efecto de rotación al texto
    this.tweens.add({
      targets: textoContenedor,
      angle: { from: -2, to: 2 },
      yoyo: true,
      repeat: -1,
      duration: 1500,
      ease: 'Sine.easeInOut'
    });
  }
  
  // Método para verificar si se han alcanzado los puntos necesarios para completar el nivel
  verificarPuntosParaCompletarNivel() {
    if (this.juegoActivo) {
      // Obtener dimensiones de la pantalla
      const screenWidth = this.sys.game.config.width;
      
      // Calcular progreso y ancho objetivo - asegurar que se llene completamente
      const porcentajeCompletado = Math.min(1, this.puntos / this.puntosParaCompletarNivel);
      
      // Determinar ancho objetivo basado en progreso
      if (this.puntos >= this.puntosParaCompletarNivel) {
        // Forzar llenado completo cuando se alcanzan los puntos
        this.targetProgressWidth = this.progressBarMaxWidth;
        this.progressBarWidth = this.progressBarMaxWidth;
      } else {
        this.targetProgressWidth = this.progressBarMaxWidth * porcentajeCompletado;
        
        // Animación suave de la barra de progreso
        if (Math.abs(this.progressBarWidth - this.targetProgressWidth) > 1) {
          this.progressBarWidth += (this.targetProgressWidth - this.progressBarWidth) * 0.1;
        } else {
          this.progressBarWidth = this.targetProgressWidth;
        }
      }
      
      // Actualizar ancho de las barras
      this.progressBar.width = this.progressBarWidth;
      this.progressBarGlow.width = this.progressBarWidth;
      
      // Actualizar el texto de puntos necesarios con efecto de pulso
      this.puntosNecesariosTexto.setText(`Puntos para completar: ${this.puntos}/${this.puntosParaCompletarNivel}`);
      
      // Cambiar color de la barra según el progreso con transiciones suaves
      let targetColor;
      if (porcentajeCompletado < 0.3) {
        targetColor = 0xff3333; // Rojo brillante
      } else if (porcentajeCompletado < 0.7) {
        targetColor = 0xffaa00; // Naranja-amarillo
      } else {
        targetColor = 0x00ff44; // Verde brillante
      }
      
      // Aplicar color con efecto de transición
      this.progressBar.fillColor = targetColor;
      
      // Efecto de pulso en el texto cuando hay progreso
       if (this.lastProgressWidth !== this.progressBarWidth) {
         this.tweens.add({
           targets: this.puntosNecesariosTexto,
           scaleX: 1.1,
           scaleY: 1.1,
           duration: 150,
           yoyo: true,
           ease: 'Power2'
         });
         this.lastProgressWidth = this.progressBarWidth;
       }
       
       // Efecto de brillo pulsante cuando está cerca de completar
        if (porcentajeCompletado >= 1.0) {
          // Barra completamente llena - efecto especial
          if (!this.completeTween || !this.completeTween.isPlaying()) {
            this.completeTween = this.tweens.add({
              targets: this.progressBarGlow,
              alpha: { from: 0.8, to: 1.0 },
              duration: 300,
              yoyo: true,
              repeat: -1,
              ease: 'Power2'
            });
            
            // Efecto de destello en el borde
            this.tweens.add({
              targets: this.progressBarBorder,
              alpha: { from: 1.0, to: 0.3 },
              duration: 500,
              yoyo: true,
              repeat: 2,
              ease: 'Power2'
            });
          }
        } else if (porcentajeCompletado > 0.8) {
          // Cerca de completar - brillo suave
          if (!this.glowTween || !this.glowTween.isPlaying()) {
            this.glowTween = this.tweens.add({
              targets: this.progressBarGlow,
              alpha: { from: 0.3, to: 0.8 },
              duration: 800,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
          }
        } else {
          // Detener efectos si no está cerca de completar
          if (this.glowTween && this.glowTween.isPlaying()) {
            this.glowTween.stop();
            this.progressBarGlow.alpha = 0.6;
          }
          if (this.completeTween && this.completeTween.isPlaying()) {
            this.completeTween.stop();
            this.progressBarGlow.alpha = 0.6;
          }
        }
      
      // Añadir efecto de brillo cuando se está cerca de completar
      if (porcentajeCompletado > 0.8 && !this.brilloActivado) {
        this.brilloActivado = true;
        
        // Crear efecto de partículas alrededor de la barra
        if (!this.emisorBrillo) {
          const particulas = this.add.particles('particula');
          this.emisorBrillo = particulas.createEmitter({
            x: { min: screenWidth / 2 - 200, max: screenWidth / 2 + 200 },
            y: 120,
            speed: { min: 20, max: 40 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            tint: 0x00ffff,
            frequency: 50,
            lifespan: 1000
          });
        }
      } else if (porcentajeCompletado <= 0.8 && this.brilloActivado) {
        this.brilloActivado = false;
        if (this.emisorBrillo) {
          this.emisorBrillo.remove();
          this.emisorBrillo = null;
        }
      }
      
      // Verificar si se completaron los puntos necesarios
      if (this.puntos >= this.puntosParaCompletarNivel) {
        // Mostrar mensaje de puntos alcanzados
        const screenWidth = this.sys.game.config.width;
        const screenHeight = this.sys.game.config.height;
        
        // Crear texto de puntos alcanzados
        const mensajePuntos = this.add.text(screenWidth / 2, screenHeight / 2 - 100, '¡PUNTOS COMPLETADOS!', {
          font: '30px Orbitron',
          fill: '#00ff00',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5).setDepth(101);
        
        // Efecto de desvanecimiento
        this.tweens.add({
          targets: mensajePuntos,
          alpha: 0,
          y: screenHeight / 2 - 150,
          duration: 1500,
          onComplete: () => mensajePuntos.destroy()
        });
        
        // Completar el nivel
        this.nivelCompletado();
      }
    }
  }
  
  // Método para actualizar el nivel de contención visual
  actualizarNivelContencion() {
    if (!this.nanorrobotsTotal) return;
    
    // Usar el porcentaje de contención calculado en actualizarContadores
    const porcentajeContención = this.nivelContencionPorcentaje / 100;
    const altura = Math.min(porcentajeContención * 160, 160); // Máximo 160px de altura
    
    // Verificar si se ha completado la contención (100%)
    // Solo verificar después de un tiempo para dar oportunidad de jugar
    if (porcentajeContención >= 1 && this.juegoActivo && this.tiempoInicio && (this.time.now - this.tiempoInicio > 5000)) {
      this.perderNivel();
      return;
    }
    
    this.nivelContencion.clear();
    
    // Cambiar color según el nivel de contención
    let color;
    let colorTexto;
    if (porcentajeContención < 0.3) {
      color = 0x00ff88; // Verde para contención baja (bueno)
      colorTexto = '#00ff00';
    } else if (porcentajeContención < 0.7) {
      color = 0xffff00; // Amarillo para contención media (precaución)
      colorTexto = '#ffff00';
    } else {
      color = 0xff0000; // Rojo para contención alta (peligro)
      colorTexto = '#ff0000';
    }
    
    this.nivelContencion.fillStyle(color, 0.7);
    this.nivelContencion.fillRect(
      this.zonaContenedor.x - 40, 
      this.zonaContenedor.y + 80 - altura, 
      80, 
      altura
    );
    
    // Actualizar el indicador de contención más visible
    if (this.contencionTexto) {
      this.contencionTexto.setText(`CONTENCIÓN: ${this.nivelContencionPorcentaje}%`);
      this.contencionTexto.setFill(colorTexto);
      
      // Añadir efecto de parpadeo cuando la contención es alta
      if (porcentajeContención >= 0.8) {
        if (!this.contencionParpadeo) {
          this.contencionParpadeo = this.tweens.add({
            targets: this.contencionTexto,
            alpha: { from: 1, to: 0.3 },
            yoyo: true,
            repeat: -1,
            duration: 300
          });
        }
      } else {
        if (this.contencionParpadeo) {
          this.contencionParpadeo.remove();
          this.contencionParpadeo = null;
          this.contencionTexto.alpha = 1;
        }
      }
    }
    
    // Actualizar la barra de contención
    if (this.contencionBarra) {
      const anchoBarra = 150 * porcentajeContención;
      this.contencionBarra.width = anchoBarra;
      this.contencionBarra.fillColor = color;
    }
    
    // Actualizar el texto de porcentaje en el contenedor
    if (this.contenedorPorcentajeTexto) {
      this.contenedorPorcentajeTexto.setText(`${this.nivelContencionPorcentaje}%`);
      this.contenedorPorcentajeTexto.setFill(colorTexto);
    }
    
    // Mostrar alerta visual cuando la contención es crítica (>= 80%)
    if (porcentajeContención >= 0.8) {
      if (!this.alertaContencion.visible) {
        this.alertaContencion.setVisible(true);
        
        // Crear efecto de alerta parpadeante en toda la pantalla
        const screenWidth = this.sys.game.config.width;
        const screenHeight = this.sys.game.config.height;
        
        this.alertaContencion.clear();
        this.alertaContencion.fillStyle(0xff0000, 0.1);
        this.alertaContencion.fillRect(0, 0, screenWidth, screenHeight);
        
        // Añadir borde rojo parpadeante
        this.alertaContencion.lineStyle(5, 0xff0000, 0.8);
        this.alertaContencion.strokeRect(5, 5, screenWidth - 10, screenHeight - 10);
        
        // Efecto de parpadeo para la alerta
         if (!this.alertaParpadeo) {
           this.alertaParpadeo = this.tweens.add({
             targets: this.alertaContencion,
             alpha: { from: 0.3, to: 0.8 },
             yoyo: true,
             repeat: -1,
             duration: 500
           });
         }
         
         // Mostrar mensaje de advertencia crítica
         if (this.advertenciaContencion && !this.advertenciaContencion.visible) {
           this.advertenciaContencion.setVisible(true);
           
           // Sonido de alarma de contención crítica
           if (this.sounds && this.sounds.contencionCritica) {
             this.sounds.contencionCritica.play();
           }
           
           // Efecto de parpadeo para el mensaje de advertencia
           if (!this.advertenciaParpadeo) {
             this.advertenciaParpadeo = this.tweens.add({
               targets: this.advertenciaContencion,
               alpha: { from: 1, to: 0.2 },
               scale: { from: 1, to: 1.1 },
               yoyo: true,
               repeat: -1,
               duration: 400
             });
           }
         }
       }
     } else {
       if (this.alertaContencion.visible) {
         this.alertaContencion.setVisible(false);
         if (this.alertaParpadeo) {
           this.alertaParpadeo.remove();
           this.alertaParpadeo = null;
         }
       }
       
       // Ocultar mensaje de advertencia crítica
       if (this.advertenciaContencion && this.advertenciaContencion.visible) {
         this.advertenciaContencion.setVisible(false);
         if (this.advertenciaParpadeo) {
           this.advertenciaParpadeo.remove();
           this.advertenciaParpadeo = null;
         }
       }
     }
  }
  
  // Método para manejar la derrota del nivel
  perderNivel() {
    // Detener el juego
    this.juegoActivo = false;
    if (this.temporizador) this.temporizador.remove();
    if (this.replicacionTimer) this.replicacionTimer.remove();
    
    // Limpiar el emisor de brillo si existe
    if (this.emisorBrillo) {
      this.emisorBrillo.remove();
      this.emisorBrillo = null;
    }
    
    // Obtener dimensiones de la pantalla
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // Crear fondo semitransparente
    const overlay = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.7)
      .setOrigin(0)
      .setDepth(100);
    
    // Crear texto de nivel perdido
    const mensajePerdido = this.add.text(screenWidth / 2, screenHeight / 2 - 50, '¡CONTENCIÓN FALLIDA!', {
      font: '40px Orbitron',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 4,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setDepth(101);
    
    // Crear texto de puntuación final
    const puntuacionTexto = this.add.text(screenWidth / 2, screenHeight / 2 + 20, `Puntuación final: ${this.puntos}`, {
      font: '30px Orbitron',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(101);
    
    // Crear botón de reintentar
    const reintentarBoton = this.add.text(screenWidth / 2, screenHeight / 2 + 100, 'REINTENTAR', {
      font: '24px Orbitron',
      fill: '#ffffff',
      backgroundColor: '#ff0000',
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 10
      }
    }).setOrigin(0.5).setDepth(101)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => reintentarBoton.setStyle({ fill: '#ffff00' }))
      .on('pointerout', () => reintentarBoton.setStyle({ fill: '#ffffff' }))
      .on('pointerdown', () => {
        // Reiniciar el nivel actual
        this.scene.restart();
      });
    
    // Efecto de partículas de error
    const particulas = this.add.particles('particula');
    
    // Emisor de partículas rojas
    const emisorError = particulas.createEmitter({
      x: screenWidth / 2,
      y: screenHeight / 2,
      speed: { min: 100, max: 300 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      tint: 0xff0000,
      lifespan: 2000,
      quantity: 3,
      frequency: 100
    });
    
    // Efecto de vibración en la pantalla
    this.cameras.main.shake(1000, 0.01);
    
    // Sonido de error (si existe)
    if (this.sounds && this.sounds.replicacion) {
          this.sounds.replicacion.play();
    }
  }
  
  iniciarJuego() {
    this.juegoActivo = true;
    this.nanorrobotsControlados = 0;
    this.nanorrobotsTotal = 0;
    this.puntos = 0; // Reiniciar puntos
    this.puntosParaCompletarNivel = 0; // Inicializar puntos necesarios para completar nivel
    this.brilloActivado = false; // Inicializar estado del efecto de brillo
    
    // Iniciar sonido ambiental de fondo
    if (this.sounds && this.sounds.ambientalFondo) {
      this.sounds.ambientalFondo.play();
    }
    
    // Ajustar tiempo según el nivel (reducido para facilitar avance)
    switch(this.nivelActual) {
      case 1:
        this.tiempoRestante = 45; // Menos tiempo en nivel 1
        this.puntosParaCompletarNivel = 250; // Puntos necesarios para nivel 1 (reducidos)
        break;
      case 2:
        this.tiempoRestante = 40;
        this.puntosParaCompletarNivel = 400; // Puntos necesarios para nivel 2 (reducidos)
        break;
      case 3:
        this.tiempoRestante = 35;
        this.puntosParaCompletarNivel = 600; // Puntos necesarios para nivel 3 (reducidos)
        break;
      default:
        this.tiempoRestante = 35;
        this.puntosParaCompletarNivel = 600; // Menos tiempo en nivel 3 pero más desafiante
        break;
    }
    
    // Inicializar la barra de progreso
    if (this.progressBar) {
      this.progressBar.width = 0;
      this.progressBar.fillColor = 0xff3333; // Rojo brillante al inicio
      this.progressBarGlow.width = 0;
      
      // Inicializar variables de animación
      this.progressBarWidth = 0;
      this.targetProgressWidth = 0;
      this.lastProgressWidth = 0;
    }
    
    // Actualizar el texto de puntos necesarios
    if (this.puntosNecesariosTexto) {
      this.puntosNecesariosTexto.setText(`Puntos para completar: 0/${this.puntosParaCompletarNivel}`);
    }
    
    this.nivelContencionPorcentaje = 0;
    this.tiempoInicio = this.time.now; // Registrar el tiempo de inicio del juego
    
    // Iniciar el temporizador
    this.temporizador = this.time.addEvent({
      delay: 1000,
      callback: this.actualizarTiempo,
      callbackScope: this,
      loop: true
    });
    
    // Establecer el temporizador de replicación basado en el nivel actual
    const replicacionDelay = Math.max(1000, 4000 - (this.nivelActual * 500));
    
    // Iniciar la generación de nanorrobots según el nivel
    this.iniciarNivel(this.nivelActual);
    
    // Mostrar mensaje de inicio de nivel
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    const nivelMensaje = this.add.text(screenWidth / 2, screenHeight / 2 - 50, `NIVEL ${this.nivelActual}`, {
      font: '40px Orbitron',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setDepth(100);
    
    // Animación de mensaje de nivel
    this.tweens.add({
      targets: nivelMensaje,
      scale: { from: 0.5, to: 1.5 },
      alpha: { from: 1, to: 0 },
      duration: 1500,
      onComplete: () => {
        nivelMensaje.destroy();
      }
    });
  }
  
  iniciarNivel(nivel) {
    // Limpiar nanorrobots existentes
    this.nanorrobotsGroup.clear(true, true);
    
    // Configurar dificultad según el nivel (reducida para facilitar avance)
    let cantidadInicial;
    let velocidadReplicacion;
    let velocidadMovimiento;
    
    // Ajustar parámetros según el nivel
    switch(nivel) {
      case 1:
        cantidadInicial = 8; // Más nanorrobots en nivel 1 para mayor desafío
        velocidadReplicacion = 4000; // Replicación más lenta
        velocidadMovimiento = 40; // Movimiento más lento
        break;
      case 2:
        cantidadInicial = 5; // Cantidad moderada en nivel 2
        velocidadReplicacion = 3000; // Replicación moderada
        velocidadMovimiento = 60; // Movimiento moderado
        break;
      case 3:
      default:
        cantidadInicial = 8; // Más nanorrobots en nivel 3
        velocidadReplicacion = 2000; // Replicación más rápida
        velocidadMovimiento = 80; // Movimiento más rápido
        break;
    }
    
    // Inicializar con algunos nanorrobots ya controlados para evitar 100% de contención al inicio
    this.nanorrobotsTotal = cantidadInicial;
    this.nanorrobotsControlados = Math.ceil(cantidadInicial * 0.2); // 20% controlados al inicio
    this.nivelContencionPorcentaje = 80; // 80% de contención inicial
    
    // Crear nanorrobots iniciales
    const nanorrobotsCreados = [];
    for (let i = 0; i < cantidadInicial; i++) {
      const nanorrobot = this.crearNanorrobot();
      nanorrobotsCreados.push(nanorrobot);
    }
    
    // Marcar algunos como controlados al inicio
    const cantidadControlados = Math.ceil(cantidadInicial * 0.2); // 20% controlados
    for (let i = 0; i < cantidadControlados && i < nanorrobotsCreados.length; i++) {
      const nanorrobot = nanorrobotsCreados[i];
      nanorrobot.setTint(0x00ff00); // Color verde para los controlados
      nanorrobot.controlado = true;
    }
    
    // Configurar evento de replicación
    if (this.replicacionTimer) {
      this.replicacionTimer.remove();
    }
    
    // Ajustar velocidad de replicación según el nivel actual
    const replicacionDelay = Math.max(1000, velocidadReplicacion);
    this.replicacionTimer = this.time.addEvent({
      delay: replicacionDelay,
      callback: this.replicarNanorrobots,
      callbackScope: this,
      loop: true
    });
    
    // Actualizar textos
    this.actualizarContadores();
  }
  
  crearNanorrobot() {
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // Posición aleatoria (evitando el área del contenedor)
    let x = Phaser.Math.Between(50, screenWidth - 200);
    let y = Phaser.Math.Between(150, screenHeight - 100);
    
    // Crear el nanorrobot
    const nanorrobot = this.nanorrobotsGroup.create(x, y, 'nanorrobot');
    nanorrobot.setDisplaySize(20, 20); // Tamaño reducido para hacerlos más pequeños
    nanorrobot.setTint(0xff0000); // Color rojo para los nanorrobots no contenidos
    
    // Hacer que el nanorrobot sea interactivo
    nanorrobot.setInteractive();
    this.input.setDraggable(nanorrobot);
    
    // Movimiento aleatorio
    nanorrobot.velocidadX = Phaser.Math.Between(-50, 50);
    nanorrobot.velocidadY = Phaser.Math.Between(-50, 50);
    
    // No incrementamos this.nanorrobotsTotal aquí porque ya se establece en iniciarNivel()
    // Solo actualizamos contadores durante la replicación, no durante la inicialización
    if (this.juegoActivo) {
      this.nanorrobotsTotal++;
      this.actualizarContadores();
    }
    
    return nanorrobot;
  }
  
  replicarNanorrobots() {
    if (!this.juegoActivo) return;
    
    // Calcular cuántos nanorrobots replicar basado en el nivel de contención y nivel actual
    // Cuanto mayor sea el nivel de contención, más rápido se replican
    let cantidadReplicar = 1; // Base
    
    // Ajustar umbrales según el nivel actual para una progresión más gradual
    let umbralModerado, umbralRapido, umbralCritico;
    
    switch(this.nivelActual) {
      case 1: // Nivel 1: replicación más lenta
        umbralModerado = 40; // Más alto = más difícil
        umbralRapido = 70;
        umbralCritico = 90;
        break;
      case 2: // Nivel 2: replicación moderada
        umbralModerado = 35;
        umbralRapido = 65;
        umbralCritico = 85;
        break;
      case 3: // Nivel 3: replicación más agresiva
      default:
        umbralModerado = 30;
        umbralRapido = 60;
        umbralCritico = 80;
        break;
    }
    
    if (this.nivelContencionPorcentaje > umbralModerado) {
      cantidadReplicar = 2; // Replicación moderada
    }
    
    if (this.nivelContencionPorcentaje > umbralRapido) {
      cantidadReplicar = 3; // Replicación rápida
    }
    
    if (this.nivelContencionPorcentaje > umbralCritico) {
      cantidadReplicar = 4; // Replicación crítica
    }
    
    // Obtener nanorrobots existentes para replicar
    const nanorrobots = this.nanorrobotsGroup.getChildren();
    if (nanorrobots.length > 0) {
      // Replicar la cantidad calculada
      for (let i = 0; i < cantidadReplicar; i++) {
        if (nanorrobots.length === 0) break;
        
        const indice = Phaser.Math.Between(0, nanorrobots.length - 1);
        const nanorrobotPadre = nanorrobots[indice];
        
        // Solo replicar si no está siendo arrastrado
        if (!nanorrobotPadre.input.draggable) continue;
        
        // Crear un nuevo nanorrobot cerca del padre
        const nuevoNanorrobot = this.crearNanorrobot();
        nuevoNanorrobot.x = nanorrobotPadre.x + Phaser.Math.Between(-20, 20);
        nuevoNanorrobot.y = nanorrobotPadre.y + Phaser.Math.Between(-20, 20);
        
        // Efecto visual de replicación
        this.tweens.add({
          targets: nuevoNanorrobot,
          scaleX: { from: 0.5, to: 1 },
          scaleY: { from: 0.5, to: 1 },
          alpha: { from: 0.5, to: 1 },
          duration: 300
        });
      }
      
      // Sonido de replicación con volumen basado en nivel de contención
      if (this.sounds && this.sounds.replicacionRapida) {
        this.sounds.replicacionRapida.play();
      }
      
      // Efecto visual de alerta si la contención es alta
      if (this.nivelContencionPorcentaje > 70) {
        this.cameras.main.flash(200, 255, 0, 0, 0.3); // Flash rojo
      }
    }
  }
  
  actualizarTiempo() {
    if (!this.juegoActivo) return;
    
    this.tiempoRestante--;
    this.tiempoTexto.setText(`Tiempo: ${this.tiempoRestante}s`);
    
    if (this.tiempoRestante <= 0) {
      // Verificar si se ha completado el nivel con porcentaje variable según nivel
      let porcentajeRequerido;
      
      switch(this.nivelActual) {
        case 1:
          porcentajeRequerido = 0.5; // Solo 50% en nivel 1
          break;
        case 2:
          porcentajeRequerido = 0.6; // 60% en nivel 2
          break;
        case 3:
        default:
          porcentajeRequerido = 0.7; // 70% en nivel 3
          break;
      }
      
      if (this.nanorrobotsControlados >= this.nanorrobotsTotal * porcentajeRequerido) {
        this.nivelCompletado();
      } else {
        this.gameOver();
      }
    }
  }
  
  actualizarContadores() {
    this.contadorTexto.setText(`Nanorrobots contenidos: ${this.nanorrobotsControlados}/${this.nanorrobotsTotal}`);
    this.nivelTexto.setText(`Nivel: ${this.nivelActual}/${this.nivelesMax}`);
    
    // Calcular porcentaje de contención (inverso al porcentaje de control)
    // 0% = todos controlados, 100% = ninguno controlado
    if (this.nanorrobotsTotal > 0) {
      const controlados = this.nanorrobotsControlados / this.nanorrobotsTotal;
      this.nivelContencionPorcentaje = Math.min(100, Math.floor((1 - controlados) * 100));
    } else {
      this.nivelContencionPorcentaje = 0;
    }
    
    // Actualizar el nivel de contención visual
    this.actualizarNivelContencion();
    
    // Actualizar la barra de progreso de puntos
    this.verificarPuntosParaCompletarNivel();
    
    // Verificar si se ha perdido el nivel (100% de contención)
    // Solo verificar después de un tiempo para dar oportunidad de jugar
    if (this.nivelContencionPorcentaje >= 100 && this.juegoActivo && this.tiempoInicio && (this.time.now - this.tiempoInicio > 5000)) {
      this.perderNivel();
    }
  }
  
  nivelCompletado() {
    // Detener el juego
    this.juegoActivo = false;
    this.temporizador.remove();
    this.replicacionTimer.remove();
    
    // Limpiar el emisor de brillo si existe
    if (this.emisorBrillo) {
      this.emisorBrillo.remove();
      this.emisorBrillo = null;
    }
    
    // Sonido de nivel completado
    if (this.sounds && this.sounds.nivelCompletado) {
      this.sounds.nivelCompletado.play();
    }
    
    // Efecto de partículas para celebración
    const particles = this.add.particles('particula');
    const emitter = particles.createEmitter({
      x: this.sys.game.config.width / 2,
      y: this.sys.game.config.height / 2,
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      gravityY: 100
    });
    
    // Emitir partículas
    emitter.explode(50);
    
    // Mensaje de nivel completado
    const mensaje = this.nivelActual < this.nivelesMax ? 
      '¡Nivel completado! Preparando siguiente fase de contención...' : 
      '¡Protocolo de contención completado! La estabilidad ha sido restaurada en NanoTerra.';
    
    // Mostrar mensaje con SweetAlert2
    Swal.fire({
      title: '¡Protocolo de Contención Activado!',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Continuar',
      customClass: {
        container: 'custom-container-class',
        popup: 'custom-popup-class'
      }
    }).then(() => {
      if (this.nivelActual < this.nivelesMax) {
        // Pasar al siguiente nivel
        this.nivelActual++;
        this.iniciarJuego();
      } else {
        // Mostrar mensaje de felicitaciones épico con animaciones
        Swal.fire({
          title: '<div class="animated-title">🎉 ¡FELICITACIONES! 🎉</div>',
          html: `
            <style>
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-30px); }
                60% { transform: translateY(-15px); }
              }
              @keyframes glow {
                0% { text-shadow: 0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88; }
                50% { text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88; }
                100% { text-shadow: 0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 15px #00ff88; }
              }
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
              @keyframes rainbow {
                0% { color: #ff0000; }
                16% { color: #ff8000; }
                33% { color: #ffff00; }
                50% { color: #00ff00; }
                66% { color: #0080ff; }
                83% { color: #8000ff; }
                100% { color: #ff0000; }
              }
              .animated-title {
                animation: bounce 2s infinite, glow 2s ease-in-out infinite;
                font-size: 28px !important;
                font-weight: bold;
              }
              .success-message {
                animation: pulse 3s ease-in-out infinite;
                font-size: 18px;
                margin-bottom: 20px;
                color: #00ff88;
                text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
              }
              .hero-message {
                animation: glow 2s ease-in-out infinite;
                font-size: 16px;
                color: #88ddff;
                margin: 15px 0;
              }
              .final-score {
                animation: rainbow 3s linear infinite, pulse 2s ease-in-out infinite;
                font-size: 20px;
                font-weight: bold;
                margin-top: 20px;
                text-shadow: 0 0 15px rgba(255, 255, 0, 0.8);
              }
              .particles {
                position: absolute;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
              }
              .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffff00;
                border-radius: 50%;
                animation: float 3s ease-in-out infinite;
              }
              @keyframes float {
                0% { transform: translateY(100px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
              }
            </style>
            <div class="particles">
              <div class="particle" style="left: 10%; animation-delay: 0s;"></div>
              <div class="particle" style="left: 20%; animation-delay: 0.5s;"></div>
              <div class="particle" style="left: 30%; animation-delay: 1s;"></div>
              <div class="particle" style="left: 40%; animation-delay: 1.5s;"></div>
              <div class="particle" style="left: 50%; animation-delay: 2s;"></div>
              <div class="particle" style="left: 60%; animation-delay: 0.3s;"></div>
              <div class="particle" style="left: 70%; animation-delay: 0.8s;"></div>
              <div class="particle" style="left: 80%; animation-delay: 1.3s;"></div>
              <div class="particle" style="left: 90%; animation-delay: 1.8s;"></div>
            </div>
            <div class="success-message">✨ Has completado con éxito todos los niveles del Protocolo de Contención ✨</div>
            <div class="hero-message">🦾 Tu habilidad y destreza han salvado a NanoTerra de la crisis de replicación descontrolada 🌍</div>
            <div class="final-score">⭐ Puntuación final: ${this.puntos} ⭐</div>
          `,
          icon: 'success',
          confirmButtonText: '🚀 Continuar a la siguiente misión',
          background: 'linear-gradient(135deg, #000033 0%, #000066 50%, #000099 100%)',
          backdrop: `
            rgba(0,0,123,0.6)
            url("assets/rompecabezas/Taller.png")
            center top
            no-repeat
          `,
          customClass: {
            title: 'custom-title-class',
            confirmButton: 'custom-confirm-button-class'
          },
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOut'
          }
        }).then(() => {
          // Juego completado, pasar a la escena de fallos
          if (this.sounds && this.sounds.transicionNivel) {
            this.sounds.transicionNivel.play();
          }
          // Pequeña pausa antes de la transición para que se escuche el sonido
          this.time.delayedCall(500, () => {
            this.scene.start('scenaFallos');
          });
        });
      }
    });
  }
  
  gameOver() {
    // Detener el juego
    this.juegoActivo = false;
    this.temporizador.remove();
    this.replicacionTimer.remove();
    
    // Mostrar mensaje de game over
    Swal.fire({
      title: '¡Alerta de Replicación!',
      text: 'Los nanorrobots han superado la capacidad de contención. La estabilidad de NanoTerra está en riesgo.',
      icon: 'error',
      confirmButtonText: 'Reintentar',
      customClass: {
        container: 'custom-container-class',
        popup: 'custom-popup-class'
      }
    }).then(() => {
      // Reiniciar el nivel actual
      this.iniciarJuego();
    });
  }
  
  update() {
    if (!this.juegoActivo) return;
    
    // Mover los nanorrobots
    const nanorrobots = this.nanorrobotsGroup.getChildren();
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    for (let i = 0; i < nanorrobots.length; i++) {
      const nanorrobot = nanorrobots[i];
      
      // Solo mover si no está siendo arrastrado
      if (nanorrobot.input.dragState === 0) {
        nanorrobot.x += nanorrobot.velocidadX * 0.01;
        nanorrobot.y += nanorrobot.velocidadY * 0.01;
        
        // Rebotar en los bordes
        if (nanorrobot.x < 30 || nanorrobot.x > screenWidth - 180) {
          nanorrobot.velocidadX *= -1;
        }
        if (nanorrobot.y < 130 || nanorrobot.y > screenHeight - 80) {
          nanorrobot.velocidadY *= -1;
        }
      }
    }
  }
  
  // Configurar eventos de interacción
  configurarEventos() {
    // Evento de inicio de arrastre
    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setTint(0xffff00); // Amarillo mientras se arrastra
      gameObject.setScale(1.2); // Aumentar tamaño ligeramente
      
      // Efecto de estela al arrastrar
      gameObject.estela = this.add.particles('particula').createEmitter({
        follow: gameObject,
        scale: { start: 0.2, end: 0 },
        speed: 20,
        lifespan: 200,
        blendMode: 'ADD',
        tint: 0xffff00,
        frequency: 50
      });
    });
    
    // Evento durante el arrastre
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    
    // Evento de fin de arrastre
    this.input.on('dragend', (pointer, gameObject) => {
      // Detener la estela
      if (gameObject.estela) {
        gameObject.estela.remove();
      }
      
      // Verificar si el nanorrobot está sobre el contenedor
      const bounds = this.zonaContenedor.getBounds();
      if (Phaser.Geom.Rectangle.Contains(bounds, gameObject.x, gameObject.y)) {
        // Nanorrobot contenido
        this.nanorrobotsControlados++;
        this.actualizarContadores();
        
        // Añadir puntos flotantes
        this.mostrarPuntos(gameObject.x, gameObject.y);
        
        // Efecto visual mejorado
        this.tweens.add({
          targets: gameObject,
          alpha: 0,
          scaleX: 0.1,
          scaleY: 0.1,
          duration: 300,
          onComplete: () => {
            // Explosión de partículas al ser contenido
            const particulas = this.add.particles('particula');
            const emisor = particulas.createEmitter({
              x: gameObject.x,
              y: gameObject.y,
              speed: { min: 50, max: 100 },
              angle: { min: 0, max: 360 },
              scale: { start: 0.4, end: 0 },
              blendMode: 'ADD',
              tint: [0x00ffff, 0x0088ff, 0x00ff88],
              lifespan: 500
            });
            
            // Emitir partículas y luego destruirlas
            emisor.explode(20);
            this.time.delayedCall(500, () => {
              particulas.destroy();
            });
            
            gameObject.destroy();
          }
        });
        
        // Intensificar el emisor del contenedor temporalmente
        this.emisorContenedor.setQuantity(10);
        this.emisorContenedor.setFrequency(50);
        this.time.delayedCall(500, () => {
          this.emisorContenedor.setQuantity(1);
          this.emisorContenedor.setFrequency(500);
        });
        
        // Sonido de captura
        if (this.sounds && this.sounds.capturaExitosa) {
        this.sounds.capturaExitosa.play();
      }
        
        // Verificar si se han contenido todos los nanorrobots
        if (this.nanorrobotsControlados >= this.nanorrobotsTotal) {
          this.nivelCompletado();
        }
      } else {
        // Volver a color normal y tamaño normal
        gameObject.setTint(0xff0000);
        gameObject.setScale(1);
      }
    });
  }
  
  // Método para mostrar puntos flotantes
  mostrarPuntos(x, y) {
    // Calcular puntos basados en el nivel actual (reducidos)
    const puntosGanados = 50 * this.nivelActual;
    
    // Incrementar contador global de puntos
    this.puntos += puntosGanados;
    
    // Sonido de puntos ganados
    if (this.sounds && this.sounds.puntosGanados) {
      this.sounds.puntosGanados.play();
    }
    
    // Actualizar texto de puntos con animación
    this.puntosTexto.setText(`Puntos: ${this.puntos}`);
    
    // Animación del contador de puntos
    this.tweens.add({
      targets: this.puntosTexto,
      scaleX: { from: 1, to: 1.3 },
      scaleY: { from: 1, to: 1.3 },
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Efecto de brillo en el contador
    this.tweens.add({
      targets: this.puntosTexto,
      alpha: { from: 1, to: 0.7 },
      duration: 150,
      yoyo: true,
      repeat: 1,
      ease: 'Power1'
    });
    
    // Cambio temporal de color para resaltar
    const colorOriginal = this.puntosTexto.style.fill;
    this.puntosTexto.setFill('#00ff88'); // Verde brillante
    
    this.time.delayedCall(400, () => {
      this.puntosTexto.setFill(colorOriginal); // Volver al color original
    });
    
    // Verificar si se alcanzó el bonus
    if (!this.bonusActivado && this.puntos >= this.puntosParaBonus) {
      this.activarBonus();
    }
    
    // Verificar si se alcanzaron los puntos necesarios para completar el nivel
    this.verificarPuntosParaCompletarNivel();
    
    // Crear texto de puntos flotantes
    const puntosTexto = this.add.text(x, y, `+${puntosGanados}`, {
      font: '20px Orbitron',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // Animación de puntos flotantes
    this.tweens.add({
      targets: puntosTexto,
      y: y - 50,
      alpha: { from: 1, to: 0 },
      scale: { from: 1, to: 1.5 },
      duration: 1000,
      onComplete: () => {
        puntosTexto.destroy();
      }
    });
  }
  
  // Método para activar el bonus al llegar a 500 puntos
  activarBonus() {
    this.bonusActivado = true;
    
    // Sonido de bonus activado
    if (this.sounds && this.sounds.bonusActivado) {
      this.sounds.bonusActivado.play();
    }
    
    // Mostrar mensaje de bonus
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;
    
    // Crear texto de bonus
    const bonusTexto = this.add.text(screenWidth / 2, screenHeight / 2, '¡BONUS ACTIVADO!', {
      font: '40px Orbitron',
      fill: '#ffff00',
      stroke: '#ff0000',
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 5,
        stroke: true,
        fill: true
      }
    }).setOrigin(0.5).setDepth(100);
    
    // Efecto de partículas especiales
    const particulas = this.add.particles('particula');
    
    // Emisor circular
    const emisorCircular = particulas.createEmitter({
      x: screenWidth / 2,
      y: screenHeight / 2,
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      blendMode: 'ADD',
      tint: [0xffff00, 0xff00ff, 0x00ffff, 0xff8800],
      lifespan: 2000,
      quantity: 5,
      frequency: 50
    });
    
    // Emisor radial
    const emisorRadial = particulas.createEmitter({
      x: screenWidth / 2,
      y: screenHeight / 2,
      speed: 150,
      angle: { min: 0, max: 360 },
      scale: { start: 0.4, end: 0 },
      blendMode: 'ADD',
      tint: 0xffff00,
      lifespan: 1000
    });
    
    // Emitir explosión radial
    emisorRadial.explode(50);
    
    // Animación de texto de bonus
    this.tweens.add({
      targets: bonusTexto,
      scale: { from: 0.5, to: 1.5 },
      yoyo: true,
      repeat: 2,
      duration: 500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        // Desaparecer texto
        this.tweens.add({
          targets: bonusTexto,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            bonusTexto.destroy();
          }
        });
      }
    });
    
    // Detener emisores después de un tiempo
    this.time.delayedCall(3000, () => {
      particulas.destroy();
    });
    
    // Aplicar efectos de bonus (por ejemplo, tiempo extra)
    this.tiempoRestante += 30; // Añadir 30 segundos extra
    this.tiempoTexto.setText(`Tiempo: ${this.tiempoRestante}s`);
    
    // Efecto visual en el texto de tiempo
    this.tweens.add({
      targets: this.tiempoTexto,
      scale: { from: 1, to: 1.5 },
      yoyo: true,
      repeat: 3,
      duration: 200,
      ease: 'Sine.easeInOut'
    });
  }
}