"use client";

import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] =
    useState([]);

  const [form, setForm] =
    useState({
      customerName: "",
      vehicleNumber: "",
      serviceType: "",
      mechanic: "",
      notes: "",
    });

  const loadServices =
    async () => {
      const res = await fetch(
        "/api/services"
      );

      const data =
        await res.json();

      setServices(
        data.services || []
      );
    };

  useEffect(() => {
    loadServices();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "/api/services",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data =
      await res.json();

    if (data.success) {
      loadServices();

      setForm({
        customerName: "",
        vehicleNumber: "",
        serviceType: "",
        mechanic: "",
        notes: "",
      });
    }
  };

  const updateStatus =
    async (id, status) => {
      await fetch(
        `/api/services/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      loadServices();
    };

  const deleteService =
    async (id) => {
      if (
        !confirm(
          "Delete service record?"
        )
      )
        return;

      await fetch(
        `/api/services/${id}`,
        {
          method: "DELETE",
        }
      );

      loadServices();
    };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Service Tracking
      </h1>

      <form
        onSubmit={submit}
        className="bg-white p-5 rounded shadow mb-8"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3"
            placeholder="Customer Name"
            value={
              form.customerName
            }
            onChange={(e) =>
              setForm({
                ...form,
                customerName:
                  e.target.value,
              })
            }
          />

          <input
            className="border p-3"
            placeholder="Vehicle Number"
            value={
              form.vehicleNumber
            }
            onChange={(e) =>
              setForm({
                ...form,
                vehicleNumber:
                  e.target.value,
              })
            }
          />

          <input
            className="border p-3"
            placeholder="Service Type"
            value={
              form.serviceType
            }
            onChange={(e) =>
              setForm({
                ...form,
                serviceType:
                  e.target.value,
              })
            }
          />

          <input
            className="border p-3"
            placeholder="Mechanic"
            value={
              form.mechanic
            }
            onChange={(e) =>
              setForm({
                ...form,
                mechanic:
                  e.target.value,
              })
            }
          />
        </div>

        <textarea
          className="border p-3 w-full mt-4"
          placeholder="Service Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes:
                e.target.value,
            })
          }
        />

        <button className="bg-blue-600 text-white px-5 py-2 rounded mt-4">
          Add Service
        </button>
      </form>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Mechanic</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map(
              (service) => (
                <tr
                  key={
                    service._id
                  }
                  className="border-t"
                >
                  <td>
                    {
                      service.customerName
                    }
                  </td>

                  <td>
                    {
                      service.vehicleNumber
                    }
                  </td>

                  <td>
                    {
                      service.mechanic
                    }
                  </td>

                  <td>
                    <select
                      value={
                        service.status
                      }
                      onChange={(
                        e
                      ) =>
                        updateStatus(
                          service._id,
                          e.target
                            .value
                        )
                      }
                    >
                      <option>
                        Received
                      </option>

                      <option>
                        Checking
                      </option>

                      <option>
                        Repairing
                      </option>

                      <option>
                        Completed
                      </option>
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        deleteService(
                          service._id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}