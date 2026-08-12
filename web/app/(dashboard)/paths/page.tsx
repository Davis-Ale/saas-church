"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pathsApi,
  type CreatePathData,
  type Path,
} from "@/lib/api/paths";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Table, { type TableColumn } from "@/components/ui/Table";

interface PathFormData {
  name: string;
  description: string;
  order: string;
}

const emptyFormData: PathFormData = {
  name: "",
  description: "",
  order: "",
};

export default function PathsPage() {
  const [paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<Path | null>(null);
  const [formData, setFormData] = useState<PathFormData>(emptyFormData);

  const loadPaths = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await pathsApi.getAll();
      setPaths(data);
    } catch {
      setError("Failed to load paths");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPaths();
  }, [loadPaths]);

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingPath(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (path: Path) => {
    setEditingPath(path);
    setFormData({
      name: path.name,
      description: path.description || "",
      order: path.order === null ? "" : String(path.order),
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const buildPayload = (): CreatePathData => ({
    name: formData.name.trim(),
    description: formData.description.trim() || undefined,
    order: formData.order === "" ? undefined : Number(formData.order),
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = buildPayload();

      if (editingPath) {
        await pathsApi.update(editingPath.id, payload);
      } else {
        await pathsApi.create(payload);
      }

      handleCloseModal();
      await loadPaths();
    } catch {
      setError("Failed to save path");
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<Path>[] = [
    {
      key: "order",
      label: "Order",
      render: (value) =>
        typeof value === "number" ? value : "-",
    },
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
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Paths</h1>

        <Button onClick={handleOpenCreate}>
          Add Path
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
          data={paths}
          onRowClick={handleEdit}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPath ? "Edit Path" : "New Path"}
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

          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(value) =>
              setFormData({ ...formData, order: value })
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
