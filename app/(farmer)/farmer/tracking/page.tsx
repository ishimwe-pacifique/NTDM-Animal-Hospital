"use client"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Legend, ComposedChart } from "recharts"
import { useEffect, useState } from "react"
import { Activity, MapPin, Heart, RefreshCw, Thermometer, Database } from "lucide-react"
import { DistributionChart } from "@/components/distribution-chart"
import { RwandaMap } from "@/components/rwanda-map"

// Define our data types based on API response
type Channel = {
  id: number
  name: string
  latitude: string
  longitude: string
  field1: string
  field2: string
  field3: string
  field4: string
  created_at: string
  updated_at: string
  last_entry_id: number
}

type Feed = {
  created_at: string
  entry_id: number
  field1: string
  field2: string | null
  field3: string | null
  field4: string | null
}

type ApiResponse = {
  channel: Channel
  feeds: Feed[]
}

type FormattedData = {
  created_at: string
  timestamp: string
  bpm: number
  latitude: number | null
  longitude: number | null
  temperature: number | null
  hasLocation: boolean
  hasTemperature: boolean
}

export default function PetTrackingPage() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [data, setData] = useState<FormattedData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [refreshing, setRefreshing] = useState(false)
  const [deviceId, setDeviceId] = useState<string>("2688413")
  const [apiKey, setApiKey] = useState<string>("WCY7XQTJZVB21DHQ")
  const [results, setResults] = useState<number>(20)

  // Load Leaflet CSS dynamically
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    link.integrity = "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
    link.crossOrigin = ""
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const fetchSensorData = async () => {
    setRefreshing(true)
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${deviceId}/feeds.json?api_key=${apiKey}&results=${results}`,
      )
      const json: ApiResponse = await res.json()

      setApiResponse(json)

      // Format the data using dynamic field mapping
      const formatted = json.feeds.map((feed: Feed) => {
        const date = new Date(feed.created_at)
        return {
          created_at: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          timestamp: date.toISOString(),
          bpm: Number.parseFloat(feed.field1) || 0,
          latitude: feed.field2 ? Number.parseFloat(feed.field2) : null,
          longitude: feed.field3 ? Number.parseFloat(feed.field3) : null,
          temperature: feed.field4 ? Number.parseFloat(feed.field4) : null,
          hasLocation: !!feed.field2 && !!feed.field3,
          hasTemperature: !!feed.field4,
        }
      })

      // Sort by date
      formatted.sort(
        (a: FormattedData, b: FormattedData) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )

      setData(formatted)
      setLastUpdated(new Date().toLocaleString())
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSensorData()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSensorData()
    }, 30000)

    return () => clearInterval(interval)
  }, [deviceId, apiKey, results])

  // Calculate stats dynamically
  const averageBpm =
    data.length > 0 ? Math.round(data.reduce((sum: number, item: FormattedData) => sum + item.bpm, 0) / data.length) : 0

  const latestBpm = data.length > 0 ? data[data.length - 1].bpm : 0

  // Temperature stats
  const temperatureData = data.filter((item: FormattedData) => item.hasTemperature)
  const averageTemperature =
    temperatureData.length > 0
      ? Math.round(
          (temperatureData.reduce((sum: number, item: FormattedData) => sum + (item.temperature || 0), 0) /
            temperatureData.length) *
            10,
        ) / 10
      : 0

  const latestTemperature = data.length > 0 ? data[data.length - 1].temperature : null

  // Location data stats
  const locationDataPoints = data.filter((item: FormattedData) => item.hasLocation).length
  const totalDataPoints = data.length
  const locationPercentage = totalDataPoints > 0 ? Math.round((locationDataPoints / totalDataPoints) * 100) : 0

  // Dynamic status determination
  const getBpmStatus = (bpm: number) => {
    if (bpm === 0) return { label: "No Data", color: "#9CA3AF" }
    if (bpm < 60) return { label: "Low", color: "#3B82F6" }
    if (bpm <= 100) return { label: "Normal", color: "#10B981" }
    if (bpm <= 130) return { label: "Elevated", color: "#F59E0B" }
    return { label: "High", color: "#EF4444" }
  }

  const getTemperatureStatus = (temp: number | null) => {
    if (temp === null) return { label: "No Data", color: "#9CA3AF" }
    if (temp < 36) return { label: "Low", color: "#3B82F6" }
    if (temp <= 39) return { label: "Normal", color: "#10B981" }
    if (temp <= 41) return { label: "Elevated", color: "#F59E0B" }
    return { label: "High", color: "#EF4444" }
  }

  const bpmStatus = getBpmStatus(latestBpm)
  const temperatureStatus = getTemperatureStatus(latestTemperature)

  // Data for pie chart
  const statusCounts = data.reduce((acc: Record<string, number>, item: FormattedData) => {
    const status = getBpmStatus(item.bpm).label
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(statusCounts).map(([name, value]: [string, number]) => ({
    name,
    value,
    color: getBpmStatus(
      name === "No Data" ? 0 : name === "Low" ? 50 : name === "Normal" ? 80 : name === "Elevated" ? 120 : 150,
    ).color,
  }))

  // Get locations for map
  const locationPoints = data.filter((item: FormattedData) => item.hasLocation)

  // Get dynamic field labels from channel
  const getFieldLabel = (fieldKey: keyof Channel) => {
    return apiResponse?.channel[fieldKey] || fieldKey
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {apiResponse?.channel.name || "Caw Health Monitor"}
                  </h1>
                  <p className="text-gray-600 mt-1">Real-time health and location tracking</p>
                </div>
              </div>
              {apiResponse && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Database className="w-4 h-4" />
                  <span>
                    Channel #{apiResponse.channel.id} • {apiResponse.channel.last_entry_id} total entries
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Last updated:</span> {lastUpdated}
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
                onClick={fetchSensorData}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Data Source Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Channel ID</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="ThingSpeak Channel ID"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ThingSpeak API Key"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Results Count</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={results}
                  onChange={(e) => setResults(Number.parseInt(e.target.value) || 20)}
                  min="1"
                  max="8000"
                />
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                  onClick={fetchSensorData}
                >
                  Fetch
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading sensor data...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="text-6xl mb-4">📡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-6">
              No sensor data found for the selected channel. Please verify the Channel ID and API Key.
            </p>
            <button
              onClick={fetchSensorData}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Field Information */}
            {apiResponse && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Data Fields Mapping
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <Heart className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-800">Field 1</p>
                      <p className="text-sm text-red-600">{getFieldLabel("field1")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold text-blue-800">Field 2</p>
                      <p className="text-sm text-blue-600">{getFieldLabel("field2")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <MapPin className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-800">Field 3</p>
                      <p className="text-sm text-green-600">{getFieldLabel("field3")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                    <Thermometer className="w-6 h-6 text-orange-500" />
                    <div>
                      <p className="font-semibold text-orange-800">Field 4</p>
                      <p className="text-sm text-orange-600">{getFieldLabel("field4")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      bpmStatus.color === "#10B981"
                        ? "bg-green-100 text-green-800"
                        : bpmStatus.color === "#EF4444"
                          ? "bg-red-100 text-red-800"
                          : bpmStatus.color === "#F59E0B"
                            ? "bg-yellow-100 text-yellow-800"
                            : bpmStatus.color === "#3B82F6"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {bpmStatus.label}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Latest {getFieldLabel("field1")}</h3>
                <p className="text-3xl font-bold text-gray-900">{latestBpm}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <Thermometer className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      temperatureStatus.color === "#10B981"
                        ? "bg-green-100 text-green-800"
                        : temperatureStatus.color === "#EF4444"
                          ? "bg-red-100 text-red-800"
                          : temperatureStatus.color === "#F59E0B"
                            ? "bg-yellow-100 text-yellow-800"
                            : temperatureStatus.color === "#3B82F6"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {temperatureStatus.label}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{getFieldLabel("field4")}</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {latestTemperature !== null ? `${latestTemperature}°C` : "N/A"}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Average {getFieldLabel("field1")}</h3>
                <p className="text-3xl font-bold text-gray-900">{averageBpm}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Location Coverage</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{locationPercentage}%</p>
                  <span className="text-sm text-gray-500">
                    ({locationDataPoints}/{totalDataPoints})
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Health Metrics Trend
                </h2>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={data}>
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" tick={{ fontSize: 12 }} tickMargin={10} />
                    <YAxis
                      yAxisId="left"
                      label={{
                        value: getFieldLabel("field1"),
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                      domain={[0, "auto"]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{
                        value: `${getFieldLabel("field4")} (°C)`,
                        angle: 90,
                        position: "insideRight",
                        style: { textAnchor: "middle" },
                      }}
                      domain={[20, 45]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        backdropFilter: "blur(8px)",
                      }}
                      labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="bpm"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                      name={`${getFieldLabel("field1")}`}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="temperature"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                      name={`${getFieldLabel("field4")} (°C)`}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  {getFieldLabel("field1")} Distribution
                </h2>
                <DistributionChart pieData={pieData} data={data} />
              </div>
            </div>

            {/* Rwanda Map */}
            {locationDataPoints > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  🇷🇼 {apiResponse?.channel.name} Location Tracking in Rwanda
                </h2>
                <RwandaMap
                  locationPoints={locationPoints.map((point) => ({
                    latitude: point.latitude!,
                    longitude: point.longitude!,
                    timestamp: point.timestamp,
                    bpm: point.bpm,
                    temperature: point.temperature,
                  }))}
                  animalName={apiResponse?.channel.name || "Pet"}
                />
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                Recent Readings
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        {getFieldLabel("field1")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        {getFieldLabel("field4")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Location ({getFieldLabel("field2")}, {getFieldLabel("field3")})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data
                      .slice()
                      .reverse()
                      .slice(0, 15)
                      .map((item, index) => {
                        const bpmStatus = getBpmStatus(item.bpm)
                        const tempStatus = getTemperatureStatus(item.temperature)
                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-150">
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(item.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.bpm}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {item.temperature !== null ? `${item.temperature}°C` : "N/A"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    bpmStatus.color === "#10B981"
                                      ? "bg-green-100 text-green-800"
                                      : bpmStatus.color === "#EF4444"
                                        ? "bg-red-100 text-red-800"
                                        : bpmStatus.color === "#F59E0B"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : bpmStatus.color === "#3B82F6"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {getFieldLabel("field1")}: {bpmStatus.label}
                                </span>
                                {item.hasTemperature && (
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      tempStatus.color === "#10B981"
                                        ? "bg-green-100 text-green-800"
                                        : tempStatus.color === "#EF4444"
                                          ? "bg-red-100 text-red-800"
                                          : tempStatus.color === "#F59E0B"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : tempStatus.color === "#3B82F6"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {getFieldLabel("field4")}: {tempStatus.label}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.hasLocation ? (
                                <span className="text-green-600 font-medium">
                                  {item.latitude?.toFixed(6)}, {item.longitude?.toFixed(6)}
                                </span>
                              ) : (
                                <span className="text-gray-400">No location data</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
