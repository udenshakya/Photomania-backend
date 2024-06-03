// src/entities/Post.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Users } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  caption!: string;

  @Column()
  imageUrl!: string;

  @Column()
  description!: string;

  @Column()
  publicId!: string;

  @ManyToOne(() => Users, (user) => user.posts)
  user!: Users;
}
