import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string; // e.g., 'ethereum', 'polygon'

  @Column('float', { nullable: true })  // Allow null values temporarily
  targetPrice: number; // The price at which the alert will be triggered

  @Column()
  email: string; // The user's email to send the alert

  @CreateDateColumn()
  createdAt: Date; // Automatically managed timestamp for when the alert was created
}
