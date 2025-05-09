export const validateTwitterHandle = (handle: string): boolean => {
  const twitterRegex = /^[A-Za-z0-9_]{4,15}$/;
  return twitterRegex.test(handle.replace('@', ''));
};

export const validateAudioRecording = (audioChunks: Blob[]): boolean => {
  return audioChunks.length > 0;
};

export const validateMood = (mood: string): boolean => {
  const validMoods = ['friendly', 'professional', 'casual', 'enthusiastic'];
  return validMoods.includes(mood);
}; 