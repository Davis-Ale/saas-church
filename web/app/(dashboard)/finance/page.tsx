'use client';
import { useEffect, useState } from 'react';
import { financeApi, Transaction } from '@/lib/api/finance';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
export default function FinancePage() {
  const [data, setData] = useState<Transaction[]>([]);
  useEffect(() => { financeApi.getAll().then(setData); }, []);
  return <div><div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Finance</h1><Button>Add Transaction</Button></div><Table columns={[{key:'description',label:'Description'},{key:'type',label:'Type'},{key:'amount',label:'Amount'},{key:'date',label:'Date'}]} data={data} /></div>;
}
