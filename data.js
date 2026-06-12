const PASSAGES = {
  invention: {
    id: "invention",
    title: "Necessity Is the Mother of Invention",
    sections: [
      {
        id: "bicycle",
        title: "Bicycle",
        sentences: [
          { id: 1, text: "Mt. Tambora, a volcano in Indonesia, exploded in 1815.", highlight: false, hints: [{ word: "exploded", note: "폭발하다" }], cloze: ["exploded"] },
          { id: 2, text: "The explosion created a huge cloud of ash, so crops failed around the world.", highlight: false, hints: [{ word: "failed", note: "흉작이 되다" }], cloze: ["failed"] },
          { id: 3, text: "As a result, people didn't have enough food to eat.", highlight: false, hints: [{ word: "to eat", note: "to부정사의 형용사적 용법" }], cloze: ["to", "eat"] },
          { id: 4, text: "Surprisingly, this made traveling difficult. Why?", highlight: false, hints: [], cloze: ["Surprisingly", "traveling"] },
          { id: 5, text: "In those days, people rode horses, but many horses were killed for food.", highlight: true, hints: [{ word: "were killed", note: "수동태" }], cloze: ["rode", "were", "killed"] },
          { id: 6, text: "People needed a new way to travel, and Karl von Drais invented the first bicycle in Germany in 1817.", highlight: false, hints: [], cloze: ["invented", "bicycle"] },
          { id: 7, text: "Drais's bicycle had two wooden wheels but no pedals.", highlight: false, hints: [{ word: "wooden", note: "나무로 된" }], cloze: ["wooden", "pedals"] },
          { id: 8, text: "How did it move without pedals?", highlight: false, hints: [], cloze: ["pedals"] },
          { id: 9, text: "Well, riders simply pushed the bicycle forward with their feet.", highlight: false, hints: [], cloze: ["pushed", "forward"] },
          { id: 10, text: "The present-day bicycle is the result of many inventors' work in the 19th century.", highlight: false, hints: [], cloze: ["present-day", "result"] },
        ],
      },
      {
        id: "whiteout",
        title: "Whiteout",
        sentences: [
          { id: 11, text: "Whiteout was invented by Bette Graham.", highlight: true, hints: [{ word: "was invented", note: "수동태" }], cloze: ["was", "invented"] },
          { id: 12, text: "In 1956, Graham was working at a bank in Texas, USA.", highlight: false, hints: [{ word: "was working", note: "과거진행형" }], cloze: ["was", "working"] },
          { id: 13, text: "At that time, people had to retype the whole page when they made even a small mistake.", highlight: true, hints: [{ word: "had to", note: "have to의 과거형" }], cloze: ["had", "to", "retype"] },
          { id: 14, text: "Graham was a bad typist, so she needed a solution.", highlight: false, hints: [{ word: "bad typist", note: "타자를 잘 못 치는 사람" }], cloze: ["typist", "solution"] },
          { id: 15, text: "One day, Graham saw some window painters.", highlight: false, hints: [], cloze: ["painters"] },
          { id: 16, text: "When they made a mistake, they corrected it by simply painting over it.", highlight: false, hints: [{ word: "made a mistake", note: "실수하다" }], cloze: ["mistake", "painting"] },
          { id: 17, text: "The next day, she made her own white paint and used it to correct her typing mistakes.", highlight: false, hints: [{ word: "to correct", note: "to부정사의 부사적 용법" }], cloze: ["own", "correct"] },
          { id: 18, text: "Surprisingly, nobody noticed!", highlight: false, hints: [{ word: "nobody", note: "전체 부정" }], cloze: ["nobody", "noticed"] },
          { id: 19, text: "Soon, everybody at the bank began using it.", highlight: false, hints: [{ word: "began using", note: "begin + 동명사" }], cloze: ["everybody", "began"] },
        ],
      },
      {
        id: "webcam",
        title: "Webcam",
        sentences: [
          { id: 20, text: "The first webcam was invented to watch a coffee pot.", highlight: true, hints: [{ word: "was invented", note: "수동태" }], cloze: ["webcam", "invented"] },
          { id: 21, text: "In 1991, Dr. Quentin Stafford-Fraser and Dr. Paul Jardetzky were working at a computer lab in England.", highlight: false, hints: [{ word: "were working", note: "과거진행형" }], cloze: ["were", "working"] },
          { id: 22, text: "To work better, they needed lots of coffee.", highlight: false, hints: [{ word: "To work better", note: "to부정사 목적" }], cloze: ["To", "lots"] },
          { id: 23, text: "However, there was only one coffee machine in the building.", highlight: false, hints: [{ word: "However", note: "하지만" }], cloze: ["However", "there", "was"] },
          { id: 24, text: "So, they had to make many disappointing trips to the empty coffee pot.", highlight: true, hints: [{ word: "had to", note: "have to 과거" }], cloze: ["had", "to", "empty"] },
          { id: 25, text: "As a solution, the two researchers set up a camera in front of the coffee machine.", highlight: false, hints: [{ word: "set up", note: "설치하다" }], cloze: ["set", "up"] },
          { id: 26, text: "The camera took pictures of the coffee pot three times a minute.", highlight: false, hints: [{ word: "three times a minute", note: "1분에 세 번" }], cloze: ["three", "times"] },
          { id: 27, text: "With special software, all the researchers in the building could see the pictures on their local network.", highlight: false, hints: [], cloze: ["software", "network"] },
          { id: 28, text: "No more disappointing trips!", highlight: false, hints: [{ word: "No more", note: "더 이상 ~없는" }], cloze: ["No", "more"] },
        ],
      },
    ],
  },
  shopper: {
    id: "shopper",
    title: "Be a Smart Shopper",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        sentences: [
          { id: 1, text: "Do you think you are a smart shopper?", highlight: false, hints: [{ word: "smart shopper", note: "똑똑한 쇼핑객" }], cloze: ["smart", "shopper"] },
          { id: 2, text: "Well, you may think you are, but hold on!", highlight: false, hints: [{ word: "hold on", note: "잠깐만요" }], cloze: ["hold", "on"] },
          { id: 3, text: "There are various marketing strategies which influence your decisions.", highlight: true, hints: [{ word: "which", note: "관계대명사" }], cloze: ["which", "influence"] },
          { id: 4, text: "Learning about them will make you a smarter shopper.", highlight: false, hints: [{ word: "Learning about", note: "동명사 주어" }], cloze: ["Learning", "smarter"] },
        ],
      },
      {
        id: "hunger",
        title: "Hunger Marketing",
        sentences: [
          { id: 5, text: "Junho: What? The sale ends in two hours?", highlight: false, hints: [], cloze: ["sale", "hours"] },
          { id: 6, text: "If I don't buy the sneakers now, I will have to buy them at a higher price.", highlight: true, hints: [{ word: "If", note: "조건 접속사" }], cloze: ["If", "higher"] },
          { id: 7, text: "Stop, Junho! You're buying the sneakers just because you don't want to miss the sale.", highlight: false, hints: [{ word: "just because", note: "단지 ~때문에" }], cloze: ["because", "miss"] },
          { id: 8, text: "You're falling for a hunger marketing strategy.", highlight: false, hints: [{ word: "falling for", note: "~에 속다" }], cloze: ["falling", "hunger"] },
          { id: 9, text: 'If people can buy a product only for a limited time, they often feel "hungry" for it and want to buy it.', highlight: true, hints: [{ word: "limited time", note: "제한된 시간" }], cloze: ["limited", "hungry"] },
          { id: 10, text: "About missing the sale, don't worry, Junho.", highlight: false, hints: [], cloze: ["missing", "worry"] },
          { id: 11, text: "You'll soon see a similar sale again.", highlight: false, hints: [], cloze: ["similar", "again"] },
        ],
      },
      {
        id: "viral",
        title: "Viral Marketing",
        sentences: [
          { id: 12, text: "Yuna: That's the hottest dress on social media now.", highlight: false, hints: [{ word: "social media", note: "소셜 미디어" }], cloze: ["hottest", "social"] },
          { id: 13, text: "Lots of people are wearing it. I have to get that dress, too!", highlight: false, hints: [], cloze: ["wearing", "too"] },
          { id: 14, text: "Wait, Yuna! You only want the dress because you saw it again and again on social media.", highlight: false, hints: [{ word: "again and again", note: "계속해서" }], cloze: ["only", "again"] },
          { id: 15, text: "It isn't just you.", highlight: false, hints: [{ word: "isn't just", note: "단지 ~만이 아니다" }], cloze: ["isn't", "just"] },
          { id: 16, text: "There are a lot of people who fall for a viral marketing strategy. Why?", highlight: true, hints: [{ word: "who", note: "관계대명사" }], cloze: ["who", "viral"] },
          { id: 17, text: 'Information about a product can spread quickly and widely on the Internet, just like a "virus."', highlight: false, hints: [{ word: "spread", note: "퍼지다" }], cloze: ["spread", "virus"] },
          { id: 18, text: "If a product becomes hot on social media, people naturally want to have it.", highlight: true, hints: [{ word: "If", note: "조건 접속사" }], cloze: ["If", "naturally"] },
          { id: 19, text: "Yuna, just remember that a popular product isn't always right for you.", highlight: true, hints: [{ word: "isn't always", note: "항상 ~은 아니다" }], cloze: ["isn't", "always"] },
        ],
      },
      {
        id: "anchoring",
        title: "Anchoring Effect",
        sentences: [
          { id: 20, text: "Somi: I'm looking for a lipstick for my mom.", highlight: false, hints: [], cloze: ["looking", "lipstick"] },
          { id: 21, text: "Clerk: How about this?", highlight: false, hints: [], cloze: ["How", "about"] },
          { id: 22, text: "Somi: Expensive! I thought I could buy a lipstick for 30 dollars.", highlight: false, hints: [], cloze: ["Expensive", "dollars"] },
          { id: 23, text: "Clerk: This is also popular.", highlight: false, hints: [], cloze: ["popular"] },
          { id: 24, text: "Somi: That's better!", highlight: false, hints: [], cloze: ["better"] },
          { id: 25, text: "Hold on, Somi! Your budget is 30 dollars, but you are buying a 40-dollar lipstick.", highlight: false, hints: [{ word: "budget", note: "예산" }], cloze: ["budget", "40-dollar"] },
          { id: 26, text: "The 40-dollar lipstick sounds cheap only because the salesperson showed you a 50-dollar lipstick first.", highlight: false, hints: [{ word: "only because", note: "단지 ~때문에" }], cloze: ["only", "because"] },
          { id: 27, text: "This is an example of the anchoring effect.", highlight: false, hints: [{ word: "anchoring effect", note: "앵커링 효과" }], cloze: ["anchoring", "effect"] },
          { id: 28, text: 'Usually, the first piece of information becomes an "anchor" and influences the shopper\'s decision.', highlight: false, hints: [{ word: "anchor", note: "닻, 기준점" }], cloze: ["anchor", "influences"] },
          { id: 29, text: "In your case, the 50-dollar lipstick was the anchor.", highlight: false, hints: [], cloze: ["anchor"] },
          { id: 30, text: "Somi, don't just rely on the first piece of information that is given to you.", highlight: true, hints: [{ word: "that", note: "관계대명사" }], cloze: ["rely", "that"] },
        ],
      },
    ],
    vocabulary: SHOPPER_VOCABULARY,
  },
};

let activePassageId = "invention";

function setActivePassage(id) {
  activePassageId = id;
}

function getActivePassage() {
  return PASSAGES[activePassageId];
}

function getAllSentences() {
  const passage = getActivePassage();
  const list = [];
  for (const section of passage.sections) {
    for (const s of section.sentences) {
      list.push({ ...s, sectionId: section.id, sectionTitle: section.title });
    }
  }
  return list;
}

function getSentenceById(id) {
  return getAllSentences().find((s) => s.id === id);
}

function getPassageSentenceCount() {
  return getAllSentences().length;
}

function formatId(n) {
  return String(n).padStart(2, "0");
}

function hasVocabulary() {
  const vocab = getActivePassage().vocabulary;
  return Array.isArray(vocab) && vocab.length > 0;
}

function getAllVocab() {
  return getActivePassage().vocabulary || [];
}

function getVocabById(id) {
  return getAllVocab().find((v) => v.id === id);
}

function getVocabCount() {
  return getAllVocab().length;
}
