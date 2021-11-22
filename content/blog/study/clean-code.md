함수 내에서 사용할 수 있는 값은 전역 변수 값과 함수 lexical scope 안에 있는 변수들 그리고 parameter로 받는 값들이 있다.

hooks 내의 함수를 만들다보면 hook에도 args가 필요하고 함수도 args를 가지는데 함수 내에서 어떤 값을 hook에 args에 있는 값을 사용할건지 함수 args로 사용할 건지 기준을 생각하기 어렵다.
얼마전에 useAddNewResource hooks을 만드는데 props를 변경해야할지 addUrlResource args를 바꿔야할지 판단하기 어려웠다. 결국 이 훅을 사용하는 곳에서의 상태가 매우 중요했다.
