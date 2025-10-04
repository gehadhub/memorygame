var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var MemoryGame = /** @class */ (function () {
    function MemoryGame() {
        this.cards = [];
        // Explicit card references instead of array
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.matchedPairs = 0;
        this.totalPairs = 12;
        this.board = document.getElementById("game-board");
        this.winAudio = document.getElementById("win-audio");
        this.loseAudio = document.getElementById("lose-audio");
        this.winningAudio = document.getElementById("winning-audio");
        var bgMusic = document.getElementById("bg-music");
        bgMusic.volume = 0.3;
        this.generateCards();
        this.renderBoard();
    }
    MemoryGame.prototype.generateCards = function () {
        var images = [
            "images/hen.jpg", "images/cow.jpg", "images/cat.jpg", "images/dog.jpg", "images/goose.jpg",
            "images/duck.jpeg", "images/bunny.jpg", "images/pigeon.jpeg", "images/chick.jpg", "images/sheep.jpg", "images/horse.jpg", "images/rooster.jpeg"
        ];
        this.cards = __spreadArray(__spreadArray([], images, true), images, true).map(function (img, i) { return ({ id: i, image: img }); });
        this.cards.sort(function () { return Math.random() - 0.5; });
    };
    MemoryGame.prototype.renderBoard = function () {
        var _this = this;
        this.board.innerHTML = "";
        this.cards.forEach(function (card) {
            var col = document.createElement("div");
            col.className = "col";
            var cardEl = document.createElement("div");
            cardEl.className = "card";
            cardEl.dataset.image = card.image;
            cardEl.dataset.id = card.id.toString();
            cardEl.innerHTML = "\n        <div class=\"card-inner\">\n          <div class=\"card-front\"></div>\n          <div class=\"card-back\">\n            <img src=\"".concat(card.image, "\" alt=\"card image\">\n          </div>\n        </div>\n      ");
            cardEl.addEventListener("click", function () { return _this.flipCard(cardEl); });
            col.appendChild(cardEl);
            _this.board.appendChild(col);
        });
    };
    MemoryGame.prototype.flipCard = function (cardEl) {
        if (this.lockBoard)
            return;
        if (cardEl.classList.contains("flipped"))
            return;
        cardEl.classList.add("flipped");
        if (!this.firstCard) {
            this.firstCard = cardEl;
        }
        else if (!this.secondCard) {
            this.secondCard = cardEl;
            this.checkMatch();
        }
    };
    MemoryGame.prototype.checkMatch = function () {
        var _this = this;
        if (!this.firstCard || !this.secondCard)
            return;
        this.lockBoard = true;
        var isMatch = this.firstCard.dataset.image === this.secondCard.dataset.image;
        console.log("Card 1:", { id: this.firstCard.dataset.id, img: this.firstCard.dataset.image });
        console.log("Card 2:", { id: this.secondCard.dataset.id, img: this.secondCard.dataset.image });
        setTimeout(function () {
            if (isMatch) {
                _this.winAudio.play();
                _this.matchedPairs++;
                if (_this.matchedPairs === _this.totalPairs) {
                    document.getElementById("bg-music").pause();
                    _this.winningAudio.play();
                }
            }
            else {
                _this.loseAudio.play();
                _this.firstCard.classList.remove("flipped");
                _this.secondCard.classList.remove("flipped");
            }
            // Reset
            _this.firstCard = null;
            _this.secondCard = null;
            _this.lockBoard = false;
        }, 1000);
    };
    return MemoryGame;
}());
window.onload = function () {
    var game = new MemoryGame();
    var bgMusic = document.getElementById("bg-music");
    // unlock background music on first click
    document.body.addEventListener("click", function () {
        if (bgMusic.muted) {
            bgMusic.muted = false;
            bgMusic.play();
        }
    }, { once: true });
};
