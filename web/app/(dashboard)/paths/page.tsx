'use client';
import { useEffect, useState } from 'react';
import { pathsApi, Path } from '@/lib/api/paths';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
export default function PathsPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  useEffect(() => { pathsApi.getAll().then(setPaths); }, []);
  return <div><div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Paths</h1><Button>Add Path</Button></div><Table columns={[{key:'name',label:'Name'},{key:'description',label:'Description'},{key:'status',label:'Status'}]} data={paths} /></div>;
}
