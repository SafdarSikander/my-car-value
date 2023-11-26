import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`User is added with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User is updated with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User is removed with id ${this.id}`);
  }
}
