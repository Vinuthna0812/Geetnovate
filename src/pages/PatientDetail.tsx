import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  logs: string[];
  medications: string[];
}

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        const res = await fetch(`/api/patients/${id}`);
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.error('Failed to fetch patient detail:', error);
      }
    };

    fetchPatientDetail();
  }, [id]);

  if (!patient) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{patient.name}'s Details</h1>
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Condition:</strong> {patient.condition}</p>

        <div>
          <h2 className="text-xl font-semibold">Health Logs</h2>
          <ul className="list-disc ml-6">
            {patient.logs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Medications</h2>
          <ul className="list-disc ml-6">
            {patient.medications.map((med, index) => (
              <li key={index}>{med}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
