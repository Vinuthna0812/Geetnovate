import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import { Patient } from '../types';

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [atRiskPatients, setAtRiskPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const doctorCode = localStorage.getItem('doctorCode');
      if (!doctorCode) return;

      try {
        const res = await fetch('http://localhost:5000/api/doctor/patients', {
          headers: {
            'doctor-code': doctorCode
          }
        });

        if (res.ok) {
          const data = await res.json();
          setPatients(data);

          // Calculate at-risk patients
          const risky = data.filter((patient: Patient) => {
            let total = 0;
            let count = 0;

            patient.symptoms?.forEach((entry: any) => {
              entry.entries.forEach((symptom: any) => {
                const severity = parseFloat(symptom.severity);
                if (!isNaN(severity)) {
                  total += severity;
                  count += 1;
                }
              });
            });

            const average = count > 0 ? total / count : 0;
            return average > 7 || patient.status === 'critical';
          });

          setAtRiskPatients(risky);
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };

    fetchPatients();
  }, []);

  // Helper to calculate status for a patient
  const determineStatus = (patient: Patient): 'critical' | 'normal' => {
    let total = 0;
    let count = 0;

    patient.symptoms?.forEach((entry: any) => {
      entry.entries.forEach((symptom: any) => {
        const severity = parseFloat(symptom.severity);
        if (!isNaN(severity)) {
          total += severity;
          count += 1;
        }
      });
    });

    const average = count > 0 ? total / count : 0;
    return average > 7 || patient.status === 'critical' ? 'critical' : 'normal';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">At-Risk Patients</h2>
      {atRiskPatients.length > 0 ? (
        atRiskPatients.map((patient) => (
          <Card key={patient.username}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{patient.username}</h3>
                <p>Disease: {patient.diseaseName}</p>
              </div>
              <StatusBadge status="critical" />
            </div>
          </Card>
        ))
      ) : (
        <p>No patients at risk currently.</p>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">All Patients</h2>
      {patients.map((patient) => {
        const status = determineStatus(patient);
        return (
          <Card key={patient.username}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{patient.username}</h3>
                <p>Disease: {patient.diseaseName}</p>
              </div>
              <StatusBadge status={status} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DoctorDashboard;
