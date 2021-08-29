### React Query Render Optimizations

Render Optimization은 앱에서 꼭 필요한 컨셉은 아니다. 이미 React Query가 좀 최적화를 해줌.
(사람들이 불필요한 re-render에 목숨걸어서 최적화를 하려고 하지만 생각하는 것보다 그렇게 중요한 문제는 아니다. 앱을 최신 상태를 만들어주기 위한 것이기 떄문에 Re-render는 좋은 것임 )

사람들이 내 데이터는 안 바꼈는데 react Query 때문에 여러번 렌더가 된다. 왜 이러는 거임? 이라는 질문을 많이 해서 좀 설명해보고자함.

### isFetching transition

todos의 길이가 바뀔 때만 컴포넌트가 렌더된다고 말한건 사실 구라였다.
background refetch가 이루어질 때 마다, 컴포넌트가 2번 리렌더된다.

이건 사실 React Query가 매 query 마다 많은 메타 정보를 노출시켜서 그런건데 isFetching이 그 중 하나다. 실제로 request가 날라가면 flag가 true가 된다.
