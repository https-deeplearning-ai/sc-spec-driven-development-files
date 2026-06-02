import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, species, modelProvider, modelName } = body;

    if (!name || !species || !modelProvider || !modelName) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, species, modelProvider, modelName",
        },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof species !== "string" ||
      typeof modelProvider !== "string" ||
      typeof modelName !== "string"
    ) {
      return NextResponse.json(
        { error: "All fields must be strings" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const result = db
      .insert(patients)
      .values({
        name,
        species,
        modelProvider,
        modelName,
        status: "active",
        createdAt: now,
        updatedAt: now,
      })
      .returning()
      .get();

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  const allPatients = db.select().from(patients).all();
  return NextResponse.json(allPatients);
}
