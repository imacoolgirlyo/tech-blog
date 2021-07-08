const users = [
  { id: 1, name: 'SK', age: 21 },
  { id: 2, name: 'SK2', age: 22 },
  { id: 3, name: 'SK3', age: 23 },
  { id: 4, name: 'SK4', age: 24 },
  { id: 5, name: 'SK5', age: 25 },
  { id: 6, name: 'SK6', age: 26 },
  { id: 7, name: 'SK7', age: 27 },
  { id: 8, name: 'SK8', age: 28 },
  { id: 9, name: 'SK9', age: 29 },
  { id: 10, name: 'SK10', age: 20 },
]

// 명령형 코드
// 1. 30세 이상인 user는 거른다.
let temp_users = []
for (var i = 0; i < users.length; i++) {
  if (users[i].age >= 30) {
    temp_users.push(user[i])
  }
}
console.log(temp_users)

// 2. 30세 이상인 users의 name을 수집한다.

let names = []
for (var i = 0; i < users.length; i++) {
  if (users[i].age >= 30) {
    names.push(user[i].name)
  }
}
console.log(names)

// 3. 30세 미만인 users의 name을 수집한다.

let names = []
for (var i = 0; i < users.length; i++) {
  if (users[i].age < 30) {
    names.push(user[i].name)
  }
}
console.log(names)

// 3. 30세 미만인 users의 age을 수집한다.

let ages = []
for (var i = 0; i < users.length; i++) {
  if (users[i].age < 30) {
    ages.push(user[i].age)
  }
}
console.log(ages)

// 위 함수를 map, filter로 리팩토링

function _filter (users, predi) {
  let new_list = []
  for (var i = 0; i < users.length; i++) {
    if (predi(users)) {
      new_list.push(user[i])
    }
  }
  return new_list // 외부 요소인 console.log 제거하고 밖으로 값을 return
}

// 추상화의 단위를 함수로 해서 진행한다. 어떤 조건으로 거를 건지에 대한건 함수에게 완전히 위임함
// 함수가 함수를 받아서 원하는 시점에 받은 인자를 평가를 해나가면서 로직을 완성해나가는 프로그래밍을 응용형 프로그래밍, 적용형 프로그래밍이라고 함
// 위의 _filter가 응용형 함수, 고차함수

// _filter는 users에 의존성이 없기 때문에 어떤 array든 filter 할 수 있는 다용성이 높은 함수가됨

function _map (list, mapper) {
  let new_list = []
  for (let i = 0; i < list.length; i++) {
    new_list.push(mapper(list[i]))
  }

  return new_list
}

// list가 뭔지, mapper 가 뭔지 _map이 신경 쓸 필요가 없게됨. 관심사가 완전히 분리된다!
// map과 filter도 for문에 관련해서 중복이 있는데 이를 해결할 수 있을까?

// [참고](https://www.inflearn.com/course/%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D/lecture/6776?tab=note&speed=1.25)
