import {Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class GenericEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;
  
  @Column({nullable: true})
  @ApiPropertyOptional()
  createdBy?: string;
  
  @Column({nullable: true})
  @ApiPropertyOptional()
  updatedBy?: string;
  
  @CreateDateColumn()
  @ApiPropertyOptional()
  createdAt: Date;
  
  @UpdateDateColumn()
  @ApiPropertyOptional()
  updatedAt: Date;
  
  @DeleteDateColumn()
  @ApiPropertyOptional()
  deletedAt: boolean;
}
