---
title: 'Many To One, One To Many RelationShip'
date: 2021-11-16 09:16:13
category: 'TypeORM'
draft: false
---

https://orkhan.gitbook.io/typeorm/docs/many-to-one-one-to-many-relations

Many To One, One To Many 관계는 한 인스턴스가 여러 인스턴스를 가질 수 있는 관계이고 그 반대로 여러 인스턴스는 하나의 인스턴스만 가질 수 있는 관계이다.

예를 들어서 User와 Photo를 생각해보면 User는 많은 photos를 가질 수 있으나 photo는 단 하나의 owner만 가질 수 있다.

```js
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => User, user => user.photos)
  user: User;
}


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column:
  name: string

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];
}
```
