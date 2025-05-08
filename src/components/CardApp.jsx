import { useEffect, useState } from "react"
import axios from "axios"

function generateRandomStyle() {
  const angle = Math.floor(Math.random() * 60 - 30);
  const x = Math.floor(Math.random() * 20 - 10);
  const y = Math.floor(Math.random() * 20 - 10);
  return {
    transform: `rotate(${angle}deg) translate(${x}px, ${y}px)`,
    position: "absolute",
    top: 0,
    left: 0,
    transition:"all 0.3s ease",
  }
}










function CardApp () {
  
  const [deckId, setDeckId] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    async function fetchDeck() {
      try {
        const res = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
        );
        setDeckId(res.data.deck_id)
      } catch (e) {
        console.error("create deck failed", e)
      }
    }
    fetchDeck();
  }, []);

  async function drawCard() {
    try {
      const res = await axios.get(
       ` https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
      )
      if (!res.data.success) {
        alert("Error: no cards remaining!");
        return;
      }

      const card = res.data.cards[0]
      const cardWithStyle = {...card, style:generateRandomStyle()}
      setDrawnCards(cards => [...cards, cardWithStyle]);

    } catch (e) {
    console.error("fail to draw a card", e)
  }
  } 

  async function shuffleDeck() {
    try {
      setIsShuffling(true);
      await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      setDrawnCards([]);
    } catch (e) {
      console.error("Fail to shuffle", e)
    } finally {
      setIsShuffling(false)
    }
  }



  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1> Draw a Card</h1>

      {deckId ? (
        <>
          <div style={{ marginBottom: "20px" }}>
            <button onClick={drawCard}>Draw a Card</button>{" "}
            <button onClick={shuffleDeck} disabled={isShuffling}>
              {isShuffling ? "Shuffling..." : "Shuffle Again"}
            </button>
          </div>

    
          <div
            style={{
              position: "relative",
              width: "226px",
              height: "314px",
              margin: "0 auto",
            }}
          >
            {drawnCards.map((card, idx) => (
              <img
                key={idx}
                src={card.image}
                alt={`${card.value} of ${card.suit}`}
                style={card.style}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

}


export default CardApp