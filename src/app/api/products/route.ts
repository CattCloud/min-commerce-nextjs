import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Esta función maneja las peticiones GET a /api/products
export async function GET() {
  try {
    console.log('Fetching products...');
    const products = await prisma.product.findMany();
    console.log('Products fetched:', products.length);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}