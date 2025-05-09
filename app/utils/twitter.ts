export interface CleanedTwitterData {
  handle?: string;
  bio?: string;
  location?: string;
  followerCount?: number;
  followingCount?: number;
  tweetCount?: number;
  tweets?: Array<{
    text: string;
    favorites: number;
    retweets: number;
    date: string;
  }>;
}

export function cleanTwitterData(data: any): CleanedTwitterData {
  if (!data?.text) return {};
  
  const text = data.text;
  
  const [profileInfo, ...tweetTexts] = text.split('| created_at:');
  const profileParts = profileInfo.split('|');
  const bio = profileParts[0].trim();
  
  const matches = {
    followers: text.match(/followers_count: (\d+)/),
    following: text.match(/friends_count: (\d+)/),
    tweets: text.match(/statuses_count: (\d+)/),
    location: text.match(/location: ([^|]+)/)
  };

  const tweets = tweetTexts.map((tweetText: string) => {
    const dateMatch = tweetText.match(/^([^|]+)/);
    const favMatch = tweetText.match(/favorite_count: (\d+)/);
    const rtMatch = tweetText.match(/retweet_count: (\d+)/);
    const contentMatch = tweetText.match(/count: \d+\s*\|\s*lang: \w+\s+([^|]+)/);

    return {
      date: dateMatch ? dateMatch[1].trim() : '',
      text: contentMatch ? contentMatch[1].trim() : '',
      favorites: favMatch ? parseInt(favMatch[1]) : 0,
      retweets: rtMatch ? parseInt(rtMatch[1]) : 0
    };
  }).filter((tweet: { text: string }) => tweet.text);

  return {
    handle: data.author,
    bio,
    location: matches.location ? matches.location[1].trim() : undefined,
    followerCount: matches.followers ? parseInt(matches.followers[1]) : undefined,
    followingCount: matches.following ? parseInt(matches.following[1]) : undefined,
    tweetCount: matches.tweets ? parseInt(matches.tweets[1]) : undefined,
    tweets
  };
} 