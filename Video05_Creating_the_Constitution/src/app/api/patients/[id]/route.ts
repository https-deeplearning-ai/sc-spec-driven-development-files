import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patientId = parseInt(id, 10);

  if (isNaN(patientId)) {
    return NextResponse.json(
      { error: "Invalid patient ID" },
      { status: 400 }
    );
  }

  const patient = db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId))
    .get();

  if (!patient) {
    return NextResponse.json(
      { error: "Patient not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(patient);
}
