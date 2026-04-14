'use client';
import { useEffect, useState } from 'react';
import { ministriesApi, Ministry } from '@/lib/api/ministries';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
export default function MinistriesPage() {
  const [data, setData] = useState<Ministry[]>([]);
  useEffect(() => { ministriesApi.getAll().then(setData); }, []);
  return <div><div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Ministries</h1><Button>Add Ministry</Button></div><Table columns={[{key:'name',label:'Name'},{key:'description',label:'Description'},{key:'status',label:'Status'}]} data={data} /></div>;
}
