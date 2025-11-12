"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerAnimal } from "@/lib/actions"
import { useLanguage } from "@/contexts/LanguageContext"

interface AddAnimalFormProps {
  userId: string;
}

export default function AddAnimalForm({ userId }: AddAnimalFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    district: "",
    sector: "",
    class: "",
    ownerName: "",
    phoneNumber: "",
    price: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value)
    })

    try {
      const result = await registerAnimal(form, userId)
      if (result.success) {
        router.push("/farmer/animals")
        router.refresh()
      } else {
        console.error("Error registering animal:", result.error)
      }
    } catch (error) {
      console.error("Error registering animal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('farmer.animalInformation')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('farmer.name')}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('farmer.enterAnimalName')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{t('farmer.animalType')}</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder={t('farmer.selectAnimalType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cow">{t('farmer.cow')}</SelectItem>
                  <SelectItem value="goat">{t('farmer.goat')}</SelectItem>
                  <SelectItem value="sheep">{t('farmer.sheep')}</SelectItem>
                  <SelectItem value="chicken">{t('farmer.chicken')}</SelectItem>
                  <SelectItem value="dog">{t('farmer.dog')}</SelectItem>
                  <SelectItem value="cat">{t('farmer.cat')}</SelectItem>
                  <SelectItem value="other">{t('farmer.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">{t('farmer.breed')}</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder={t('farmer.enterBreed')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">{t('farmer.class')}</Label>
              <Select value={formData.class} onValueChange={(value) => handleSelectChange("class", value)} required>
                <SelectTrigger id="class">
                  <SelectValue placeholder={t('farmer.selectClass')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dairy">{t('farmer.dairy')}</SelectItem>
                  <SelectItem value="meat">{t('farmer.meat')}</SelectItem>
                  <SelectItem value="poultry">{t('farmer.poultry')}</SelectItem>
                  <SelectItem value="pet">{t('farmer.pet')}</SelectItem>
                  <SelectItem value="other">{t('farmer.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t('farmer.district')}</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleSelectChange("district", value)}
                required
              >
                <SelectTrigger id="district">
                  <SelectValue placeholder={t('farmer.selectDistrict')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kigali">Kigali</SelectItem>
                  <SelectItem value="musanze">Musanze</SelectItem>
                  <SelectItem value="huye">Huye</SelectItem>
                  <SelectItem value="rubavu">Rubavu</SelectItem>
                  <SelectItem value="nyagatare">Nyagatare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">{t('farmer.sector')}</Label>
              <Select value={formData.sector} onValueChange={(value) => handleSelectChange("sector", value)} required>
                <SelectTrigger id="sector">
                  <SelectValue placeholder={t('farmer.selectSector')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nyarugenge">Nyarugenge</SelectItem>
                  <SelectItem value="kicukiro">Kicukiro</SelectItem>
                  <SelectItem value="gasabo">Gasabo</SelectItem>
                  <SelectItem value="kinigi">Kinigi</SelectItem>
                  <SelectItem value="ngoma">Ngoma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">{t('farmer.ownerName')}</Label>
              <Input
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder={t('farmer.enterOwnerName')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('farmer.phoneNumber')}</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder={t('farmer.enterPhoneNumber')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t('farmer.priceRWF')}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder={t('farmer.enterPrice')}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('farmer.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('farmer.registering') : t('farmer.registerAnimal')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
