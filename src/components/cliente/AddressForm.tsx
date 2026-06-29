'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddressForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ label: 'Casa', street: '', number: '', complement: '', district: '', city: '', state: '', zipCode: '', isDefault: true })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/user/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setLoading(false)
    if (res.ok) {
      setForm({ label: 'Casa', street: '', number: '', complement: '', district: '', city: '', state: '', zipCode: '', isDefault: true })
      router.refresh()
    } else {
      alert('Erro ao salvar endereço')
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input name="label" value={form.label} onChange={handleChange} placeholder="Label (Casa, Trabalho)" className="input" />
      <input name="street" value={form.street} onChange={handleChange} placeholder="Rua" className="input" />
      <input name="number" value={form.number} onChange={handleChange} placeholder="Número" className="input" />
      <input name="complement" value={form.complement} onChange={handleChange} placeholder="Complemento" className="input" />
      <input name="district" value={form.district} onChange={handleChange} placeholder="Bairro" className="input" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" className="input" />
      <input name="state" value={form.state} onChange={handleChange} placeholder="Estado" className="input" />
      <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="CEP" className="input" />
      <label className="flex items-center gap-2 md:col-span-2">
        <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} /> Definir como padrão
      </label>
      <div className="md:col-span-2 text-right">
        <button type="submit" className="btn-primary px-6 py-2" disabled={loading}>{loading ? 'Salvando...' : 'Salvar endereço'}</button>
      </div>
    </form>
  )
}
