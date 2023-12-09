import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile';
import { Lesson } from './lesson';

@Entity()
export class LearningPath {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (userProfile) => userProfile.learningPaths)
  @JoinColumn()
  userProfile: Profile;

  @ManyToOne(() => Lesson, (lesson) => lesson.learningPaths)
  @JoinColumn()
  lesson: Lesson;
}
