import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Message } from "../message/message.entity";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column("varchar")
  userAgent: string;

  @OneToMany(() => Message, message => message.conversation, { eager: true })
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}