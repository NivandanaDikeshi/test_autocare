"use client";

import { useEffect, useState } from "react";

export default function PartsPage() {
  const [parts, setParts] = useState([]);

  const [form, setForm] = useState({
    partName: "",
    category: "",
    stock: "",
    price: "",
    supplier: "",
  });

  const loadParts = async () => {
    const res = await fetch("/api/parts");
    const data = await res.json();
    setParts(data.parts || []);
  };

  useEffect(() => {
    loadParts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await fetch("/api/parts", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(form),
    });

    loadParts();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Spare Parts Inventory
      </h1>

      <form
        onSubmit={submit}
        className="bg-white p-5 rounded shadow mb-6"
      >
        <input
          placeholder="Part Name"
          className="border p-2 m-2"
          onChange={(e) =>
            setForm({
              ...form,
              partName: e.target.value,
            })
          }
        />

        <input
          placeholder="Category"
          className="border p-2 m-2"
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
        />

        <input
          placeholder="Stock"
          className="border p-2 m-2"
          onChange={(e) =>
            setForm({
              ...form,
              stock: e.target.value,
            })
          }
        />

        <input
          placeholder="Price"
          className="border p-2 m-2"
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Part
        </button>
      </form>

      <table className="w-full bg-white">
        <thead>
          <tr>
            <th>Part</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {parts.map((part) => (
            <tr key={part._id}>
              <td>{part.partName}</td>
              <td>{part.stock}</td>
              <td>Rs.{part.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}