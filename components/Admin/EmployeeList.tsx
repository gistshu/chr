
import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Employee, Role, EmployeeDocument } from '../../types';
import { Search, User, Phone, Save, X, Briefcase, FileText, CreditCard, Upload, Camera, Trash2, Download, FolderOpen, Image as ImageIcon } from 'lucide-react';

const EmployeeList: React.FC = () => {
  const { employees, updateEmployee, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  // Filter logic
  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmp) {
      updateEmployee(selectedEmp.id, selectedEmp);
      setSelectedEmp(null); // Close modal
    }
  };

  const handleFieldChange = (field: keyof Employee, value: any) => {
    if (selectedEmp) {
      setSelectedEmp({ ...selectedEmp, [field]: value });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Employee) => {
    const file = e.target.files?.[0];
    if (file && selectedEmp) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedEmp({ ...selectedEmp, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedEmp) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc: EmployeeDocument = {
          id: `DOC-${Date.now()}`,
          name: file.name,
          url: reader.result as string,
          uploadDate: new Date().toISOString().split('T')[0],
          type: file.type.includes('image') ? 'image' : 'file'
        };
        const updatedDocs = [...(selectedEmp.documents || []), newDoc];
        setSelectedEmp({ ...selectedEmp, documents: updatedDocs });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    if (selectedEmp && selectedEmp.documents) {
      const updatedDocs = selectedEmp.documents.filter(d => d.id !== docId);
      setSelectedEmp({ ...selectedEmp, documents: updatedDocs });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">{t('emp.title')}</h2>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64 text-slate-900 placeholder:text-slate-400"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
        </div>
      </div>

      {/* List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-emerald-50 text-emerald-900 font-bold border-b border-emerald-100">
            <tr>
              <th className="px-6 py-4">{t('emp.col.id')}</th>
              <th className="px-6 py-4">{t('emp.col.name')}</th>
              <th className="px-6 py-4">{t('emp.col.hireDate')}</th>
              <th className="px-6 py-4">{t('emp.col.resignDate')}</th>
              <th className="px-6 py-4">{t('emp.col.title')}</th>
              <th className="px-6 py-4">{t('emp.col.dept')}</th>
              <th className="px-6 py-4">{t('emp.col.phone')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedEmp(emp)}
                    className="font-mono text-emerald-600 font-bold hover:underline hover:text-emerald-800"
                  >
                    {emp.id}
                  </button>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800 flex items-center space-x-2">
                   <img src={emp.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                   <span>{emp.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{emp.hireDate}</td>
                <td className="px-6 py-4 text-slate-400">{emp.resignationDate || '-'}</td>
                <td className="px-6 py-4 text-slate-700">{emp.jobTitle}</td>
                <td className="px-6 py-4 text-slate-700">
                   <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{emp.department}</span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono">{emp.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Labor Record Card Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-5 flex justify-between items-center shrink-0">
               <div className="flex items-center space-x-4">
                  <div className="relative group w-16 h-16 cursor-pointer">
                    <img src={selectedEmp.avatar} className="w-full h-full rounded-full border-2 border-emerald-400 object-cover bg-white" alt="" />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} className="text-white" />
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleFileUpload(e, 'avatar')}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{t('emp.detail.title')}</h3>
                    <div className="flex items-center space-x-2 text-emerald-200 text-sm">
                       <span>{selectedEmp.id}</span>
                       <span>•</span>
                       <span>{selectedEmp.name}</span>
                       <span className="text-xs bg-emerald-700 px-2 py-0.5 rounded">{t('emp.btn.uploadPhoto')}</span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setSelectedEmp(null)} className="hover:bg-emerald-700 p-2 rounded-full transition">
                  <X size={24} />
               </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="p-8 overflow-y-auto bg-slate-50/50">
               <form id="empForm" onSubmit={handleUpdate} className="space-y-8">
                  
                  {/* Section 1: Identity & Basic Information */}
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                     <h4 className="text-emerald-800 font-bold border-b border-emerald-100 pb-2 mb-4 flex items-center space-x-2">
                        <User size={20} />
                        <span>{t('emp.detail.identity')}</span>
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* ID Card Upload Area */}
                        <div className="md:col-span-4 grid grid-cols-2 gap-4 mb-4">
                           <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center relative hover:bg-slate-50 transition min-h-[160px]">
                              {selectedEmp.idCardFront ? (
                                <img src={selectedEmp.idCardFront} alt="ID Front" className="max-h-32 object-contain" />
                              ) : (
                                <div className="text-center text-slate-400">
                                   <CreditCard size={32} className="mx-auto mb-2" />
                                   <span className="text-sm font-bold">{t('emp.field.idCardFront')}</span>
                                   <p className="text-xs">{t('emp.btn.upload')}</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload(e, 'idCardFront')}
                              />
                           </div>
                           <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center relative hover:bg-slate-50 transition min-h-[160px]">
                              {selectedEmp.idCardBack ? (
                                <img src={selectedEmp.idCardBack} alt="ID Back" className="max-h-32 object-contain" />
                              ) : (
                                <div className="text-center text-slate-400">
                                   <CreditCard size={32} className="mx-auto mb-2" />
                                   <span className="text-sm font-bold">{t('emp.field.idCardBack')}</span>
                                   <p className="text-xs">{t('emp.btn.upload')}</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload(e, 'idCardBack')}
                              />
                           </div>
                        </div>

                        <div className="md:col-span-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.col.name')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.name}
                              onChange={(e) => handleFieldChange('name', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.gender')}</label>
                           <select 
                              value={selectedEmp.gender || 'Male'}
                              onChange={(e) => handleFieldChange('gender', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 bg-white"
                           >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                           </select>
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.birthday')}</label>
                           <input 
                              type="date" 
                              value={selectedEmp.birthday || ''}
                              onChange={(e) => handleFieldChange('birthday', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.idNumber')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.idNumber || ''}
                              onChange={(e) => handleFieldChange('idNumber', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-slate-900"
                           />
                        </div>
                        
                        <div className="md:col-span-2">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.address')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.address || ''}
                              onChange={(e) => handleFieldChange('address', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.col.phone')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.phone}
                              onChange={(e) => handleFieldChange('phone', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div className="md:col-span-1">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.dependents')}</label>
                           <input 
                              type="number" 
                              value={selectedEmp.dependentsCount || 0}
                              onChange={(e) => handleFieldChange('dependentsCount', parseInt(e.target.value))}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Section 2: Education & Background */}
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                     <h4 className="text-emerald-800 font-bold border-b border-emerald-100 pb-2 mb-4 flex items-center space-x-2">
                        <FileText size={20} />
                        <span>{t('emp.detail.background')}</span>
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.education')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.education || ''}
                              onChange={(e) => handleFieldChange('education', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.skills')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.skills || ''}
                              onChange={(e) => handleFieldChange('skills', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.experience')}</label>
                           <textarea 
                              rows={2}
                              value={selectedEmp.experience || ''}
                              onChange={(e) => handleFieldChange('experience', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-slate-900"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Section 3: Employment & Insurance */}
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                     <h4 className="text-emerald-800 font-bold border-b border-emerald-100 pb-2 mb-4 flex items-center space-x-2">
                        <Briefcase size={20} />
                        <span>{t('emp.detail.employment')}</span>
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.col.dept')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.department}
                              onChange={(e) => handleFieldChange('department', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.col.title')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.jobTitle}
                              onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.col.hireDate')}</label>
                           <input 
                              type="date" 
                              value={selectedEmp.hireDate}
                              onChange={(e) => handleFieldChange('hireDate', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.col.resignDate')}</label>
                           <input 
                              type="date" 
                              value={selectedEmp.resignationDate || ''}
                              onChange={(e) => handleFieldChange('resignationDate', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.laborDate')}</label>
                           <input 
                              type="date" 
                              value={selectedEmp.laborInsuranceDate || ''}
                              onChange={(e) => handleFieldChange('laborInsuranceDate', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.healthDate')}</label>
                           <input 
                              type="date" 
                              value={selectedEmp.healthInsuranceDate || ''}
                              onChange={(e) => handleFieldChange('healthInsuranceDate', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                         <div className="md:col-span-2">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('emp.field.emergency')}</label>
                           <input 
                              type="text" 
                              value={selectedEmp.emergencyContact || ''}
                              onChange={(e) => handleFieldChange('emergencyContact', e.target.value)}
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Section 4: Personal Files & Documents */}
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                     <div className="flex justify-between items-center border-b border-emerald-100 pb-2 mb-4">
                        <h4 className="text-emerald-800 font-bold flex items-center space-x-2">
                           <FolderOpen size={20} />
                           <span>{t('emp.detail.files')}</span>
                        </h4>
                        <div className="relative">
                           <input 
                              type="file" 
                              onChange={handleDocumentUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                           />
                           <button type="button" className="flex items-center space-x-1 text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition">
                              <Upload size={14} />
                              <span>{t('emp.btn.upload')}</span>
                           </button>
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        {selectedEmp.documents && selectedEmp.documents.length > 0 ? (
                           selectedEmp.documents.map((doc) => (
                              <div key={doc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition">
                                 <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded shadow-sm text-slate-500">
                                       {doc.type === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                       <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                                       <p className="text-xs text-slate-400">{doc.uploadDate}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                    <a 
                                      href={doc.url} 
                                      download={doc.name}
                                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded transition"
                                      title={t('emp.btn.download')}
                                    >
                                       <Download size={16} />
                                    </a>
                                    <button 
                                      type="button"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                      className="p-1.5 text-slate-400 hover:text-red-500 rounded transition"
                                      title={t('emp.btn.delete')}
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="text-center py-6 text-slate-400 text-sm italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                              No documents uploaded.
                           </div>
                        )}
                     </div>
                  </div>

               </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
               <button 
                  type="button" 
                  onClick={() => setSelectedEmp(null)}
                  className="mr-3 px-6 py-2 rounded-lg text-slate-600 font-bold hover:bg-slate-200 transition"
               >
                  Cancel
               </button>
               <button 
                  onClick={handleUpdate}
                  className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition flex items-center space-x-2"
               >
                  <Save size={18} />
                  <span>{t('emp.save')}</span>
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
