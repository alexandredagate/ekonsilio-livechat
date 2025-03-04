import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Conversation } from "../conversation/conversation.entity";
import { User } from "../user/user.entity";

@Entity()
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar")
  text: string;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  @JoinColumn({ name: "conversationId" })
  conversation: Conversation;
 
  @Column({ nullable: false })
  conversationId: string;

  @ManyToOne(() => User, user => user.messages, { nullable: true, eager: true })
  @JoinColumn()
  operator?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}