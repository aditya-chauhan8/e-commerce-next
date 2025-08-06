'use client';

import BuyerFormModal from '@/components/admin/BuyerFormModal';
import { useEffect, useState } from 'react';

type Buyer = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: string;
    createdAt: string;
    account_profiles: any;
};

export default function BuyerListPage() {
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editBuyer, setEditBuyer] = useState<any>(null);

    useEffect(() => {
        fetch('/api/buyers')
            .then(res => res.json())
            .then(data => {
                setBuyers(data);
                setLoading(false);
            });
    }, []);

    console.log(buyers);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this buyer?")) return;
        await fetch(`/api/buyers/${id}`, { method: 'DELETE' });
        setBuyers(buyers.filter(b => b.id !== id));
    };

    const handleEdit = (id: string) => {
        const buyer = buyers.find((b) => b.id === id);
        if (!buyer) return;

        const profile = buyer.account_profiles || {};
        setEditBuyer({
            ...profile,
            email: buyer.email,
            id: buyer.id,
        });

        setIsModalOpen(true);
    };


    const handleCreate = () => {
        // Ideally open a modal or route to create page
        // alert("Create buyer clicked");
        setEditBuyer(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: any) => {
        try {
            if (editBuyer) {
                await fetch(`/api/buyers/${editBuyer.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, role: 'buyer' }),
                });
            }

            const updated = await fetch('/api/buyers').then((res) => res.json());
            setBuyers(updated);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving buyer", err);
        }
    };
    const handleClose = () => {
        setEditBuyer(null);
        setIsModalOpen(false)
    }


    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Buyer List</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Create Buyer
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
                        {buyers.map((buyer) => (
                            <tr key={buyer.id} className="border-t">
                                <td className="p-2">{buyer?.account_profiles?.full_name}</td>
                                <td className="p-2">{buyer?.email}</td>
                                <td className="p-2">{buyer?.account_profiles?.phone || '-'}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${buyer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {buyer.status}
                                    </span>
                                </td>
                                <td className="p-2">{new Date(buyer.createdAt).toLocaleDateString()}</td>
                                <td className="p-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(buyer.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(buyer.id)}
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
                <BuyerFormModal
                    isOpen={isModalOpen}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    initialData={editBuyer}
                />
            }
        </div>
    );
}
