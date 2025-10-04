interface CardData {
  id: number;
  image: string;
}

class MemoryGame {
  private board: HTMLElement;
  private cards: CardData[] = [];

  // Explicit card references instead of array
  private firstCard: HTMLElement | null = null;
  private secondCard: HTMLElement | null = null;

  private lockBoard = false;
  private matchedPairs = 0;
  private totalPairs = 12;

  private winAudio: HTMLAudioElement;
  private loseAudio: HTMLAudioElement;
  private winningAudio: HTMLAudioElement;

  constructor() {
    this.board = document.getElementById("game-board")!;
    this.winAudio = document.getElementById("win-audio") as HTMLAudioElement;
    this.loseAudio = document.getElementById("lose-audio") as HTMLAudioElement;
    this.winningAudio = document.getElementById("winning-audio") as HTMLAudioElement;
    const bgMusic = document.getElementById("bg-music") as HTMLAudioElement;
    bgMusic.volume=0.3;
    this.generateCards();
    this.renderBoard();
  }

  private generateCards() {
    const images = [
      "images/hen.jpg","images/cow.jpg","images/cat.jpg","images/dog.jpg","images/goose.jpg",
      "images/duck.jpeg","images/bunny.jpg","images/pigeon.jpeg","images/chick.jpg","images/sheep.jpg","images/horse.jpg","images/rooster.jpeg"
    ];
    this.cards = [...images, ...images].map((img, i) => ({ id: i, image: img }));
    this.cards.sort(() => Math.random() - 0.5);
  }

  private renderBoard() {
    this.board.innerHTML = "";
    this.cards.forEach(card => {
      const col = document.createElement("div");
      col.className = "col";

      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.dataset.image = card.image;
      cardEl.dataset.id = card.id.toString();

      cardEl.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">
            <img src="${card.image}" alt="card image">
          </div>
        </div>
      `;

      cardEl.addEventListener("click", () => this.flipCard(cardEl));
      col.appendChild(cardEl);
      this.board.appendChild(col);
    });
  }

  private flipCard(cardEl: HTMLElement) {
    if (this.lockBoard) return;
    if (cardEl.classList.contains("flipped")) return;

    cardEl.classList.add("flipped");

    if (!this.firstCard) {
      this.firstCard = cardEl;
    } else if (!this.secondCard) {
      this.secondCard = cardEl;
      this.checkMatch();
    }
  }

  private checkMatch() {
    if (!this.firstCard || !this.secondCard) return;
    this.lockBoard = true;

    const isMatch = this.firstCard.dataset.image === this.secondCard.dataset.image;

    console.log("Card 1:", { id: this.firstCard.dataset.id, img: this.firstCard.dataset.image });
    console.log("Card 2:", { id: this.secondCard.dataset.id, img: this.secondCard.dataset.image });

    setTimeout(() => {
      if (isMatch) {
        this.winAudio.play();
        this.matchedPairs++;

        if (this.matchedPairs === this.totalPairs) {
          (document.getElementById("bg-music") as HTMLAudioElement).pause();
          this.winningAudio.play();
        }
      } else {
        this.loseAudio.play();
        this.firstCard.classList.remove("flipped");
        this.secondCard.classList.remove("flipped");
      }

      // Reset
      this.firstCard = null;
      this.secondCard = null;
      this.lockBoard = false;
    }, 1000);
  }
}

window.onload = () => {
  const game = new MemoryGame();
  const bgMusic = document.getElementById("bg-music") as HTMLAudioElement;

  // unlock background music on first click
  document.body.addEventListener("click", () => {
    if (bgMusic.muted) {
      bgMusic.muted = false;
      bgMusic.play();
    }
  }, { once: true });
};
