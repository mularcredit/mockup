import React, { useState } from 'react';
import { Camera, Building2, Mail, Phone, Globe, MapPin, Building, UploadCloud, Hash, CheckCircle2 } from 'lucide-react';
import UserAvatar from '../../UI/UserAvatar';

export default function OrganizationProfile({ onChange }: { onChange?: () => void }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
        if (onChange) onChange();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Visual Identity Section */}
      <div className="glass-card p-6 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[var(--p-dim)] to-transparent" />
        
        <div className="relative flex items-end gap-6 pt-12">
          {/* Logo Uploader */}
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-[var(--sidebar)] border-2 border-[var(--glass)] shadow-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              {logoPreview ? (
                <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--glass)]">
                  <UserAvatar name="ZiraHR Technologies" size={96} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleLogoUpload}
            />
          </div>

          <div className="flex-1 pb-2">
            <h3 className="text-xl font-bold text-[var(--t1)]">ZiraHR Technologies</h3>
            <p className="text-[13px] text-[var(--t3)] flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[var(--green)] shadow-[0_0_8px_var(--green-glow)]" />
              Active Enterprise Account
            </p>
          </div>
          
          <div className="pb-2">
            <button className="px-4 py-2 bg-[var(--glass)] border border-[var(--p-line)] rounded-lg text-[12px] font-medium text-[var(--t1)] hover:bg-[var(--glass-h)] transition-colors flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[var(--p)]" />
              Update Cover Image
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Main Details Form */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--p-line)]">
              <div>
                <h3 className="text-[14px] font-bold text-[var(--t1)]">Company Details</h3>
                <p className="text-[11px] text-[var(--t4)]">Primary registered information.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Legal name</label>
                <input type="text" defaultValue="ZiraHR Technologies Limited" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="legal_name" />
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Trading name (optional)</label>
                <input type="text" defaultValue="ZiraHR" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="tradingnameoptional" />
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Registration number</label>
                <input type="text" defaultValue="PVT-2023-XXXXX" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="registrationnumber" />
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Date of incorporation</label>
                <input type="date" defaultValue="2023-01-15" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="dateofincorporation" />
              </div>
              
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Industry / sector</label>
                <select className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange} id="industrysector">
                  <option>Technology & Software</option>
                  <option>Financial Services (SACCOs)</option>
                  <option>Education & Schools</option>
                  <option>Healthcare</option>
                  <option>Retail & FMCG</option>
                  <option>NGOs & Non-Profits</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--p-line)]">
              <div>
                <h3 className="text-[14px] font-bold text-[var(--t1)]">Contact & Location</h3>
                <p className="text-[11px] text-[var(--t4)]">Official HQ communication channels.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Primary email</label>
                <div className="relative"><Mail className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" /><input type="email" defaultValue="hr@zirahr.com" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 pl-9" onChange={onChange}  id="primaryemail" /></div>
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Primary phone</label>
                <div className="relative"><Phone className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" /><input type="tel" defaultValue="+254 700 000000" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 pl-9" onChange={onChange}  id="primaryphone" /></div>
              </div>
              
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Website</label>
                <div className="relative"><Globe className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" /><input type="url" defaultValue="https://zirahr.com" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 pl-9" onChange={onChange}  id="website" /></div>
              </div>
              
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">HQ physical address</label>
                <div className="relative"><MapPin className="w-4 h-4 text-white/30 absolute left-3 top-3 pointer-events-none" /><textarea rows={3} defaultValue="Prism Tower, Upper Hill
Nairobi, Kenya" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300 pl-9" onChange={onChange}  id="hqphysicaladdress" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings (Compliance & Branding) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Statutory Registration Box (Kenyan Context) */}
          <div className="glass-card p-6 rounded-lg border-t-2 border-t-[var(--p)]">
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[13px] font-bold text-[var(--t1)]">Statutory Registration</h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">KRA PIN</label>
                <input type="text" defaultValue="P051XXXXXXX" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="krapin" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">NSSF employer no.</label>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="nssfemployerno" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">SHA/NHIF employer no.</label>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="shanhifemployerno" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-medium text-[#C8A84B]/80 ml-1">Housing levy reg no.</label>
                <input type="text" defaultValue="XXXXXXXX" className="w-full bg-white/[0.02] border border-[#C8A84B]/20 rounded-lg px-3 py-2.5 text-[13px] text-white/90 outline-none focus:border-[#C8A84B]/50 focus:bg-[#C8A84B]/[0.02] transition-all duration-300" onChange={onChange}  id="housinglevyregno" />
              </div>
            </div>
            
            <div className="mt-5 p-3 rounded-md bg-[var(--green-d)] border border-[var(--green-glow)] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--green)] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[var(--green)] leading-relaxed">
                All statutory numbers configured. Payroll processing is enabled for Kenyan compliance.
              </p>
            </div>
          </div>

          {/* Brand Identity Card */}
          <div className="glass-card p-6 rounded-lg">
            <h3 className="text-[13px] font-bold text-[var(--t1)] mb-4">Brand Colors</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-white mb-2">Primary accent</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--p)] shadow-lg cursor-pointer border border-[var(--glass)]" />
                  <input type="text" defaultValue="#F5A623" className="flex-1 !bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-1 py-2 text-[12px] text-[var(--t1)] font-mono focus:border-b-[1.5px] focus:border-[var(--p)] outline-none transition-all" onChange={onChange} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-white mb-2">Sidebar theme</label>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--sidebar)] shadow-lg cursor-pointer border border-[var(--glass)]" />
                  <select className="flex-1 !bg-transparent border-0 border-b border-[var(--p-line)] rounded-none px-3 py-1.5 text-[12px] text-[var(--t1)]" onChange={onChange}>
                    <option>Dark Mode (Default)</option>
                    <option>Light Mode</option>
                    <option>Auto (System)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
// trigger hmr
