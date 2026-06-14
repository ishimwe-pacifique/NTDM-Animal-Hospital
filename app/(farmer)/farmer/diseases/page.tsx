"use client"

import { useState, useEffect, useMemo } from "react"
import { getCurrentUser } from "@/lib/actions/auth"
import { getAnimals, getDoctorsList } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ShieldAlert, Plus, Pencil, Trash2, BarChart3, History, Activity, CheckCircle2, AlertCircle, Clock, Syringe, DollarSign, Download, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface Animal { _id: string; name: string; type: string; insuranceId?: string | null; earTagId?: string | null }
interface Doctor { _id: string; name: string; specialization: string }
interface DiseaseRecord {
  _id: string; animalId: string; animalName: string | null
  diseaseName: string; symptoms: string | null; treatment: string | null
  diagnosedDate: string; resolvedDate: string | null
  status: string; notes: string | null; veterinarianName: string | null
}
interface TreatmentDose {
  _id: string; diseaseRecordId: string; animalId: string; animalName: string | null
  diseaseName: string | null; date: string; session: string
  doseCount: number; medicineName: string | null
  medicineCost: number; vetCost: number; totalCost: number; notes: string | null
}

const STATUSES = ["Active", "Under Treatment", "Resolved"]
const SESSIONS = ["Morning", "Evening"]
const COMMON_DISEASES = [
  "Foot and Mouth Disease", "Mastitis", "Bovine Respiratory Disease",
  "Brucellosis", "Tuberculosis", "Lumpy Skin Disease", "East Coast Fever",
  "Trypanosomiasis", "Newcastle Disease", "Anthrax", "Blackleg", "Other"
]

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-red-50 text-red-700 border-red-200",
  "Under Treatment": "bg-amber-50 text-amber-700 border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
}
const SESSION_STYLES: Record<string, string> = {
  Morning: "bg-amber-50 text-amber-700 border-amber-200",
  Evening: "bg-indigo-50 text-indigo-700 border-indigo-200",
}

const PIE_COLORS = ["#ef4444", "#f59e0b", "#16a34a"]
const today = new Date().toISOString().split("T")[0]

