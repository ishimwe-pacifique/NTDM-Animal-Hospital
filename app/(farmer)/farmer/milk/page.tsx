"use client"

import { useState, useEffect, useMemo } from "react"
import { getCurrentUser } from "@/lib/actions/auth"
import { getAnimals } from "@/lib/actions"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Milk, Plus, Pencil, Trash2, BarChart3, History, TrendingUp, DollarSign, Droplets, Download, FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Animal { _id: string; name: string; type: string }
interface MilkRecord {
  _id: string; cowId: string; cowName: string; liters: number
  pricePerLiter: number | null; totalAmount: number | null
  session: string; date: string; time: string | null; notes: string | null
}

const SESSIONS = ["Morning", "Evening"]
const today = new Date().toISOString().split("T")[0]

export default function MilkProductionPage() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [records, setRecords] = useState<MilkRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editRecord, setEditRecord] = useState<MilkRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [cowId, setCowId] = useState("")
  const [liters, setLiters] = useState("")
  const [pricePerLiter, setPricePerLiter] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [session, setSession] = useState("")
  const [date, setDate] = useState(today)
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter state
  const [filterCow, setFilterCow] = useState("")
  const [filterSession, setFilterSession] = useState("")
  const [filterStart, setFilterStart] = useState("")
  const [filterEnd, setFilterEnd] = useState("")
  const [filterMonth, setFilterMonth] = useState("")

  useEffect(() => {
    async function init() {
      const userData = await getCurrentUser()
      if (!userData) return
      setUser(userData)
      const animalsData = await getAnimals(userData._id.toString())
      setAnimals(animalsData)
      await fetchRecords(userData._id.toString())
      setLoading(false)
    }
    init()
  }, [])

  const fetchRecords = async (farmerId: string) => {
    const res = await fetch(`/api/milk?farmerId=${farmerId}`)
    const data = await res.json()
    setRecords(Array.isArray(data) ? data : [])
  }

  // Client-side filtered records
  const filteredRecords = useMemo(() => {
    let filtered = [...records]
    if (filterCow) filtered = filtered.filter(r => r.cowId === filterCow)
    if (filterSession) filtered = filtered.filter(r => r.session === filterSession)
    if (filterMonth) {
      filtered = filtered.filter(r => r.date.startsWith(filterMonth))
    } else {
      if (filterStart) filtered = filtered.filter(r => r.date >= filterStart)
      if (filterEnd) filtered = filtered.filter(r => r.date <= filterEnd)
    }
    return filtered
  }, [records, filterCow, filterSession, filterStart, filterEnd, filterMonth])

  // Auto-calculate total amount
  useEffect(() => {
    if (liters && pricePerLiter) {
      setTotalAmount((Number(liters) * Number(pricePerLiter)).toFixed(2))
    }
  }, [liters, pricePerLiter])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!cowId) e.cowId = "Please select a cow"
    if (!liters || Number(liters) <= 0) e.liters = "Enter valid liters"
    if (!session) e.session = "Select a session"
    if (!date) e.date = "Select a date"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const resetForm = () => {
    setCowId(""); setLiters(""); setPricePerLiter(""); setTotalAmount("")
    setSession(""); setDate(today); setTime(""); setNotes("")
    setErrors({}); setEditRecord(null)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    const cow = animals.find(a => a._id === cowId)
    const body = { farmerId: user._id.toString(), cowId, cowName: cow?.name, liters, pricePerLiter, totalAmount, session, date, time, notes }

    if (editRecord) {
      await fetch("/api/milk", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editRecord._id, liters, pricePerLiter, totalAmount, session, date, time, notes }) })
    } else {
      await fetch("/api/milk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    }

    await fetchRecords(user._id.toString())
    resetForm()
    setSaving(false)
  }

  const handleEdit = (r: MilkRecord) => {
    setEditRecord(r); setCowId(r.cowId); setLiters(String(r.liters))
    setPricePerLiter(r.pricePerLiter ? String(r.pricePerLiter) : "")
    setTotalAmount(r.totalAmount ? String(r.totalAmount) : "")
    setSession(r.session); setDate(r.date); setTime(r.time || ""); setNotes(r.notes || "")
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/milk?id=${id}`, { method: "DELETE" })
    await fetchRecords(user._id.toString())
    setDeleteId(null)
  }

  const clearFilters = () => {
    setFilterCow(""); setFilterSession(""); setFilterStart(""); setFilterEnd(""); setFilterMonth("")
  }

  // Export state
  const [exportOpen, setExportOpen] = useState(false)
  const [exportCow, setExportCow] = useState("all")
  const [exportType, setExportType] = useState<"daily" | "monthly" | "total">("total")
  const [exportDate, setExportDate] = useState(today)
  const [exportMonth, setExportMonth] = useState(today.slice(0, 7))
  const [exporting, setExporting] = useState(false)

  const getExportRecords = () => {
    let data = [...records]
    if (exportCow !== "all") data = data.filter(r => r.cowId === exportCow)
    if (exportType === "daily") data = data.filter(r => r.date === exportDate)
    if (exportType === "monthly") data = data.filter(r => r.date.startsWith(exportMonth))
    return data.sort((a, b) => a.date.localeCompare(b.date))
  }

  const exportToPDF = async () => {
    setExporting(true)
    try {
      const jsPDF = (await import('jspdf')).default
      const doc = new jsPDF()
      const exportRecords = getExportRecords()
      const cowName = exportCow === "all" ? "All Animals" : animals.find(a => a._id === exportCow)?.name || "Unknown"
      const totalL = exportRecords.reduce((s, r) => s + r.liters, 0)
      const totalRev = exportRecords.reduce((s, r) => s + (r.totalAmount || 0), 0)
      const reportLabel = exportType === "daily" ? `Daily Report — ${exportDate}` : exportType === "monthly" ? `Monthly Report — ${exportMonth}` : "Total Production Report"

      // Header
      doc.setFillColor(22, 163, 74)
      doc.rect(0, 0, 210, 38, 'F')

      // Logo
      try {
        const logoImg = new Image()
        logoImg.crossOrigin = 'anonymous'
        logoImg.src = '/logo/NTDM.png'
        await new Promise((resolve, reject) => { logoImg.onload = resolve; logoImg.onerror = reject })
        doc.addImage(logoImg, 'PNG', 15, 7, 22, 22)
      } catch {}

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Milk Production Report', 45, 18)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('NTDM Animal Hospital', 45, 27)

      // Meta
      doc.setTextColor(55, 65, 81)
      doc.setFontSize(10)
      doc.text(`Animal: ${cowName}`, 15, 50)
      doc.text(`Report Type: ${reportLabel}`, 15, 58)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 66)
      doc.text(`Generated by: ${user?.name || 'Unknown'}`, 15, 74)

      // Summary box
      doc.setFillColor(248, 250, 252)
      doc.setDrawColor(226, 232, 240)
      doc.rect(15, 82, 180, 28, 'FD')
      doc.setTextColor(22, 163, 74)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Summary', 20, 93)
      doc.setTextColor(55, 65, 81)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Total Liters: ${totalL.toFixed(1)} L`, 20, 103)
      doc.text(`Total Revenue: RWF ${totalRev.toLocaleString()}`, 80, 103)
      doc.text(`Records: ${exportRecords.length}`, 155, 103)

      // Table header
      let y = 122
      doc.setFillColor(22, 163, 74)
      doc.rect(15, y - 6, 180, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('Date', 18, y)
      doc.text('Animal', 48, y)
      doc.text('Session', 88, y)
      doc.text('Liters', 118, y)
      doc.text('Price/L', 138, y)
      doc.text('Total (RWF)', 158, y)

      // Table rows
      doc.setFont('helvetica', 'normal')
      exportRecords.forEach((r, i) => {
        y += 9
        if (y > 275) { doc.addPage(); y = 20 }
        if (i % 2 === 0) {
          doc.setFillColor(248, 250, 252)
          doc.rect(15, y - 5, 180, 8, 'F')
        }
        doc.setTextColor(55, 65, 81)
        doc.text(r.date, 18, y)
        doc.text(r.cowName || '-', 48, y)
        doc.text(r.session, 88, y)
        doc.setTextColor(22, 163, 74)
        doc.text(`${r.liters}L`, 118, y)
        doc.setTextColor(55, 65, 81)
        doc.text(r.pricePerLiter ? String(r.pricePerLiter) : '-', 138, y)
        doc.text(r.totalAmount ? r.totalAmount.toLocaleString() : '-', 158, y)
      })

      // Footer
      const pageH = doc.internal.pageSize.height
      doc.setFillColor(248, 250, 252)
      doc.rect(0, pageH - 18, 210, 18, 'F')
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(7)
      doc.text(`NTDM Animal Hospital | www.ntdm-animal-hospital.com | Generated by: ${user?.name || 'Unknown'}`, 15, pageH - 7)

      doc.save(`milk-report-${cowName.replace(/\s+/g, '-')}-${exportType}-${new Date().toISOString().split('T')[0]}.pdf`)
      setExportOpen(false)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  // Reports calculations — based on filteredRecords so charts/cards reflect active filters
  const totalLiters = useMemo(() => filteredRecords.reduce((s, r) => s + r.liters, 0), [filteredRecords])
  const totalRevenue = useMemo(() => filteredRecords.reduce((s, r) => s + (r.totalAmount || 0), 0), [filteredRecords])
  const avgPerDay = useMemo(() => {
    const days = new Set(filteredRecords.map(r => r.date)).size
    return days > 0 ? (totalLiters / days).toFixed(1) : "0"
  }, [filteredRecords, totalLiters])

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {}
    filteredRecords.forEach(r => { map[r.date] = (map[r.date] || 0) + r.liters })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-14).map(([date, liters]) => ({ date: date.slice(5), liters }))
  }, [filteredRecords])

  const cowData = useMemo(() => {
    const map: Record<string, { name: string; liters: number; revenue: number }> = {}
    filteredRecords.forEach(r => {
      if (!map[r.cowId]) map[r.cowId] = { name: r.cowName, liters: 0, revenue: 0 }
      map[r.cowId].liters += r.liters
      map[r.cowId].revenue += r.totalAmount || 0
    })
    return Object.values(map)
  }, [filteredRecords])

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {}
    filteredRecords.forEach(r => {
      const month = r.date.slice(0, 7)
      map[month] = (map[month] || 0) + r.liters
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([month, liters]) => ({ month, liters }))
  }, [filteredRecords])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl">
          <Milk className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Milk Production</h1>
          <p className="text-sm text-gray-500">Record and track daily milk production</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-100 uppercase font-medium">Total Liters</p>
              <p className="text-2xl font-bold">{totalLiters.toFixed(1)}L</p>
            </div>
            <Droplets className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-sky-500 to-blue-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-sky-100 uppercase font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">RWF {totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-100 uppercase font-medium">Avg/Day</p>
              <p className="text-2xl font-bold">{avgPerDay}L</p>
            </div>
            <TrendingUp className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-100 uppercase font-medium">Records</p>
              <p className="text-2xl font-bold">{records.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="record">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="record" className="flex items-center gap-1"><Plus className="h-4 w-4" /> Record</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-4 w-4" /> History</TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1"><BarChart3 className="h-4 w-4" /> Reports</TabsTrigger>
        </TabsList>

        {/* RECORD TAB */}
        <TabsContent value="record">
          <Card className="border-0 shadow-xl bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                {editRecord ? "Edit Milk Record" : "New Milk Record"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cow */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Cow *</label>
                  <Select value={cowId} onValueChange={setCowId}>
                    <SelectTrigger className={errors.cowId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select cow..." />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map(a => <SelectItem key={a._id} value={a._id}>{a.name} ({a.type})</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.cowId && <p className="text-xs text-red-500">{errors.cowId}</p>}
                </div>

                {/* Session */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Session *</label>
                  <Select value={session} onValueChange={setSession}>
                    <SelectTrigger className={errors.session ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select session..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.session && <p className="text-xs text-red-500">{errors.session}</p>}
                </div>

                {/* Liters */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Milk Quantity (Liters) *</label>
                  <Input type="number" min="0" step="0.1" placeholder="e.g. 12.5" value={liters} onChange={e => setLiters(e.target.value)} className={errors.liters ? "border-red-500" : ""} />
                  {errors.liters && <p className="text-xs text-red-500">{errors.liters}</p>}
                </div>

                {/* Price per liter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Price per Liter (RWF) <span className="text-gray-400 text-xs">optional</span></label>
                  <Input type="number" min="0" placeholder="e.g. 500" value={pricePerLiter} onChange={e => setPricePerLiter(e.target.value)} />
                </div>

                {/* Total amount */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Total Amount (RWF) <span className="text-gray-400 text-xs">auto-calculated</span></label>
                  <Input type="number" min="0" placeholder="Auto-calculated" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="bg-emerald-50" />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} className={errors.date ? "border-red-500" : ""} />
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                </div>

                {/* Time */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Time <span className="text-gray-400 text-xs">optional</span></label>
                  <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>

                {/* Notes */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Notes <span className="text-gray-400 text-xs">optional</span></label>
                  <Input placeholder="Any observations..." value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSubmit} disabled={saving} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl px-6">
                  {saving ? "Saving..." : editRecord ? "Update Record" : "Save Record"}
                </Button>
                {editRecord && (
                  <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history">
          <Card className="border-0 shadow-xl bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-2 h-2 bg-sky-500 rounded-full" />
                Milk History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-xl">
                <Select value={filterCow || "all"} onValueChange={v => setFilterCow(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All Cows" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cows</SelectItem>
                    {animals.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterSession || "all"} onValueChange={v => setFilterSession(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All Sessions" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {SESSIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="month" value={filterMonth} onChange={e => { setFilterMonth(e.target.value); setFilterStart(""); setFilterEnd("") }} />
                <Input type="date" value={filterStart} onChange={e => { setFilterStart(e.target.value); setFilterMonth("") }} placeholder="Start date" />
                <Input type="date" value={filterEnd} onChange={e => { setFilterEnd(e.target.value); setFilterMonth("") }} placeholder="End date" />
                <div className="flex items-center gap-3 col-span-2 md:col-span-3 lg:col-span-5">
                  <p className="text-sm text-gray-500">{filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found</p>
                  <Button variant="outline" onClick={clearFilters} className="rounded-xl ml-auto">Clear Filters</Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Cow</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Liters</TableHead>
                      <TableHead>Price/L</TableHead>
                      <TableHead>Total (RWF)</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-gray-400">No records found</TableCell></TableRow>
                    ) : filteredRecords.map(r => (
                      <TableRow key={r._id}>
                        <TableCell className="text-sm">{r.date}{r.time ? ` ${r.time}` : ""}</TableCell>
                        <TableCell className="font-medium">{r.cowName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={r.session === "Morning" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-indigo-50 text-indigo-700 border-indigo-200"}>
                            {r.session}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-700">{r.liters}L</TableCell>
                        <TableCell>{r.pricePerLiter ? `${r.pricePerLiter}` : "-"}</TableCell>
                        <TableCell>{r.totalAmount ? r.totalAmount.toLocaleString() : "-"}</TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-[120px] truncate">{r.notes || "-"}</TableCell>
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

        {/* REPORTS TAB */}
        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Export Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setExportOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
            {/* Per Cow Summary */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Production per Cow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cow</TableHead>
                        <TableHead>Total Liters</TableHead>
                        <TableHead>Total Revenue (RWF)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cowData.length === 0 ? (
                        <TableRow><TableCell colSpan={3} className="text-center py-6 text-gray-400">No data</TableCell></TableRow>
                      ) : cowData.map((c, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-emerald-700 font-semibold">{c.liters.toFixed(1)}L</TableCell>
                          <TableCell>{c.revenue > 0 ? c.revenue.toLocaleString() : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Daily Trend Chart */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Daily Production (Last 14 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dailyData.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: any) => [`${v}L`, "Liters"]} />
                      <Bar dataKey="liters" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Monthly Trend Chart */}
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-sky-500 rounded-full" />
                  Monthly Production Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyData.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: any) => [`${v}L`, "Liters"]} />
                      <Legend />
                      <Line type="monotone" dataKey="liters" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: "#0ea5e9" }} name="Liters" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Per Cow Bar Chart */}
            {cowData.length > 0 && (
              <Card className="border-0 shadow-xl bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    Production by Cow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={cowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v: any) => [`${v}L`, "Liters"]} />
                      <Bar dataKey="liters" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Report Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Export Milk Production Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Animal</label>
              <Select value={exportCow} onValueChange={setExportCow}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Animals</SelectItem>
                  {animals.map(a => <SelectItem key={a._id} value={a._id}>{a.name} ({a.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <Select value={exportType} onValueChange={v => setExportType(v as "daily" | "monthly" | "total")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="total">Total Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {exportType === "daily" && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Select Date</label>
                <Input type="date" value={exportDate} onChange={e => setExportDate(e.target.value)} />
              </div>
            )}

            {exportType === "monthly" && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Select Month</label>
                <Input type="month" value={exportMonth} onChange={e => setExportMonth(e.target.value)} />
              </div>
            )}

            {/* Preview summary */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              {(() => {
                const preview = getExportRecords()
                const previewLiters = preview.reduce((s, r) => s + r.liters, 0)
                const previewRev = preview.reduce((s, r) => s + (r.totalAmount || 0), 0)
                return (
                  <div className="text-sm space-y-1">
                    <p className="font-medium text-emerald-700">Preview</p>
                    <p className="text-gray-600">{preview.length} records &bull; {previewLiters.toFixed(1)}L &bull; RWF {previewRev.toLocaleString()}</p>
                  </div>
                )
              })()}
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={() => setExportOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button
                onClick={exportToPDF}
                disabled={exporting || getExportRecords().length === 0}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl gap-2"
              >
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Milk Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this milk record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
