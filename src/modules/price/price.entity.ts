import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  chain: string; // e.g., 'ethereum', 'polygon'

  @Column({ type: 'float' })
  price: number;

  @CreateDateColumn()
  createdAt: Date; // Automatically managed timestamp for when the price is saved
}
