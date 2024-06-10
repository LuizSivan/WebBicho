import {
  Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

export class GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({nullable: true})
  createdBy?: string;
  
  @Column({nullable: true})
  updatedBy?: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
  
  @DeleteDateColumn()
  deletedAt: boolean;
}
