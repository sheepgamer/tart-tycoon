class TartTycoon {
    constructor() {
        // Game state
        this.gold = 0;
        this.totalApples = 0;
        this.appleRate = 0;
        
        // Upgrades data
        this.upgrades = [
            {
                id: 'farmer',
                name: 'Apple Farmer',
                description: '+0.1 apples/sec',
                cost: 10,
                rate: 0.1,
                count: 0,
                emoji: '👨‍🌾'
            },
            {
                id: 'orchard',
                name: 'Small Orchard',
                description: '+1 apple/sec',
                cost: 100,
                rate: 1,
                count: 0,
                emoji: '🌳'
            },
            {
                id: 'greenhouse',
                name: 'Greenhouse',
                description: '+10 apples/sec',
                cost: 500,
                rate: 10,
                count: 0,
                emoji: '🏠'
            },
            {
                id: 'factory',
                name: 'Apple Factory',
                description: '+50 apples/sec',
                cost: 2000,
                rate: 50,
                count: 0,
                emoji: '🏭'
            },
            {
                id: 'empire',
                name: 'Apple Empire',
                description: '+200 apples/sec',
                cost: 10000,
                rate: 200,
                count: 0,
                emoji: '👑'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderUpgrades();
        this.gameLoop();
        this.loadGame();
    }

    setupEventListeners() {
        document.getElementById('appleButton').addEventListener('click', () => this.clickApple());
    }

    clickApple() {
        this.gold += 1;
        this.totalApples += 1;
        this.updateDisplay();
        this.createFloatingText('+1');
    }

    createFloatingText(text) {
        const apple = document.getElementById('appleButton');
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.position = 'absolute';
        floatingText.style.color = '#ff6b6b';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.fontSize = '1.5em';
        floatingText.style.pointerEvents = 'none';
        
        const rect = apple.getBoundingClientRect();
        floatingText.style.left = (rect.left + rect.width / 2) + 'px';
        floatingText.style.top = (rect.top) + 'px';
        
        document.body.appendChild(floatingText);
        
        let opacity = 1;
        let y = 0;
        const interval = setInterval(() => {
            y -= 2;
            opacity -= 0.05;
            floatingText.style.transform = `translateY(${y}px)`;
            floatingText.style.opacity = opacity;
            
            if (opacity <= 0) {
                clearInterval(interval);
                floatingText.remove();
            }
        }, 30);
    }

    buyUpgrade(id) {
        const upgrade = this.upgrades.find(u => u.id === id);
        
        if (!upgrade || this.gold < upgrade.cost) {
            return;
        }

        this.gold -= upgrade.cost;
        upgrade.count += 1;
        this.appleRate += upgrade.rate;
        
        this.updateDisplay();
        this.renderUpgrades();
        this.saveGame();
    }

    renderUpgrades() {
        const container = document.getElementById('upgradesContainer');
        container.innerHTML = '';

        this.upgrades.forEach(upgrade => {
            const button = document.createElement('button');
            button.className = 'upgrade-btn';
            button.disabled = this.gold < upgrade.cost;
            button.innerHTML = `
                <strong>${upgrade.emoji} ${upgrade.name}</strong>
                <small>${upgrade.description}</small>
                <small>Cost: $${upgrade.cost} | Owned: ${upgrade.count}</small>
            `;
            
            button.addEventListener('click', () => this.buyUpgrade(upgrade.id));
            container.appendChild(button);
        });
    }

    updateDisplay() {
        document.getElementById('gold').textContent = '$' + this.gold.toLocaleString();
        document.getElementById('totalApples').textContent = this.totalApples.toLocaleString();
        document.getElementById('appleRate').textContent = this.appleRate.toFixed(1);
    }

    gameLoop() {
        setInterval(() => {
            const deltaTime = 0.1; // 100ms per tick
            this.gold += this.appleRate * deltaTime;
            this.totalApples += this.appleRate * deltaTime;
            this.updateDisplay();
        }, 100);

        // Save game every 10 seconds
        setInterval(() => this.saveGame(), 10000);
    }

    saveGame() {
        const saveData = {
            gold: Math.floor(this.gold),
            totalApples: Math.floor(this.totalApples),
            appleRate: this.appleRate,
            upgrades: this.upgrades
        };
        localStorage.setItem('tartTycoonSave', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('tartTycoonSave');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.gold = data.gold;
            this.totalApples = data.totalApples;
            this.appleRate = data.appleRate;
            
            // Restore upgrade counts
            data.upgrades.forEach(savedUpgrade => {
                const upgrade = this.upgrades.find(u => u.id === savedUpgrade.id);
                if (upgrade) {
                    upgrade.count = savedUpgrade.count;
                }
            });
            
            this.updateDisplay();
            this.renderUpgrades();
        }
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new TartTycoon();
});
