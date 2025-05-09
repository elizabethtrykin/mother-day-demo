import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';

export const seasonSans = localFont({
  src: [
    {
      path: './seasonSans/SeasonSans-Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './seasonSans/SeasonSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './seasonSans/SeasonSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './seasonSans/SeasonSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './seasonSans/SeasonSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './seasonSans/SeasonSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  preload: true,
});

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  style: 'normal',
  display: 'swap',
  preload: true,
}); 