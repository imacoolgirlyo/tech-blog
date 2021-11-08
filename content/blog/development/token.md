---
title: 'ID Token과 Refresh Token'
date: 2021-11-08 00:00:00
category: 'development'
draft: false
---

### ID Token

ID token 은 user가 인증된 유저라는 걸 증명해준다. 구글이나 페이스북 등의 identity provider 들이 사용 하고 있는 표준인 OpenID Connect에 의해 만들어진 개념이다.
즉 쉽게 말해서 당신이 신뢰하고 있는 구글, 페이스북이 인증한 유저라는 걸 알려준다.

JSON Web Token(JWT)로 encoded 되어있는데 이걸 decode 해보면 유저 정보가 나온다.

```js
{
  "name": "Seokyung Jung",
  "email": "seokyung.jung@business-canvas.com",
  "email_verified": true,
  "auth_time": 1636378392,
  "user_id": "",
  "firebase": {
    "identities": {
      "email": [
        "seokyung.jung@business-canvas.com"
      ],
      "google.com": [
        ""
      ]
    },
    "sign_in_provider": "google.com"
  },
  "iat": 1636378392, // 토근이 발급된 시간
  "exp": 1636381992, // 토큰 만료 시간
  "aud": "typed-app-dev",
  "iss": "https://securetoken.google.com/typed-app-dev",
  "sub": ""
}
```

각 프로퍼티 들을 claim이라고 부른다. 이 중 aud는 audience로 이 토큰을 사용하고자 하는 클라이언트 (웹 어플리케이션)에 대한 정보를 나타낸다.

### Access Token

server에 API 요청을 해서 특정 리소스를 얻기 위해서는 인증된 유저여야 한다. 유저는 resource의 owner여야 하고 authorization server의 owner여야 한다.

즉, access token이 이 유저가 특정 리소스에 접근할 권한이 있는지 없는지 파악하기 위한 용도이다.

### Refresh Token

Access Token은 만료시간이 있기 때문에 새로운 Access Token 발급을 위해 refresh token을 사용한다.

### References

- https://auth0.com/blog/id-token-access-token-what-is-the-difference/
