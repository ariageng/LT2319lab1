import { InformationState } from "./types";
import {
  objectsEqual,
  WHQ,
  findout,
  consultDB,
  getFactArgument,
} from "./utils";
// 这个is.ts文件是用来定义信息状态的，信息状态包括domain, database, next_moves, private, shared
// 信息状态是用来表示对话的状态的，包括对话的上下文，对话的历史，对话的意图等

export const initialIS = (): InformationState => { 
  // 这里是输出一个函数initialIS，这个函数没有参数。
  // 这个函数是用来初始化信息状态的，返回一个对象，对象的属性是predicates和individuals, return一个InformationState, 包括domain, database, next_moves, private, shared
  // initialIS = () 的意思是initialIS是一个函数，()的意思是这个函数没有参数
  const predicates: { [index: string]: string } = {
    // Mapping from predicate to sort
    favorite_food: "food",
    booking_course: "course",
    booking_day: "day",
  };
  const individuals: { [index: string]: string } = {
    // Mapping from individual to sort
    pizza: "food",
    LT2319: "course",
    Monday: "day",
    Thursday: "day"
  };
  return {
    domain: {
      predicates: predicates,
      individuals: individuals,
      relevant: (a, q) => { // 这里定义了relevant函数，用来判断a和q是否相关
        if (
          typeof a === "string" &&
          predicates[q.predicate] === individuals[a]
        ) {
          return true;
        }
        if (typeof a === "object" && q.predicate === a.predicate) {
          return true;
        }
        return false;
      },
      resolves: (a, q) => { // 这个函数是用来判断a和q是否可以resolve的，返回一个布尔值
        if (typeof a === "object" && q.predicate === a.predicate) {
          return true;
        }
        return false;
      },
      combine: (q, a) => { // 这个函数是用来combine的，返回一个对象，对象的属性是predicate和argument
        if (
          typeof a === "string" &&
          predicates[q.predicate] === individuals[a]
        ) {
          return { predicate: q.predicate, argument: a };
        }
        if (typeof a === "object" && q.predicate === a.predicate) {
          return a;
        }
        throw new Error("Combine failed.");
      },
      plans: [ // 这个函数是用来定义plan的，plan是一个列表，列表的元素是动作
        {
          type: "issue",
          content: WHQ("booking_room"),
          plan: [ // 计划是先
            findout(WHQ("booking_course")), 
            findout(WHQ("booking_day")), // findout相当于获得索引的动作，然后在agenda里面加上这个动作
            consultDB(WHQ("booking_room")), // consultDB相当于查询数据库的动作
          ],
        }, 
      ],
    },
    database: {
      consultDB: (question, facts) => { // 这个函数是用来查询数据库的，返回一个对象，对象的属性是predicate和argument
        if (objectsEqual(question, WHQ("booking_room"))) {
          const course = getFactArgument(facts, "booking_course"); 
          if (course == "LT2319") {
            const day = getFactArgument(facts, "booking_day");
            if (day == "Monday") {
              // if the user says Monday, then reply with G212
              return { predicate: "booking_room", argument: "G212" };
            }
            if (day == "Thursday") {
              // if the user says Thursday, then reply with J440
              return { predicate: "booking_room", argument: "J440" };
            }
            else {
              return null;
            }
          }
          else {
            // if the user says something else, then end the conversation
            return { predicate: "booking_room", argument: "Not the right course" };
          }
        }
        else {
          return null;
        }
      },
    },
    next_moves: [],
    private: {
      plan: [],
      agenda: [
        {
          type: "greet",
          content: null,
        },
      ],
      bel: [{ predicate: "favorite_food", argument: "pizza" }], // 这个是belief，表示对话的上下文，对话的历史，对话的意图等
    },
    shared: { lu: undefined, qud: [], com: [] },
  };
};
