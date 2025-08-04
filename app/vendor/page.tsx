"use client";

export default function VendorPage() {
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.href = "/login";
    } else {
      alert("Logout failed");
    }
  };
  return (
    <>
      <h1 className="text-2xl p-4">Welcome, Vendor!</h1>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
