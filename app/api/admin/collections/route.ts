import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Get all collections (admin view)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const db = await getDatabase('makers3d_db');
        const collections = await db.collection('collections')
            .find({})
            .sort({ order: 1, createdAt: -1 })
            .toArray();

        const formattedCollections = collections.map(c => ({
            ...c,
            id: c._id.toString()
        }));

        return NextResponse.json(formattedCollections, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Create new collection
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, image, slug, order } = body;

        if (!name || !slug) {
            return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // Check if slug already exists
        const existingCollection = await db.collection('collections').findOne({ slug });
        if (existingCollection) {
            return NextResponse.json({ message: 'Slug already exists' }, { status: 400 });
        }

        const result = await db.collection('collections').insertOne({
            name,
            description: description || '',
            image: image || '',
            slug,
            order: order || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Revalidate frontend pages
        revalidatePath('/');
        revalidatePath('/products');

        return NextResponse.json({ message: 'Collection created', id: result.insertedId }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Update collection
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, description, image, slug, order } = body;

        if (!id) {
            return NextResponse.json({ message: 'Collection ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');

        // If slug is being updated, check it doesn't conflict
        if (slug) {
            const existingCollection = await db.collection('collections').findOne({
                slug,
                _id: { $ne: new ObjectId(id) }
            });
            if (existingCollection) {
                return NextResponse.json({ message: 'Slug already exists' }, { status: 400 });
            }
        }

        const updateData: any = {
            updatedAt: new Date()
        };

        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (slug) updateData.slug = slug;
        if (order !== undefined) updateData.order = Number(order);

        const result = await db.collection('collections').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
        }

        // Revalidate frontend pages
        revalidatePath('/');
        revalidatePath('/products');

        return NextResponse.json({ message: 'Collection updated' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Delete collection
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Collection ID required' }, { status: 400 });
        }

        const db = await getDatabase('makers3d_db');
        const result = await db.collection('collections').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Collection not found' }, { status: 404 });
        }

        // Revalidate frontend pages
        revalidatePath('/');
        revalidatePath('/products');

        return NextResponse.json({ message: 'Collection deleted' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
