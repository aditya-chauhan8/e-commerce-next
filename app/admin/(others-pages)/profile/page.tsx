"use client"
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";

import React, { useEffect, useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    profile_image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchProfile = async () => {
    const res = await fetch("/api/admin");
    const data = await res.json();
    if (res.ok) {
      setProfile(data);
      // Setting form data
      if (data) {
        setForm({
          full_name: data?.full_name || "",
          phone: data?.phone || "",
          address: data?.address || "",
          country: data?.country || "",
          state: data?.state || "",
          city: data?.city || "",
          postal_code: data?.postal_code || "",
          profile_image: data?.profile_image || "",
        });

        if (data?.profile_image) {
          setImagePreview(`/uploads/${data?.profile_image}`);
        }
      } else {
        console.error(data.error);
      }


    } else {
      console.error(data.error);
    }
    setLoading(false);
  };
  useEffect(() => {

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Unable to load profile.</div>;
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };



  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setForm((prev) => ({ ...prev, profile_image: file.name }));
    setImagePreview(URL.createObjectURL(file));
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setForm((prev) => ({
    //     ...prev,
    //     profile_image: typeof reader.result === "string" ? reader.result : "",
    //   }));
    // };
    // if (file) reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    try {

      const formData = new FormData();
      formData.append("full_name", form.full_name);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("country", form.country);
      formData.append("state", form.state);
      formData.append("city", form.city);
      formData.append("postal_code", form.postal_code);
      if (imageFile) formData.append("profile_image", imageFile);

      const res = await fetch("/api/admin", {
        method: "POST",
        body: formData,
        // headers: { "Content-Type": "application/json" },
      });
      const data = await res.json()
      if (res.ok) {
        setIsOpen(false);
        fetchProfile();
      } else {
        alert(data.error || "Failed to update profile.");
      }
    } catch (error) {
      alert("Error updating profile.");
    }
    // setIsOpen(false);
  };

  console.log("Form Data:", form);

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex justify-between  items-center mb-7">

          <h3 className=" text-lg font-semibold text-gray-800 dark:text-white/90 ">
            Profile
          </h3>
          <button
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center justify-center h-10 gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
        <div className="space-y-6">
          <UserMetaCard profiledata={profile} />
          <UserInfoCard profiledata={profile} />
          <UserAddressCard profiledata={profile} />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[700px] m-4">

        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col overflow-y-auto custom-scrollbar h-[500px]" onSubmit={handleSave}>


            <div className="  px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Full Name</Label>
                    <Input type="text" name="full_name"
                      value={form.full_name}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Address</Label>
                    <Input type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Country</Label>
                    <Input type="text"
                      name="country"
                      value={form.country}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>State</Label>
                    <Input type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>City</Label>
                    <Input type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Postal Code</Label>
                    <Input type="text"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Profile Image</Label>
                    {/* <Input type="file"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleImageChange} />
                    {form.profile_image && (
                      <img
                        src={form.profile_image.startsWith("data") ? form.profile_image : `/uploads/${form.profile_image}`}
                        alt="Profile Preview"
                        className="mt-2 w-20 h-20 rounded-full object-cover"
                      />
                    )} */}
                    <Input type="file" name="profile_image" accept="image/*" onChange={handleImageChange} />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="mt-2 w-20 h-20 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>



            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
