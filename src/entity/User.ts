import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  // @OneToOne(() => Profile)
  // @JoinColumn()
  // profile!: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}
