"use client";

import { useEffect, useState } from "react";
import { membersApi, type Member } from "@/lib/api/members";
import Button from "@/components/ui/Button";
import Table, { type TableColumn } from "@/components/ui/Table";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await membersApi.getAll();
        setMembers(data);
      } catch (error) {
        console.error("Failed to load members:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadMembers();
  }, []);

  const columns: TableColumn<Member>[] = [
    {
      key: "firstName",
      label: "Name",
      render: (_value, row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "email",
      label: "Email",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "-",
    },
    {
      key: "phone",
      label: "Phone",
      render: (value) =>
        typeof value === "string" && value.length > 0 ? value : "-",
    },
    {
      key: "serviceApproved",
      label: "Service Approved",
      render: (value) => (value === true ? "Yes" : "No"),
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Members
        </h1>

        <Button>Add Member</Button>
      </div>

      <Table columns={columns} data={members} />
    </div>
  );
}
