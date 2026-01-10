import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const db = await getDatabase('makers3d_db');
                    const user = await db.collection('users').findOne({
                        email: credentials.email
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    if (user.isVerified === false) {
                        throw new Error('Please verify your email before logging in.');
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image || null,
                    };
                } catch (error: any) {
                    console.error('Auth error:', error);
                    throw new Error(error.message || 'Authentication failed');
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    const db = await getDatabase('makers3d_db');
                    const usersCollection = db.collection('users');

                    const existingUser = await usersCollection.findOne({ email: user.email });

                    if (!existingUser) {
                        await usersCollection.insertOne({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            provider: 'google',
                            isVerified: true, // Google users are pre-verified
                            createdAt: new Date(),
                        });
                    } else if (existingUser.provider !== 'google') {
                        // Update existing user to mark as verified if they are signing in with Google
                        await usersCollection.updateOne(
                            { email: user.email },
                            {
                                $set: {
                                    isVerified: true,
                                    image: user.image || existingUser.image,
                                    lastLogin: new Date()
                                }
                            }
                        );
                    }
                    return true;
                } catch (error) {
                    console.error('Error saving Google user:', error);
                    return true; // Still allow sign in even if DB update fails
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.image = (user as any).image;
            }

            // Handle updates if session is updated manually
            if (trigger === "update" && session?.image) {
                token.image = session.image;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                session.user.image = token.image as string;

                // Optional: Fetch fresh data from DB if image is missing but exists in DB
                if (!session.user.image) {
                    try {
                        const db = await getDatabase('makers3d_db');
                        const dbUser = await db.collection('users').findOne({ email: session.user.email });
                        if (dbUser?.image) {
                            session.user.image = dbUser.image;
                        }
                    } catch (e) {
                        console.error("Error fetching user image for session:", e);
                    }
                }
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
