import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "../message/message.entity";
import { User } from "../user/user.entity";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column("varchar", { nullable: true })
  userAgent?: string;

  @OneToMany(() => Message, message => message.conversation, { eager: true, cascade: true })
  messages: Message[];

  @ManyToOne(() => User, user => user.conversations, { eager: true })
  @JoinColumn()
  operator: User;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}