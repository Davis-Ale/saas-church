"use client";

import { useCallback, useEffect, useState } from "react";
import {
  smallGroupsApi,
  type CreateSmallGroupData,
  type SmallGroup,
} from "@/lib/api/smallGroups";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Table, { type TableColumn } from "@/components/ui/Table";

interface SmallGroupFormData {
  name: string;
  address: string;
  meetingDay: string;
  meetingTime: string;
}

const emptyFormData: SmallGroupFormData = {
  name: "",
  address: "",
  meetingDay: "",
  meetingTime: "",
};

export default function SmallGroupsPage() {
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SmallGroup | null>(null);
  const [formData, setFormData] = useState<SmallGroupFormData>(emptyFormData);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await smallGroupsApi.getAll();
      setGroups(data);
    } catch {
      setError("Failed to load small groups");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingGroup(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (group: SmallGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      address: group.address || "",
      meetingDay: group.meetingDay || "",
      meetingTime: group.meetingTime || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const buildPayload = (): CreateSmallGroupData => ({
    name: formData.name.trim(),
    address: formData.address.trim() || undefined,
    meetingDay: formData.meetingDay.trim() || undefined,
    meetingTime: formData.meetingTime.trim() || undefined,
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = buildPayload();

      if (editingGroup) {
        await smallGroupsApi.update(editingGroup.id, payload);
      } else {
        await smallGroupsApi.create(payload);
      }

      handleCloseModal();
      await loadGroups();
    } catch {
      setError("Failed to save small group");
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<SmallGroup>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "address",
      label: "Address",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "-",
    },
    {
      key: "meetingDay",
      label: "Meeting Day",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "-",
    },
    {
      key: "meetingTime",
      label: "Time",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "-",
    },
    {
      key: "members",
      label: "Members",
      render: (value) => (Array.isArray(value) ? value.length : 0),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const status = typeof value === "string" ? value : "unknown";

        return (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === "active"
                ? "bg-green-50 text-green-700"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Small Groups
        </h1>

        <Button onClick={handleOpenCreate}>
          Add Small Group
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          Loading...
        </div>
      ) : (
        <Table
          columns={columns}
          data={groups}
          onRowClick={handleEdit}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingGroup ? "Edit Small Group" : "New Small Group"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(value) =>
              setFormData({ ...formData, name: value })
            }
            required
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(value) =>
              setFormData({ ...formData, address: value })
            }
          />

          <Input
            label="Meeting Day"
            value={formData.meetingDay}
            onChange={(value) =>
              setFormData({ ...formData, meetingDay: value })
            }
            placeholder="e.g., Wednesday"
          />

          <Input
            label="Meeting Time"
            value={formData.meetingTime}
            onChange={(value) =>
              setFormData({ ...formData, meetingTime: value })
            }
            placeholder="e.g., 19:00"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
