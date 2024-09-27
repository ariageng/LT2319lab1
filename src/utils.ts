import { Action, Proposition, Question } from "./types"; 
// 导入Action, Proposition, Question，这些是在types.ts文件中定义的
// utils这个文件是用来表示一些工具函数，比如objectsEqual，WHQ，findout，consultDB，getFactArgument
// 这些函数都是用来表示对话的，比如objectsEqual是用来判断两个对象是否相等的，WHQ是用来表示询问的，findout是用来表示询问的，consultDB是用来表示咨询数据库的，getFactArgument是用来表示获取事实的参数的


export function objectsEqual(obj1: any, obj2: any) { // 这个函数是用来判断两个对象是否相等的，比如两个对象的属性相同，值相同，那么这两个对象就是相等的
  if (obj1 === obj2) {
    return true; // same reference or both are null/undefined
  }

  if (
    typeof obj1 !== "object" || 
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false; // primitive values or one of them is null
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false; // different number of properties
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !objectsEqual(obj1[key], obj2[key])) {
      return false; // different properties or values
    }
  }

  return true;
}

export function WHQ(predicate: string): Question { // 这个函数输入一个谓词，返回一个询问
  return {
    type: "whq", // type是whq，表示这是一个询问，询问的内容是predicate；在typescript里type是用来表示类型的，定义type后，在后面使用的时候，type只能取定义的类型，不能取其他的类型
    predicate: predicate,
  };
}

export function findout(q: Question): Action { // 这个函数是个动作，动作的类型是findout，动作的内容是询问
  return {
    type: "findout",
    content: q,
  };
}
// Action函数和Question函数都是用来表示动作和询问的，但是它们的类型不同，Action函数是用来表示动作的，Question函数是用来表示询问的
// Action和Question是在types.ts文件中定义的
// Action函数有findout和consultDB，Question函数有WHQ

export function consultDB(q: Question): Action { // 这个函数是个动作，动作的类型是consultDB，动作的内容是询问
  return {
    type: "consultDB",
    content: q,
  };
}

export function getFactArgument(facts: Proposition[], predicate: string) { // 这个函数是用来获取事实的参数的
  // this function is used to get the argument of the fact
  for (let fact of facts) {
    if (fact.predicate == predicate) {
      return fact.argument;
    }
  }
}
