import { Profile as UserProfile, Lesson, Profile } from "../models";

export const calculateProgress = (
  completedLessons: any,
  totalLessons: any
): number => {
  const completedLessonIds = completedLessons.map((lesson: any) => lesson.id);
  const totalLessonIds = totalLessons.map((lesson: any) => lesson.id);

  const uniqueCompletedLessonIds = [...new Set(completedLessonIds)];
  const uniqueTotalLessonIds = [...new Set(totalLessonIds)];

  const progress =
    (uniqueCompletedLessonIds.length / uniqueTotalLessonIds.length) * 100;
  return isNaN(progress) ? 0 : progress;
};

export const generateLearningPath = async (
  userProfile: any,
  totalLessons: any
) => {
  const progress = userProfile.progress;
  const learningPathSize = 3; // Adjust the number of lessons per session

  // Assume user progresses linearly through the curriculum based on completion percentage
  const startIndex = Math.floor((progress / 100) * totalLessons.length);
  const endIndex = startIndex + learningPathSize;

  // Limit endIndex to prevent array out-of-bounds errors
  const slicedLessons = totalLessons.slice(
    startIndex,
    Math.min(endIndex, totalLessons.length)
  );

  // Update user profile progress based on the generated learning path
  const updatedProgress = calculateProgress(slicedLessons, totalLessons);
  userProfile.progress = updatedProgress;

  // Update the database with the new progress
  // This assumes you have access to the database connection and UserProfile repository
  await Profile.findOneAndUpdate(
    { id: userProfile.id },
    { progress: updatedProgress },
    { new: true }
  );

  return slicedLessons;
};
