// import NextAuth from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';
// import connectDB from '@/lib/db';
// import User from '@/models/User';

// export const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//       scope: 'user:email read:user repo'
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account.provider === 'github') {
//         await connectDB();
//         const existingUser = await User.findOne({ githubId: user.id });
//         if (existingUser) {
//           existingUser.accessToken = account.access_token;
//           await existingUser.save();
//         } else {
//           await User.create({
//             githubId: user.id,
//             username: user.name,
//             accessToken: account.access_token,
//           });
//         }
//       }
//       return true;
//     },
//     async session({ session, token }) {  // Changed from user to token
//       await connectDB();
//       const dbUser = await User.findOne({ githubId: token.sub });  // Use token.sub instead of user.id
//       if (dbUser) {
//         session.user.accessToken = dbUser.accessToken;
//         session.user.id = dbUser._id;
//         session.user.githubId = dbUser.githubId;
//       }
//       return session;
//     },
//     async jwt({ token, account, profile }) {
//       if (account) {
//         token.accessToken = account.access_token;
//         token.githubId = profile.id;
//       }
//       return token;
//     }
//   },
// };

// const handler = NextAuth(authOptions);

// // export { handler as GET, handler as POST };
// import NextAuth from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';
// import connectDB from '@/lib/db';
// import User from '@/models/User';

// export const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//       scope: 'user:email read:user repo'
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account.provider === 'github') {
//         await connectDB();
        
//         console.log('GitHub Profile:', profile);
        
//         const existingUser = await User.findOne({ githubId: user.id });
//         if (existingUser) {
//           existingUser.accessToken = account.access_token;
//           existingUser.githubUsername = profile.login; // GitHub username
//           await existingUser.save();
//         } else {
//           await User.create({
//             githubId: user.id,
//             githubUsername: profile.login, // Use profile.login here
//             accessToken: account.access_token,
//           });
//         }
//       }
//       return true;
//     },
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         token.accessToken = account.access_token;
//         token.githubUsername = profile.login; // Add to JWT token
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log('Token in session callback:', token);
      
//       await connectDB();
//       const dbUser = await User.findOne({ githubId: token.sub });
      
//       if (dbUser) {
//         session.user.accessToken = dbUser.accessToken;
//         session.user.id = dbUser._id;
//         session.user.githubId = dbUser.githubId;
//         session.user.githubUsername = dbUser.githubUsername;
//       }
      
//       console.log('Final session:', session);
      
//       return session;
//     },
//   },
//   debug: true,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };



// import NextAuth, { NextAuthOptions } from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';
// import connectDB from '@/lib/db';
// import User from '@/models/User';

// export const authOptions: NextAuthOptions = { // Explicit typing here
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || '', // Add fallback to avoid undefined values
//       clientSecret: process.env.GITHUB_SECRET || '',
//       scope: 'user:email read:user repo'
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       if (account.provider === 'github') {
//         await connectDB();
        
//         console.log('GitHub Profile:', profile);
        
//         const existingUser = await User.findOne({ githubId: user.id });
//         if (existingUser) {
//           existingUser.accessToken = account.access_token;
//           existingUser.githubUsername = profile.login; // GitHub username
//           await existingUser.save();
//         } else {
//           await User.create({
//             githubId: user.id,
//             githubUsername: profile.login, // Use profile.login here
//             accessToken: account.access_token,
//           });
//         }
//       }
//       return true;
//     },
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         token.accessToken = account.access_token;
//         token.githubUsername = profile.login; // Add to JWT token
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log('Token in session callback:', token);
      
//       await connectDB();
//       const dbUser = await User.findOne({ githubId: token.sub });
      
//       if (dbUser) {
//         session.user.accessToken = dbUser.accessToken;
//         session.user.id = dbUser._id;
//         session.user.githubId = dbUser.githubId;
//         session.user.githubUsername = dbUser.githubUsername;
//       }
      
//       console.log('Final session:', session);
      
//       return session;
//     },
//   },
//   debug: true,
// };


// @ts-nocheck
// @ts-nocheck
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import connectDB from '@/lib/db';
import User from '@/models/User';

const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      scope: 'user:email read:user repo',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        await connectDB();
        const existingUser = await User.findOne({ githubId: user.id });
        if (existingUser) {
          existingUser.accessToken = account.access_token;
          existingUser.githubUsername = profile?.login;
          await existingUser.save();
        } else {
          await User.create({
            githubId: user.id,
            githubUsername: profile?.login,
            accessToken: account.access_token,
          });
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.githubUsername = profile.login;
      }
      return token;
    },
    async session({ session, token }) {
      await connectDB();
      const dbUser = await User.findOne({ githubId: token.sub });
      if (dbUser && session.user) {
        session.user.accessToken = dbUser.accessToken;
        session.user.id = dbUser._id.toString();
        session.user.githubId = dbUser.githubId;
        session.user.githubUsername = dbUser.githubUsername;
      }
      return session;
    },
  },
  debug: true,
};

// Explicitly export the HTTP method handlers as individual functions
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
