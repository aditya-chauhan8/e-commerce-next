'use client';

import VendorFormModal from '@/components/admin/VendorFormModal';
import { useEffect, useState } from 'react';

type Vendor = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: string;
    createdAt: string;
    account_profiles: any;
};

export default function VendorListPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editVendor, setEditVendor] = useState<any>(null);

    useEffect(() => {
        fetch('/api/vendors')
            .then(res => res.json())
            .then(data => {
                setVendors(data);
                setLoading(false);
            });
    }, []);

    console.log(vendors);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this vendor?")) return;
        await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
        setVendors(vendors.filter(v => v.id !== id));
    };

    const handleEdit = (id: string) => {
        const vendor = vendors.find((v) => v.id === id);
        if (!vendor) return;

        const profile = vendor.account_profiles || {};
        setEditVendor({
            ...profile,
            email: vendor.email,
            id: vendor.id,
        });

        setIsModalOpen(true);
    };


    const handleCreate = () => {
        // Ideally open a modal or route to create page
        // alert("Create vendor clicked");
        setEditVendor(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (editVendor) {
                await fetch(`/api/vendors/${editVendor.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, role: 'vendor' }),
                });
            }

            const updated = await fetch('/api/vendors').then((res) => res.json());
            setVendors(updated);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving vendor", err);
        }
    };
    const handleClose = () => {
        setEditVendor(null);
        setIsModalOpen(false)
    }


    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Vendor List</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Vendor
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-md">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Phone</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Joined</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor.id} className="border-t">
                                <td className="p-2">{vendor?.account_profiles?.full_name}</td>
                                <td className="p-2">{vendor?.email}</td>
                                <td className="p-2">{vendor?.account_profiles?.phone || '-'}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="p-2">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                                <td className="p-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(vendor.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vendor.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen &&
                <VendorFormModal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    initialData={editVendor}
                />
            }
        </div>
    );
}
