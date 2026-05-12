'use client'

import { useState } from 'react'
import TransactionFilters from '@/components/transactions/TransactionFilters'
import TransactionTable from '@/components/transactions/TransactionTable'
import TransactionForm from '@/components/transactions/TransactionForm'
import type { Transaction, TransactionFilters as Filters } from '@/types/transaction.types'

export default function TransactionsPage() {
  const [filters, setFilters] = useState<Filters>({})
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()

  const openCreate = () => {
    setEditingTransaction(undefined)
    setFormOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTransaction(undefined)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Transacciones</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Historial completo de movimientos
        </p>
      </div>

      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        onAdd={openCreate}
      />

      <TransactionTable filters={filters} onEdit={openEdit} />

      <TransactionForm
        open={formOpen}
        onClose={closeForm}
        transaction={editingTransaction}
      />
    </div>
  )
}
