import { Move } from "./types";
import { objectsEqual, WHQ } from "./utils";

interface NLUMapping {
  [index: string]: Move[];
}
type NLGMapping = [Move, string][];

const nluMapping: NLUMapping = {
  "where is the lecture?": [{
    type: "ask",
    content: WHQ("booking_room"), // WHQ("booking_room")返回{type: "whq", content: "booking_room"}
  }],
  "what's your favorite food?": [{
    type: "ask",
    content: WHQ("favorite_food"),
  }],
  pizza: [{
    type: "answer",
    content: "pizza",
  }],
  "dialogue systems 2": [{
    type: "answer",
    content: "LT2319",
  }],
  "dialogue systems": [{
    type: "answer",
    content: "LT2319",
  }],
  "monday": [{
    type: "answer",
    content: "Monday",
  }],
  "thursday": [{
    type: "answer",
    content: "Thursday",
  }]
};
// NLG：自然语言生成 
const nlgMapping: NLGMapping = [ 
  [{ type: "ask", content: WHQ("booking_course") }, "Which course?"],
  [{ type: "ask", content: WHQ("booking_day") }, "Which day?"],
  [{ type: "greet", content: null }, "Hello! You can ask me anything!"],
  [{ type: "dontunderstand", content: null }, "I don't understand."],
  [
    {
      type: "answer",
      content: { predicate: "favorite_food", argument: "pizza" },
    },
    "Pizza.",
  ],
  [
    {
      type: "answer",
      content: { predicate: "booking_room", argument: "G212" },
    },
    "The lecture is in G212.",
  ],
  [
    {
      type: "answer",
      content: { predicate: "booking_room", argument: "J440" },
    },
    "The lecture is in J440.",
  ],
];

export function nlg(moves: Move[]): string {
  console.log("generating moves", moves);
  function generateMove(move: Move): string {
    const mapping = nlgMapping.find((x) => objectsEqual(x[0], move));
    if (mapping) {
      return mapping[1];
    }
    throw new Error(`Failed to generate move ${JSON.stringify(move)}`);
  }
  const utterance = moves.map(generateMove).join(' ');
  console.log("generated utterance:", utterance);
  return utterance;
}

/** NLU mapping function can be replaced by statistical NLU
 */
export function nlu(utterance: string): Move[] {
  return nluMapping[utterance.toLowerCase()] || [];
} // nlu function takes in the utterance and returns the moves that the user wants to make.
