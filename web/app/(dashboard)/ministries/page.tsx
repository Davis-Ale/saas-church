"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ministriesApi,
  type CreateMinistryData,
  type Ministry,
} from "@/lib/api/ministries";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Table, { type TableColumn } from "@/components/ui/Table";

interface MinistryFormData {
  name: string;
  description: string;
}

const emptyFormData: MinistryFormData = {
  name: "",
  description: "",
};

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [formData, setFormData] = useState<MinistryFormData>(emptyFormData);

  const loadMinistries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await ministriesApi.getAll();
      setMinistries(data);
    } catch {
      setError("Failed to load ministries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMinistries();
  }, [loadMinistries]);

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingMinistry(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (ministry: Ministry) => {
    setEditingMinistry(ministry);
    setFormData({
      name: ministry.name,
      description: ministry.description || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const buildPayload = (): CreateMinistryData => ({
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = buildPayload();

      if (editingMinistry) {
        await ministriesApi.update(editingMinistry.id, payload);
      } else {
        await ministriesApi.create(payload);
      }

      handleCloseModal();
      await loadMinistries();
    } catch {
      setError("Failed to save ministry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ministry: Ministry) => {
    const confirmed = window.confirm(`Remove ${ministry.name}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(ministry.id);
    setError("");

    try {
      await ministriesApi.delete(ministry.id);
      await loadMinistries();
    } catch {
      setError("Failed to remove ministry");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: TableColumn<Ministry>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "description",
      label: "Description",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "-",
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
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <button
          type="button"
          disabled={deletingId === row.id}
          onClick={(event) => {
            event.stopPropagation();
            void handleDelete(row);
          }}
          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          {deletingId === row.id ? "Removing..." : "Remove"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Ministries
        </h1>

        <Button onClick={handleOpenCreate}>
          Add Ministry
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
          data={ministries}
          onRowClick={handleEdit}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMinistry ? "Edit Ministry" : "New Ministry"}
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
            label="Description"
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
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