export default function DiseaseManagementPage() {
  const [user, setUser] = useState<any>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [records, setRecords] = useState<DiseaseRecord[]>([])
  const [doses, setDoses] = useState<TreatmentDose[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editRecord, setEditRecord] = useState<DiseaseRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Disease form
  const [animalId, setAnimalId] = useState("")
  const [diseaseName, setDiseaseName] = useState("")
  const [customDisease, setCustomDisease] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [treatment, setTreatment] = useState("")
  const [diagnosedDate, setDiagnosedDate] = useState(today)
  const [resolvedDate, setResolvedDate] = useState("")
  const [status, setStatus] = useState("Active")
  const [veterinarianName, setVeterinarianName] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [insuranceId, setInsuranceId] = useState("")
  const [earTagId, setEarTagId] = useState("")

  // Dose form
  const [doseRecordId, setDoseRecordId] = useState("")
  const [doseDate, setDoseDate] = useState(today)
  const [doseSession, setDoseSession] = useState("")
  const [doseCount, setDoseCount] = useState("1")
  const [medicineName, setMedicineName] = useState("")
  const [medicineCost, setMedicineCost] = useState("")
  const [vetCost, setVetCost] = useState("")
  const [doseNotes, setDoseNotes] = useState("")
  const [doseErrors, setDoseErrors] = useState<Record<string, string>>({})
  const [editDose, setEditDose] = useState<TreatmentDose | null>(null)
  const [deleteDoseId, setDeleteDoseId] = useState<string | null>(null)
  const [savingDose, setSavingDose] = useState(false)

  // Filters
  const [filterStatus, setFilterStatus] = useState("")
  const [filterAnimal, setFilterAnimal] = useState("")
  const [filterMonth, setFilterMonth] = useState("")
  const [filterDoseRecord, setFilterDoseRecord] = useState("")

  useEffect(() => {
    async function init() {
      const userData = await getCurrentUser()
      if (!userData) return
      setUser(userData)
      const [animalsData, doctorsData] = await Promise.all([
        getAnimals(userData._id.toString()),
        getDoctorsList(),
      ])
      setAnimals(animalsData)
      setDoctors(doctorsData)
      await Promise.all([
        fetchRecords(userData._id.toString()),
        fetchDoses(userData._id.toString()),
      ])
      setLoading(false)
    }
    init()
  }, [])

  const fetchRecords = async (farmerId: string) => {
    const res = await fetch(`/api/diseases?farmerId=${farmerId}`)
    const data = await res.json()
    setRecords(Array.isArray(data) ? data : [])
  }

  const fetchDoses = async (farmerId: string) => {
    const res = await fetch(`/api/treatment-doses?farmerId=${farmerId}`)
    const data = await res.json()
    setDoses(Array.isArray(data) ? data : [])
  }

  // Auto-detect insurance ID from selected animal
  useEffect(() => {
    const animal = animals.find(a => a._id === animalId)
    setInsuranceId(animal?.insuranceId || "")
    setEarTagId(animal?.earTagId || "")
  }, [animalId, animals])

  const getAnimalInsuranceId = (id: string) =>
    animals.find(a => a._id === id)?.insuranceId || '—'

  const getAnimalEarTagId = (id: string) =>
    animals.find(a => a._id === id)?.earTagId || '—'

  const filteredRecords = useMemo(() => {
    let data = [...records]
    if (filterStatus) data = data.filter(r => r.status === filterStatus)
    if (filterAnimal) data = data.filter(r => r.animalId === filterAnimal)
    if (filterMonth) data = data.filter(r => r.diagnosedDate.startsWith(filterMonth))
    return data
  }, [records, filterStatus, filterAnimal, filterMonth])

  const filteredDoses = useMemo(() => {
    if (!filterDoseRecord) return doses
    return doses.filter(d => d.diseaseRecordId === filterDoseRecord)
  }, [doses, filterDoseRecord])

  // Cost per animal (total across all doses per animal)
  const costPerAnimal = useMemo(() => {
    const map: Record<string, { animalId: string; animalName: string; medicineCost: number; vetCost: number; total: number; doses: number }> = {}
    doses.forEach(d => {
      if (!map[d.animalId]) map[d.animalId] = { animalId: d.animalId, animalName: d.animalName || d.animalId, medicineCost: 0, vetCost: 0, total: 0, doses: 0 }
      map[d.animalId].medicineCost += d.medicineCost
      map[d.animalId].vetCost += d.vetCost
      map[d.animalId].total += d.totalCost
      map[d.animalId].doses += d.doseCount
    })
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [doses])

  // Validate disease form
  const validate = () => {
    const e: Record<string, string> = {}
    if (!animalId) e.animalId = "Select an animal"
    const finalDisease = diseaseName === "Other" ? customDisease : diseaseName
    if (!finalDisease) e.diseaseName = "Enter the disease name"
    if (!diagnosedDate) e.diagnosedDate = "Select a date"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Validate dose form
  const validateDose = () => {
    const e: Record<string, string> = {}
    if (!doseRecordId) e.doseRecordId = "Select a disease case"
    if (!doseSession) e.doseSession = "Select a session"
    if (!doseDate) e.doseDate = "Select a date"
    if (!doseCount || Number(doseCount) < 1) e.doseCount = "Enter number of doses"
    setDoseErrors(e)
    return Object.keys(e).length === 0
  }

  const resetForm = () => {
    setAnimalId(""); setDiseaseName(""); setCustomDisease(""); setSymptoms("")
    setTreatment(""); setDiagnosedDate(today); setResolvedDate("")
    setStatus("Active"); setVeterinarianName(""); setNotes("")
    setInsuranceId(""); setEarTagId("")
    setErrors({}); setEditRecord(null)
  }

  const resetDoseForm = () => {
    setDoseRecordId(""); setDoseDate(today); setDoseSession("")
    setDoseCount("1"); setMedicineName(""); setMedicineCost("")
    setVetCost(""); setDoseNotes("")
    setDoseErrors({}); setEditDose(null)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    const animal = animals.find(a => a._id === animalId)
    const finalDisease = diseaseName === "Other" ? customDisease : diseaseName
    const body = {
      farmerId: user._id.toString(), animalId,
      animalName: animal?.name || null,
      diseaseName: finalDisease, symptoms, treatment,
      diagnosedDate, resolvedDate: resolvedDate || null,
      status, notes, veterinarianName,
    }
    if (editRecord) {
      await fetch("/api/diseases", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editRecord._id, ...body }) })
    } else {
      await fetch("/api/diseases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    }
    await fetchRecords(user._id.toString())
    resetForm()
    setSaving(false)
  }

  const handleDoseSubmit = async () => {
    if (!validateDose()) return
    setSavingDose(true)
    const diseaseRecord = records.find(r => r._id === doseRecordId)
    const body = {
      farmerId: user._id.toString(),
      diseaseRecordId: doseRecordId,
      animalId: diseaseRecord?.animalId || "",
      animalName: diseaseRecord?.animalName || null,
      diseaseName: diseaseRecord?.diseaseName || null,
      date: doseDate, session: doseSession,
      doseCount, medicineName, medicineCost, vetCost, notes: doseNotes,
    }
    if (editDose) {
      await fetch("/api/treatment-doses", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editDose._id, ...body }) })
    } else {
      await fetch("/api/treatment-doses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    }
    await fetchDoses(user._id.toString())
    resetDoseForm()
    setSavingDose(false)
  }

  const handleEdit = (r: DiseaseRecord) => {
    setEditRecord(r)
    setAnimalId(r.animalId)
    setInsuranceId(animals.find(a => a._id === r.animalId)?.insuranceId || "")
    setEarTagId(animals.find(a => a._id === r.animalId)?.earTagId || "")
    const isCommon = COMMON_DISEASES.includes(r.diseaseName)
    setDiseaseName(isCommon ? r.diseaseName : "Other")
    setCustomDisease(isCommon ? "" : r.diseaseName)
    setSymptoms(r.symptoms || "")
    setTreatment(r.treatment || "")
    setDiagnosedDate(r.diagnosedDate)
    setResolvedDate(r.resolvedDate || "")
    setStatus(r.status)
    setVeterinarianName(r.veterinarianName || "")
    setNotes(r.notes || "")
  }

  const handleEditDose = (d: TreatmentDose) => {
    setEditDose(d)
    setDoseRecordId(d.diseaseRecordId)
    setDoseDate(d.date)
    setDoseSession(d.session)
    setDoseCount(String(d.doseCount))
    setMedicineName(d.medicineName || "")
    setMedicineCost(d.medicineCost ? String(d.medicineCost) : "")
    setVetCost(d.vetCost ? String(d.vetCost) : "")
    setDoseNotes(d.notes || "")
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/diseases?id=${id}`, { method: "DELETE" })
    await fetchRecords(user._id.toString())
    setDeleteId(null)
  }

  const handleDeleteDose = async (id: string) => {
    await fetch(`/api/treatment-doses?id=${id}`, { method: "DELETE" })
    await fetchDoses(user._id.toString())
    setDeleteDoseId(null)
  }

  // Stats
  const activeCount = useMemo(() => records.filter(r => r.status === "Active").length, [records])
  const underTreatmentCount = useMemo(() => records.filter(r => r.status === "Under Treatment").length, [records])
  const resolvedCount = useMemo(() => records.filter(r => r.status === "Resolved").length, [records])
  const totalTreatmentCost = useMemo(() => doses.reduce((s, d) => s + d.totalCost, 0), [doses])

  const [reportCaseId, setReportCaseId] = useState("")

  const dailyCostBreakdown = useMemo(() => {
    const caseDoses = reportCaseId ? doses.filter(d => d.diseaseRecordId === reportCaseId) : doses
    const dayMap: Record<string, { date: string; morning: TreatmentDose[]; evening: TreatmentDose[]; dayTotal: number }> = {}
    caseDoses.forEach(d => {
      if (!dayMap[d.date]) dayMap[d.date] = { date: d.date, morning: [], evening: [], dayTotal: 0 }
      if (d.session === "Morning") dayMap[d.date].morning.push(d)
      else dayMap[d.date].evening.push(d)
      dayMap[d.date].dayTotal += d.totalCost
    })
    let running = 0
    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date)).map(row => {
      running += row.dayTotal
      return { ...row, runningTotal: running }
    })
  }, [doses, reportCaseId])

  const diseaseFrequency = useMemo(() => {
    const map: Record<string, number> = {}
    filteredRecords.forEach(r => { map[r.diseaseName] = (map[r.diseaseName] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))
  }, [filteredRecords])

  const statusData = useMemo(() => [
    { name: "Active", value: activeCount },
    { name: "Under Treatment", value: underTreatmentCount },
    { name: "Resolved", value: resolvedCount },
  ].filter(d => d.value > 0), [activeCount, underTreatmentCount, resolvedCount])

  // Export
  const [exportOpen, setExportOpen] = useState(false)
  const [exportCaseId, setExportCaseId] = useState("all")
  const [exporting, setExporting] = useState(false)

  const getExportDoses = () => exportCaseId === "all" ? doses : doses.filter(d => d.diseaseRecordId === exportCaseId)
  const getExportRecords = () => exportCaseId === "all" ? records : records.filter(r => r._id === exportCaseId)

  const getExportDailyBreakdown = () => {
    const caseDoses = getExportDoses()
    const dayMap: Record<string, { date: string; morning: TreatmentDose[]; evening: TreatmentDose[]; dayTotal: number }> = {}
    caseDoses.forEach(d => {
      if (!dayMap[d.date]) dayMap[d.date] = { date: d.date, morning: [], evening: [], dayTotal: 0 }
      if (d.session === "Morning") dayMap[d.date].morning.push(d)
      else dayMap[d.date].evening.push(d)
      dayMap[d.date].dayTotal += d.totalCost
    })
    let running = 0
    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date)).map(row => {
      running += row.dayTotal
      return { ...row, runningTotal: running }
    })
  }

  const exportToPDF = async () => {
    setExporting(true)
    try {
      const jsPDF = (await import('jspdf')).default
      const doc = new jsPDF()
      const caseLabel = exportCaseId === "all" ? "All Cases" : (() => { const r = records.find(r => r._id === exportCaseId); return r ? `${r.animalName} — ${r.diseaseName}` : "Unknown" })()
      const daily = getExportDailyBreakdown()
      const exportDoses = getExportDoses()
      const exportRecs = getExportRecords()
      const grandTotal = daily.length > 0 ? daily[daily.length - 1].runningTotal : 0
      const totalDoses = exportDoses.reduce((s, d) => s + d.doseCount, 0)

      // Header
      doc.setFillColor(239, 68, 68)
      doc.rect(0, 0, 210, 38, 'F')
      try {
        const logoImg = new Image(); logoImg.crossOrigin = 'anonymous'; logoImg.src = '/logo/NTDM.png'
        await new Promise((res, rej) => { logoImg.onload = res; logoImg.onerror = rej })
        doc.addImage(logoImg, 'PNG', 15, 7, 22, 22)
      } catch { }
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16); doc.setFont('helvetica', 'bold')
      doc.text('Disease Management Report', 45, 18)
      doc.setFontSize(10); doc.setFont('helvetica', 'normal')
      doc.text('NTDM Animal Hospital', 45, 27)

      // Meta
      doc.setTextColor(55, 65, 81); doc.setFontSize(10)
      doc.text(`Case: ${caseLabel}`, 15, 50)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 58)
      doc.text(`Generated by: ${user?.name || 'Unknown'}`, 15, 66)

      // Summary box
      doc.setFillColor(248, 250, 252); doc.setDrawColor(226, 232, 240)
      doc.rect(15, 74, 180, 28, 'FD')
      doc.setTextColor(239, 68, 68); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
      doc.text('Summary', 20, 85)
      doc.setTextColor(55, 65, 81); doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
      doc.text(`Disease Cases: ${exportRecs.length}`, 20, 95)
      doc.text(`Total Doses: ${totalDoses}`, 80, 95)
      doc.text(`Treatment Days: ${daily.length}`, 140, 95)
      doc.text(`Grand Total Cost: RWF ${grandTotal.toLocaleString()}`, 20, 103) // will overlap if too wide — kept simple

      // ── Disease Cases section ──
      let y = 118

      const caseCols = {
        animal: { x: 18, width: 22 },
        earTag: { x: 42, width: 22 },
        insurance: { x: 65, width: 30 },
        disease: { x: 98, width: 24 },
        status: { x: 124, width: 20 },
        vet: { x: 148, width: 20 },
        date: { x: 170, width: 20 }
      }

      const drawCaseHeader = () => {
        doc.setFillColor(239, 68, 68)
        doc.rect(15, y - 6, 180, 8, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')

        doc.text('Animal', caseCols.animal.x, y)
        doc.text('Ear Tag', caseCols.earTag.x, y)
        doc.text('Insurance ID', caseCols.insurance.x, y)
        doc.text('Disease', caseCols.disease.x, y)
        doc.text('Status', caseCols.status.x, y)
        doc.text('Vet', caseCols.vet.x, y)
        doc.text('Diagnosed', caseCols.date.x, y)

        doc.setFont('helvetica', 'normal')
      }

      drawCaseHeader()
      y += 8

      exportRecs.forEach((r, i) => {
        const animalText = r.animalName || '—'
        const earTagText = getAnimalEarTagId(r.animalId) || '—'
        const insuranceText = getAnimalInsuranceId(r.animalId) || '—'
        const diseaseText = r.diseaseName || '—'
        const statusText = r.status || '—'
        const vetText = r.veterinarianName || '—'

        const animalLines = doc.splitTextToSize(animalText, caseCols.animal.width)
        const earTagLines = doc.splitTextToSize(earTagText, caseCols.earTag.width)
        const insuranceLines = doc.splitTextToSize(insuranceText, caseCols.insurance.width)
        const diseaseLines = doc.splitTextToSize(diseaseText, caseCols.disease.width)
        const statusLines = doc.splitTextToSize(statusText, caseCols.status.width)
        const vetLines = doc.splitTextToSize(vetText, caseCols.vet.width)

        const rowHeight =
          Math.max(
            animalLines.length,
            earTagLines.length,
            insuranceLines.length,
            diseaseLines.length,
            statusLines.length,
            vetLines.length,
            1
          ) * 5 + 4

        // Page break
        if (y + rowHeight > 270) {
          doc.addPage()
          y = 20
          drawCaseHeader()
          y += 8
        }

        // Row background
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252)
          doc.rect(15, y - 4, 180, rowHeight, 'F')
        }

        doc.setDrawColor(226, 232, 240)
        doc.rect(15, y - 4, 180, rowHeight)

        doc.setTextColor(55, 65, 81)

        doc.text(animalLines, caseCols.animal.x, y)
        doc.text(earTagLines, caseCols.earTag.x, y)
        doc.text(insuranceLines, caseCols.insurance.x, y)
        doc.text(diseaseLines, caseCols.disease.x, y)
        doc.text(statusLines, caseCols.status.x, y)
        doc.text(vetLines, caseCols.vet.x, y)

        doc.text(r.diagnosedDate || '—', caseCols.date.x, y)

        y += rowHeight
      })

      // Footer
      const totalPages = doc.getNumberOfPages()

      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page)

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()

        // Footer background
        doc.setFillColor(248, 250, 252)
        doc.rect(0, pageHeight - 18, pageWidth, 18, "F")

        // Top border line
        doc.setDrawColor(226, 232, 240)
        doc.line(
          0,
          pageHeight - 18,
          pageWidth,
          pageHeight - 18
        )

        doc.setFontSize(7)
        doc.setTextColor(107, 114, 128)

        // Left side
        doc.text(
          `NTDM Animal Hospital | Generated by: ${user?.name || "Unknown"
          }`,
          15,
          pageHeight - 7
        )

        // Right side page number
        doc.text(
          `Page ${page} of ${totalPages}`,
          pageWidth - 15,
          pageHeight - 7,
          { align: "right" }
        )
      }

      doc.save(`disease-report-${caseLabel.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${today}.pdf`)
      setExportOpen(false)
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const exportToExcel = async () => {
    setExporting(true)
    try {
      const XLSX = await import('xlsx')
      const wb = XLSX.utils.book_new()
      const caseLabel = exportCaseId === "all" ? "All Cases" : (() => { const r = records.find(r => r._id === exportCaseId); return r ? `${r.animalName} - ${r.diseaseName}` : "Unknown" })()
      const daily = getExportDailyBreakdown()
      const exportRecs = getExportRecords()

      // Sheet 1 — Disease Cases
      const casesData = exportRecs.map(r => ({
        Animal: r.animalName || '—',
        'Ear Tag ID': getAnimalEarTagId(r.animalId),
        'Insurance ID': getAnimalInsuranceId(r.animalId),
        Disease: r.diseaseName,
        Status: r.status,
        'Diagnosed Date': r.diagnosedDate,
        'Resolved Date': r.resolvedDate || '—',
        Veterinarian: r.veterinarianName || '—',
        Symptoms: r.symptoms || '—',
        Treatment: r.treatment || '—',
        Notes: r.notes || '—',
      }))
      const ws1 = XLSX.utils.json_to_sheet(casesData)
      ws1['!cols'] = [18, 18, 20, 28, 16, 16, 16, 20, 30, 30, 30].map(w => ({ wch: w }))
      XLSX.utils.book_append_sheet(wb, ws1, 'Disease Cases')

      // Sheet 2 — Daily Cost Breakdown
      const dailyData = daily.map(row => {
        const mDoses = row.morning.reduce((s, d) => s + d.doseCount, 0)
        const mCost = row.morning.reduce((s, d) => s + d.totalCost, 0)
        const eDoses = row.evening.reduce((s, d) => s + d.doseCount, 0)
        const eCost = row.evening.reduce((s, d) => s + d.totalCost, 0)
        return {
          Date: row.date,
          'Morning Doses': mDoses || 0,
          'Morning Cost (RWF)': mCost,
          'Evening Doses': eDoses || 0,
          'Evening Cost (RWF)': eCost,
          'Daily Total (RWF)': row.dayTotal,
          'Cumulative Total (RWF)': row.runningTotal,
        }
      })
      const ws2 = XLSX.utils.json_to_sheet(dailyData)
      ws2['!cols'] = [14, 16, 20, 16, 20, 20, 22].map(w => ({ wch: w }))
      XLSX.utils.book_append_sheet(wb, ws2, 'Daily Cost Breakdown')

      // Sheet 3 — Cost per Animal
      const animalData = costPerAnimal.map(row => ({
        Animal: row.animalName,
        'Ear Tag ID': getAnimalEarTagId(row.animalId || ''),
        'Insurance ID': getAnimalInsuranceId(row.animalId || ''),
        'Total Doses': row.doses,
        'Medicine Cost (RWF)': row.medicineCost,
        'Vet Cost (RWF)': row.vetCost,
        'Total Cost (RWF)': row.total,
      }))
      const ws3 = XLSX.utils.json_to_sheet(animalData)
      ws3['!cols'] = [20, 18, 20, 14, 22, 18, 20].map(w => ({ wch: w }))
      XLSX.utils.book_append_sheet(wb, ws3, 'Cost per Animal')

      XLSX.writeFile(wb, `disease-report-${caseLabel.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${today}.xlsx`)
      setExportOpen(false)
    } catch (err) {
      console.error('Excel export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl">
          <ShieldAlert className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disease Management</h1>
          <p className="text-sm text-gray-500">Track illnesses, treatment doses, and costs per animal</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-slate-600 to-slate-700 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-300 uppercase font-medium">Total Cases</p>
              <p className="text-2xl font-bold">{records.length}</p>
            </div>
            <Activity className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-red-100 uppercase font-medium">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-100 uppercase font-medium">In Treatment</p>
              <p className="text-2xl font-bold">{underTreatmentCount}</p>
            </div>
            <Clock className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-100 uppercase font-medium">Total Cost (RWF)</p>
              <p className="text-2xl font-bold">{totalTreatmentCost.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="record">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="record" className="flex items-center gap-1"><Plus className="h-4 w-4" /> Record</TabsTrigger>
          <TabsTrigger value="doses" className="flex items-center gap-1"><Syringe className="h-4 w-4" /> Doses</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-4 w-4" /> History</TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1"><BarChart3 className="h-4 w-4" /> Reports</TabsTrigger>
        </TabsList>

        {/* ── RECORD TAB ── */}
        <TabsContent value="record">
          <Card className="border-0 shadow-xl bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                {editRecord ? "Edit Disease Record" : "New Disease Record"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Animal *</label>
                  <Select value={animalId} onValueChange={setAnimalId}>
                    <SelectTrigger className={errors.animalId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select animal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map(a => <SelectItem key={a._id} value={a._id}>{a.name} ({a.type})</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.animalId && <p className="text-xs text-red-500">{errors.animalId}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Insurance ID <span className="text-gray-400 text-xs">auto-detected</span></label>
                  <Input
                    readOnly
                    value={insuranceId || (animalId ? "No insurance registered" : "Select an animal first")}
                    className={insuranceId ? "bg-blue-50 text-blue-700 font-medium" : "bg-gray-50 text-gray-400 italic"}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ear Tag ID <span className="text-gray-400 text-xs">auto-detected</span></label>
                  <Input
                    readOnly
                    value={earTagId || (animalId ? "No ear tag registered" : "Select an animal first")}
                    className={earTagId ? "bg-amber-50 text-amber-700 font-medium" : "bg-gray-50 text-gray-400 italic"}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Disease *</label>
                  <Select value={diseaseName} onValueChange={setDiseaseName}>
                    <SelectTrigger className={errors.diseaseName ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select disease..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_DISEASES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.diseaseName && <p className="text-xs text-red-500">{errors.diseaseName}</p>}
                </div>

                {diseaseName === "Other" && (
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Specify Disease *</label>
                    <Input placeholder="Enter disease name..." value={customDisease} onChange={e => setCustomDisease(e.target.value)} className={errors.diseaseName ? "border-red-500" : ""} />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status *</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Diagnosed Date *</label>
                  <Input type="date" value={diagnosedDate} onChange={e => setDiagnosedDate(e.target.value)} className={errors.diagnosedDate ? "border-red-500" : ""} />
                  {errors.diagnosedDate && <p className="text-xs text-red-500">{errors.diagnosedDate}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Resolved Date <span className="text-gray-400 text-xs">optional</span></label>
                  <Input type="date" value={resolvedDate} onChange={e => setResolvedDate(e.target.value)} min={diagnosedDate} />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Veterinarian <span className="text-gray-400 text-xs">optional</span></label>
                  <Select value={veterinarianName || "none"} onValueChange={v => setVeterinarianName(v === "none" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Not assigned —</SelectItem>
                      {doctors.map(d => (
                        <SelectItem key={d._id} value={d.name}>
                          {d.name}{d.specialization ? ` — ${d.specialization}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Symptoms <span className="text-gray-400 text-xs">optional</span></label>
                  <Input placeholder="e.g. fever, loss of appetite, swollen joints..." value={symptoms} onChange={e => setSymptoms(e.target.value)} />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Treatment <span className="text-gray-400 text-xs">optional</span></label>
                  <Input placeholder="e.g. antibiotics, vaccination, isolation..." value={treatment} onChange={e => setTreatment(e.target.value)} />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Notes <span className="text-gray-400 text-xs">optional</span></label>
                  <Input placeholder="Any additional observations..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl px-6">
                  {saving ? "Saving..." : editRecord ? "Update Record" : "Save Record"}
                </Button>
                {editRecord && <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── DOSES TAB ── */}
        <TabsContent value="doses">
          <div className="space-y-6">
            {/* Dose form */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  {editDose ? "Edit Treatment Dose" : "Log Treatment Dose"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Disease case selector */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Disease Case *</label>
                    <Select value={doseRecordId} onValueChange={setDoseRecordId}>
                      <SelectTrigger className={doseErrors.doseRecordId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select disease case..." />
                      </SelectTrigger>
                      <SelectContent>
                        {records.map(r => (
                          <SelectItem key={r._id} value={r._id}>
                            {r.animalName} — {r.diseaseName} ({r.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {doseErrors.doseRecordId && <p className="text-xs text-red-500">{doseErrors.doseRecordId}</p>}
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Date *</label>
                    <Input type="date" value={doseDate} onChange={e => setDoseDate(e.target.value)} className={doseErrors.doseDate ? "border-red-500" : ""} />
                    {doseErrors.doseDate && <p className="text-xs text-red-500">{doseErrors.doseDate}</p>}
                  </div>

                  {/* Session */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Session *</label>
                    <Select value={doseSession} onValueChange={setDoseSession}>
                      <SelectTrigger className={doseErrors.doseSession ? "border-red-500" : ""}>
                        <SelectValue placeholder="Morning / Evening" />
                      </SelectTrigger>
                      <SelectContent>
                        {SESSIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {doseErrors.doseSession && <p className="text-xs text-red-500">{doseErrors.doseSession}</p>}
                  </div>

                  {/* Number of doses */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Number of Doses *</label>
                    <Input type="number" min="1" placeholder="e.g. 2" value={doseCount} onChange={e => setDoseCount(e.target.value)} className={doseErrors.doseCount ? "border-red-500" : ""} />
                    {doseErrors.doseCount && <p className="text-xs text-red-500">{doseErrors.doseCount}</p>}
                  </div>

                  {/* Medicine name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Medicine <span className="text-gray-400 text-xs">optional</span></label>
                    <Input placeholder="e.g. Oxytetracycline..." value={medicineName} onChange={e => setMedicineName(e.target.value)} />
                  </div>

                  {/* Medicine cost */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Medicine Cost (RWF) <span className="text-gray-400 text-xs">optional</span></label>
                    <Input type="number" min="0" placeholder="0" value={medicineCost} onChange={e => setMedicineCost(e.target.value)} />
                  </div>

                  {/* Vet cost */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Vet Cost (RWF) <span className="text-gray-400 text-xs">optional</span></label>
                    <Input type="number" min="0" placeholder="0" value={vetCost} onChange={e => setVetCost(e.target.value)} />
                  </div>

                  {/* Auto total */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Total Cost (RWF)</label>
                    <Input readOnly value={((Number(medicineCost) || 0) + (Number(vetCost) || 0)).toLocaleString()} className="bg-emerald-50 font-semibold text-emerald-700" />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Notes <span className="text-gray-400 text-xs">optional</span></label>
                    <Input placeholder="Any observations for this dose..." value={doseNotes} onChange={e => setDoseNotes(e.target.value)} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={handleDoseSubmit} disabled={savingDose} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-6">
                    {savingDose ? "Saving..." : editDose ? "Update Dose" : "Log Dose"}
                  </Button>
                  {editDose && <Button variant="outline" onClick={resetDoseForm} className="rounded-xl">Cancel</Button>}
                </div>
              </CardContent>
            </Card>

            {/* Dose history table */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    Dose Log
                  </CardTitle>
                  <Select value={filterDoseRecord || "all"} onValueChange={v => setFilterDoseRecord(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Filter by case..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cases</SelectItem>
                      {records.map(r => (
                        <SelectItem key={r._id} value={r._id}>
                          {r.animalName} — {r.diseaseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Animal</TableHead>
                        <TableHead>Disease</TableHead>
                        <TableHead>Doses</TableHead>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Med. Cost</TableHead>
                        <TableHead>Vet Cost</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDoses.length === 0 ? (
                        <TableRow><TableCell colSpan={10} className="text-center py-8 text-gray-400">No doses logged yet</TableCell></TableRow>
                      ) : filteredDoses.map(d => (
                        <TableRow key={d._id}>
                          <TableCell className="text-sm">{d.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={SESSION_STYLES[d.session] || ""}>{d.session}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{d.animalName || "—"}</TableCell>
                          <TableCell className="text-sm text-gray-600">{d.diseaseName || "—"}</TableCell>
                          <TableCell className="font-semibold text-center">{d.doseCount}</TableCell>
                          <TableCell className="text-sm">{d.medicineName || <span className="text-gray-400">—</span>}</TableCell>
                          <TableCell className="text-sm">{d.medicineCost > 0 ? d.medicineCost.toLocaleString() : "—"}</TableCell>
                          <TableCell className="text-sm">{d.vetCost > 0 ? d.vetCost.toLocaleString() : "—"}</TableCell>
                          <TableCell className="font-semibold text-emerald-700">{d.totalCost > 0 ? d.totalCost.toLocaleString() : "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditDose(d)} className="h-8 w-8 p-0 hover:bg-emerald-50">
                                <Pencil className="h-3.5 w-3.5 text-emerald-600" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setDeleteDoseId(d._id)} className="h-8 w-8 p-0 hover:bg-red-50">
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Dose summary footer */}
                {filteredDoses.length > 0 && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-wrap gap-6 text-sm">
                    <span className="text-gray-600">Total doses: <strong className="text-gray-900">{filteredDoses.reduce((s, d) => s + d.doseCount, 0)}</strong></span>
                    <span className="text-gray-600">Medicine cost: <strong className="text-gray-900">RWF {filteredDoses.reduce((s, d) => s + d.medicineCost, 0).toLocaleString()}</strong></span>
                    <span className="text-gray-600">Vet cost: <strong className="text-gray-900">RWF {filteredDoses.reduce((s, d) => s + d.vetCost, 0).toLocaleString()}</strong></span>
                    <span className="text-emerald-700 font-semibold">Total: RWF {filteredDoses.reduce((s, d) => s + d.totalCost, 0).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── HISTORY TAB ── */}
        <TabsContent value="history">
          <Card className="border-0 shadow-xl bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-2 h-2 bg-sky-500 rounded-full" />
                Disease History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
                <Select value={filterStatus || "all"} onValueChange={v => setFilterStatus(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterAnimal || "all"} onValueChange={v => setFilterAnimal(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All Animals" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    {animals.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 whitespace-nowrap">{filteredRecords.length} found</p>
                  <Button variant="outline" onClick={() => { setFilterStatus(""); setFilterAnimal(""); setFilterMonth("") }} className="rounded-xl text-xs ml-auto">Clear</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Animal</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Diagnosed</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead>Veterinarian</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400">No records found</TableCell></TableRow>
                    ) : filteredRecords.map(r => (
                      <TableRow key={r._id}>
                        <TableCell className="font-medium">{r.animalName || "—"}</TableCell>
                        <TableCell className="font-semibold text-gray-800">{r.diseaseName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={STATUS_STYLES[r.status] || ""}>{r.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{r.diagnosedDate}</TableCell>
                        <TableCell className="text-sm">{r.resolvedDate || <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm">{r.veterinarianName || <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-[140px] truncate">{r.treatment || "—"}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(r)} className="h-8 w-8 p-0 hover:bg-emerald-50">
                              <Pencil className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeleteId(r._id)} className="h-8 w-8 p-0 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── REPORTS TAB ── */}
        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Export button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setExportOpen(true)}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
            {/* Daily cost breakdown */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Daily Treatment Cost
                  </CardTitle>
                  <Select value={reportCaseId || "all"} onValueChange={v => setReportCaseId(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-full sm:w-80">
                      <SelectValue placeholder="All cases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cases</SelectItem>
                      {records.map(r => (
                        <SelectItem key={r._id} value={r._id}>
                          {r.animalName} — {r.diseaseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {dailyCostBreakdown.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No cost data yet — log doses to see the breakdown</div>
                ) : (
                  <>
                    {/* Bar chart — daily cost */}
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={dailyCostBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(v: any) => [`RWF ${Number(v).toLocaleString()}`, "Daily Cost"]} />
                        <Bar dataKey="dayTotal" fill="#16a34a" radius={[4, 4, 0, 0]} name="Daily Cost" />
                      </BarChart>
                    </ResponsiveContainer>

                    {/* Daily breakdown table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Morning Doses</TableHead>
                            <TableHead>Morning Cost</TableHead>
                            <TableHead>Evening Doses</TableHead>
                            <TableHead>Evening Cost</TableHead>
                            <TableHead>Daily Total</TableHead>
                            <TableHead>Cumulative Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dailyCostBreakdown.map((row, i) => {
                            const mDoses = row.morning.reduce((s, d) => s + d.doseCount, 0)
                            const mCost = row.morning.reduce((s, d) => s + d.totalCost, 0)
                            const eDoses = row.evening.reduce((s, d) => s + d.doseCount, 0)
                            const eCost = row.evening.reduce((s, d) => s + d.totalCost, 0)
                            return (
                              <TableRow key={i}>
                                <TableCell className="font-medium">{row.date}</TableCell>
                                <TableCell className="text-center">
                                  {mDoses > 0
                                    ? <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{mDoses} dose{mDoses !== 1 ? "s" : ""}</Badge>
                                    : <span className="text-gray-300">—</span>}
                                </TableCell>
                                <TableCell className="text-sm">{mCost > 0 ? `RWF ${mCost.toLocaleString()}` : <span className="text-gray-300">—</span>}</TableCell>
                                <TableCell className="text-center">
                                  {eDoses > 0
                                    ? <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">{eDoses} dose{eDoses !== 1 ? "s" : ""}</Badge>
                                    : <span className="text-gray-300">—</span>}
                                </TableCell>
                                <TableCell className="text-sm">{eCost > 0 ? `RWF ${eCost.toLocaleString()}` : <span className="text-gray-300">—</span>}</TableCell>
                                <TableCell className="font-semibold text-gray-800">RWF {row.dayTotal.toLocaleString()}</TableCell>
                                <TableCell className="font-bold text-emerald-700">RWF {row.runningTotal.toLocaleString()}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Grand total footer */}
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium">Treatment Days</p>
                        <p className="text-xl font-bold text-gray-900">{dailyCostBreakdown.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium">Total Doses</p>
                        <p className="text-xl font-bold text-gray-900">
                          {dailyCostBreakdown.reduce((s, r) => s + r.morning.reduce((a, d) => a + d.doseCount, 0) + r.evening.reduce((a, d) => a + d.doseCount, 0), 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium">Avg Daily Cost</p>
                        <p className="text-xl font-bold text-gray-900">
                          RWF {dailyCostBreakdown.length > 0 ? Math.round(dailyCostBreakdown[dailyCostBreakdown.length - 1].runningTotal / dailyCostBreakdown.length).toLocaleString() : 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-medium">Grand Total</p>
                        <p className="text-xl font-bold text-emerald-700">
                          RWF {dailyCostBreakdown.length > 0 ? dailyCostBreakdown[dailyCostBreakdown.length - 1].runningTotal.toLocaleString() : 0}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Cost per animal summary */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Total Cost per Animal
                </CardTitle>
              </CardHeader>
              <CardContent>
                {costPerAnimal.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No cost data yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Animal</TableHead>
                          <TableHead>Total Doses</TableHead>
                          <TableHead>Medicine Cost (RWF)</TableHead>
                          <TableHead>Vet Cost (RWF)</TableHead>
                          <TableHead>Total Cost (RWF)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costPerAnimal.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{row.animalName}</TableCell>
                            <TableCell>{row.doses}</TableCell>
                            <TableCell>{row.medicineCost.toLocaleString()}</TableCell>
                            <TableCell>{row.vetCost.toLocaleString()}</TableCell>
                            <TableCell className="font-bold text-emerald-700">{row.total.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status breakdown pie */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statusData.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                        {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Most frequent diseases */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  Most Frequent Diseases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diseaseFrequency.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={diseaseFrequency} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={160} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              Export Disease Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Disease Case</label>
              <Select value={exportCaseId} onValueChange={setExportCaseId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  {records.map(r => (
                    <SelectItem key={r._id} value={r._id}>
                      {r.animalName} — {r.diseaseName} ({r.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview summary */}
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              {(() => {
                const previewRecs = getExportRecords()
                const previewDoses = getExportDoses()
                const previewDaily = getExportDailyBreakdown()
                const grandTotal = previewDaily.length > 0 ? previewDaily[previewDaily.length - 1].runningTotal : 0
                return (
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-red-700">Preview</p>
                    <p className="text-gray-600">
                      {previewRecs.length} case{previewRecs.length !== 1 ? 's' : ''} &bull; {previewDoses.reduce((s, d) => s + d.doseCount, 0)} doses &bull; {previewDaily.length} treatment day{previewDaily.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-600">Total cost: <strong className="text-emerald-700">RWF {grandTotal.toLocaleString()}</strong></p>
                  </div>
                )
              })()}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <Button variant="outline" onClick={() => setExportOpen(false)} className="rounded-xl">Cancel</Button>
              <Button
                onClick={exportToExcel}
                disabled={exporting}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exporting...' : 'Excel'}
              </Button>
              <Button
                onClick={exportToPDF}
                disabled={exporting}
                className="col-span-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white gap-2"
              >
                <FileText className="h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete disease dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Disease Record</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete dose dialog */}
      <AlertDialog open={!!deleteDoseId} onOpenChange={open => !open && setDeleteDoseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dose Record</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this dose entry? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDoseId && handleDeleteDose(deleteDoseId)} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
