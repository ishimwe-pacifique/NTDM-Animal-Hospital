export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"

const DB = "ntdm_animal_hospital"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const farmerId = searchParams.get("farmerId")
    const diseaseRecordId = searchParams.get("diseaseRecordId")

    if (!farmerId) return NextResponse.json({ error: "farmerId required" }, { status: 400 })

    const client = await clientPromise
    const db = client.db(DB)

    const query: any = { farmerId }
    if (diseaseRecordId) query.diseaseRecordId = diseaseRecordId

    const doses = await db.collection("treatment_doses").find(query).sort({ date: -1, session: 1 }).toArray()
    return NextResponse.json(doses.map(d => ({ ...d, _id: d._id.toString() })))
  } catch {
    return NextResponse.json({ error: "Failed to fetch treatment doses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { farmerId, diseaseRecordId, animalId, animalName, diseaseName, date, session, doseCount, medicineName, medicineCost, vetCost, notes } = body

    if (!farmerId || !diseaseRecordId || !date || !session)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

    const client = await clientPromise
    const db = client.db(DB)

    const record = {
      farmerId, diseaseRecordId, animalId, animalName: animalName || null,
      diseaseName: diseaseName || null,
      date, session,
      doseCount: doseCount ? Number(doseCount) : 1,
      medicineName: medicineName || null,
      medicineCost: medicineCost ? Number(medicineCost) : 0,
      vetCost: vetCost ? Number(vetCost) : 0,
      totalCost: (medicineCost ? Number(medicineCost) : 0) + (vetCost ? Number(vetCost) : 0),
      notes: notes || null,
      createdAt: new Date(),
    }

    const result = await db.collection("treatment_doses").insertOne(record)
    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch {
    return NextResponse.json({ error: "Failed to save treatment dose" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, date, session, doseCount, medicineName, medicineCost, vetCost, notes } = body
    if (!id) return NextResponse.json({ error: "Record ID required" }, { status: 400 })

    const client = await clientPromise
    const db = client.db(DB)

    const totalCost = (medicineCost ? Number(medicineCost) : 0) + (vetCost ? Number(vetCost) : 0)

    await db.collection("treatment_doses").updateOne(
      { _id: new ObjectId(id) },
      { $set: { date, session, doseCount: Number(doseCount), medicineName, medicineCost: Number(medicineCost) || 0, vetCost: Number(vetCost) || 0, totalCost, notes, updatedAt: new Date() } }
    )
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update treatment dose" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "Record ID required" }, { status: 400 })

    const client = await clientPromise
    const db = client.db(DB)

    await db.collection("treatment_doses").deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete treatment dose" }, { status: 500 })
  }
}
