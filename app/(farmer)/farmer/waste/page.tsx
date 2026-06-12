"use client"

import { useState, useEffect, useMemo } from "react"
import { getCurrentUser } from "@/lib/actions/auth"
import { getAnimals } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Trash2, Plus, Pencil, BarChart3, History, Weight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Animal { _id: string; name: string; type: string }
interface WasteRecord {
  _id: string; animalId: string | null; animalName: string | null
  wasteType: string; quantity: number; unit: string
  disposalMethod: string | null; date: string; notes: string | null
}

const WASTE_TYPES = ["Manure", "Urine", "Bedding", "Feed Waste", "Dead Animals", "Wastewater", "Other"]
const UNITS = ["kg", "litres", "bags", "tonnes"]
const DISPOSAL_METHODS = ["Composting", "Biogas", "Landfill", "Sold", "Spread on Fields", "Other"]

const today = new Date().toISOString().split("T")[0]

const WASTE_COLORS: Record<string, string> = {
  Manure: "bg-amber-50 text-amber-700 border-amber-200",
  Urine: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Bedding: "bg-orange-50 text-orange-700 border-orange-200",
  "Feed Waste": "bg-lime-50 text-lime-700 border-lime-200",
  "Dead Animals": "bg-red-50 text-red-700 border-red-200",
  Wastewater: "bg-sky-50 text-sky-700 border-sky-200",
  Other: "bg-gray-50 text-gray-700 border-gray-200",
}

