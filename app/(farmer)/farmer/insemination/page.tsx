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
import { Syringe, Plus, Pencil, Trash2, History, ChevronDown, Baby, FlaskConical } from "lucide-react"

interface Animal { _id: string; name: string; type: string; gender?: string | null; insuranceId?: string | null }
interface Vet { _id: string; name: string; specialization: string }
interface InseminationRecord {
  _id: string
  animalId: string | null
  animalName: string | null
  semenTypes: string[]
  semenPrice: number | null
  vetPrice: number | null
  injectionTime: string | null
  expectedBirthDate: string | null
  vetName: string | null
  vetOrigin: string | null
  date: string
  notes: string | null
}

const SEMEN_TYPES = ["Bovine", "Ovine", "Caprine", "Porcine", "Equine", "Other"]

const today = new Date().toISOString().split("T")[0]

export default function InseminationPage() {
  const [user, setUser] = useState<any>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [vets, setVets] = useState<Vet[]>([])
  const femaleAnimals = animals.filter(a => !a.gender || a.gender === "female")
  const [records, setRecords] = useState<InseminationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editRecord, setEditRecord] = useState<InseminationRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [semenTypeOpen, setSemenTypeOpen] = useState(false)

  // Form fields
  const [animalId, setAnimalId] = useState("")
  const [semenTypes, setSemenTypes] = useState<string[]>([])
  const [semenPrice, setSemenPrice] = useState("")
  const [vetPrice, setVetPrice] = useState("")
  const [injectionTime, setInjectionTime] = useState("")
  const [expectedBirthDate, setExpectedBirthDate] = useState("")
  const [vetName, setVetName] = useState("")
  const [vetOrigin, setVetOrigin] = useState("")
  const [insuranceId, setInsuranceId] = useState("")
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-calculate expected birth date (+283 days) when insemination date changes for cows
  const calcExpectedBirth = (insemDate: string) => {
    if (!insemDate) return ""
    const d = new Date(insemDate)
    d.setDate(d.getDate() + 283)
    return d.toISOString().split("T")[0]
  }

  const handleDateChange = (val: string) => {
    setDate(val)
    const selectedAnimal = animals.find(a => a._id === animalId)
    if (selectedAnimal?.type?.toLowerCase() === "cow") {
      setExpectedBirthDate(calcExpectedBirth(val))
    }
  }

  const handleAnimalChange = (val: string) => {
    setAnimalId(val === "none" ? "" : val)
    const selectedAnimal = animals.find(a => a._id === val)
    setInsuranceId(selectedAnimal?.insuranceId || "")
    if (selectedAnimal?.type?.toLowerCase() === "cow" && date) {
      setExpectedBirthDate(calcExpectedBirth(date))
    }
  }

  // Days counter for expected birth date
  const birthCountdown = useMemo(() => {
    if (!expectedBirthDate) return null
    const diff = Math.ceil((new Date(expectedBirthDate).getTime() - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24))
    return diff
  }, [expectedBirthDate])

  // Filters
  const [filterAnimal, setFilterAnimal] = useState("")
  const [filterMonth, setFilterMonth] = useState("")

  useEffect(() => {
    async function init() {
      const userData = await getCurrentUser()
      if (!userData) return
      setUser(userData)
      const animalsData = await getAnimals(userData._id.toString())
      setAnimals(animalsData)
      const vetsData = await getDoctorsList()
      setVets(vetsData)
      await fetchRecords(userData._id.toString())
      setLoading(false)
    }
    init()
  }, [])

  const fetchRecords = async (farmerId: string) => {
    const res = await fetch(`/api/insemination?farmerId=${farmerId}`)
    const data = await res.json()
    setRecords(Array.isArray(data) ? data : [])
  }

  const filteredRecords = useMemo(() => {
    let data = [...records]
    if (filterAnimal) data = data.filter(r => r.animalId === filterAnimal)
    if (filterMonth) data = data.filter(r => r.date.startsWith(filterMonth))
    return data
  }, [records, filterAnimal, filterMonth])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!semenTypes.length) e.semenTypes = "Select at least one semen type"
    if (!date) e.date = "Select a date"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const resetForm = () => {
    setAnimalId(""); setInsuranceId(""); setSemenTypes([]); setSemenPrice(""); setVetPrice("")
    setInjectionTime(""); setExpectedBirthDate(""); setVetName(""); setVetOrigin("")
    setDate(today); setNotes(""); setErrors({}); setEditRecord(null)
    setSemenTypeOpen(false)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    const animal = animals.find(a => a._id === animalId)
    const body = {
      farmerId: user._id.toString(),
      animalId: animalId || null,
      animalName: animal?.name || null,
      semenTypes, semenPrice, vetPrice, injectionTime,
      expectedBirthDate, vetName, vetOrigin, date, notes,
    }

    if (editRecord) {
      await fetch("/api/insemination", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editRecord._id, ...body }) })
    } else {
      await fetch("/api/insemination", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    }

    await fetchRecords(user._id.toString())
    resetForm()
    setSaving(false)
  }

  const handleEdit = (r: InseminationRecord) => {
    setEditRecord(r)
    setAnimalId(r.animalId || "")
    setInsuranceId(animals.find(a => a._id === r.animalId)?.insuranceId || "")
    setSemenTypes(r.semenTypes || [])
    setSemenPrice(r.semenPrice != null ? String(r.semenPrice) : "")
    setVetPrice(r.vetPrice != null ? String(r.vetPrice) : "")
    setInjectionTime(r.injectionTime || "")
    setExpectedBirthDate(r.expectedBirthDate || "")
    setVetName(r.vetName || "")
    setVetOrigin(r.vetOrigin || "")
    setDate(r.date)
    setNotes(r.notes || "")
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/insemination?id=${id}`, { method: "DELETE" })
    await fetchRecords(user._id.toString())
    setDeleteId(null)
  }

  const totalCost = useMemo(() =>
    filteredRecords.reduce((s, r) => s + (r.semenPrice || 0) + (r.vetPrice || 0), 0),
    [filteredRecords]
  )

  const upcoming = useMemo(() =>
    records.filter(r => r.expectedBirthDate && new Date(r.expectedBirthDate) >= new Date()).length,
    [records]
  )

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
          <Syringe className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insemination</h1>
          <p className="text-sm text-gray-500">Track artificial insemination records</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-100 uppercase font-medium">Total Records</p>
              <p className="text-2xl font-bold">{records.length}</p>
            </div>
            <Syringe className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-100 uppercase font-medium">Total Cost</p>
              <p className="text-2xl font-bold">{totalCost.toFixed(0)}</p>
            </div>
            <FlaskConical className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-indigo-600 text-white col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-100 uppercase font-medium">Expected Births</p>
              <p className="text-2xl font-bold">{upcoming}</p>
            </div>
            <Baby className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="record">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="record" className="flex items-center gap-1"><Plus className="h-4 w-4" /> Record</TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1"><History className="h-4 w-4" /> History</TabsTrigger>
        </TabsList>

        {/* RECORD TAB */}
        <TabsContent value="record">
          <Card className="border-0 shadow-xl bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                {editRecord ? "Edit Insemination Record" : "New Insemination Record"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Animal */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Animal <span className="text-gray-400 text-xs">optional</span></label>
                  <Select value={animalId || "none"} onValueChange={handleAnimalChange}>
                    <SelectTrigger><SelectValue placeholder="Select animal..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All / General</SelectItem>
                      {femaleAnimals.map(a => <SelectItem key={a._id} value={a._id}>{a.name} ({a.type})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Insurance ID */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Insurance ID <span className="text-gray-400 text-xs">auto-detected</span></label>
                  <Input
                    readOnly
                    value={insuranceId || (animalId ? "No insurance registered" : "Select an animal first")}
                    className={`${insuranceId ? "bg-blue-50 text-blue-700 font-medium" : "bg-gray-50 text-gray-400 italic"}`}
                  />
                </div>

                {/* Semen Types — collapsible multi-select */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Types of Semen *</label>
                  <button
                    type="button"
                    onClick={() => setSemenTypeOpen(o => !o)}
                    className={`w-full flex items-center justify-between border rounded-md px-3 py-2 bg-white text-sm text-left${errors.semenTypes ? " border-red-500" : " border-input"}`}
                  >
                    <span className="flex flex-wrap gap-1 flex-1 min-w-0">
                      {semenTypes.length === 0
                        ? <span className="text-gray-400">Select semen type(s)...</span>
                        : semenTypes.map(t => (
                            <span key={t} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs border bg-emerald-50 text-emerald-700 border-emerald-200">{t}</span>
                          ))
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 ml-2 shrink-0 transition-transform${semenTypeOpen ? " rotate-180" : ""}`} />
                  </button>
                  {semenTypeOpen && (
                    <div className="border border-input rounded-md bg-white shadow-sm p-2 space-y-1">
                      {SEMEN_TYPES.map(t => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
                          <input
                            type="checkbox"
                            checked={semenTypes.includes(t)}
                            onChange={() => setSemenTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                            className="accent-emerald-600 h-4 w-4"
                          />
                          <span className="text-sm">{t}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.semenTypes && <p className="text-xs text-red-500">{errors.semenTypes}</p>}
                </div>

                {/* Semen Price */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Price of Semen <span className="text-gray-400 text-xs">optional</span></label>
                  <Input type="number" min="0" step="0.01" placeholder="e.g. 5000" value={semenPrice} onChange={e => setSemenPrice(e.target.value)} />
                </div>

                {/* Vet Price */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Vet Price <span className="text-gray-400 text-xs">optional</span></label>
                  <Input type="number" min="0" step="0.01" placeholder="e.g. 3000" value={vetPrice} onChange={e => setVetPrice(e.target.value)} />
                </div>

                {/* Time of Injection */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Time of Injection <span className="text-gray-400 text-xs">optional</span></label>
                  <Input type="time" value={injectionTime} onChange={e => setInjectionTime(e.target.value)} />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <Input type="date" value={date} onChange={e => handleDateChange(e.target.value)} className={errors.date ? "border-red-500" : ""} />
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
                </div>

                {/* Expected Birth Date */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Expected Birth Date <span className="text-gray-400 text-xs">optional</span></label>
                    {birthCountdown !== null && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        birthCountdown > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : birthCountdown === 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {birthCountdown > 0 ? `${birthCountdown}d remaining` : birthCountdown === 0 ? "Due today" : `${Math.abs(birthCountdown)}d overdue`}
                      </span>
                    )}
                  </div>
                  <Input type="date" value={expectedBirthDate} onChange={e => setExpectedBirthDate(e.target.value)} />
                  {(() => {
                    const sel = animals.find(a => a._id === animalId)
                    return sel?.type?.toLowerCase() === "cow" && date ? (
                      <p className="text-xs text-emerald-600">Auto-estimated: AI date + 283 days</p>
                    ) : null
                  })()}
                </div>

                {/* Vet Name */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Name of the Vet <span className="text-gray-400 text-xs">optional</span></label>
                  <Select
                    value={vetName || "none"}
                    onValueChange={v => {
                      if (v === "none") { setVetName(""); setVetOrigin("") }
                      else {
                        const vet = vets.find(d => d.name === v)
                        setVetName(v)
                        if (vet?.specialization) setVetOrigin(vet.specialization)
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Select vet..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Not specified —</SelectItem>
                      {vets.map(d => (
                        <SelectItem key={d._id} value={d.name}>
                          {d.name}{d.specialization ? ` — ${d.specialization}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vet Origin */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Vet Origin / Organization <span className="text-gray-400 text-xs">optional</span></label>
                  <Input placeholder="e.g. RAB, MINAGRI, Private Clinic" value={vetOrigin} onChange={e => setVetOrigin(e.target.value)} />
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
                {editRecord && <Button variant="outline" onClick={resetForm} className="rounded-xl">Cancel</Button>}
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
                Insemination History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                <Select value={filterAnimal || "all"} onValueChange={v => setFilterAnimal(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All Animals" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Animals</SelectItem>
                    {femaleAnimals.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
                <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500">{filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}</p>
                  <Button variant="outline" onClick={() => { setFilterAnimal(""); setFilterMonth("") }} className="rounded-xl ml-auto text-xs">Clear</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Animal</TableHead>
                      <TableHead>Semen Types</TableHead>
                      <TableHead>Semen Price</TableHead>
                      <TableHead>Vet Price</TableHead>
                      <TableHead>Injection Time</TableHead>
                      <TableHead>Expected Birth</TableHead>
                      <TableHead>Vet</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow><TableCell colSpan={10} className="text-center py-8 text-gray-400">No records found</TableCell></TableRow>
                    ) : filteredRecords.map(r => (
                      <TableRow key={r._id}>
                        <TableCell className="text-sm">{r.date}</TableCell>
                        <TableCell className="text-sm">{r.animalName || <span className="text-gray-400">General</span>}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(r.semenTypes || []).map(t => (
                              <Badge key={t} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">{t}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{r.semenPrice != null ? r.semenPrice : <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm">{r.vetPrice != null ? r.vetPrice : <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm">{r.injectionTime || <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm">
                          {r.expectedBirthDate
                            ? <span className={new Date(r.expectedBirthDate) >= new Date() ? "text-emerald-600 font-medium" : "text-gray-500"}>{r.expectedBirthDate}</span>
                            : <span className="text-gray-400">—</span>
                          }
                        </TableCell>
                        <TableCell className="text-sm">{r.vetName || <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm">{r.vetOrigin || <span className="text-gray-400">—</span>}</TableCell>
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
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Insemination Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
