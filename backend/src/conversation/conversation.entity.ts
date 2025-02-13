import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @Column("varchar")
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}