export default function WasteManagementPage() {
  const [user, setUser] = useState<any>(null)
  const [animals, setAnimals] = useState<Animal[]>([])
  const [records, setRecords] = useState<WasteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editRecord, setEditRecord] = useState<WasteRecord | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form
  const [animalId, setAnimalId] = useState("")
  const [wasteType, setWasteType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [disposalMethod, setDisposalMethod] = useState("")
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter
  const [filterType, setFilterType] = useState("")
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
    const res = await fetch(`/api/waste?farmerId=${farmerId}`)
    const data = await res.json()
    setRecords(Array.isArray(data) ? data : [])
  }

  const filteredRecords = useMemo(() => {
    let data = [...records]
    if (filterType) data = data.filter(r => r.wasteType === filterType)
    if (filterMonth) data = data.filter(r => r.date.startsWith(filterMonth))
    return data
  }, [records, filterType, filterMonth])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!wasteType) e.wasteType = "Select a waste type"
    if (!quantity || Number(quantity) <= 0) e.quantity = "Enter a valid quantity"
    if (!unit) e.unit = "Select a unit"
    if (!date) e.date = "Select a date"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const resetForm = () => {
    setAnimalId(""); setWasteType(""); setQuantity(""); setUnit("")
    setDisposalMethod(""); setDate(today); setNotes("")
    setErrors({}); setEditRecord(null)
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    const animal = animals.find(a => a._id === animalId)
    const body = {
      farmerId: user._id.toString(), animalId: animalId || null,
      animalName: animal?.name || null, wasteType, quantity, unit,
      disposalMethod: disposalMethod || null, date, notes,
    }

    if (editRecord) {
      await fetch("/api/waste", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editRecord._id, ...body }) })
    } else {
      await fetch("/api/waste", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    }

    await fetchRecords(user._id.toString())
    resetForm()
    setSaving(false)
  }

  const handleEdit = (r: WasteRecord) => {
    setEditRecord(r)
    setAnimalId(r.animalId || "")
    setWasteType(r.wasteType)
    setQuantity(String(r.quantity))
    setUnit(r.unit)
    setDisposalMethod(r.disposalMethod || "")
    setDate(r.date)
    setNotes(r.notes || "")
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/waste?id=${id}`, { method: "DELETE" })
    await fetchRecords(user._id.toString())
    setDeleteId(null)
  }

  // Summary stats
  const totalByType = useMemo(() => {
    const map: Record<string, number> = {}
    filteredRecords.forEach(r => { map[r.wasteType] = (map[r.wasteType] || 0) + r.quantity })
    return Object.entries(map).map(([type, quantity]) => ({ type, quantity }))
  }, [filteredRecords])

  const totalQuantity = useMemo(() => filteredRecords.reduce((s, r) => s + r.quantity, 0), [filteredRecords])

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
          <Trash2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Waste Management</h1>
          <p className="text-sm text-gray-500">Track and manage farm waste disposal</p>
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
            <BarChart3 className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-100 uppercase font-medium">Total Quantity</p>
              <p className="text-2xl font-bold">{totalQuantity.toFixed(1)}</p>
            </div>
            <Weight className="h-8 w-8 text-white/40" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-indigo-600 text-white col-span-2 lg:col-span-1">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-100 uppercase font-medium">Waste Types</p>
              <p className="text-2xl font-bold">{totalByType.length}</p>
            </div>
            <Trash2 className="h-8 w-8 text-white/40" />
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
                {editRecord ? "Edit Waste Record" : "New Waste Record"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Animal (optional) */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Animal <span className="text-gray-400 text-xs">optional</span></label>
                  <Select value={animalId || "none"} onValueChange={v => setAnimalId(v === "none" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Select animal..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">All / General</SelectItem>
                      {animals.map(a => <SelectItem key={a._id} value={a._id}>{a.name} ({a.type})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Waste Type */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Waste Type *</label>
                  <Select value={wasteType} onValueChange={setWasteType}>
                    <SelectTrigger className={errors.wasteType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select waste type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {WASTE_TYPES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.wasteType && <p className="text-xs text-red-500">{errors.wasteType}</p>}
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Quantity *</label>
                  <Input type="number" min="0" step="0.1" placeholder="e.g. 50" value={quantity} onChange={e => setQuantity(e.target.value)} className={errors.quantity ? "border-red-500" : ""} />
                  {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
                </div>

                {/* Unit */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Unit *</label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className={errors.unit ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-xs text-red-500">{errors.unit}</p>}
                </div>

                {/* Disposal Method */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Disposal Method <span className="text-gray-400 text-xs">optional</span></label>
                  <Select value={disposalMethod || "none"} onValueChange={v => setDisposalMethod(v === "none" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Select method..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— Not specified —</SelectItem>
                      {DISPOSAL_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date *</label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} className={errors.date ? "border-red-500" : ""} />
                  {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
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
                Waste History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                <Select value={filterType || "all"} onValueChange={v => setFilterType(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {WASTE_TYPES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
                <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                  <p className="text-sm text-gray-500">{filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""}</p>
                  <Button variant="outline" onClick={() => { setFilterType(""); setFilterMonth("") }} className="rounded-xl ml-auto text-xs">Clear</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Waste Type</TableHead>
                      <TableHead>Animal</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Disposal</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">No records found</TableCell></TableRow>
                    ) : filteredRecords.map(r => (
                      <TableRow key={r._id}>
                        <TableCell className="text-sm">{r.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={WASTE_COLORS[r.wasteType] || WASTE_COLORS.Other}>
                            {r.wasteType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{r.animalName || <span className="text-gray-400">General</span>}</TableCell>
                        <TableCell className="font-semibold text-emerald-700">{r.quantity} {r.unit}</TableCell>
                        <TableCell className="text-sm">{r.disposalMethod || <span className="text-gray-400">—</span>}</TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-[120px] truncate">{r.notes || "—"}</TableCell>
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
            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  Waste by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalByType.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={totalByType}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="quantity" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  Summary by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Waste Type</TableHead>
                        <TableHead>Total Quantity</TableHead>
                        <TableHead>Records</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {totalByType.length === 0 ? (
                        <TableRow><TableCell colSpan={3} className="text-center py-6 text-gray-400">No data</TableCell></TableRow>
                      ) : totalByType.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Badge variant="outline" className={WASTE_COLORS[row.type] || WASTE_COLORS.Other}>{row.type}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-emerald-700">{row.quantity.toFixed(1)}</TableCell>
                          <TableCell>{filteredRecords.filter(r => r.wasteType === row.type).length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Waste Record</AlertDialogTitle>
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
