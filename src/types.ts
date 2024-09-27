import { SpeechStateExternalEvent } from "speechstate";

type Individuals = Predicates;
type Predicates = { [index: string]: string }; // e.g. { "booking_room": "G212", "course_day_room": "Monday" }
export type Domain = {
  combine: (q: Question, y: ShortAnswer | Proposition) => Proposition; //q是询问，y是回答，combine是用来combine的，返回一个命题
  relevant: (x: ShortAnswer | Proposition, q: Question) => boolean; //x是回答，q是询问，relevant是用来判断回答是否相关的，返回一个布尔值
  resolves: (x: ShortAnswer | Proposition, q: Question) => boolean; //x是回答，q是询问，resolves是用来判断回答是否能解决询问的，返回一个布尔值
  plans: PlanInfo[]; // PlanInfo是用来表示plan的类型, 这个意思是plan是一个列表，列表的每个元素都是一个PlanInfo
  predicates: Predicates; // predicates里包括了Predicates, e.g. predicates = { "booking_room": "G212", "course_day_room": "Monday" }
  individuals: Individuals; // individuals里包括了Individuals, e.g. individuals = { "G212": "G212", "Monday": "Monday" }
};

export type PlanInfo = {
  type: string;
  content: null | Proposition | ShortAnswer | Question;
  plan: Action[];
};

export type Database = {
  consultDB: (q: Question, p: Proposition[]) => Proposition | null; // proposition是命题，表示一个事实
};

export type ShortAnswer = string;
export type Proposition = { // proposition意思是命题，表示一个事实
  predicate: string; // e.g. predicate = "booking_room"
  argument: string; // e.g. argument = "G212"
}; // 这里Proposition和Predicate的区别在于，Proposition表示一个事实，Predicate表示一个询问

export type Question = WhQuestion;
type WhQuestion = { type: "whq"; predicate: string };

interface OtherMove { // 这个是其他动作，比如greet和request，interface是用来定义类型的，而type是用来定义类型的值的
  type:
    | "greet"
    | "request"
    | "dontunderstand";
  content: null | string;
}
interface AnswerMove {
  type: "answer";
  content: Proposition | ShortAnswer;
}
interface AskMove {
  type: "ask";
  content: Question;
}

export type Move = OtherMove | AnswerMove | AskMove; 
export type Action = {
  type:
    | "greet"
    | "respond"
    | "raise"
    | "findout"
    | "consultDB";
  content: null | Question;
} 
// 以上Move和Action的区别在于，Move是用来表示动作的，Action是用来表示动作的类型

type Speaker = "usr" | "sys";

export interface InformationState {
  next_moves: Move[]; // next_moves是用来表示下一个动作的列表
  domain: Domain;
  database: Database;
  private: { agenda: Action[]; plan: Action[]; bel: Proposition[] };  // private指的是对话的私人信息，比如对话的计划，对话的信念，对话的议程
  // agenda是用来表示动作的列表，plan是用来表示动作的列表，bel是用来表示命题的列表
  shared: {
    lu?: { speaker: Speaker; moves: Move[] }; // lu是用来表示对话的列表，speaker是用来表示说话者的类型，moves是用来表示动作的列表，lu是缩写，表示last utterance
    qud: Question[]; // qud是用来表示询问的列表
    com: Proposition[]; // com是用来表示命题的列表
  };
}

export interface DMContext extends TotalInformationState { // DMContext是用来表示对话管理器的上下文
  ssRef: any;
}

export interface DMEContext extends TotalInformationState {  // DMEContext是用来表示对话管理引擎的上下文
  parentRef: any; 
}

export interface TotalInformationState {  // TotalInformationState是用来表示对话的全部信息的
  /** interface variables */
  latest_speaker?: Speaker;
  latest_moves?: Move[];

  /** information state */
  is: InformationState; 
}

export type DMEvent = // DMEvent是用来表示对话管理器的动作的
  | { type: "CLICK" } // 这个是用来表示点击的
  | SpeechStateExternalEvent // 这个是用来表示SpeechState外部事件
  | NextMovesEvent; // 这个是用来表示下一个动作的事件

export type DMEEvent = SaysMovesEvent; // DMEEvent是用来表示对话管理引擎的动作的

export type SaysMovesEvent = { // SaysMovesEvent是用来表示说话的动作的
  type: "SAYS"; // 这个是用来表示说话的
  value: { speaker: Speaker; moves: Move[] }; // speaker是用来表示说话者的类型，moves是用来表示动作的列表
};

export type NextMovesEvent = {
  type: "NEXT_MOVES"; // 这个是用来表示下一个动作的
  value: Move[]; // 这个是用来表示动作的列表
};
