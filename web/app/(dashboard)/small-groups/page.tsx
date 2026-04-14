'use client';

import { useEffect, useState } from 'react';
import { smallGroupsApi, SmallGroup } from '@/lib/api/smallGroups';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

export default function SmallGroupsPage() {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SmallGroup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    meetingDay: '',
    meetingTime: ''
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const data = await smallGroupsApi.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await smallGroupsApi.update(editingGroup.id, formData);
      } else {
        await smallGroupsApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadGroups();
    } catch (error) {
      console.error('Failed to save group:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', meetingDay: '', meetingTime: '' });
    setEditingGroup(null);
  };

  const handleEdit = (group: SmallGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      address: group.address || '',
      meetingDay: group.meetingDay || '',
      meetingTime: group.meetingTime || ''
    });
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'meetingDay', label: 'Meeting Day', render: (val: string) => val || '-' },
    { key: 'meetingTime', label: 'Time', render: (val: string) => val || '-' },
    { 
      key: 'members', 
      label: 'Members', 
      render: (val: any[]) => val?.length || 0 
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          val === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
        }`}>
          {val}
        </span>
      )
    }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Small Groups</h1>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          Add Small Group
        </Button>
      </div>

      <Table columns={columns} data={groups} onRowClick={handleEdit} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingGroup ? 'Edit Small Group' : 'New Small Group'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            required
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(val) => setFormData({ ...formData, address: val })}
          />
          <Input
            label="Meeting Day"
            value={formData.meetingDay}
            onChange={(val) => setFormData({ ...formData, meetingDay: val })}
            placeholder="e.g., Wednesday"
          />
          <Input
            label="Meeting Time"
            value={formData.meetingTime}
            onChange={(val) => setFormData({ ...formData, meetingTime: val })}
            placeholder="e.g., 19:00"
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit">Save</Button>
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
