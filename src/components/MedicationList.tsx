import { useState, useEffect } from "react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

const MedicationList = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [error, setError] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  // Load medications from localStorage for this user
  useEffect(() => {
    if (loggedInUser?.email) {
      const stored = localStorage.getItem(`medications_${loggedInUser.email}`);
      if (stored) {
        setMedications(JSON.parse(stored));
      }
    }
  }, []);

  // Save to localStorage when medications change
  useEffect(() => {
    if (loggedInUser?.email) {
      localStorage.setItem(`medications_${loggedInUser.email}`, JSON.stringify(medications));
    }
  }, [medications]);

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !dosage || !frequency) {
      setError("All fields are required.");
      return;
    }

    const newMed: Medication = { name, dosage, frequency };
    setMedications((prev) => [...prev, newMed]);

    setName("");
    setDosage("");
    setFrequency("");
    setError("");
  };

  if (!loggedInUser) {
    return (
      <div className="p-6 text-center text-red-500">
        Please login to view and manage your medications.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Medication List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">My Medications</h2>
          {medications.length === 0 ? (
            <p className="text-gray-500">No medications added yet.</p>
          ) : (
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-blue-100 p-4 rounded-md border hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-blue-900">{med.name}</h3>
                  <p className="text-sm text-gray-700">
                    <strong>Dosage:</strong> {med.dosage}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Frequency:</strong> {med.frequency}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Medication Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-green-700">Add Medication</h2>
          <form onSubmit={handleAddMedication} className="space-y-4">
            <input
              type="text"
              placeholder="Medication Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Dosage (e.g., 500mg)"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Frequency (e.g., Twice a day)"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Add Medication
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicationList;
