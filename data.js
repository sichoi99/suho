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
  streetart: {
    id: "streetart",
    title: "Street Art in London",
    label: "Reading",
    subtitle: "2학년 동아(윤정미) · Lesson 5 Reading",
    sections: [
      {
        id: "shoreditch",
        title: "Shoreditch",
        sentences: [
          {
            id: 1,
            text: "Modern street art comes in many different forms, and it makes cities colorful and lively.",
            highlight: false,
            hints: [
              { word: "comes in", note: "~한 형태로 나오다" },
              { word: "makes cities colorful", note: "make + 목적어 + 형용사" },
            ],
            cloze: ["comes", "makes", "colorful"],
          },
          {
            id: 2,
            text: "Today, we are going to see some well-known street artworks in London.",
            highlight: false,
            hints: [{ word: "are going to", note: "be going to + 동사 (~할 것이다)" }],
            cloze: ["going", "well-known"],
          },
          {
            id: 3,
            text: "The place that we are going to visit is Shoreditch.",
            highlight: true,
            hints: [{ word: "that", note: "관계대명사" }],
            cloze: ["that", "visit", "Shoreditch"],
          },
          {
            id: 4,
            text: "Poor workers used to live in this area, but now it is one of the hippest areas in London.",
            highlight: true,
            hints: [
              { word: "used to", note: "과거의 습관 (~하곤 했다)" },
              { word: "one of the hippest", note: "one of the + 최상급 + 복수명사" },
            ],
            cloze: ["used", "to", "hippest"],
          },
          {
            id: 5,
            text: "We can find so many great pieces of street art here.",
            highlight: false,
            hints: [{ word: "pieces of", note: "~의 작품들" }],
            cloze: ["pieces", "street"],
          },
          {
            id: 6,
            text: "Do you see the painting over there?",
            highlight: false,
            hints: [{ word: "over there", note: "저기" }],
            cloze: ["painting", "over"],
          },
          {
            id: 7,
            text: "It is by the artist STIK.",
            highlight: false,
            hints: [{ word: "by", note: "~에 의해 (작가)" }],
            cloze: ["by", "STIK"],
          },
          {
            id: 8,
            text: "He is famous for using only lines and dots in his paintings of human bodies.",
            highlight: false,
            hints: [{ word: "is famous for using", note: "be famous for + -ing" }],
            cloze: ["famous", "using", "dots"],
          },
          {
            id: 9,
            text: "According to STIK, the three figures represent the past, present, and future of Shoreditch.",
            highlight: false,
            hints: [
              { word: "figures", note: "인물, 형상" },
              { word: "represent", note: "나타내다, 상징하다" },
            ],
            cloze: ["figures", "represent"],
          },
          {
            id: 10,
            text: "Which figure represents which?",
            highlight: false,
            hints: [],
            cloze: ["figure", "represents"],
          },
          {
            id: 11,
            text: "Well, look closely at the eyes of the three figures.",
            highlight: false,
            hints: [{ word: "look closely at", note: "~을 자세히 살펴보다" }],
            cloze: ["closely", "eyes"],
          },
          {
            id: 12,
            text: "They are just dots, but they will give you a clue.",
            highlight: false,
            hints: [{ word: "clue", note: "실마리, 단서" }],
            cloze: ["dots", "clue"],
          },
        ],
      },
      {
        id: "banksy",
        title: "Banksy",
        sentences: [
          {
            id: 13,
            text: "We are now in Finsbury Park to see a painting by Banksy, an internationally famous street artist.",
            highlight: false,
            hints: [{ word: "to see", note: "to부정사의 부사적 용법 (목적)" }],
            cloze: ["to", "see", "Banksy"],
          },
          {
            id: 14,
            text: "Banksy's artworks often carry social messages, and the green tree you see over there is a good example.",
            highlight: true,
            hints: [{ word: "social messages", note: "사회적 메시지" }],
            cloze: ["carry", "social", "example"],
          },
          {
            id: 15,
            text: "As you can see, he created a green tree by spraying green paint on a wall behind a leafless tree.",
            highlight: false,
            hints: [{ word: "leafless", note: "잎이 없는 (leaf + -less)" }],
            cloze: ["spraying", "leafless"],
          },
          {
            id: 16,
            text: "Next to the tree, there is a person who is holding a sprayer.",
            highlight: false,
            hints: [{ word: "who", note: "관계대명사" }],
            cloze: ["who", "holding", "sprayer"],
          },
          {
            id: 17,
            text: "What message does Banksy want to give us through this painting?",
            highlight: false,
            hints: [],
            cloze: ["message", "through"],
          },
          {
            id: 18,
            text: "In many people's opinion, he is telling us that nature is having a hard time.",
            highlight: false,
            hints: [{ word: "having a hard time", note: "힘든 시간을 보내다" }],
            cloze: ["opinion", "hard"],
          },
          {
            id: 19,
            text: "They think he wants us to take better care of it.",
            highlight: false,
            hints: [
              { word: "wants us to", note: "want + 목적어 + to부정사" },
              { word: "take care of", note: "~을 돌보다" },
            ],
            cloze: ["wants", "care"],
          },
        ],
      },
      {
        id: "wilson",
        title: "Ben Wilson",
        sentences: [
          {
            id: 20,
            text: "The final stop of our tour today is Muswell Hill.",
            highlight: false,
            hints: [{ word: "final stop", note: "마지막 장소" }],
            cloze: ["final", "Muswell"],
          },
          {
            id: 21,
            text: "Can't see any street artworks?",
            highlight: false,
            hints: [],
            cloze: ["Can't", "artworks"],
          },
          {
            id: 22,
            text: "Well, look down and look closely.",
            highlight: false,
            hints: [],
            cloze: ["down", "closely"],
          },
          {
            id: 23,
            text: "Do you see the little chewing gum paintings?",
            highlight: false,
            hints: [{ word: "chewing gum", note: "껌" }],
            cloze: ["chewing", "gum"],
          },
          {
            id: 24,
            text: "They are by the artist Ben Wilson.",
            highlight: false,
            hints: [],
            cloze: ["by", "Wilson"],
          },
          {
            id: 25,
            text: "Wilson is well known for painting pictures on gum that people drop on the street.",
            highlight: true,
            hints: [{ word: "is well known for", note: "~로 잘 알려져 있다" }],
            cloze: ["known", "painting", "drop"],
          },
          {
            id: 26,
            text: "His gum paintings often carry personal messages from people he meets on the street.",
            highlight: true,
            hints: [{ word: "personal messages", note: "개인적인 메시지" }],
            cloze: ["carry", "personal", "meets"],
          },
          {
            id: 27,
            text: "For example, the one over here is a happy birthday wish for a loved one.",
            highlight: false,
            hints: [
              { word: "the one", note: "부정대명사 one" },
              { word: "loved one", note: "사랑하는 사람" },
            ],
            cloze: ["one", "loved"],
          },
          {
            id: 28,
            text: "Wilson's gum paintings are tiny, but they give great pleasure to many people.",
            highlight: false,
            hints: [
              { word: "tiny", note: "아주 작은" },
              { word: "pleasure", note: "기쁨, 즐거움" },
            ],
            cloze: ["tiny", "pleasure"],
          },
        ],
      },
    ],
    vocabulary: STREET_ART_VOCABULARY,
  },
  freedom: {
    id: "freedom",
    title: "A Fight for American Freedom",
    label: "Reading",
    subtitle: "미국 독립 · 문장 01–30",
    sections: [
      {
        id: "colonies",
        title: "Colonies",
        sentences: [
          {
            id: 1,
            text: "The Fourth of July is one of the most important days in the US, just as the August 15 is in Korea.",
            highlight: true,
            hints: [{ word: "just as", note: "~와 마찬가지로" }],
            cloze: ["Fourth", "important", "just"],
          },
          {
            id: 2,
            text: "In the 1700s, thirteen American colonies were under the British rule.",
            highlight: false,
            hints: [{ word: "under the British rule", note: "영국의 통치 아래" }],
            cloze: ["thirteen", "colonies", "British"],
          },
          {
            id: 3,
            text: "The colonists had to pay a lot of taxes to Britain, but they had no voice in the British government.",
            highlight: true,
            hints: [{ word: "had no voice", note: "발언권이 없다" }],
            cloze: ["taxes", "voice"],
          },
          {
            id: 4,
            text: "As a result, a movement for freedom started to spread widely.",
            highlight: false,
            hints: [{ word: "spread widely", note: "널리 퍼지다" }],
            cloze: ["movement", "spread", "widely"],
          },
          {
            id: 5,
            text: "People began to gather and talk about becoming an independent country.",
            highlight: false,
            hints: [{ word: "independent", note: "독립적인" }],
            cloze: ["gather", "independent"],
          },
        ],
      },
      {
        id: "washington",
        title: "Washington",
        sentences: [
          {
            id: 6,
            text: "George Washington, who was born in Westmoreland County, Virginia, was a leader who wanted freedom from Britain.",
            highlight: true,
            hints: [{ word: "who", note: "관계대명사" }],
            cloze: ["who", "leader", "freedom"],
          },
          {
            id: 7,
            text: "He became the leader of the American army and fought against the British army.",
            highlight: false,
            hints: [{ word: "fought against", note: "~와 싸우다" }],
            cloze: ["leader", "fought"],
          },
          {
            id: 8,
            text: "His soldiers had little food and few warm clothes.",
            highlight: false,
            hints: [
              { word: "little", note: "거의 없는 (불가산)" },
              { word: "few", note: "거의 없는 (가산)" },
            ],
            cloze: ["little", "few"],
          },
          {
            id: 9,
            text: "They had a hard time, but Washington did not give up.",
            highlight: true,
            hints: [
              { word: "had a hard time", note: "힘든 시간을 보내다" },
              { word: "give up", note: "포기하다" },
            ],
            cloze: ["hard", "give", "up"],
          },
          {
            id: 10,
            text: "The soldiers saw Washington lead them, and they trusted him.",
            highlight: false,
            hints: [{ word: "trusted", note: "믿다, 신뢰하다" }],
            cloze: ["lead", "trusted"],
          },
        ],
      },
      {
        id: "declaration",
        title: "Declaration",
        sentences: [
          {
            id: 11,
            text: "On July 4, 1776, the leaders of the thirteen colonies adopted the Declaration of Independence.",
            highlight: true,
            hints: [{ word: "adopted", note: "채택하다" }],
            cloze: ["adopted", "Declaration", "Independence"],
          },
          {
            id: 12,
            text: "It was a historic document that announced the colonies' independence from Britain.",
            highlight: false,
            hints: [
              { word: "historic", note: "역사적인" },
              { word: "announced", note: "발표하다, 선언하다" },
            ],
            cloze: ["historic", "announced"],
          },
          {
            id: 13,
            text: "Articles about the declaration spread quickly, and many people thought it was unbelievable.",
            highlight: false,
            hints: [{ word: "unbelievable", note: "믿을 수 없는" }],
            cloze: ["spread", "unbelievable"],
          },
        ],
      },
      {
        id: "franklin",
        title: "Franklin",
        sentences: [
          {
            id: 14,
            text: "America also needed help from other countries.",
            highlight: false,
            hints: [],
            cloze: ["needed", "help"],
          },
          {
            id: 15,
            text: "Benjamin Franklin went to France to get help from the French government.",
            highlight: false,
            hints: [{ word: "to get", note: "to부정사 목적" }],
            cloze: ["France", "to", "get"],
          },
          {
            id: 16,
            text: "He met many French leaders and asked them to support America.",
            highlight: false,
            hints: [{ word: "asked them to", note: "ask + O + to-V" }],
            cloze: ["asked", "support"],
          },
          {
            id: 17,
            text: "He sometimes had to hide important information under the watchful eyes of British spies.",
            highlight: true,
            hints: [{ word: "under the watchful eyes of", note: "~의 감시 아래" }],
            cloze: ["hide", "watchful", "spies"],
          },
          {
            id: 18,
            text: "His hard work helped France support America.",
            highlight: false,
            hints: [],
            cloze: ["hard", "support"],
          },
        ],
      },
      {
        id: "independence",
        title: "Independence",
        sentences: [
          {
            id: 19,
            text: "In 1783, after their defeat in the war, Britain recognized American independence in the Treaty of Paris, and America became a free and independent country.",
            highlight: true,
            hints: [
              { word: "recognized", note: "인정하다" },
              { word: "Treaty of Paris", note: "파리 조약" },
            ],
            cloze: ["defeat", "recognized", "Treaty"],
          },
          {
            id: 20,
            text: "Washington later became the first president.",
            highlight: false,
            hints: [],
            cloze: ["first", "president"],
          },
          {
            id: 21,
            text: "Today, his face is on the one-dollar bill and Franklin's face is on the one-hundred-dollar bill.",
            highlight: false,
            hints: [],
            cloze: ["one-dollar", "one-hundred-dollar"],
          },
          {
            id: 22,
            text: "Washington was later buried in his family cemetery at Mount Vernon, and Franklin was buried in Christ Church Burial Ground in Philadelphia.",
            highlight: false,
            hints: [{ word: "buried", note: "묻히다, 매장되다" }],
            cloze: ["buried", "cemetery", "Philadelphia"],
          },
        ],
      },
      {
        id: "celebration",
        title: "Celebration",
        sentences: [
          {
            id: 23,
            text: "Today, Americans celebrate their independence on July 4.",
            highlight: false,
            hints: [{ word: "celebrate", note: "축하하다, 기념하다" }],
            cloze: ["celebrate", "independence"],
          },
          {
            id: 24,
            text: "Families and friends gather for outdoor parties and barbecues.",
            highlight: false,
            hints: [],
            cloze: ["gather", "barbecues"],
          },
          {
            id: 25,
            text: "They enjoy hamburgers, hot dogs, potato salad, and watermelon.",
            highlight: false,
            hints: [],
            cloze: ["enjoy", "watermelon"],
          },
          {
            id: 26,
            text: "Many towns also have parades with music and colorful floats.",
            highlight: false,
            hints: [{ word: "floats", note: "축제용 장식 차량" }],
            cloze: ["parades", "floats"],
          },
          {
            id: 27,
            text: "At night, people watch beautiful fireworks together.",
            highlight: false,
            hints: [{ word: "fireworks", note: "불꽃놀이" }],
            cloze: ["watch", "fireworks"],
          },
          {
            id: 28,
            text: "Some celebrations are so exciting that people stay outside until late at night.",
            highlight: true,
            hints: [{ word: "so ~ that", note: "너무 ~해서 …하다" }],
            cloze: ["so", "exciting", "that"],
          },
        ],
      },
    ],
    vocabulary: FREEDOM_VOCABULARY,
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
