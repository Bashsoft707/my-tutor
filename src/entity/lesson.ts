import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
import { LearningPath } from "./learning-path";
  
  @Entity()
  export class Lesson {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column()
    title: string;
  
    @Column()
    content: string;
  
    @Column()
    difficulty: string;
  
    @Column()
    topic: string;
  
    @Column('simple-array')
    learningObjectives: string[];

    @OneToMany(() => LearningPath, (learningPath) => learningPath.lesson)
    learningPaths: LearningPath[];
  }
  