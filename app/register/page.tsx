'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'buyer',
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        profile_image: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSuccess("Registration successful!");
                router.push('/login'); // or redirect wherever needed
            }
        } catch (err) {
            setError("Network error");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="full_name" placeholder="Full Name" onChange={handleChange} value={formData.full_name} required className="w-full border p-2" />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required className="w-full border p-2" />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} required className="w-full border p-2" />
                <select name="role" onChange={handleChange} value={formData.role} className="w-full border p-2">
                    <option value="buyer">Buyer</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                </select>
                <input name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} className="w-full border p-2" />
                <input name="address" placeholder="Address" onChange={handleChange} value={formData.address} className="w-full border p-2" />
                <input name="country" placeholder="Country" onChange={handleChange} value={formData.country} className="w-full border p-2" />
                <input name="state" placeholder="State" onChange={handleChange} value={formData.state} className="w-full border p-2" />
                <input name="city" placeholder="City" onChange={handleChange} value={formData.city} className="w-full border p-2" />
                <input name="postal_code" placeholder="Postal Code" onChange={handleChange} value={formData.postal_code} className="w-full border p-2" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setFormData(prev => ({
                                    ...prev,
                                    profile_image: reader.result as string, // base64 or data URL
                                }));
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="w-full border p-2"
                />

                {formData.profile_image && (
                    <img src={formData.profile_image} alt="Preview" className="h-24 w-24 mt-2 object-cover rounded-full" />
                )}


                <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Register</button>
            </form>
        </div>
    );
}
