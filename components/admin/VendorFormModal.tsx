'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
export default function VendorFormModal({ isOpen, onClose, onSubmit, initialData = {} }: any) {
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        profile_image: '',
        status: 'active',
    });

    useEffect(() => {
        if (initialData) {
            setForm({ ...form, ...initialData });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm({ ...form, profile_image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
            <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4">
                <h4 className="text-2xl font-semibold mb-4">Vendor Form</h4>
                <form className="grid grid-cols-1 lg:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label>Full Name</Label>
                        <Input name="full_name" value={form.full_name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input name="email" value={form.email} onChange={handleChange} />
                    </div>
                    {!initialData?.email && (
                        <div>
                            <Label>Password</Label>
                            <Input type="password" name="password" value={form.password} onChange={handleChange} />
                        </div>
                    )}
                    <div>
                        <Label>Phone</Label>
                        <Input name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input name="address" value={form.address} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Country</Label>
                        <Input name="country" value={form.country} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>State</Label>
                        <Input name="state" value={form.state} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>City</Label>
                        <Input name="city" value={form.city} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Postal Code</Label>
                        <Input name="postal_code" value={form.postal_code} onChange={handleChange} />
                    </div>
                    <div className="relative">
                        <Label>Status</Label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs text-gray-800 border-gray-300 bg-transparent focus:outline-hidden focus:ring-3 focus:border-brand-300 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800`}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="banned">Banned</option>
                        </select>
                    </div>


                    <div>
                        <Label>Profile Image</Label>
                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className="col-span-2 flex justify-end gap-3 mt-6">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
