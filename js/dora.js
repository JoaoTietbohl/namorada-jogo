document.addEventListener('DOMContentLoaded', () => {
    const ASSET_NAMES = [
        'dora-1.png', 
        'dora-2.png', 
        'dora-3.png', 
        'dora-4.png', 
        'dora-5.png',
        'dora-6.png',
        'dora-7.png',
    ]; 
    
    let cardAssets = [...ASSET_NAMES, ...ASSET_NAMES];
    
    const GRID = document.getElementById('memoryGrid');
    const TOTAL_PAIRS = ASSET_NAMES.length;
    
    let flippedCards = []; 
    let matchesFound = 0;
    let lockBoard = false; 

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        shuffle(cardAssets);
        
        cardAssets.forEach((assetName, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.asset = assetName;
            card.dataset.index = index;
            card.addEventListener('click', flipCard);

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front card-face"></div>
                    <div class="card-back card-face">
                        <img src="img/${assetName}" alt="Dora">
                    </div>
                </div>
            `;
            GRID.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.asset === card2.dataset.asset;

        if (isMatch) {
            disableCards(card1, card2);
        } else {
            unflipCards();
        }
    }

    function disableCards(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchesFound++;
        
        resetBoard();

        if (matchesFound === TOTAL_PAIRS) {
            showPrizeModal();
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped'));
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    function showPrizeModal() {
        document.getElementById('prizeModal').classList.add('visible');
    }

    function showPrizeModal() {
        const modal = document.getElementById('prizeModal');
        
        // 1. Define o conteúdo do prêmio
        const prizeHTML = `
            <h3>🥳 Parabéns, Meu bem! 🥳</h3>
            <p>Você é muito foda !</p>
            <p>Seu prêmio é: Um super Vale Cinema com pipoca doce e filme à sua escolha!(sem o kauan) ❤️</p>
            <button onclick="window.location.href='index2.html'">Voltar ao Menu</button>
        `;

        // 2. Insere o HTML no modal (assumindo que o modal-content tem ID)
        document.getElementById('modalContent').innerHTML = prizeHTML;

        // 3. Exibe o modal
        modal.classList.add('visible');
    }

    createBoard();
});