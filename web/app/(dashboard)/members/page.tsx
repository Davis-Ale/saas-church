"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  membersApi,
  type CreateMemberData,
  type Member,
} from "@/lib/api/members";
import {
  smallGroupsApi,
  type SmallGroup,
} from "@/lib/api/smallGroups";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Table, { type TableColumn } from "@/components/ui/Table";

interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  smallGroupId: string;
  serviceApproved: boolean;
}

const emptyFormData: MemberFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: "",
  address: "",
  smallGroupId: "",
  serviceApproved: false,
};

const PAGE_LIMIT = 20;

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [smallGroups, setSmallGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(emptyFormData);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await membersApi.list({
        search: search || undefined,
        page,
        limit: PAGE_LIMIT,
      });

      setMembers(response.data);
      setTotal(response.total);
    } catch {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  useEffect(() => {
    const loadSmallGroups = async () => {
      try {
        const data = await smallGroupsApi.getAll();
        setSmallGroups(data);
      } catch {
        setError("Failed to load small groups");
      }
    };

    void loadSmallGroups();
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_LIMIT)),
    [total]
  );

  const resetForm = () => {
    setFormData(emptyFormData);
    setEditingMember(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setError("");
    setIsModalOpen(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || "",
      birthDate: member.birthDate
        ? member.birthDate.slice(0, 10)
        : "",
      address: member.address || "",
      smallGroupId: member.smallGroupId || member.smallGroup?.id || "",
      serviceApproved: member.serviceApproved,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const buildPayload = (): CreateMemberData => ({
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim() || undefined,
    birthDate: formData.birthDate || undefined,
    address: formData.address.trim() || undefined,
    smallGroupId: formData.smallGroupId || undefined,
    serviceApproved: formData.serviceApproved,
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = buildPayload();

      if (editingMember) {
        await membersApi.update(editingMember.id, payload);
      } else {
        await membersApi.create(payload);
      }

      handleCloseModal();
      await loadMembers();
    } catch {
      setError("Failed to save member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: Member) => {
    const confirmed = window.confirm(
      `Remove ${member.firstName} ${member.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(member.id);
    setError("");

    try {
      await membersApi.delete(member.id);
      await loadMembers();
    } catch {
      setError("Failed to remove member");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const columns: TableColumn<Member>[] = [
    {
      key: "firstName",
      label: "Name",
      render: (_value, row) =>
        `${row.firstName} ${row.lastName}`,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) =>
        typeof value === "string" && value.length > 0
          ? value
          : "-",
    },
    {
      key: "smallGroup",
      label: "Small Group",
      render: (_value, row) => row.smallGroup?.name || "-",
    },
    {
      key: "serviceApproved",
      label: "Service Approved",
      render: (value) => (value === true ? "Yes" : "No"),
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
          Members
        </h1>

        <Button onClick={handleOpenCreate}>
          Add Member
        </Button>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex max-w-xl gap-3"
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search members"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2"
        />

        <Button type="submit">
          Search
        </Button>
      </form>

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
        <>
          <Table
            columns={columns}
            data={members}
            onRowClick={handleEdit}
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {total} members
            </span>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() =>
                  setPage((currentPage) =>
                    Math.max(1, currentPage - 1)
                  )
                }
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((currentPage) =>
                    Math.min(totalPages, currentPage + 1)
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMember ? "Edit Member" : "New Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  firstName: value,
                })
              }
              required
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  lastName: value,
                })
              }
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) =>
              setFormData({
                ...formData,
                email: value,
              })
            }
            required
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChange={(value) =>
              setFormData({
                ...formData,
                phone: value,
              })
            }
          />

          <Input
            label="Birth Date"
            type="date"
            value={formData.birthDate}
            onChange={(value) =>
              setFormData({
                ...formData,
                birthDate: value,
              })
            }
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(value) =>
              setFormData({
                ...formData,
                address: value,
              })
            }
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Small Group
            </label>

            <select
              value={formData.smallGroupId}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  smallGroupId: event.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option
                value=""
                disabled={Boolean(
                  editingMember?.smallGroupId || editingMember?.smallGroup?.id
               )}
              >
                No small group
              </option>

              {smallGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={formData.serviceApproved}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  serviceApproved: event.target.checked,
                })
              }
            />
            Service Approved
          </label>

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
