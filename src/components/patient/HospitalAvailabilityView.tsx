import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Hospital } from '../../types';
import { Building2, Search, MapPin, Phone, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const HospitalAvailabilityView: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'hospitals'), (snap) => {
      setHospitals(snap.docs.map(d => d.data() as Hospital));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'hospitals'));

    return () => unsub();
  }, []);

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hospital & Bed Availability</h2>
          <p className="text-xs text-slate-500">Real-time facility capacity, bed availability, and emergency status.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search hospitals by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900"
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium w-full sm:w-auto"
        >
          <option value="All">All Cities</option>
          <option value="New Delhi">New Delhi</option>
        </select>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map((hosp) => (
          <div key={hosp.hospitalId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 hover:border-indigo-500 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Verified Facility
                </span>
                <h3 className="text-lg font-extrabold text-slate-950 mt-2">{hosp.name}</h3>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{hosp.address}, {hosp.city}</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                hosp.emergencyStatus === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                hosp.emergencyStatus === 'Limited Availability' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {hosp.emergencyStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
              <div>
                <div className="text-slate-400 font-medium">General Beds Available</div>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">{hosp.availableBeds} <span className="text-xs font-normal text-slate-500">/ {hosp.totalBeds}</span></div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">ICU Beds Available</div>
                <div className="text-xl font-extrabold text-cyan-700 mt-0.5">{hosp.availableIcu} <span className="text-xs font-normal text-slate-500">/ {hosp.totalIcu}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Available Departments:</div>
              <div className="flex flex-wrap gap-1.5">
                {hosp.departments?.map((dept, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600">
                <Phone className="w-4 h-4 text-cyan-600" />
                <span>{hosp.phone}</span>
              </div>
              <a
                href={`https://maps.google.com/?q=${hosp.latitude},${hosp.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center space-x-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Open Map</span>
              </a>
            </div>
          </div>
        ))}
        {filteredHospitals.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400 text-sm">No hospitals found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};
