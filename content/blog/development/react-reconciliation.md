배열 안의 아이템을 화면에 그린다고 했을 때, 배열에 값이 추가되거나 삭제될 때 모든 아이템들이 다시 렌더가 되나?

YES.

React는 render시 화면에 보여지는 노드 트리와 새로운 노드 트리의 구조를 비교하는 과정을 거친다. (Reconciliation) 만약 리스트를 비교한다고 했을 때, 동시에 두 리스트를 선회하면서 차이점이 있으면 변경시킨다.

```html
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

리스트를 처음부터 순회하다가 마지막 third element가 다르니 새로운 item을 추가해서 화면에 보여줄 수 있다. 하지만 배열 맨 앞에 엘리먼트를 추가하는 경우 이 방법으로 비교하는 건 너무 비효율적이다. first, second 는 위치만 변경된 것이지 element 자체는 변경되지 않았기 때문에.

그래서 React는 리스트에서 item에 unique한 key를 붙여서 동일한 아이템이란 것을 확인한다. 그래서 위와 같이 item의 순서가 변하더라도 이전 리스트에서의 동일한 key 값이 있다면 새로 그리지 않게 된다.