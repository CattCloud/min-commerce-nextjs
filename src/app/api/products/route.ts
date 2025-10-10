import { NextResponse } from 'next/server';
import { products } from '../../data/products'; 

// Esta función maneja las peticiones GET a /api/products
export async function GET() {
  // Retornamos los productos en formato JSON
  return NextResponse.json(products);
}