document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const GAME_WIDTH = canvas.width;
    const GAME_HEIGHT = canvas.height;
    const GRAVITY = 0.6;
    const JUMP_POWER = 16;
    const SCROLL_SPEED = 7;      // Velocidade de rolagem (Fundo)
    const PLAYER_SIDE_SPEED = 10; // Velocidade lateral do personagem
    const GROUND_HEIGHT = 80;
    const LADYBUG_GOAL = 19;

    let scrollX = 0;
    let collectedCount = 0;
    let keys = {};
    let gameOver = false;

    const imgPlayer = new Image();
    imgPlayer.src = 'img/pamela-jogo.png';

    const imgLadybug = new Image();
    imgLadybug.src = 'img/joana-jogo.png';

    const imgWall = new Image();
    imgWall.src = 'img/talisson-jogo.png';

    // Hitbox muito fino (20px) para compensar a alta velocidade
    const player = {
        x: 135,
        y: GAME_HEIGHT - GROUND_HEIGHT - 130,
        width: 20, 
        height: 130,
        vy: 0,
        onGround: false
    };

    const platforms = [];
    const platformWidth = 300;
    for (let i = 0; i < 50; i++) {
        const hasGap = Math.random() < 0.15 && (i === 0 || !platforms[i - 1].hasGap);
        if (hasGap) {
            platforms.push({ hasGap: true });
        } else {
            platforms.push({
                x: i * platformWidth,
                y: GAME_HEIGHT - GROUND_HEIGHT,
                width: platformWidth,
                height: GROUND_HEIGHT,
                hasGap: false
            });
        }
    }

    const obstacles = [];
    for (let i = 700; i < 15000; i += 1200) {
        const h = 80 + Math.random() * 60;
        obstacles.push({
            x: i,
            y: GAME_HEIGHT - GROUND_HEIGHT - h,
            width: 100,
            height: h
        });
    }

    
    const ladybugs = [];
function spawnLadybug(x) {
    const y = GAME_HEIGHT - GROUND_HEIGHT - (Math.random() * 120 + 125); 
    ladybugs.push({ x, y, collected: false });
}
for (let i = 400; i < 15000; i += 664) spawnLadybug(i);
    
    document.addEventListener('keydown', (e) => {
    // 1. Impede a ação padrão (rolagem da tela, etc.) para o jogo
    if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
    }
    
    // 2. Registra a tecla para a lógica do jogo
    keys[e.code] = true;
});
document.addEventListener('keyup', (e) => keys[e.code] = false);

    function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
        return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    function update() {
        if (gameOver) return false;

        scrollX += SCROLL_SPEED;

        player.vy += GRAVITY;
        player.y += player.vy;

        if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(player.x + PLAYER_SIDE_SPEED, GAME_WIDTH * 0.45);
        if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(player.x - PLAYER_SIDE_SPEED, 110); 

        if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.onGround) {
            player.vy = -JUMP_POWER;
            player.onGround = false;
        }

        player.onGround = false;
        const collisionPadding = 5;
        for (const p of platforms) {
            if (p.hasGap) continue;
            const px = p.x - scrollX;
            if (rectsOverlap(player.x, player.y, player.width, player.height, px, p.y, p.width, p.height)) {
                if (player.vy >= 0 && (player.y + player.height - p.y) <= collisionPadding + player.vy) {
                    player.y = p.y - player.height;
                    player.vy = 0;
                    player.onGround = true;
                }
            }
        }

        for (const obs of obstacles) {
            const ox = obs.x - scrollX;
            if (rectsOverlap(player.x, player.y, player.width, player.height, ox, obs.y, obs.width, obs.height)) {
                gameOver = true;
                showGameOver();
                return false;
            }
        }

        if (player.y > GAME_HEIGHT) {
            gameOver = true;
            showGameOver();
            return false;
        }

        ladybugs.forEach(l => {
            if (!l.collected && rectsOverlap(player.x, player.y, player.width, player.height, l.x - scrollX, l.y, 40, 40)) {
                l.collected = true;
                collectedCount++;
                document.getElementById('score').textContent = `Joaninhas coletadas: ${collectedCount} / ${LADYBUG_GOAL}`;
            }
        });

        if (collectedCount >= LADYBUG_GOAL) {
        const modal = document.getElementById('prizeModal');

        // Injeta o novo conteúdo completo de VITÓRIA no modal
        modal.innerHTML = `
         <div class="modal-content">
             <h2>🥳 Parabéns, AMOR! 🥳</h2>
             <p>Você é INCRIVEL!</p>
             <div class="ticket-prize">
              <h3>🎁 Vale Refeição Joazinho!! Você ganhou o direito a uma receita especial à sua escolha! (Para resgatar, você terá que dormir aqui em casa!  ❤️</h3>
             </div>
             <button onclick="window.location.href='index2.html'" class="cta-button">Voltar ao Menu</button>
             </div>
        `;

            modal.classList.add('visible');
            return false;
         }

        return true;
    }

    function draw() {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        ctx.fillStyle = '#7a4494ff';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        platforms.forEach(p => {
            if (p.hasGap) return;
            const px = p.x - scrollX;
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(px, p.y, p.width, 20);
            ctx.fillStyle = '#a0522d';
            ctx.fillRect(px, p.y + 20, p.width, p.height - 20);
        });

        obstacles.forEach(o => {
            ctx.drawImage(imgWall, o.x - scrollX, o.y, o.width, o.height);
        });

        ladybugs.forEach(l => {
            if (!l.collected) ctx.drawImage(imgLadybug, l.x - scrollX - 20, l.y - 20, 40, 40);
        });

        // Desenha a imagem de 90px com offset de 35px para centralizar sobre o hitbox de 20px.
        ctx.drawImage(imgPlayer, player.x - 35, player.y, 90, player.height);
    }

    function showGameOver() {
    const modal = document.getElementById('prizeModal');
    
    // Conteúdo HTML do Game Over com o botão
    modal.innerHTML = `
        <div class="modal-content">
            <h2>💀 se fudeu</h2>
            <p>Você apodreceu ao encosntar no talisson ou caiu no void</p>
            <button onclick="window.location.reload()" class="cta-button">Tente salvar as joaninhas de novo</button>
            <button onclick="window.location.href='index2.html'" class="cta-button secondary-button">Voltar ao Menu</button>
        </div>
    `;

    modal.classList.add('visible');
}

    function gameLoop() {
        const running = update();
        draw();
        if (running) requestAnimationFrame(gameLoop);
    }

    gameLoop();
});