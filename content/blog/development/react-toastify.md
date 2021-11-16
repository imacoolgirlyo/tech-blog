toast는 유저가 클릭 할 때 마다 새로운 Toast 가 떠야 한다. 동시에 다른 Toast 메세지가 떠야 할 필요도 있다. 이건 어떻게 구현되어야 할까?

클릭할 때 마다 보여줘야할 toast array에 item을 추가하면 될까?
이미 출력됐거나 toast 메세지를 끌 때는 어떻게 이 array를 갱신 시켜야 하나? redux store 같은 전역 state 관리를 쓰지 않고 어떻게 만들 수 있을까?

내부에서 event 라는 걸 만들고 setTimeout와 queue를 사용한다. 이 queue를 사용하는 듯 하나 containers 라는 것도 확인해볼 필요 있을 듯 -> 내부 로직 부터 보는 것보다 사용되고 있는 곳에서의 코드를 먼저 보는게 더 이해가 빠를거 같다.

### Map

Map 객체는 key-value 쌍으로 값을 저장하고 key들의 들어온 순서를 기억한다. 어떤 타입이던 key나 value가 될 수 있다.

```js
const map1 = new Map()

map1.set('a', 1)
map2.set('b', 2)

console.log(map1.get('a')) // 1
console.log(map1.size) // 3

map1.delete('b')
```

보여야 할 Toast 컴포넌트는 `getToastToRender`에 의해 계산된다. useToastContainer 에서 만들어지는 이 함수는 결과적으로는 collection 이라는 객체를 사용한다. 화면에 보여야할 토스트들의 아이템들이 저장된 곳이다.

collection은 appendToast에서 유일하게 값이 추가된다. appendToast가 호출되는 곳은 buildToast와 dequeueToast 이다.

```js
function appendToast(content, toastProps, staleId) {
  collection[toastId] = {
    content,
    props: toastProps,
  }

  dispatch({ type: ActionType.Add, toastId })

  /* args */
  content: React.ReactNode
  toastProps: ToastProps

  interface ToastProps extends ToastOptions {
    isIn: boolean;
    staleId?: Id;
    toastId: Id;
    key: Id;
    transition: ToastTransition;
    closeToast: () => void;
    position: ToastPosition;
    children?: ToastContent;
  }
}
```

buildToast 함수는 이름만 들어도 Toast를 만드는데 한 몫 할거 같다.

buildToast는 useToastContainer 내에 useEffect 내에서 실행된다. `eventManger.on(Event.Show, buildToast)`로 실행된다. 다시 eventManager를 살펴보면 callback(buildToast)가 어딘가로 push 된다.
`this.list.get(event)!.push(callback);` 이 syntax가 익숙하지 않다.

1. 여기서의 this는? -> this.list는 Map 객체를 가리킨다.
2. this.list.has(event) || this.list.set(event, []) 는 event가 있으면 오른쪽을 실행하는 거였었나?
   list에 event가 없으면 (앞이 false면) list에 값을 추가
3. get(event) 는 type이 array인가? 그 옆의 !는 뭐지?
4. ToastContainer가 mount 되면 어딘가(list 아니면 event?)에 callback을 추가하는 듯 하다.

```js
 on(event: Event, callback: Callback) {
    this.list.has(event) || this.list.set(event, []);
    this.list.get(event)!.push(callback);
    return this;
  },
```
