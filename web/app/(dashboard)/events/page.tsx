'use client';
import { useEffect, useState } from 'react';
import { eventsApi, Event } from '@/lib/api/events';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
export default function EventsPage() {
  const [data, setData] = useState<Event[]>([]);
  useEffect(() => { eventsApi.getAll().then(setData); }, []);
  return <div><div className="flex justify-between mb-6"><h1 className="text-3xl font-bold">Events</h1><Button>Add Event</Button></div><Table columns={[{key:'title',label:'Event'},{key:'startDate',label:'Start Date'},{key:'price',label:'Price'},{key:'status',label:'Status'}]} data={data} /></div>;
}
