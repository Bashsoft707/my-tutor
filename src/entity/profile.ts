import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { LearningPath } from "./learning-path";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  knowledgeLevel: string;

  @Column({ default: 0 })
  progress: number;

  // Use a custom transformer to store the array as a JSON string
  @Column({
    transformer: {
      to: (value: string[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
  })
  interests: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @OneToMany(() => LearningPath, (learningPath) => learningPath.userProfile)
  learningPaths: LearningPath[];
}
